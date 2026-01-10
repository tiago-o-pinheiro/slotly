import type { Booking } from '@/types/booking'

/**
 * Helper function to get the next occurrence of a weekday with a specific time.
 * @param weekday - 1=Monday, 2=Tuesday, ..., 7=Sunday
 * @param time - Time in HH:mm format (e.g., '10:00')
 * @returns ISO string of the next occurrence
 */
const getNextWeekdayDateIso = (weekday: number, time: string): string => {
  const today = new Date()
  const currentDay = today.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday

  // Convert to ISO weekday (1=Monday, ..., 7=Sunday)
  const currentIsoWeekday = currentDay === 0 ? 7 : currentDay

  // Calculate days to add
  let daysToAdd = weekday - currentIsoWeekday
  if (daysToAdd <= 0) {
    daysToAdd += 7 // Move to next week if already passed
  }

  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysToAdd)

  // Set time
  const [hours, minutes] = time.split(':').map(Number)
  targetDate.setHours(hours, minutes, 0, 0)

  return targetDate.toISOString()
}

/**
 * Mock bookings to demonstrate availability conflicts in the calendar.
 * These bookings are used by the availability engine to exclude occupied time slots.
 *
 * Note: In production, these would come from a database/API.
 */
export const mockBookings: Booking[] = [
  // Claudio's Barber - Monday bookings
  {
    token: 'MOCK001ABCDEF123',
    businessId: 'biz_claudio_barber',
    serviceId: 'haircut',
    customer: {
      name: 'Marco Rossi',
      email: 'marco@example.com',
    },
    startAtIso: getNextWeekdayDateIso(1, '10:00'), // Monday 10:00
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  {
    token: 'MOCK002ABCDEF456',
    businessId: 'biz_claudio_barber',
    serviceId: 'beard-trim',
    customer: {
      name: 'Luca Bianchi',
      phone: '+34 600 111 222',
    },
    startAtIso: getNextWeekdayDateIso(1, '14:30'), // Monday 14:30
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  // Claudio's Barber - Wednesday bookings
  {
    token: 'MOCK003ABCDEF789',
    businessId: 'biz_claudio_barber',
    serviceId: 'haircut-beard',
    customer: {
      name: 'Giuseppe Verde',
      email: 'giuseppe@example.com',
      phone: '+34 600 333 444',
    },
    startAtIso: getNextWeekdayDateIso(3, '11:00'), // Wednesday 11:00
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  // Claudio's Barber - Friday bookings
  {
    token: 'MOCK004ABCDEFABC',
    businessId: 'biz_claudio_barber',
    serviceId: 'haircut',
    customer: {
      name: 'Antonio Nero',
      email: 'antonio@example.com',
    },
    startAtIso: getNextWeekdayDateIso(5, '09:00'), // Friday 09:00
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  {
    token: 'MOCK005ABCDEFXYZ',
    businessId: 'biz_claudio_barber',
    serviceId: 'beard-trim',
    customer: {
      name: 'Stefano Giallo',
      phone: '+34 600 555 666',
    },
    startAtIso: getNextWeekdayDateIso(5, '16:00'), // Friday 16:00
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
]
