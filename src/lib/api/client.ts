/**
 * Booking API client.
 *
 * All public booking endpoints behind Bearer token auth.
 * Auth + refresh handled by the shared axios instance.
 */

import api from './axios'
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
  ApiError,
} from './types'

// ── Error class ─────────────────────────────────────────

class BookingApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'BookingApiError'
    this.status = status
  }
}

// ── Public API ──────────────────────────────────────────

/** Month-level availability: which days have >= 1 open slot. */
export const getMonthAvailability = async (
  params: MonthAvailabilityParams,
): Promise<MonthAvailabilityResponse> => {
  const { data } = await api.get<MonthAvailabilityResponse>(
    '/availability/month',
    {
      params: {
        businessId: params.businessId,
        serviceId: params.serviceId,
        year: params.year,
        month: params.month,
      },
    },
  )
  return data
}

/** Day-level availability: concrete time slots for a date. */
export const getDayAvailability = async (
  params: DayAvailabilityParams,
): Promise<DayAvailabilityResponse> => {
  const { data } = await api.get<DayAvailabilityResponse>('/availability', {
    params: {
      businessId: params.businessId,
      serviceId: params.serviceId,
      date: params.date,
    },
  })
  return data
}

/** Lock a time slot (5-minute TTL). Must be called before confirm. */
export const lockAppointment = async (
  body: LockRequest,
): Promise<LockResponse> => {
  const { data } = await api.post<LockResponse>('/appointments/lock', body)
  return data
}

/** Confirm a locked appointment with customer details. */
export const confirmAppointment = async (
  body: ConfirmRequest,
): Promise<ConfirmResponse> => {
  const { data } = await api.post<ConfirmResponse>(
    '/appointments/confirm',
    body,
  )
  return data
}

/** Verify appointment with the emailed confirmation code. */
export const verifyAppointment = async (
  body: VerifyRequest,
): Promise<VerifyResponse> => {
  const { data } = await api.post<VerifyResponse>(
    '/appointments/verify',
    body,
  )
  return data
}

export { BookingApiError }
export type { ApiError }
