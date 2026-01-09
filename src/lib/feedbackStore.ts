import type { Feedback } from '@/types/feedback'

const STORAGE_KEY = 'slotly_feedback'

// In-memory fallback for SSR
const inMemoryStore = new Map<string, Feedback>()

const isBrowser = typeof window !== 'undefined'

const generateId = (): string => {
  return `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

const getAllFeedback = (): Map<string, Feedback> => {
  if (!isBrowser) {
    return inMemoryStore
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, Feedback>
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.error('Failed to load feedback from localStorage', error)
  }

  return new Map()
}

const persistFeedback = (feedback: Map<string, Feedback>): void => {
  if (!isBrowser) {
    return
  }

  try {
    const obj = Object.fromEntries(feedback.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (error) {
    console.error('Failed to persist feedback to localStorage', error)
  }
}

export const getFeedbackByBookingToken = (bookingToken: string): Feedback | null => {
  const allFeedback = getAllFeedback()
  for (const feedback of allFeedback.values()) {
    if (feedback.bookingToken === bookingToken) {
      return feedback
    }
  }
  return null
}

export const saveFeedback = (
  bookingToken: string,
  businessId: string,
  rating: number,
  comment?: string,
): Feedback => {
  const feedback: Feedback = {
    id: generateId(),
    bookingToken,
    businessId,
    rating,
    comment,
    createdAtIso: new Date().toISOString(),
  }

  const allFeedback = getAllFeedback()
  allFeedback.set(feedback.id, feedback)
  persistFeedback(allFeedback)

  if (!isBrowser) {
    inMemoryStore.set(feedback.id, feedback)
  }

  return feedback
}
