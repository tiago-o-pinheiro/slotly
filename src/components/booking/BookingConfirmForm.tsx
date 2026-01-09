'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
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

export const BookingConfirmForm = ({ businessId, businessSlug, serviceId }: BookingConfirmFormProps) => {
  const router = useRouter()
  const [formData, setFormData] = useState<CustomerInput>({
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInput, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setIsSubmitting(true)

    try {
      const validated = customerSchema.parse(formData)

      // Mock date/time (2 days from now at 10:00 AM)
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

      router.push(`/${businessSlug}/m/${booking.token}`)
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
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-brand bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-brand bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-brand bg-surface text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <Button type="submit" variant="solid" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating booking...' : 'Confirm booking (demo)'}
          </Button>

          <p className="text-xs text-foreground/50 text-center">
            This is a demo. No real booking will be created.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
