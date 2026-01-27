import { z } from 'zod'

// ── Availability ─────────────────────────────────────────

export const MonthAvailabilityResponseSchema = z.object({
  availableDates: z.array(z.string()),
})

export const TimeSlotSchema = z.object({
  startTime: z.string(),
  endTime: z.string(),
})

export const DayAvailabilityResponseSchema = z.object({
  date: z.string(),
  slots: z.array(TimeSlotSchema),
})

// ── Lock ─────────────────────────────────────────────────

export const LockResponseSchema = z.object({
  ID: z.string(),
  BusinessID: z.string(),
  ServiceID: z.string(),
  Date: z.string(),
  StartTime: z.string(),
  EndTime: z.string(),
  ExpiresAt: z.string(),
  CreatedAt: z.string(),
})

// ── Confirm ──────────────────────────────────────────────

export const ConfirmResponseSchema = z.object({
  appointmentId: z.string(),
  message: z.string(),
  status: z.string(),
})

// ── Verify ───────────────────────────────────────────────

export const VerifyResponseSchema = z.object({
  appointmentId: z.string(),
  status: z.string(),
  message: z.string().optional(),
})
