export type BookingStatus = 'confirmed' | 'cancelled' | 'completed'

export type BookingCustomer = {
  name: string
  email: string
  phone: string
}

export type Booking = {
  token: string
  businessId: string
  serviceId: string
  customer: BookingCustomer
  startAtIso: string
  status: BookingStatus
  createdAtIso: string
}
