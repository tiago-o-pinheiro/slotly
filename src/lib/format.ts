export const formatPrice = (priceCents: number): string => {
  if (priceCents === 0) {
    return 'Free'
  }

  const amount = (priceCents / 100).toFixed(2)
  return `€${amount}`
}

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}min`
}

/** Format a Date to ICS-compatible UTC string (e.g. 20260127T143000Z). */
export const formatICSDate = (date: Date): string =>
  date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

/** Format hours and minutes to HH:mm (zero-padded). */
export const formatHHmm = (hours: number, minutes: number): string =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

export const formatTime = (time: string): string => {
  // Input format: HH:mm, output format: h:mma or HH:mm depending on preference
  const [hours, minutes] = time.split(':').map(Number)

  if (hours === 12) {
    return `${hours}:${minutes.toString().padStart(2, '0')}pm`
  } else if (hours > 12) {
    return `${hours - 12}:${minutes.toString().padStart(2, '0')}pm`
  } else if (hours === 0) {
    return `12:${minutes.toString().padStart(2, '0')}am`
  } else {
    return `${hours}:${minutes.toString().padStart(2, '0')}am`
  }
}
