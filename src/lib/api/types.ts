// ── Session ──────────────────────────────────────────────

export type SessionResponse = {
  token: string
}

// ── Availability ─────────────────────────────────────────

export type MonthAvailabilityParams = {
  businessId: string
  serviceId: string
  year: number
  month: number // 1-12
}

/** Each entry is a date string "YYYY-MM-DD" that has ≥1 slot */
export type MonthAvailabilityResponse = {
  availableDates: string[]
}

export type DayAvailabilityParams = {
  businessId: string
  serviceId: string
  date: string // YYYY-MM-DD
}

export type TimeSlot = {
  startTime: string // "HH:mm"
  endTime: string   // "HH:mm"
}

export type DayAvailabilityResponse = {
  date: string
  slots: TimeSlot[]
}

// ── Lock ─────────────────────────────────────────────────

export type LockRequest = {
  businessId: string
  serviceId: string
  date: string      // YYYY-MM-DD
  startTime: string // HH:mm
  endTime: string   // HH:mm
}

/** Backend returns PascalCase (Go) */
export type LockResponse = {
  ID: string
  BusinessID: string
  ServiceID: string
  Date: string
  StartTime: string
  EndTime: string
  ExpiresAt: string
  CreatedAt: string
}

// ── Confirm ──────────────────────────────────────────────

export type ConfirmRequest = {
  appointmentId: string
  name: string
  email: string
  phone: string
}

export type ConfirmResponse = {
  appointmentId: string
  message: string
  status: string
}

// ── Verify ───────────────────────────────────────────────

export type VerifyRequest = {
  appointmentId: string
  confirmationCode: string
}

export type VerifyResponse = {
  appointmentId: string
  status: string
  message?: string
}

// ── Errors ───────────────────────────────────────────────

export type ApiError = {
  message: string
  status: number
}
