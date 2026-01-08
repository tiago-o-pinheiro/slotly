import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { fetchBusinessBySlug } from '@/lib/business'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, formatDuration } from '@/lib/format'

type BookingPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string }>
}

const BookingPage = async ({ params, searchParams }: BookingPageProps) => {
  const { slug } = await params
  const { service: serviceId } = await searchParams
  const business = await fetchBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  const selectedService = serviceId ? business.services.find((s) => s.id === serviceId) : null

  const steps = [
    { label: 'Service', icon: CheckCircle2, active: !!selectedService },
    { label: 'Date', icon: Calendar, active: false },
    { label: 'Time', icon: Clock, active: false },
    { label: 'Confirm', icon: CheckCircle2, active: false },
  ]

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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Book your appointment</h1>
          <p className="text-lg text-foreground/70">{business.name}</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      step.active ? 'bg-primary text-white' : 'bg-muted text-foreground/40'
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      step.active ? 'text-foreground font-medium' : 'text-foreground/50'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && <div className={`h-px flex-1 ${step.active ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Service Summary */}
        {selectedService && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-base">Selected service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{selectedService.name}</p>
                  <p className="text-sm text-foreground/60 mt-1">{selectedService.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="default" size="sm">
                    {formatPrice(selectedService.priceCents)}
                  </Badge>
                  <p className="text-xs text-foreground/60 mt-1">{formatDuration(selectedService.durationMin)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Placeholder UI */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-brand flex items-center justify-center">
                <p className="text-foreground/40 text-sm">Calendar widget (coming soon)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Time slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-brand flex items-center justify-center">
                <p className="text-foreground/40 text-sm">Time slots (coming soon)</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-foreground mb-2">Next step: booking flow implementation</h3>
            <p className="text-foreground/70 text-sm mb-4">
              The complete booking experience will include service selection, real-time availability, customer details
              form, and confirmation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="solid" size="md">
                <a href={`tel:${business.contact.phone}`}>Call to book: {business.contact.phone}</a>
              </Button>
              <Button asChild variant="outline" size="md">
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

export default BookingPage
