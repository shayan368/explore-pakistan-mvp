import { useState, useEffect } from "react"
import type { Room, BookingState, RefundRecord } from "./types"
import { IconCheck } from "./icons"
import { useAuth } from "../../context/AuthContext"
import { calculateCancellationRefund } from "../../utils/cancellation"

type Props = {
  booking: BookingState
  setBooking: (b: BookingState) => void
  rooms: Room[]
  nights: number
  onBackToHotel: () => void
  hotelData: any
  startCancel?: boolean
}

export default function MyBooking({ booking, setBooking, rooms, nights, onBackToHotel, hotelData, startCancel }: Props) {
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelStep, setCancelStep] = useState<'idle' | 'calculating' | 'processing' | 'cancelling' | 'done'>('idle')
  const { updateBookingData } = useAuth()
  
  useEffect(() => {
    if (startCancel && booking.status !== 'cancelled' && booking.status !== 'no_show') {
      setShowCancelModal(true)
    }
  }, [startCancel, booking.status])
  
  // Simulator controls removed
  
  const selectedDetails = booking.selectedRooms.map((sr) => {
    const room = rooms.find(r => r.id === sr.roomId)!
    return { room, quantity: sr.quantity }
  })

  let totalPrice = 0
  selectedDetails.forEach(({ room, quantity }) => {
    totalPrice += room.price * quantity * nights
  })
  const finalTotal = totalPrice * 1.1

  const refundCalc = calculateCancellationRefund(booking, finalTotal, nights, false)

  const processCancellation = (isNoShow: boolean = false) => {
    if (booking.status === 'cancelled' || booking.status === 'no_show' || booking.refund?.status === 'processed') return;
    
    setCancelStep('calculating')
    const finalCalc = calculateCancellationRefund(booking, finalTotal, nights, isNoShow)
    
    setTimeout(() => {
      setCancelStep('processing')
      setTimeout(() => {
        setCancelStep('cancelling')
        setTimeout(() => {
          const newStatus = isNoShow ? 'no_show' : 'cancelled'
          const newRefund: RefundRecord = {
            id: `EP-REF-${Date.now()}`,
            bookingId: booking.bookingId,
            originalAmount: finalTotal,
            cancellationFee: finalCalc.cancellationFee,
            refundAmount: finalCalc.refundAmount,
            currency: "PKR",
            reason: isNoShow ? "No-show - first night charged" : "Customer cancellation",
            policyType: finalCalc.policyType,
            status: "processed",
            createdAt: new Date().toISOString(),
            processedAt: new Date().toISOString()
          }

          const updatedBooking: BookingState = { ...booking, status: newStatus, refund: newRefund }
          setBooking(updatedBooking)
          
          if (booking.bookingId) {
            updateBookingData(booking.bookingId, { status: newStatus, refund: newRefund })
          }
          
          setCancelStep('done')
          setShowCancelModal(false)
        }, 800)
      }, 800)
    }, 800)
  }

  const handleCancelBooking = () => {
    processCancellation(false)
  }

  const effectiveStatus = booking.status

  if (effectiveStatus === 'hotel_cancelled') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">Booking Cancelled by Hotel</h2>
          <p className="text-gray-600 mb-2 text-lg">We're sorry, but the hotel has cancelled this reservation.</p>
          <p className="text-emerald-700 font-bold mb-8">Full refund expected</p>
          <div className="w-full space-y-4">
            <button className="w-full py-4 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
              Find Another Hotel
            </button>
            <button className="w-full py-4 rounded-full font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors">
              View Refund Status
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (effectiveStatus === 'pending') {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <h2 className="font-display font-bold text-3xl text-gray-900 mb-4">Payment Received — Booking Confirmation Pending</h2>
          <p className="text-gray-600 mb-8 text-lg">Your payment has been received, but your room confirmation is still being processed.</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 text-left w-full mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-gray-500 uppercase">Status</span>
              <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">Pending Confirmation</span>
            </div>
            <div className="space-y-2 text-sm text-gray-700 font-medium">
              <p>Reference: {booking.bookingId}</p>
              <p>Amount: PKR {finalTotal.toLocaleString()}</p>
              <p>Hotel: {hotelData.name}</p>
            </div>
          </div>

          <button className="w-full py-4 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg">
            View Booking Status
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBackToHotel} className="text-emerald-600 font-bold flex items-center gap-2 hover:text-emerald-700">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="bg-gray-50 border-b border-gray-200 p-8 flex justify-between items-center">
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Booking ID</p>
            <h1 className="font-display font-bold text-3xl text-gray-900">{booking.bookingId}</h1>
          </div>
          <div>
            {effectiveStatus === 'cancelled' ? (
              <div className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-xl text-lg flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Cancelled
              </div>
            ) : (
              <div className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-xl text-lg flex items-center gap-2">
                <IconCheck /> Confirmed
              </div>
            )}
          </div>
        </div>

        {(effectiveStatus === 'cancelled' || effectiveStatus === 'no_show') && booking.refund && (
          <div className={`p-8 border-b border-gray-100 ${effectiveStatus === 'no_show' ? 'bg-amber-50/50' : 'bg-red-50/50'}`}>
            <h3 className="font-bold text-gray-900 text-xl mb-4">
              {effectiveStatus === 'no_show' ? 'No-Show' : 'Cancellation'}
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status</span>
                <span className="font-medium text-gray-900">
                  {effectiveStatus === 'no_show' ? 'Customer did not arrive' : 'Customer cancellation'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Policy applied</span>
                <span className="font-medium text-gray-900">
                  {booking.refund.policyType === 'free_cancellation' ? 'Free cancellation' : 
                   booking.refund.policyType === 'within_24_hours' ? '50% cancellation fee' : 
                   booking.refund.policyType === 'no_show' ? 'First night charged' : 'No payment'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Refund ID</span>
                <span className="font-medium text-gray-900">{booking.refund.id}</span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 text-xl mb-4">Refund</h3>
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Original amount</span>
                  <span className="font-medium text-gray-900">PKR {booking.refund.originalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cancellation fee</span>
                  <span className="font-medium text-red-600">PKR {booking.refund.cancellationFee.toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Refund Amount</p>
                  <p className="font-bold text-2xl text-emerald-600">PKR {booking.refund.refundAmount.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Status</p>
                  <p className="font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg inline-block capitalize">{booking.refund.status}</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 font-medium">
              {effectiveStatus === 'no_show' 
                ? "Because this booking was marked as a no-show, the first night has been charged according to the cancellation policy." 
                : "Your cancellation request was processed."}
            </p>
          </div>
        )}

        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h3 className="font-bold text-gray-900 text-xl mb-4">Hotel</h3>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg text-gray-900">{hotelData.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{hotelData.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 text-emerald-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></button>
                  <button className="bg-white border border-gray-200 rounded-lg p-2 hover:bg-gray-50 text-emerald-600"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">Stay</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Check-in</span>
                    <span className="font-bold text-gray-900">{booking.checkIn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Check-out</span>
                    <span className="font-bold text-gray-900">{booking.checkOut}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-500 font-medium">Duration</span>
                    <span className="font-bold text-gray-900">{nights} night{nights > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">Guests & Rooms</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Guests</span>
                    <span className="font-bold text-gray-900">{booking.adults} Adult{booking.adults > 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} Child` : ""}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 space-y-1">
                    {selectedDetails.map((d, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">{d.room.name}</span>
                        <span className="font-bold text-gray-900">× {d.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Guest Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Name</p>
                  <p className="font-bold text-gray-900">{booking.guestName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Email</p>
                  <p className="font-bold text-gray-900">{booking.guestEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Phone</p>
                  <p className="font-bold text-gray-900">{booking.guestPhone}</p>
                </div>
                {booking.specialRequests && (
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase">Special Requests</p>
                    <p className="font-bold text-gray-900">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4">Payment</h3>
              <div className="space-y-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-500">Total</span>
                  <span className="font-bold text-gray-900">PKR {finalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  {booking.paymentMethod === 'cash' ? (
                    <span className="font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs">Pay at Property</span>
                  ) : (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded text-xs">Paid</span>
                  )}
                </div>
              </div>
              <button className="w-full mt-4 py-2 bg-white border border-gray-200 rounded-lg text-emerald-600 font-bold text-sm hover:bg-gray-50">Download Receipt</button>
            </section>

            {effectiveStatus !== 'cancelled' && effectiveStatus !== 'no_show' && (
              <section className="space-y-3">
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-4 rounded-xl font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  Cancel Booking
                </button>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative overflow-hidden">
            {cancelStep === 'idle' ? (
              <>
                <h2 className="font-bold text-2xl text-gray-900 mb-4">Cancel Booking?</h2>
                
                {refundCalc.policyType === 'free_cancellation' ? (
                  <>
                    <h3 className="font-bold text-emerald-700 text-lg mb-2">You're eligible for a full refund</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      You'll receive a full refund of PKR {finalTotal.toLocaleString()}. Your booking is eligible for a full refund with no cancellation fee.
                    </p>
                  </>
                ) : refundCalc.policyType === 'no_payment' ? (
                  <>
                    <h3 className="font-bold text-gray-700 text-lg mb-2">No payment collected</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      This was a Pay at Property booking. You will not be charged a fee.
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-bold text-amber-700 text-lg mb-2">A cancellation fee applies</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Because your cancellation is within 24 hours of check-in, a {refundCalc.refundPercentage === 50 ? '50%' : 'cancellation'} fee applies.
                    </p>
                  </>
                )}
                
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 mb-8 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">Original Total</span>
                    <span className="font-bold text-gray-900">PKR {finalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-gray-700">Cancellation Fee</span>
                    <span className="font-bold text-red-600">PKR {refundCalc.cancellationFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="font-bold text-gray-700">Estimated refund:</span>
                    <span className="font-bold text-xl text-emerald-600">PKR {refundCalc.refundAmount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowCancelModal(false)}
                    className="py-3 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button 
                    onClick={handleCancelBooking}
                    className="py-3 rounded-full font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                  >
                    Continue Cancellation
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 border-4 border-gray-100 border-t-emerald-500 rounded-full animate-spin mx-auto mb-6"></div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">
                  {cancelStep === 'calculating' ? 'Calculating refund...' : 
                   cancelStep === 'processing' ? 'Processing refund...' : 
                   'Cancelling booking...'}
                </h3>
                <p className="text-gray-500 text-sm">Please do not close this window</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
