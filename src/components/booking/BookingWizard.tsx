'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Calendar, Clock, User, Check, Download, ArrowLeft, Phone, ShieldCheck } from 'lucide-react'
import { format, parse } from 'date-fns'
import type { Business, Service } from '@/types/domain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { Header } from '@/components/widgets/header'
import { ServicePicker } from './ServicePicker'
import { DatePicker } from './DatePicker'
import { TimeSlots } from './TimeSlots'
import { formatPrice, formatDuration, formatICSDate, formatHHmm } from '@/lib/format'
import {
  initSession,
  getMonthAvailability,
  getDayAvailability,
  lockAppointment,
  confirmAppointment,
  verifyAppointment,
  BookingApiError,
} from '@/lib/api'
import type { TimeSlot } from '@/lib/api'
import { computeAvailableDays, computeSlotsForDay } from '@/lib/availability'
import type { AvailabilityParams } from '@/lib/availability'
import { mockBookings } from '@/mocks/bookings'

type BookingWizardProps = {
  business: Business
}

type WizardStep = 'service' | 'date' | 'time' | 'confirm' | 'verify' | 'success'

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
})

type CustomerInput = z.infer<typeof customerSchema>

export const BookingWizard = ({ business }: BookingWizardProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL state
  const serviceId = searchParams.get('service')
  const dateParam = searchParams.get('date')
  const timeParam = searchParams.get('time')

  // Wizard state
  const [currentStep, setCurrentStep] = useState<WizardStep>('service')
  const [selectedDate, setSelectedDate] = useState<string | null>(dateParam)
  const [selectedTime, setSelectedTime] = useState<string | null>(timeParam)
  const [customerData, setCustomerData] = useState<CustomerInput>({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInput, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // API state
  const [sessionReady, setSessionReady] = useState(false)
  const [availableDays, setAvailableDays] = useState<string[]>([])
  const [availableDaysLoading, setAvailableDaysLoading] = useState(false)
  const [daySlots, setDaySlots] = useState<TimeSlot[]>([])
  const [daySlotsLoading, setDaySlotsLoading] = useState(false)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)

  // Verify state
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  const selectedService = serviceId
    ? business.services.find((s) => s.id === serviceId)
    : null

  // ── Session init ──────────────────────────────────────

  useEffect(() => {
    initSession()
      .then(() => setSessionReady(true))
      .catch(() => setSessionReady(true)) // proceed anyway; API calls will retry
  }, [])

  // ── Step derivation from URL ──────────────────────────

  useEffect(() => {
    if (!serviceId) {
      setCurrentStep('service')
    } else if (!dateParam) {
      setCurrentStep('date')
    } else if (!timeParam) {
      setCurrentStep('time')
    } else {
      setCurrentStep('confirm')
    }
  }, [serviceId, dateParam, timeParam])

  // ── Fetch month availability when service changes ─────

  const fetchMonthAvailability = useCallback(async (service: Service) => {
    setAvailableDaysLoading(true)
    try {
      const now = new Date()
      const thisMonth = await getMonthAvailability({
        businessId: business.id,
        serviceId: service.id,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
      })

      // Also fetch next month for calendar navigation
      const nextDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      const nextMonth = await getMonthAvailability({
        businessId: business.id,
        serviceId: service.id,
        year: nextDate.getFullYear(),
        month: nextDate.getMonth() + 1,
      })

      const allDays = [
        ...thisMonth.availableDates,
        ...nextMonth.availableDates,
      ]
      setAvailableDays(allDays)
    } catch {
      // Fallback to local computation if API unavailable
      const params: AvailabilityParams = {
        workingHours: business.workingHours,
        serviceDurationMin: service.durationMin,
        bufferMin: 0,
        existingBookings: mockBookings,
        businessId: business.id,
      }
      const localDays = computeAvailableDays(params, 60)
      setAvailableDays(localDays)
    } finally {
      setAvailableDaysLoading(false)
    }
  }, [business])

  useEffect(() => {
    if (selectedService && sessionReady) {
      fetchMonthAvailability(selectedService)
    }
  }, [selectedService, sessionReady, fetchMonthAvailability])

  // ── Fetch day slots when date changes ─────────────────

  const fetchDaySlots = useCallback(async (service: Service, date: string) => {
    setDaySlotsLoading(true)
    try {
      const result = await getDayAvailability({
        businessId: business.id,
        serviceId: service.id,
        date,
      })
      setDaySlots(result.slots)
    } catch {
      // Fallback to local computation
      const params: AvailabilityParams = {
        workingHours: business.workingHours,
        serviceDurationMin: service.durationMin,
        bufferMin: 0,
        existingBookings: mockBookings,
        businessId: business.id,
      }
      const localSlots = computeSlotsForDay(params, date)
      setDaySlots(
        localSlots.map((s) => ({
          startTime: format(new Date(s.startAtIso), 'HH:mm'),
          endTime: format(new Date(s.endAtIso), 'HH:mm'),
        }))
      )
    } finally {
      setDaySlotsLoading(false)
    }
  }, [business])

  useEffect(() => {
    if (selectedService && selectedDate && sessionReady) {
      fetchDaySlots(selectedService, selectedDate)
    }
  }, [selectedService, selectedDate, sessionReady, fetchDaySlots])

  // ── URL management ────────────────────────────────────

  const updateUrl = (updates: {
    service?: string | null
    date?: string | null
    time?: string | null
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.service !== undefined) {
      if (updates.service) params.set('service', updates.service)
      else params.delete('service')
    }
    if (updates.date !== undefined) {
      if (updates.date) params.set('date', updates.date)
      else params.delete('date')
    }
    if (updates.time !== undefined) {
      if (updates.time) params.set('time', updates.time)
      else params.delete('time')
    }

    router.replace(`/${business.slug}/book?${params.toString()}`)
  }

  // ── Handlers ──────────────────────────────────────────

  const handleServiceSelect = (service: Service) => {
    updateUrl({ service: service.id, date: null, time: null })
  }

  const handleDateSelect = (dateIso: string) => {
    setSelectedDate(dateIso)
    updateUrl({ date: dateIso, time: null })
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    updateUrl({ time })
  }

  const handleBackToService = () => {
    updateUrl({ service: null, date: null, time: null })
  }

  const handleBackToDate = () => {
    updateUrl({ time: null })
  }

  const handleBackToTime = () => {
    setCurrentStep('time')
  }

  const updateCustomerField = (field: keyof CustomerInput) => (value: string) => {
    setCustomerData({ ...customerData, [field]: value })
  }

  // ── Confirm: lock → confirm → move to verify ─────────

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitError(null)
    setIsSubmitting(true)

    try {
      const validated = customerSchema.parse(customerData)
      if (!selectedService || !selectedDate || !selectedTime) return

      // Compute end time from service duration
      const [h, m] = selectedTime.split(':').map(Number)
      const endDate = new Date(2000, 0, 1, h, m + selectedService.durationMin)
      const endTime = formatHHmm(endDate.getHours(), endDate.getMinutes())

      // Step 1: Lock the slot
      const lock = await lockAppointment({
        businessId: business.id,
        serviceId: selectedService.id,
        date: selectedDate,
        startTime: selectedTime,
        endTime,
      })

      // Step 2: Confirm with customer details
      const confirmation = await confirmAppointment({
        appointmentId: lock.ID,
        name: validated.name,
        email: validated.email,
        phone: validated.phone,
      })

      setAppointmentId(confirmation.appointmentId)
      setCurrentStep('verify')
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CustomerInput, string>> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof CustomerInput] = issue.message
          }
        })
        setErrors(fieldErrors)
      } else if (error instanceof BookingApiError) {
        setSubmitError(
          error.status === 409
            ? 'This time slot was just taken. Please pick another time.'
            : 'Something went wrong. Please try again.'
        )
      } else {
        setSubmitError('Something went wrong. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Verify: code → verify → success ───────────────────

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!appointmentId) return
    setVerifyError(null)
    setIsVerifying(true)

    try {
      await verifyAppointment({
        appointmentId,
        confirmationCode: verifyCode.trim(),
      })
      setCurrentStep('success')
    } catch (error) {
      if (error instanceof BookingApiError) {
        setVerifyError(
          error.status === 400 || error.status === 422
            ? 'That code doesn\'t match. Please check and try again.'
            : 'Something went wrong. Please try again.'
        )
      } else {
        setVerifyError('Something went wrong. Please try again.')
      }
    } finally {
      setIsVerifying(false)
    }
  }

  // ── ICS download ──────────────────────────────────────

  const handleDownloadICS = () => {
    if (!selectedService || !selectedDate || !selectedTime) return

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const bookingDate = parse(selectedDate, 'yyyy-MM-dd', new Date())
    bookingDate.setHours(hours, minutes, 0, 0)

    const endDate = new Date(bookingDate)
    endDate.setMinutes(endDate.getMinutes() + selectedService.durationMin)

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Slotly//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${appointmentId ?? 'local'}@slotly`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(bookingDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${selectedService.name} at ${business.name}`,
      `DESCRIPTION:${selectedService.description}`,
      `LOCATION:${business.address.line1}, ${business.address.city}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `booking-${appointmentId ?? 'local'}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  // ── Step labels & progress ────────────────────────────

  const stepLabels: Record<WizardStep, string> = {
    service: 'Choose a service',
    date: 'Pick a date',
    time: 'Pick a time',
    confirm: 'Your details',
    verify: 'Confirm your booking',
    success: 'All set',
  }

  const getStepNumber = (step: WizardStep): number => {
    const stepOrder: WizardStep[] = ['service', 'date', 'time', 'confirm', 'verify']
    const idx = stepOrder.indexOf(step)
    return idx >= 0 ? idx + 1 : 5
  }

  const totalSteps = 5

  const displayStep = currentStep === 'success' ? 'verify' : currentStep

  return (
    <div className="space-y-6">
      <Header
        variant="booking"
        backHref={`/${business.slug}`}
        backLabel={`Back to ${business.name}`}
        title={`Step ${getStepNumber(displayStep)} of ${totalSteps}`}
        subtitle={stepLabels[displayStep]}
        currentStep={getStepNumber(displayStep)}
        totalSteps={totalSteps}
      />

      {/* Step 1: Service Selection */}
      {currentStep === 'service' && (
        <section>
          <h2 className="text-xl font-semibold text-(--gray-12) mb-4">Choose a service</h2>
          <ServicePicker
            services={business.services}
            businessSlug={business.slug}
            onServiceSelect={handleServiceSelect}
          />
        </section>
      )}

      {/* Step 2: Date Selection */}
      {currentStep === 'date' && selectedService && (
        <>
          <ServiceSummaryCard
            service={selectedService}
            onChangeService={handleBackToService}
          />
          <section>
            <h2 className="text-xl font-semibold text-(--gray-12) mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-(--accent-11)" />
              Pick a date
            </h2>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availableDays={availableDays}
              isLoading={availableDaysLoading}
            />
          </section>
        </>
      )}

      {/* Step 3: Time Selection */}
      {currentStep === 'time' && selectedService && selectedDate && (
        <>
          <ServiceSummaryCard
            service={selectedService}
            onChangeService={handleBackToService}
          />
          <DateSummaryCard date={selectedDate} onChangeDate={handleBackToDate} />
          <section>
            <h2 className="text-xl font-semibold text-(--gray-12) mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-(--accent-11)" />
              Pick a time
            </h2>
            <TimeSlots
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              onBackToDate={handleBackToDate}
              slots={daySlots}
              isLoading={daySlotsLoading}
            />
          </section>
        </>
      )}

      {/* Step 4: Confirm Details */}
      {currentStep === 'confirm' && selectedService && selectedDate && selectedTime && (
        <>
          <BookingSummaryCard
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
            onEdit={() => setCurrentStep('time')}
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Your details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleConfirmSubmit} className="space-y-4">
                <FormField
                  id="name"
                  label="Name"
                  type="text"
                  required
                  value={customerData.name}
                  error={errors.name}
                  onChange={updateCustomerField('name')}
                />
                <div>
                  <FormField
                    id="phone"
                    label="Phone"
                    type="tel"
                    required
                    value={customerData.phone}
                    error={errors.phone}
                    onChange={updateCustomerField('phone')}
                  />
                  <p className="text-xs text-(--gray-10) mt-1.5 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    So we can reach you if anything changes with your appointment.
                  </p>
                </div>
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  required
                  value={customerData.email}
                  error={errors.email}
                  onChange={updateCustomerField('email')}
                />

                {submitError && (
                  <p className="text-sm text-(--red-9) bg-(--red-2) border border-(--red-6) rounded-(--radius-2) px-3 py-2">
                    {submitError}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBackToTime}
                    className="flex-1"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    size="lg"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Reserving your spot...' : 'Confirm booking'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 5: Verify Code */}
      {currentStep === 'verify' && selectedService && selectedDate && selectedTime && (
        <>
          <BookingSummaryCard
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
          />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Confirm your booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-(--gray-11) mb-4">
                We sent a confirmation code to your email. Enter it below to finalise your booking.
              </p>
              <form onSubmit={handleVerifySubmit} className="space-y-4">
                <FormField
                  id="verifyCode"
                  label="Confirmation code"
                  type="text"
                  required
                  value={verifyCode}
                  error={verifyError ?? undefined}
                  onChange={setVerifyCode}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />

                <Button
                  type="submit"
                  variant="solid"
                  size="lg"
                  className="w-full"
                  disabled={isVerifying || verifyCode.trim().length === 0}
                >
                  {isVerifying ? 'Verifying...' : 'Verify and book'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {/* Success */}
      {currentStep === 'success' && selectedService && selectedDate && selectedTime && (
        <Card className="border-(--accent-6) bg-(--accent-2)">
          <CardContent className="pt-8 pb-8 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-(--radius-full) bg-(--accent-3) mb-4">
                <Check className="w-8 h-8 text-(--accent-11)" />
              </div>
              <h2 className="text-2xl font-bold text-(--gray-12) mb-2">You&apos;re all set</h2>
              <p className="text-(--gray-11)">
                Your appointment at {business.name} is confirmed. We&apos;ll see you there.
              </p>
            </div>

            <div className="bg-(--gray-1) border border-(--gray-6) rounded-(--radius-3) p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-(--gray-11)">Service</span>
                <span className="font-medium">{selectedService.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--gray-11)">Date</span>
                <span className="font-medium">
                  {format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--gray-11)">Time</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-(--gray-11)">Duration</span>
                <span className="font-medium">{formatDuration(selectedService.durationMin)}</span>
              </div>
              <div className="flex justify-between border-t border-(--gray-6) pt-2 mt-2">
                <span className="text-(--gray-11)">Price</span>
                <span className="font-semibold">{formatPrice(selectedService.priceCents)}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleDownloadICS}
              >
                <Download className="w-4 h-4 mr-2" />
                Add to calendar
              </Button>
              <Button
                variant="solid"
                size="lg"
                className="w-full"
                onClick={() => router.push(`/${business.slug}`)}
              >
                Back to {business.name}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ── Helper Components ───────────────────────────────────

type FormFieldProps = {
  id: string
  label: string
  type: string
  required?: boolean
  value: string
  error?: string
  onChange: (value: string) => void
  autoComplete?: string
  inputMode?: 'text' | 'numeric' | 'tel' | 'email'
}

const FormField = ({ id, label, type, required, value, error, onChange, autoComplete, inputMode }: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-(--gray-12) mb-1">
      {label} {required && <span className="text-(--accent-11)">*</span>}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-(--gray-6) rounded-(--radius-2) bg-(--gray-1) text-(--gray-12) focus:outline-none focus:ring-2 focus:ring-(--accent-8)"
      required={required}
      autoComplete={autoComplete}
      inputMode={inputMode}
    />
    {error && <p className="text-sm text-(--red-9) mt-1">{error}</p>}
  </div>
)

const ServiceSummaryCard = ({
  service,
  onChangeService,
}: {
  service: Service
  onChangeService: () => void
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Selected service</span>
        <Button variant="ghost" size="sm" onClick={onChangeService}>
          Change
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-(--gray-12) text-lg mb-2">{service.name}</h3>
          <p className="text-sm text-(--gray-12)/70">{service.description}</p>
        </div>
        <div className="text-right shrink-0">
          <Badge variant="default" size="md" className="mb-2">
            {formatPrice(service.priceCents)}
          </Badge>
          <p className="text-sm text-(--gray-12)/60">{formatDuration(service.durationMin)}</p>
        </div>
      </div>
    </CardContent>
  </Card>
)

const DateSummaryCard = ({
  date,
  onChangeDate,
}: {
  date: string
  onChangeDate: () => void
}) => (
  <Card>
    <CardContent className="py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-(--accent-11)" />
          <span className="font-medium">
            {format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d, yyyy')}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onChangeDate}>
          Change
        </Button>
      </div>
    </CardContent>
  </Card>
)

const BookingSummaryCard = ({
  service,
  date,
  time,
  onEdit,
}: {
  service: Service
  date: string
  time: string
  onEdit?: () => void
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Booking Summary</span>
        {onEdit && (
          <Button variant="ghost" size="sm" onClick={onEdit}>
            Edit
          </Button>
        )}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-(--gray-12)">{service.name}</p>
          <p className="text-sm text-(--gray-11)">{service.description}</p>
        </div>
        <Badge variant="default" size="md">
          {formatPrice(service.priceCents)}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-(--gray-11)" />
        <span>{format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d, yyyy')}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-(--gray-11)" />
        <span>
          {time} ({formatDuration(service.durationMin)})
        </span>
      </div>
    </CardContent>
  </Card>
)
