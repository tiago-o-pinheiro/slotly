import { addDays, format, startOfDay, parse, addMinutes } from 'date-fns'
import type { Booking } from '@/types/booking'

/**
 * Working hours for a specific weekday.
 * weekday: 1=Monday, 2=Tuesday, ..., 7=Sunday
 */
export type WeekdayHours = {
  weekday: number
  start: string // HH:mm format (e.g., '09:00')
  end: string // HH:mm format (e.g., '18:00')
}

/**
 * A single bookable time slot.
 */
export type Slot = {
  startAtIso: string // ISO datetime string
  endAtIso: string // ISO datetime string
  label: string // Display label (e.g., '10:00 AM')
}

/**
 * Availability for a specific day.
 */
export type AvailabilityDay = {
  dateIso: string // YYYY-MM-DD format
  slots: Slot[]
}

/**
 * Parameters for computing availability.
 */
export type AvailabilityParams = {
  workingHours: WeekdayHours[]
  serviceDurationMin: number
  bufferMin?: number // Default: 0
  existingBookings: Booking[]
  businessId: string
}

/**
 * Computes available days for the next N days.
 * A day is considered available if it has at least one free slot.
 *
 * Note: For MVP, we treat the user's local timezone as the business timezone
 * to avoid complexity. In production, use business.timezone for accurate conversion.
 */
export const computeAvailableDays = (
  params: AvailabilityParams,
  daysAhead: number = 30
): string[] => {
  const availableDays: string[] = []
  const today = startOfDay(new Date())

  for (let i = 0; i < daysAhead; i++) {
    const targetDate = addDays(today, i)
    const dateIso = format(targetDate, 'yyyy-MM-dd')
    const slots = computeSlotsForDay(params, dateIso)

    if (slots.length > 0) {
      availableDays.push(dateIso)
    }
  }

  return availableDays
}

/**
 * Computes available time slots for a specific day.
 *
 * Algorithm:
 * 1. Check if the day has working hours configured
 * 2. Generate all possible slots from start to end in 15-minute increments
 * 3. Filter out slots that conflict with existing bookings
 * 4. Filter out slots in the past (if the day is today)
 * 5. Return sorted slots
 */
export const computeSlotsForDay = (
  params: AvailabilityParams,
  dateIso: string
): Slot[] => {
  const { workingHours, serviceDurationMin, bufferMin = 0, existingBookings, businessId } = params

  // Parse the target date
  const targetDate = parse(dateIso, 'yyyy-MM-dd', new Date())
  const targetWeekday = getIsoWeekday(targetDate)

  // Find working hours for this weekday
  const hours = workingHours.find((wh) => wh.weekday === targetWeekday)
  if (!hours) {
    return [] // No working hours for this weekday
  }

  // Parse start and end times
  const [startHour, startMin] = hours.start.split(':').map(Number)
  const [endHour, endMin] = hours.end.split(':').map(Number)

  const dayStart = new Date(targetDate)
  dayStart.setHours(startHour, startMin, 0, 0)

  const dayEnd = new Date(targetDate)
  dayEnd.setHours(endHour, endMin, 0, 0)

  // Generate all possible slots in 15-minute increments
  const slotDurationMin = serviceDurationMin + bufferMin
  const slotIncrement = 15 // Generate slots every 15 minutes
  const slots: Slot[] = []

  let currentTime = new Date(dayStart)
  const nowTime = new Date()

  while (currentTime < dayEnd) {
    const slotEnd = addMinutes(currentTime, slotDurationMin)

    // Check if slot end fits within working hours
    if (slotEnd > dayEnd) {
      break
    }

    // Skip slots in the past
    if (currentTime <= nowTime) {
      currentTime = addMinutes(currentTime, slotIncrement)
      continue
    }

    // Check for conflicts with existing bookings
    const hasConflict = existingBookings.some((booking) => {
      if (booking.businessId !== businessId || booking.status === 'cancelled') {
        return false
      }

      const bookingStart = new Date(booking.startAtIso)
      const bookingEnd = addMinutes(
        bookingStart,
        serviceDurationMin // Use current service duration for simplicity
      )

      // Check if slots overlap
      return currentTime < bookingEnd && slotEnd > bookingStart
    })

    if (!hasConflict) {
      slots.push({
        startAtIso: currentTime.toISOString(),
        endAtIso: slotEnd.toISOString(),
        label: format(currentTime, 'h:mm a'), // e.g., '10:00 AM'
      })
    }

    currentTime = addMinutes(currentTime, slotIncrement)
  }

  return slots
}

/**
 * Get ISO weekday from a Date object.
 * Returns 1=Monday, 2=Tuesday, ..., 7=Sunday
 */
const getIsoWeekday = (date: Date): number => {
  const day = date.getDay() // 0=Sunday, 1=Monday, ..., 6=Saturday
  return day === 0 ? 7 : day
}

/**
 * Check if a specific date is available (has at least one slot).
 */
export const isDateAvailable = (
  params: AvailabilityParams,
  dateIso: string
): boolean => {
  const slots = computeSlotsForDay(params, dateIso)
  return slots.length > 0
}
