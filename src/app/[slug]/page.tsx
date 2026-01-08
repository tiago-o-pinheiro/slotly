import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, MapPin, Mail, Star, ExternalLink } from 'lucide-react'
import { fetchBusinessBySlug } from '@/lib/business'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/Separator'
import { ServicesAccordion } from '@/components/landing/ServicesAccordion'
import { WorkingHoursSection } from '@/components/landing/WorkingHoursSection'
import { StickyCta } from '@/components/landing/StickyCta'

type BusinessPageProps = {
  params: Promise<{ slug: string }>
}

// Enable ISR with 5-minute revalidation (ready for production)
export const revalidate = 300

// Opt into dynamic rendering to support useSearchParams
export const dynamic = 'force-dynamic'

export const generateMetadata = async ({ params }: BusinessPageProps): Promise<Metadata> => {
  const { slug } = await params
  const business = await fetchBusinessBySlug(slug)

  if (!business) {
    return {
      title: 'Business Not Found',
    }
  }

  return {
    title: `${business.name} - Book Online | Slotly`,
    description: business.shortDescription,
    openGraph: {
      title: business.name,
      description: business.shortDescription,
      type: 'website',
    },
  }
}

const BusinessPage = async ({ params }: BusinessPageProps) => {
  const { slug } = await params

  // REST-ready fetch (currently uses mock, swap for fetch() in production)
  const business = await fetchBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-border sticky top-0 z-40 backdrop-blur-sm bg-surface/95">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">{business.name}</h1>
            <Badge variant="secondary" size="sm" className="mt-1">
              {business.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" aria-label="Call business">
              <a href={`tel:${business.contact.phone}`}>
                <Phone className="w-4 h-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" aria-label="Get directions">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address.line1}, ${business.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MapPin className="w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <section className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{business.name}</h2>
          <p className="text-lg text-foreground/80 mb-4">{business.shortDescription}</p>
          <div className="flex items-center gap-4 mb-6">
            <Badge variant="default" size="md" className="gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{business.rating.score}</span>
            </Badge>
            <span className="text-sm text-foreground/60">({business.rating.count} reviews)</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="solid" size="lg">
              <Link href={`/${business.slug}/book`}>Book now</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href={`tel:${business.contact.phone}`}>Call us</a>
            </Button>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Services Section */}
        <section id="services-section" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Services</h2>
          <Suspense fallback={<div className="text-foreground/60">Loading services...</div>}>
            <ServicesAccordion services={business.services} businessSlug={business.slug} />
          </Suspense>
        </section>

        <Separator className="my-12" />

        {/* Business Info Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Visit us</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-primary" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80">
                  {business.address.line1}
                  <br />
                  {business.address.city}, {business.address.region}
                  <br />
                  {business.address.postalCode}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opening hours</CardTitle>
              </CardHeader>
              <CardContent>
                <WorkingHoursSection workingHours={business.workingHours} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="w-4 h-4 text-primary" />
                  Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <a href={`tel:${business.contact.phone}`} className="block text-sm text-primary hover:underline">
                  {business.contact.phone}
                </a>
                <a
                  href={`mailto:${business.contact.email}`}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {business.contact.email}
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Reviews Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-4">What people say</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {business.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-4">
                  <p className="text-foreground/80 text-sm mb-3 italic">&ldquo;{review.quote}&rdquo;</p>
                  <p className="text-foreground/60 text-xs">— {review.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button asChild variant="ghost" size="sm">
            <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer" className="gap-2">
              Leave a review on Google
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </section>

        <footer className="border-t border-border pt-8 pb-12 text-center text-sm text-foreground/50">
          <p>&copy; 2026 {business.name}. All rights reserved.</p>
        </footer>
      </main>

      <StickyCta businessSlug={business.slug} businessName={business.name} />
    </div>
  )
}

export default BusinessPage
