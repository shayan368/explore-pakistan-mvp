import { BookingState } from "../components/hotel-booking/types"

export function calculateCancellationRefund(
  booking: BookingState,
  totalPrice: number,
  nights: number,
  isNoShow: boolean = false,
  currentTime: number = Date.now()
) {
  const policy = booking.cancellationPolicy || {
    fullRefundUntilHoursBeforeCheckIn: 24,
    cancellationFeeWithin24HoursPercentage: 50,
    noShowFirstNightCharge: true
  }

  if (booking.paymentMethod === "cash") {
    return {
      eligible: false,
      refundPercentage: 0,
      cancellationFee: 0,
      refundAmount: 0,
      reason: "No payment was collected",
      policyType: "no_payment" as const,
    }
  }

  // Assume check-in is at 15:00 (3:00 PM) on the checkIn date.
  const checkInStr = `${booking.checkIn}T15:00:00`
  const checkInTime = new Date(checkInStr).getTime()
  const hoursRemaining = (checkInTime - currentTime) / (1000 * 60 * 60)

  if (isNoShow) {
    const nightlyRate = totalPrice / nights;
    const firstNightCharge = policy.noShowFirstNightCharge ? nightlyRate : 0;
    
    const remainingTotal = totalPrice - firstNightCharge;
    const feePercentage = policy.cancellationFeeWithin24HoursPercentage;
    const extraFee = remainingTotal * (feePercentage / 100);
    const refundAmount = remainingTotal - extraFee;
    const totalFee = firstNightCharge + extraFee;

    return {
      eligible: false,
      firstNightCharge,
      refundPercentage: 100 - feePercentage,
      cancellationFee: totalFee,
      refundAmount,
      reason: "No-show - first night charged",
      policyType: "no_show" as const
    }
  }

  if (hoursRemaining > policy.fullRefundUntilHoursBeforeCheckIn) {
    return {
      eligible: true,
      refundPercentage: 100,
      cancellationFee: 0,
      refundAmount: totalPrice,
      reason: "Full refund before cancellation deadline",
      policyType: "free_cancellation" as const
    }
  } else {
    const feePercentage = policy.cancellationFeeWithin24HoursPercentage;
    const fee = totalPrice * (feePercentage / 100);
    return {
      eligible: true,
      refundPercentage: 100 - feePercentage,
      cancellationFee: fee,
      refundAmount: totalPrice - fee,
      reason: `Cancellation within 24 hours of check-in`,
      policyType: "within_24_hours" as const
    }
  }
}
