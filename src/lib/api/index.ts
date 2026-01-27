import { USE_REAL_API } from '@/lib/config/features'

import * as realClient from './client'
import { initSession as realInitSession } from './axios'
import * as mockClient from './mock-client'

const client = USE_REAL_API ? realClient : mockClient

export const getMonthAvailability = client.getMonthAvailability
export const getDayAvailability = client.getDayAvailability
export const lockAppointment = client.lockAppointment
export const confirmAppointment = client.confirmAppointment
export const verifyAppointment = client.verifyAppointment
export const BookingApiError = client.BookingApiError

export const initSession = USE_REAL_API
  ? realInitSession
  : async () => 'mock-token'

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
