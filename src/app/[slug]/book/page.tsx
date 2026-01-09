import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { fetchBusinessBySlug } from '@/lib/business'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { StepHeader } from '@/components/booking/StepHeader'
import { ServicePicker } from '@/components/booking/ServicePicker'
import { BookingConfirmForm } from '@/components/booking/BookingConfirmForm'
import { formatPrice, formatDuration } from '@/lib/format'

type BookingPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string }>
}

export const dynamic = 'force-dynamic'

const BookingPageContent = async ({ params, searchParams }: BookingPageProps) => {
  const { slug } = await params
  const { service: serviceId } = await searchParams
  const business = await fetchBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const selectedService = serviceId ? business.services.find((s) => s.id === serviceId) : null

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
        <StepHeader title="Book your appointment" currentStep="service" />

        {/* Service Selection or Summary */}
        {selectedService ? (
          <>
            {/* Selected Service Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Selected service</span>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/${business.slug}/book`}>Change</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-2">{selectedService.name}</h3>
                    <p className="text-sm text-foreground/70 mb-3">{selectedService.description}</p>
                    {selectedService.notes && (
                      <p className="text-xs text-foreground/60 italic">{selectedService.notes}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <Badge variant="default" size="md" className="mb-2">
                      {formatPrice(selectedService.priceCents)}
                    </Badge>
                    <p className="text-sm text-foreground/60">{formatDuration(selectedService.durationMin)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder: Pick a Date */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Pick a date
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <Skeleton className="h-8 w-full" />
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/50 text-center mt-6">
                    Date selection will be available once backend integration is complete
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Placeholder: Pick a Time */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Pick a time
              </h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/50 text-center mt-6">
                    Time slot selection will be available once backend integration is complete
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Booking Confirmation Form */}
            <section className="mb-8">
              <BookingConfirmForm businessId={business.id} businessSlug={business.slug} serviceId={selectedService.id} />
            </section>
          </>
        ) : (
          <>
            {/* Service Picker - No service selected */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-foreground mb-4">Choose a service</h2>
              <ServicePicker services={business.services} businessSlug={business.slug} />
            </section>

            <Card className="bg-muted/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-foreground/70">
                  Select a service above to continue with your booking
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {/* Call to action fallback */}
        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Need help booking?</h3>
            <p className="text-foreground/70 text-sm mb-4">
              You can always reach us directly by phone or email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="outline" size="md">
                <a href={`tel:${business.contact.phone}`}>Call: {business.contact.phone}</a>
              </Button>
              <Button asChild variant="ghost" size="md">
                <a href={`mailto:${business.contact.email}`}>Email us</a>
              </Button>
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

const BookingPage = (props: BookingPageProps) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </div>
        </div>
      }
    >
      <BookingPageContent {...props} />
    </Suspense>
  )
}

export default BookingPage
