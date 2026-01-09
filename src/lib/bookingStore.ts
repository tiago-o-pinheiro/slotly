import type { Booking, BookingStatus } from '@/types/booking'

const STORAGE_KEY = 'slotly_bookings'

// In-memory fallback for SSR
const inMemoryStore = new Map<string, Booking>()

const isBrowser = typeof window !== 'undefined'

const generateToken = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let token = ''
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

const getAllBookings = (): Map<string, Booking> => {
  if (!isBrowser) {
    return inMemoryStore
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, Booking>
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.error('Failed to load bookings from localStorage', error)
  }

  return new Map()
}

const persistBookings = (bookings: Map<string, Booking>): void => {
  if (!isBrowser) {
    return
  }

  try {
    const obj = Object.fromEntries(bookings.entries())
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (error) {
    console.error('Failed to persist bookings to localStorage', error)
  }
}

export const getBookingByToken = (token: string): Booking | null => {
  const bookings = getAllBookings()
  return bookings.get(token) ?? null
}

export const saveBooking = (booking: Booking): void => {
  const bookings = getAllBookings()
  bookings.set(booking.token, booking)
  persistBookings(bookings)

  if (!isBrowser) {
    inMemoryStore.set(booking.token, booking)
  }
}

export const markBookingStatus = (token: string, status: BookingStatus): boolean => {
  const bookings = getAllBookings()
  const booking = bookings.get(token)

  if (!booking) {
    return false
  }

  booking.status = status
  bookings.set(token, booking)
  persistBookings(bookings)

  if (!isBrowser) {
    inMemoryStore.set(token, booking)
  }

  return true
}

export const createBooking = (
  businessId: string,
  serviceId: string,
  customer: { name: string; email?: string; phone?: string },
  startAtIso: string,
): Booking => {
  const booking: Booking = {
    token: generateToken(),
    businessId,
    serviceId,
    customer,
    startAtIso,
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  }

  saveBooking(booking)
  return booking
}
