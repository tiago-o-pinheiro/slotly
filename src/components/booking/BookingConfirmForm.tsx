'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createBooking } from '@/lib/bookingStore'

const customerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
})

type CustomerInput = z.infer<typeof customerSchema>

type BookingConfirmFormProps = {
  businessId: string
  businessSlug: string
  serviceId: string
}

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
    />
    {error && <p className="text-sm text-(--red-9) mt-1">{error}</p>}
  </div>
)

export const BookingConfirmForm = ({ businessId, businessSlug, serviceId }: BookingConfirmFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomerInput>({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInput, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateField = (field: keyof CustomerInput) => (value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const validated = customerSchema.parse(formData)

      const startDate = new Date()
      startDate.setDate(startDate.getDate() + 2)
      startDate.setHours(10, 0, 0, 0)

      const booking = createBooking(
        businessId,
        serviceId,
        {
          name: validated.name,
          email: validated.email || undefined,
          phone: validated.phone || undefined,
        },
        startDate.toISOString(),
      )

      router.push(`/${businessSlug}/manage/${booking.token}`)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            id="name"
            label="Name"
            type="text"
            required
            value={formData.name}
            error={errors.name}
            onChange={updateField('name')}
          />
          <FormField
            id="email"
            label="Email"
            type="email"
            value={formData.email || ''}
            error={errors.email}
            onChange={updateField('email')}
          />
          <FormField
            id="phone"
            label="Phone"
            type="tel"
            value={formData.phone || ''}
            error={errors.phone}
            onChange={updateField('phone')}
          />

          <Button type="submit" variant="solid" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating booking...' : 'Confirm booking (demo)'}
          </Button>

          <p className="text-xs text-(--gray-12)/50 text-center">
            This is a demo. No real booking will be created.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
