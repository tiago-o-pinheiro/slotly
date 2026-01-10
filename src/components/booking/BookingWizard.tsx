'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { Calendar, Clock, User, Mail, Check, Download, ArrowLeft } from 'lucide-react'
import { format, parse } from 'date-fns'
import type { Business, Service } from '@/types/domain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card/Card'
import { Button } from '@/components/ui/button/Button'
import { Badge } from '@/components/ui/badge/Badge'
import { ServicePicker } from './ServicePicker'
import { DatePicker } from './DatePicker'
import { TimeSlots } from './TimeSlots'
import { StepHeader } from './StepHeader'
import { formatPrice, formatDuration } from '@/lib/format'
import { createBooking } from '@/lib/bookingStore'
import { mockBookings } from '@/mocks/bookings'
import type { AvailabilityParams } from '@/lib/availability'
import {
  sendVerificationCode,
  verifyCode,
  generateVerificationCode,
  getVerificationTarget,
} from '@/lib/mockMail'

type BookingWizardProps = {
  business: Business
}

type WizardStep = 'service' | 'date' | 'time' | 'confirm' | 'verify' | 'success'

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
})

type CustomerInput = z.infer<typeof customerSchema>

export const BookingWizard = ({ business }: BookingWizardProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  // State from URL
  const serviceId = searchParams.get('service')
  const dateParam = searchParams.get('date')
  const timeParam = searchParams.get('time')

  // Local state
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
  const [verificationCodeSent, setVerificationCodeSent] = useState('')
  const [verificationInput, setVerificationInput] = useState('')
  const [verificationError, setVerificationError] = useState('')
  const [bookingToken, setBookingToken] = useState('')

  const selectedService = serviceId
    ? business.services.find((s) => s.id === serviceId)
    : null

  // Update step based on selections
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

  const updateUrl = (updates: {
    service?: string | null
    date?: string | null
    time?: string | null
  }) => {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.service !== undefined) {
      if (updates.service) {
        params.set('service', updates.service)
      } else {
        params.delete('service')
      }
    }
    if (updates.date !== undefined) {
      if (updates.date) {
        params.set('date', updates.date)
      } else {
        params.delete('date')
      }
    }
    if (updates.time !== undefined) {
      if (updates.time) {
        params.set('time', updates.time)
      } else {
        params.delete('time')
      }
    }

    router.replace(`/${business.slug}/book?${params.toString()}`)
  }

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

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const validated = customerSchema.parse(customerData)

      // Validate email or phone is provided
      if (!validated.email && !validated.phone) {
        setErrors({ email: 'Please provide either email or phone number' })
        setIsSubmitting(false)
        return
      }

      // Generate and send verification code
      const code = generateVerificationCode()
      setVerificationCodeSent(code)

      const target = validated.email || validated.phone || ''
      await sendVerificationCode(target, code)

      setCurrentStep('verify')
      setIsSubmitting(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CustomerInput, string>> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof CustomerInput] = issue.message
          }
        })
        setErrors(fieldErrors)
      }
      setIsSubmitting(false)
    }
  }

  const handleVerifyCode = () => {
    if (verifyCode(verificationInput)) {
      // Create booking
      if (!selectedService || !selectedDate || !selectedTime) return

      const [hours, minutes] = selectedTime.split(':').map(Number)
      const bookingDate = parse(selectedDate, 'yyyy-MM-dd', new Date())
      bookingDate.setHours(hours, minutes, 0, 0)

      const booking = createBooking(
        business.id,
        selectedService.id,
        {
          name: customerData.name,
          email: customerData.email || undefined,
          phone: customerData.phone || undefined,
        },
        bookingDate.toISOString()
      )

      setBookingToken(booking.token)
      setCurrentStep('success')
      setVerificationError('')
    } else {
      setVerificationError('Invalid code. Please try again.')
    }
  }

  const handleResendCode = async () => {
    const code = generateVerificationCode()
    setVerificationCodeSent(code)
    const target = customerData.email || customerData.phone || ''
    await sendVerificationCode(target, code)
    setVerificationInput('')
    setVerificationError('')
  }

  const handleDownloadICS = () => {
    if (!selectedService || !selectedDate || !selectedTime) return

    const [hours, minutes] = selectedTime.split(':').map(Number)
    const bookingDate = parse(selectedDate, 'yyyy-MM-dd', new Date())
    bookingDate.setHours(hours, minutes, 0, 0)

    const endDate = new Date(bookingDate)
    endDate.setMinutes(endDate.getMinutes() + selectedService.durationMin)

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Slotly//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${bookingToken}@slotly.test`,
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
    link.download = `booking-${bookingToken}.ics`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Build availability params
  const availabilityParams: AvailabilityParams | null = selectedService
    ? {
        workingHours: business.workingHours,
        serviceDurationMin: selectedService.durationMin,
        bufferMin: 0,
        existingBookings: mockBookings,
        businessId: business.id,
      }
    : null

  return (
    <div className="space-y-8">
      <StepHeader
        title="Book your appointment"
        currentStep={
          currentStep === 'verify' || currentStep === 'success' ? 'confirm' : currentStep
        }
      />

      {/* Step 1: Service Selection */}
      {currentStep === 'service' && (
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Choose a service</h2>
          <ServicePicker
            services={business.services}
            businessSlug={business.slug}
            onServiceSelect={handleServiceSelect}
          />
        </section>
      )}

      {/* Step 2: Date Selection */}
      {currentStep === 'date' && selectedService && availabilityParams && (
        <>
          <ServiceSummaryCard
            service={selectedService}
            onChangeService={handleBackToService}
          />
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Pick a date
            </h2>
            <DatePicker
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availabilityParams={availabilityParams}
            />
          </section>
        </>
      )}

      {/* Step 3: Time Selection */}
      {currentStep === 'time' && selectedService && selectedDate && availabilityParams && (
        <>
          <ServiceSummaryCard
            service={selectedService}
            onChangeService={handleBackToService}
          />
          <DateSummaryCard date={selectedDate} onChangeDate={handleBackToDate} />
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Pick a time
            </h2>
            <TimeSlots
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              onBackToDate={handleBackToDate}
              availabilityParams={availabilityParams}
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
                <FormField
                  id="email"
                  label="Email"
                  type="email"
                  value={customerData.email || ''}
                  error={errors.email}
                  onChange={updateCustomerField('email')}
                />
                <FormField
                  id="phone"
                  label="Phone"
                  type="tel"
                  value={customerData.phone || ''}
                  error={errors.phone}
                  onChange={updateCustomerField('phone')}
                />

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
                    {isSubmitting ? 'Sending code...' : 'Continue'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </>
      )}

      {/* Step 5: Verify Email/Phone */}
      {currentStep === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Check your {customerData.email ? 'email' : 'phone'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We sent a 6-digit confirmation code to{' '}
              <strong>{getVerificationTarget()}</strong>. Enter it below to complete your
              booking.
            </p>

            <div className="bg-muted/50 p-4 rounded-lg text-sm">
              <p className="font-medium mb-1">Demo Mode</p>
              <p className="text-muted-foreground">
                Your verification code is: <code className="font-mono font-bold text-primary">{verificationCodeSent}</code>
              </p>
            </div>

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationInput}
                onChange={(e) => setVerificationInput(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-brand bg-surface text-foreground text-center text-lg tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="000000"
                maxLength={6}
              />
              {verificationError && (
                <p className="text-sm text-red-500 mt-2">{verificationError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleResendCode}
                className="flex-1"
              >
                Resend code
              </Button>
              <Button
                variant="solid"
                size="lg"
                onClick={handleVerifyCode}
                className="flex-1"
                disabled={verificationInput.length !== 6}
              >
                Verify
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Success */}
      {currentStep === 'success' && selectedService && selectedDate && selectedTime && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Booking confirmed!</h2>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked.
              </p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedService.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span className="font-medium">
                    {format(parse(selectedDate, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{formatDuration(selectedService.durationMin)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">{formatPrice(selectedService.priceCents)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="solid"
                size="lg"
                className="w-full"
                onClick={() => router.push(`/${business.slug}/manage/${bookingToken}`)}
              >
                Manage booking
              </Button>
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
                variant="ghost"
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

// Helper Components

type FormFieldProps = {
  id: keyof CustomerInput
  label: string
  type: string
  required?: boolean
  value: string
  error?: string
  onChange: (value: string) => void
}

const FormField = ({ id, label, type, required, value, error, onChange }: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-border rounded-brand bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
      required={required}
    />
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
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
          <h3 className="font-semibold text-foreground text-lg mb-2">{service.name}</h3>
          <p className="text-sm text-foreground/70">{service.description}</p>
        </div>
        <div className="text-right shrink-0">
          <Badge variant="default" size="md" className="mb-2">
            {formatPrice(service.priceCents)}
          </Badge>
          <p className="text-sm text-foreground/60">{formatDuration(service.durationMin)}</p>
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
          <Calendar className="w-4 h-4 text-primary" />
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
  onEdit: () => void
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>Booking Summary</span>
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-foreground">{service.name}</p>
          <p className="text-sm text-muted-foreground">{service.description}</p>
        </div>
        <Badge variant="default" size="md">
          {formatPrice(service.priceCents)}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span>{format(parse(date, 'yyyy-MM-dd', new Date()), 'EEEE, MMMM d, yyyy')}</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span>
          {time} ({formatDuration(service.durationMin)})
        </span>
      </div>
    </CardContent>
  </Card>
)
