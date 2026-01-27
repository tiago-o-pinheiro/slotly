import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Phone, MapPin, Star, Clock } from 'lucide-react'
import { fetchBusinessBySlug } from '@/lib/business'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/widgets/header'
import { ServicesAccordion } from '@/components/landing/ServicesAccordion'
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
      <Header
        variant="landing"
        businessName={business.name}
        category={business.category}
        phone={business.contact.phone}
        address={`${business.address.line1}, ${business.address.city}`}
      />

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-[1100px]">
        {/* Hero Section */}
        <div className="@container">
          <div className="md:p-4">
            <div
              className="relative flex min-h-[420px] flex-col gap-6 bg-cover bg-center bg-no-repeat md:gap-8 md:rounded-(--radius-4) items-start justify-end px-5 pb-10 md:px-10 overflow-hidden"
              style={{
                backgroundImage: business.heroImage
                  ? `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0) 100%), url(${business.heroImage})`
                  : `linear-gradient(135deg, var(--accent-9) 0%, var(--accent-10) 100%)`,
              }}
            >
              <div className="flex flex-col gap-3 text-left w-full max-w-[480px]">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center bg-black/20 backdrop-blur-sm px-2 py-1 rounded-(--radius-2) text-white text-xs font-bold">
                    <Star className="w-4 h-4 text-(--amber-9) fill-(--amber-9) mr-1" />
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
                  className="flex-1 bg-black/20 backdrop-blur-md text-white border-white/30 hover:bg-black/30"
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
        <h3 className="text-(--gray-12) text-lg font-bold mb-4">Services</h3>
        <Suspense fallback={<div className="text-(--gray-11)">Loading services...</div>}>
          <ServicesAccordion services={business.services} businessSlug={business.slug} />
        </Suspense>
      </div>

      {/* About Section */}
      <AboutSection about={business.about} businessName={business.name} highlights={business.highlights} />

      {/* Highlights Section */}
      <HighlightsSection highlights={business.highlights} />

        {/* Visit Us Section */}
        <div className="px-4 py-8 flex flex-col gap-4">
          <h3 className="text-(--gray-12) text-lg font-bold">Visit Us</h3>

          {/* Embedded Google Maps */}
          <div className="w-full h-[300px] rounded-(--radius-4) overflow-hidden border border-(--gray-6) shadow-sm">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${business.address.line1}, ${business.address.city}`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Business location map"
            />
          </div>

          <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Address Card */}
          <div className="flex items-start gap-4 p-4 rounded-(--radius-4) bg-(--gray-1) border border-(--gray-6) shadow-sm">
            <div className="size-10 rounded-(--radius-full) bg-(--gray-3) flex items-center justify-center shrink-0 text-(--accent-11)">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-(--gray-12) text-sm">Location</span>
              <span className="text-sm text-(--gray-11)">
                {business.address.line1}
                <br />
                {business.address.city}, {business.address.region}
              </span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.address.line1}, ${business.address.city}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-(--accent-11) text-xs font-bold mt-1"
              >
                Get Directions
              </a>
            </div>
          </div>

          {/* Hours Card */}
          <div className="flex items-start gap-4 p-4 rounded-(--radius-4) bg-(--gray-1) border border-(--gray-6) shadow-sm">
            <div className="size-10 rounded-(--radius-full) bg-(--gray-3) flex items-center justify-center shrink-0 text-(--accent-11)">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <span className="font-bold text-(--gray-12) text-sm">Opening Hours</span>
              {todayHours ? (
                <div className="flex justify-between items-center text-sm mt-1">
                  <Badge variant="default" size="sm" className="bg-(--green-9)">
                    Open Today
                  </Badge>
                  <span className="font-semibold text-(--gray-12)">
                    {todayHours.start} - {todayHours.end}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-(--gray-11)">Closed today</span>
              )}
            </div>
          </div>

          {/* Contact Card */}
          <div className="flex items-start gap-4 p-4 rounded-(--radius-4) bg-(--gray-1) border border-(--gray-6) shadow-sm">
            <div className="size-10 rounded-(--radius-full) bg-(--gray-3) flex items-center justify-center shrink-0 text-(--accent-11)">
              <Phone className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-(--gray-12) text-sm">Contact</span>
              <a href={`tel:${business.contact.phone}`} className="text-sm text-(--gray-11)">
                {business.contact.phone}
              </a>
              <a href={`mailto:${business.contact.email}`} className="text-sm text-(--gray-11)">
                {business.contact.email}
              </a>
            </div>
          </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="px-4 py-4 mb-8">
          <h3 className="text-(--gray-12) text-lg font-bold mb-4">Reviews</h3>
          <div className="flex flex-col md:flex-row gap-4">
            {business.reviews.map((review) => (
              <div key={review.id} className="bg-(--gray-3) p-4 rounded-(--radius-4) relative flex-1">
                <div className="absolute top-4 right-4 text-(--gray-6) text-4xl leading-none">&ldquo;</div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? 'fill-(--amber-9) text-(--amber-9)'
                          : 'text-(--gray-6)'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-(--gray-11) font-medium italic mb-3">&ldquo;{review.quote}&rdquo;</p>
                <span className="text-xs font-bold text-(--gray-12)">— {review.author}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* End Main Content Container */}

      {/* Footer */}
      <div className="px-4 py-8 text-center border-t border-(--gray-6) bg-(--gray-2)">
        <h4 className="font-bold text-(--gray-12) mb-4">{business.name}</h4>
        {business.social && (business.social.instagram || business.social.website) && (
          <div className="flex justify-center gap-6 text-sm text-(--gray-11) mb-6">
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
        <p className="text-xs text-(--gray-10)">&copy; 2026 {business.name}. All rights reserved.</p>
      </div>

      {/* Sticky Bottom CTA */}
      <StickyCta businessSlug={business.slug} businessName={business.name} />
    </div>
  )
}

export default BusinessPage
