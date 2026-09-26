export type Room = {
  id: string
  name: string
  beds: string
  capacity: number
  maxAdults: number
  maxChildren: number
  size: string
  price: number
  facilities: string[]
  available: number
  img: string
}

export type SelectedRoom = {
  roomId: string
  quantity: number
}

export type CancellationPolicy = {
  freeCancellationUntil?: string
  fullRefundUntilHoursBeforeCheckIn: number
  cancellationFeeWithin24HoursPercentage: number
  noShowFirstNightCharge: boolean
}

export type RefundRecord = {
  id?: string
  bookingId?: string
  paymentId?: string
  originalAmount: number
  cancellationFee: number
  refundAmount: number
  currency: string
  reason: string
  policyType: "free_cancellation" | "within_24_hours" | "no_show" | "no_payment"
  status: "processed" | "pending"
  createdAt: string
  processedAt?: string
}

export type BookingState = {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  selectedRooms: SelectedRoom[]
  guestName: string
  guestEmail: string
  guestPhone: string
  specialRequests: string
  agreedToTerms: boolean
  bookingId?: string
  status: 'draft' | 'confirmed' | 'cancelled' | 'hotel_cancelled' | 'pending' | 'no_show'
  paymentMethod?: "card" | "wallet" | "cash"
  cancellationPolicy?: CancellationPolicy
  refund?: RefundRecord
}
