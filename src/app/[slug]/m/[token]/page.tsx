'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, Download, X, Star } from 'lucide-react'
import { getBookingByToken, markBookingStatus } from '@/lib/bookingStore'
import { fetchBusinessBySlug } from '@/lib/business'
import { addLoyaltyStamp } from '@/lib/loyaltyStore'
import type { Booking } from '@/types/booking'
import type { Business } from '@/types/domain'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { Skeleton } from '@/components/ui/Skeleton'
import { LoyaltyCard } from '@/components/booking/LoyaltyCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/Dialog'
import { formatPrice, formatDuration } from '@/lib/format'

const ManageBookingPage = () => {
  const params = useParams()
  const token = params.token as string
  const slug = params.slug as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      const bookingData = getBookingByToken(token)
      if (!bookingData) {
        setLoading(false)
        return
      }

      const businessData = await fetchBusinessBySlug(slug)
      if (!businessData || businessData.id !== bookingData.businessId) {
        setLoading(false)
        return
      }

      setBooking(bookingData)
      setBusiness(businessData)

      // Add loyalty stamp if booking is completed and customer has email
      if (bookingData.status === 'completed' && bookingData.customer.email && businessData.loyalty?.enabled) {
        addLoyaltyStamp(businessData.id, bookingData.customer.email)
      }

      setLoading(false)
    }

    loadData()
  }, [token, slug])

  const handleCancelBooking = () => {
    if (booking) {
      markBookingStatus(booking.token, 'cancelled')
      setBooking({ ...booking, status: 'cancelled' })
      setCancelDialogOpen(false)
    }
  }

  const handleDownloadICS = () => {
    if (!booking || !business) return

    const service = business.services.find((s) => s.id === booking.serviceId)
    if (!service) return

    const startDate = new Date(booking.startAtIso)
    const endDate = new Date(startDate.getTime() + service.durationMin * 60000)

    const formatICSDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Slotly//Booking//EN',
      'BEGIN:VEVENT',
      `UID:${booking.token}@slotly`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${service.name} at ${business.name}`,
      `DESCRIPTION:${service.description}`,
      `LOCATION:${business.address.line1}, ${business.address.city}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `booking-${booking.token}.ics`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    )
  }

  if (!booking || !business) {
    notFound()
  }

  const service = business.services.find((s) => s.id === booking.serviceId)
  if (!service) {
    notFound()
  }

  const startDate = new Date(booking.startAtIso)
  const formattedDate = startDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = startDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const customerIdentifier = booking.customer.email || booking.customer.phone || booking.customer.name

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${business.slug}`} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to {business.name}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your booking</h1>
          <div className="flex items-center gap-2">
            <Badge
              variant={
                booking.status === 'confirmed'
                  ? 'default'
                  : booking.status === 'cancelled'
                    ? 'secondary'
                    : 'default'
              }
            >
              {booking.status}
            </Badge>
            <span className="text-sm text-foreground/60">Booking #{booking.token.slice(0, 8)}</span>
          </div>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Appointment details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground text-lg mb-1">{service.name}</h3>
              <p className="text-sm text-foreground/70">{service.description}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-foreground/60">
                <span>{formatDuration(service.durationMin)}</span>
                <span className="text-foreground/40">•</span>
                <span className="font-medium text-primary">{formatPrice(service.priceCents)}</span>
              </div>
            </div>

            <Separator />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Date</p>
                  <p className="text-sm text-foreground/70">{formattedDate}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Time</p>
                  <p className="text-sm text-foreground/70">{formattedTime}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-foreground mb-2">Customer</h4>
              <p className="text-sm text-foreground/70">{booking.customer.name}</p>
              {booking.customer.email && (
                <p className="text-sm text-foreground/70">{booking.customer.email}</p>
              )}
              {booking.customer.phone && (
                <p className="text-sm text-foreground/70">{booking.customer.phone}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        {booking.status === 'confirmed' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Manage your booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" size="md" className="w-full" onClick={handleDownloadICS}>
                <Download className="w-4 h-4 mr-2" />
                Add to calendar
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="md" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Reschedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reschedule appointment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <p className="text-sm text-foreground/70">
                      Rescheduling functionality will be available once backend integration is complete.
                    </p>
                    <div className="space-y-2">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full">
                      Close
                    </Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>

              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="md" className="w-full text-red-500 hover:text-red-600">
                    <X className="w-4 h-4 mr-2" />
                    Cancel booking
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel booking?</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="text-sm text-foreground/70">
                      Are you sure you want to cancel this booking? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setCancelDialogOpen(false)}>
                      Keep booking
                    </Button>
                    <Button variant="solid" className="flex-1 bg-red-500 hover:bg-red-600" onClick={handleCancelBooking}>
                      Yes, cancel
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Separator className="my-4" />

              <Button asChild variant="ghost" size="md" className="w-full">
                <Link href={`/${business.slug}/f/${booking.token}`} className="gap-2">
                  <Star className="w-4 h-4" />
                  Rate your visit
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loyalty Card */}
        {business.loyalty?.enabled && (
          <div className="mb-6">
            <LoyaltyCard loyalty={business.loyalty} businessId={business.id} customerIdentifier={customerIdentifier} />
          </div>
        )}

        {/* Business Info */}
        <Card>
          <CardHeader>
            <CardTitle>Location & contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Address</p>
                <p className="text-sm text-foreground/70">
                  {business.address.line1}
                  <br />
                  {business.address.city}, {business.address.region} {business.address.postalCode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Phone</p>
                <a href={`tel:${business.contact.phone}`} className="text-sm text-primary hover:underline">
                  {business.contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <a href={`mailto:${business.contact.email}`} className="text-sm text-primary hover:underline">
                  {business.contact.email}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t border-border mt-12 py-8 text-center text-sm text-foreground/50">
        <p>&copy; 2026 {business.name}. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ManageBookingPage
