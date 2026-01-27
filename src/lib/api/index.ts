export {
  initSession,
} from './axios'

export {
  getMonthAvailability,
  getDayAvailability,
  lockAppointment,
  confirmAppointment,
  verifyAppointment,
  BookingApiError,
} from './client'

export type {
  SessionResponse,
  MonthAvailabilityParams,
  MonthAvailabilityResponse,
  DayAvailabilityParams,
  DayAvailabilityResponse,
  TimeSlot,
  LockRequest,
  LockResponse,
  ConfirmRequest,
  ConfirmResponse,
  VerifyRequest,
  VerifyResponse,
  ApiError,
} from './types'
