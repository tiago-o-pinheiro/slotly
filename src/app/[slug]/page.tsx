import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, MapPin, Mail, Star, ExternalLink, Instagram, Clock } from 'lucide-react'
import { fetchBusinessBySlug } from '@/lib/business'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ServicesAccordion } from '@/components/landing/ServicesAccordion'
import { WorkingHoursSection } from '@/components/landing/WorkingHoursSection'
import { StickyCta } from '@/components/landing/StickyCta'
import { GallerySection } from '@/components/landing/GallerySection'
import { AboutSection } from '@/components/landing/AboutSection'
import { HighlightsSection } from '@/components/landing/HighlightsSection'
import { CtaStrip } from '@/components/landing/CtaStrip'

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

  const today = new Date().getDay()
  const todayHours = business.workingHours.find((h) => h.weekday === today)

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24">
      {/* Sticky Header - Full width background, centered content */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="mx-auto max-w-[1100px] flex items-center justify-between h-16 px-4">
          <div className="flex flex-col justify-center">
            <h2 className="text-foreground text-lg font-bold leading-tight">{business.name}</h2>
            <Badge variant="secondary" size="sm" className="w-fit mt-0.5 text-xs">
              {business.category}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="size-10 rounded-full p-0">
              <a href={`tel:${business.contact.phone}`} aria-label="Call business">
                <Phone className="w-5 h-5" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm" className="size-10 rounded-full p-0">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address.line1}, ${business.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get directions"
              >
                <MapPin className="w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Hero Section */}
        <div className="@container">
          <div className="md:p-4">
            <div
              className="relative flex min-h-[420px] flex-col gap-6 bg-cover bg-center bg-no-repeat md:gap-8 md:rounded-lg items-start justify-end px-5 pb-10 md:px-10 overflow-hidden"
              style={{
                backgroundImage: business.heroImage
                  ? `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0) 100%), url(${business.heroImage})`
                  : 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)',
              }}
            >
              <div className="flex flex-col gap-3 text-left w-full max-w-[480px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                    {business.rating.score} ({business.rating.count})
                  </div>
                </div>
                <h1 className="text-white text-4xl md:text-5xl font-black leading-tight">
                  {business.name}
                </h1>
                <h2 className="text-white/90 text-sm md:text-base font-medium leading-normal">
                  {business.shortDescription}
                </h2>
              </div>
              <div className="flex w-full gap-3 mt-2 max-w-[480px]">
                <Button asChild variant="solid" size="lg" className="flex-1 shadow-lg">
                  <Link href={`/${business.slug}/book`}>Book now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="flex-1 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
                >
                  <a href={`tel:${business.contact.phone}`}>Call us</a>
                </Button>
              </div>
            </div>
          </div>
        </div>

      {/* Gallery Section */}
      <GallerySection gallery={business.gallery} />

      {/* CTA Strip */}
      <CtaStrip businessSlug={business.slug} />

      {/* Services Section */}
      <div className="px-4 py-4">
        <h3 className="text-foreground text-lg font-bold mb-4">Services</h3>
        <Suspense fallback={<div className="text-foreground/60">Loading services...</div>}>
          <ServicesAccordion services={business.services} businessSlug={business.slug} />
        </Suspense>
      </div>

      {/* About Section */}
      <AboutSection about={business.about} businessName={business.name} highlights={business.highlights} />

      {/* Highlights Section */}
      <HighlightsSection highlights={business.highlights} />

        {/* Visit Us Section */}
        <div className="px-4 py-8 flex flex-col gap-4">
          <h3 className="text-foreground text-lg font-bold">Visit Us</h3>
          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Address Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-foreground text-sm">Location</span>
              <span className="text-sm text-foreground/70">
                {business.address.line1}
                <br />
                {business.address.city}, {business.address.region}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address.line1}, ${business.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-xs font-bold mt-1"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Hours Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-primary">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <span className="font-bold text-foreground text-sm">Opening Hours</span>
              {todayHours ? (
                <div className="flex justify-between items-center text-sm mt-1">
                  <Badge variant="default" size="sm" className="bg-green-500">
                    Open Today
                  </Badge>
                  <span className="font-semibold text-foreground">
                    {todayHours.start} - {todayHours.end}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-foreground/70">Closed today</span>
              )}
            </div>
          </div>

          {/* Contact Card */}
          <div className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border shadow-sm">
            <div className="size-10 rounded-full bg-muted flex items-center justify-center shrink-0 text-primary">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-foreground text-sm">Contact</span>
              <a href={`tel:${business.contact.phone}`} className="text-sm text-foreground/70">
                {business.contact.phone}
              </a>
              <a href={`mailto:${business.contact.email}`} className="text-sm text-foreground/70">
                {business.contact.email}
              </a>
            </div>
          </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-4 py-4 mb-8">
          <h3 className="text-foreground text-lg font-bold mb-4">Reviews</h3>
          <div className="flex flex-col md:flex-row gap-4">
            {business.reviews.map((review) => (
              <div key={review.id} className="bg-muted p-4 rounded-xl relative flex-1">
                <div className="absolute top-4 right-4 text-border text-4xl leading-none">"</div>
                <div className="flex gap-1 text-yellow-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 font-medium italic mb-3">"{review.quote}"</p>
                <span className="text-xs font-bold text-foreground">— {review.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* End Main Content Container */}

      {/* Footer */}
      <div className="px-4 py-8 text-center border-t border-border bg-muted">
        <h4 className="font-bold text-foreground mb-4">{business.name}</h4>
        {business.social && (business.social.instagram || business.social.website) && (
          <div className="flex justify-center gap-6 text-sm text-foreground/70 mb-6">
            {business.social.instagram && (
              <a href={business.social.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
            {business.social.website && (
              <a href={business.social.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            )}
          </div>
        )}
        <p className="text-xs text-foreground/50">&copy; 2026 {business.name}. All rights reserved.</p>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCta businessSlug={business.slug} businessName={business.name} />
    </div>
  )
}

export default BusinessPage
