'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, ThumbsUp, ExternalLink } from 'lucide-react'
import { getBookingByToken } from '@/lib/bookingStore'
import { fetchBusinessBySlug } from '@/lib/business'
import { saveFeedback, getFeedbackByBookingToken } from '@/lib/feedbackStore'
import type { Booking } from '@/types/booking'
import type { Business } from '@/types/domain'
import type { Feedback } from '@/types/feedback'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

const FeedbackPage = () => {
  const params = useParams()
  const token = params.token as string
  const slug = params.slug as string

  const [booking, setBooking] = useState<Booking | null>(null)
  const [business, setBusiness] = useState<Business | null>(null)
  const [existingFeedback, setExistingFeedback] = useState<Feedback | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

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

      const feedback = getFeedbackByBookingToken(token)

      setBooking(bookingData)
      setBusiness(businessData)
      setExistingFeedback(feedback)

      if (feedback) {
        setSelectedRating(feedback.rating)
        setComment(feedback.comment || '')
        setSubmitted(true)
      }

      setLoading(false)
    }

    loadData()
  }, [token, slug])

  const handleRatingSelect = (rating: number) => {
    if (!submitted) {
      setSelectedRating(rating)
    }
  }

  const handleSubmitFeedback = () => {
    if (!booking || !business || !selectedRating) return

    saveFeedback(booking.token, business.id, selectedRating, comment || undefined)
    setSubmitted(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-(--color-background) flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-(--color-background)">
      <header className="bg-(--gray-1) border-b border-(--gray-6)">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/${business.slug}/manage/${token}`} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to booking
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-(--gray-12) mb-2">
            {submitted ? 'Thank you for your feedback!' : 'How was your visit?'}
          </h1>
          <p className="text-lg text-(--gray-12)/70">{business.name}</p>
          {service && <p className="text-sm text-(--gray-12)/60 mt-1">{service.name}</p>}
        </div>

        {!submitted ? (
          <>
            {/* Rating Selection */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Rate your experience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingSelect(rating)}
                      className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-(--accent-8) focus:ring-offset-2 rounded-(--radius-full) p-2"
                    >
                      <Star
                        className={`w-10 h-10 md:w-12 md:h-12 transition-colors ${
                          selectedRating && rating <= selectedRating
                            ? 'fill-(--accent-9) text-(--accent-9)'
                            : 'text-(--gray-12)/30'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {selectedRating && (
                  <p className="text-center text-sm text-(--gray-12)/70">
                    {selectedRating === 5 && 'Excellent!'}
                    {selectedRating === 4 && 'Great!'}
                    {selectedRating === 3 && 'Good'}
                    {selectedRating === 2 && 'Could be better'}
                    {selectedRating === 1 && 'Not satisfied'}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Conditional feedback based on rating */}
            {selectedRating !== null && (
              <>
                {selectedRating >= 4 ? (
                  <Card className="bg-(--accent-3) border-(--accent-7)">
                    <CardContent className="pt-6 text-center">
                      <ThumbsUp className="w-12 h-12 text-(--accent-11) mx-auto mb-4" />
                      <h3 className="font-semibold text-(--gray-12) text-lg mb-2">
                        We&apos;re glad you had a great experience!
                      </h3>
                      <p className="text-sm text-(--gray-12)/70 mb-6">
                        Would you mind sharing your experience with others on Google?
                      </p>
                      {business.googleReviewUrl ? (
                        <Button asChild variant="solid" size="lg" className="mb-3">
                          <a
                            href={business.googleReviewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="gap-2"
                          >
                            Leave a Google review
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      ) : (
                        <Button variant="solid" size="lg" className="mb-3" onClick={handleSubmitFeedback}>
                          Submit feedback
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={handleSubmitFeedback}>
                        Skip for now
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Help us improve</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-(--gray-12)/70 mb-4">
                        We&apos;re sorry to hear your experience wasn&apos;t perfect. Please share what went wrong so we can
                        make it better.
                      </p>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us what happened..."
                        rows={5}
                        className="w-full px-3 py-2 border border-(--gray-6) rounded-(--radius-2) bg-(--gray-1) text-(--gray-12) focus:outline-none focus:ring-2 focus:ring-(--accent-8) resize-none"
                      />
                      <Button
                        variant="solid"
                        size="lg"
                        className="w-full mt-4"
                        onClick={handleSubmitFeedback}
                        disabled={!comment.trim()}
                      >
                        Submit private feedback
                      </Button>
                      <p className="text-xs text-(--gray-12)/50 text-center mt-3">
                        Your feedback will only be visible to the business owner
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </>
        ) : (
          <Card className="bg-(--gray-3)">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Star
                    key={rating}
                    className={`w-6 h-6 ${
                      existingFeedback && rating <= existingFeedback.rating
                        ? 'fill-(--accent-9) text-(--accent-9)'
                        : 'text-(--gray-12)/30'
                    }`}
                  />
                ))}
              </div>
              <h3 className="font-semibold text-(--gray-12) text-lg mb-2">Feedback submitted</h3>
              <p className="text-sm text-(--gray-12)/70 mb-4">Thank you for taking the time to share your thoughts.</p>
              {existingFeedback?.comment && (
                <div className="bg-(--gray-1) border border-(--gray-6) rounded-(--radius-2) p-4 mb-4">
                  <p className="text-sm text-(--gray-12)/70 italic">&ldquo;{existingFeedback.comment}&rdquo;</p>
                </div>
              )}
              <Button asChild variant="outline" size="md">
                <Link href={`/${business.slug}/manage/${token}`}>Back to booking</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t border-(--gray-6) mt-12 py-8 text-center text-sm text-(--gray-12)/50">
        <p>&copy; 2026 {business.name}. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default FeedbackPage
