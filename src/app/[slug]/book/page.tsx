import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { fetchBusinessBySlug } from '@/lib/business'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { BookingWizard } from '@/components/booking/BookingWizard'
import { Header } from '@/components/widgets/header'

type BookingPageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string; date?: string; time?: string }>
}

export const dynamic = 'force-dynamic'

const BookingPageContent = async ({ params }: BookingPageProps) => {
  const { slug } = await params
  const business = await fetchBusinessBySlug(slug)

  if (!business) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-(--color-background)">


      <main className="container mx-auto px-4 pt-2 max-w-4xl">
        <BookingWizard business={business} />

        {/* Call to action fallback */}
        <Card className="mt-8 bg-(--accent-a2) border-(--accent-6)">
          <CardContent className="pt-6">
            <h3 className="font-semibold text-(--gray-12) mb-2">Need help booking?</h3>
            <p className="text-(--gray-11) text-sm mb-4">
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

      <footer className="border-t border-(--gray-6) mt-12 py-8 text-center text-sm text-(--gray-11)">
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
