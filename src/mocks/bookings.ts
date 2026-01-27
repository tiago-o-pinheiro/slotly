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
 * Uses backend-aligned UUIDs for Claudio's Barber.
 */
export const mockBookings: Booking[] = [
  {
    token: 'MOCK001ABCDEF123',
    businessId: 'b6f7e7e0-0000-4000-8000-000000000001',
    serviceId: 'b6f7e7e0-0000-4000-8000-000000000101',
    customer: {
      name: 'Marco Rossi',
      email: 'marco@example.com',
      phone: '+34 600 000 111',
    },
    startAtIso: getNextWeekdayDateIso(1, '10:00'),
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  {
    token: 'MOCK002ABCDEF456',
    businessId: 'b6f7e7e0-0000-4000-8000-000000000001',
    serviceId: 'b6f7e7e0-0000-4000-8000-000000000102',
    customer: {
      name: 'Luca Bianchi',
      email: 'luca@example.com',
      phone: '+34 600 111 222',
    },
    startAtIso: getNextWeekdayDateIso(1, '14:30'),
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  {
    token: 'MOCK003ABCDEF789',
    businessId: 'b6f7e7e0-0000-4000-8000-000000000001',
    serviceId: 'b6f7e7e0-0000-4000-8000-000000000102',
    customer: {
      name: 'Giuseppe Verde',
      email: 'giuseppe@example.com',
      phone: '+34 600 333 444',
    },
    startAtIso: getNextWeekdayDateIso(3, '11:00'),
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
  {
    token: 'MOCK004ABCDEFABC',
    businessId: 'b6f7e7e0-0000-4000-8000-000000000001',
    serviceId: 'b6f7e7e0-0000-4000-8000-000000000101',
    customer: {
      name: 'Antonio Nero',
      email: 'antonio@example.com',
      phone: '+34 600 555 666',
    },
    startAtIso: getNextWeekdayDateIso(5, '09:00'),
    status: 'confirmed',
    createdAtIso: new Date().toISOString(),
  },
]
