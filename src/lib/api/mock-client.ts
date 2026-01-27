/**
 * Mock booking API client.
 *
 * Same interface as client.ts but backed by local computation.
 * Uses the existing availability engine + mock business data.
 */

import { format } from 'date-fns'
import { computeAvailableDays, computeSlotsForDay } from '@/lib/availability'
import { mockBusinesses } from '@/mocks/businesses'
import { mockBookings } from '@/mocks/bookings'
import type {
  MonthAvailabilityParams,
  MonthAvailabilityResponse,
  DayAvailabilityParams,
  DayAvailabilityResponse,
  LockRequest,
  LockResponse,
  ConfirmRequest,
  ConfirmResponse,
  VerifyRequest,
  VerifyResponse,
} from './types'

export { BookingApiError } from './client'

// ── Helpers ──────────────────────────────────────────────

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms))

const lookupService = (businessId: string, serviceId: string) => {
  const biz = mockBusinesses.find((b) => b.id === businessId)
  if (!biz) throw new Error(`Mock: unknown businessId ${businessId}`)
  const svc = biz.services.find((s) => s.id === serviceId)
  if (!svc) throw new Error(`Mock: unknown serviceId ${serviceId}`)
  return { biz, svc }
}

// ── Public API (mirrors client.ts) ──────────────────────

export const getMonthAvailability = async (
  params: MonthAvailabilityParams,
): Promise<MonthAvailabilityResponse> => {
  await delay()
  const { biz, svc } = lookupService(params.businessId, params.serviceId)

  const allDays = computeAvailableDays(
    {
      workingHours: biz.workingHours,
      serviceDurationMin: svc.durationMin,
      existingBookings: mockBookings,
      businessId: biz.id,
    },
    90, // look ahead 90 days to cover any requested month
  )

  const prefix = `${params.year}-${String(params.month).padStart(2, '0')}`
  const availableDates = allDays.filter((d) => d.startsWith(prefix))

  return { availableDates }
}

export const getDayAvailability = async (
  params: DayAvailabilityParams,
): Promise<DayAvailabilityResponse> => {
  await delay()
  const { biz, svc } = lookupService(params.businessId, params.serviceId)

  const slots = computeSlotsForDay(
    {
      workingHours: biz.workingHours,
      serviceDurationMin: svc.durationMin,
      existingBookings: mockBookings,
      businessId: biz.id,
    },
    params.date,
  )

  return {
    date: params.date,
    slots: slots.map((s) => ({
      startTime: format(new Date(s.startAtIso), 'HH:mm'),
      endTime: format(new Date(s.endAtIso), 'HH:mm'),
    })),
  }
}

export const lockAppointment = async (
  body: LockRequest,
): Promise<LockResponse> => {
  await delay()
  const now = new Date().toISOString()
  const expires = new Date(Date.now() + 5 * 60_000).toISOString()
  return {
    ID: crypto.randomUUID(),
    BusinessID: body.businessId,
    ServiceID: body.serviceId,
    Date: body.date,
    StartTime: body.startTime,
    EndTime: body.endTime,
    ExpiresAt: expires,
    CreatedAt: now,
  }
}

export const confirmAppointment = async (
  body: ConfirmRequest,
): Promise<ConfirmResponse> => {
  await delay()
  return {
    appointmentId: body.appointmentId,
    message: 'Appointment confirmed (mock)',
    status: 'confirmed',
  }
}

export const verifyAppointment = async (
  body: VerifyRequest,
): Promise<VerifyResponse> => {
  await delay()
  return {
    appointmentId: body.appointmentId,
    status: 'verified',
    message: 'Verification successful (mock)',
  }
}
