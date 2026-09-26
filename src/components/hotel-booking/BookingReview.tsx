import { useState } from "react"
import type { Room, BookingState } from "./types"
import { IconMapPin, IconUsers, IconInfo, IconCheck } from "./icons"

type Props = {
  booking: BookingState
  setBooking: (b: BookingState) => void
  rooms: Room[]
  nights: number
  onBack: () => void
  onContinue: () => void
  hotelData: any
}

export default function BookingReview({ booking, setBooking, rooms, nights, onBack, onContinue, hotelData }: Props) {
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showPolicy, setShowPolicy] = useState(false)

  const selectedDetails = booking.selectedRooms.map((sr) => {
    const room = rooms.find(r => r.id === sr.roomId)!
    return { room, quantity: sr.quantity }
  })

  let totalPrice = 0
  let totalRooms = 0
  selectedDetails.forEach(({ room, quantity }) => {
    totalPrice += room.price * quantity * nights
    totalRooms += quantity
  })
  
  const taxes = totalPrice * 0.10
  const finalTotal = totalPrice + taxes

  const handleContinue = () => {
    if (!booking.guestName.trim() || !booking.guestEmail.trim() || !booking.guestPhone.trim()) {
      return setValidationError("Please fill in all required guest information.")
    }
    if (!booking.agreedToTerms) {
      return setValidationError("You must agree to the booking terms and conditions.")
    }
    setValidationError(null)
    onContinue()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <h1 className="font-display font-bold text-3xl text-gray-900">Review your booking</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {validationError && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-start gap-3">
              <IconInfo />
              <p className="font-bold text-sm mt-0.5">{validationError}</p>
            </div>
          )}

          {/* Guest Info */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-bold text-2xl text-gray-900 mb-6">Guest Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                <input 
                  type="text" 
                  value={booking.guestName}
                  onChange={e => setBooking({ ...booking, guestName: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  placeholder="e.g. Ali Khan"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  value={booking.guestEmail}
                  onChange={e => setBooking({ ...booking, guestEmail: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  placeholder="e.g. ali@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  value={booking.guestPhone}
                  onChange={e => setBooking({ ...booking, guestPhone: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  placeholder="e.g. +92 300 1234567"
                />
              </div>
            </div>
          </section>

          {/* Special Requests */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="font-bold text-2xl text-gray-900 mb-2">Special Requests</h2>
            <p className="text-gray-500 text-sm mb-6">Special requests are subject to hotel availability and cannot be guaranteed.</p>
            <textarea 
              value={booking.specialRequests}
              onChange={e => setBooking({ ...booking, specialRequests: e.target.value })}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow h-24 resize-none"
              placeholder="e.g. Early check-in, quiet room, high floor..."
            ></textarea>
          </section>

          {/* Policies */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-2xl text-gray-900">Cancellation Policy</h2>
              <button 
                onClick={() => setShowPolicy(!showPolicy)}
                className="text-emerald-600 font-bold text-sm hover:text-emerald-700"
              >
                {showPolicy ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {(() => {
              const policy = booking.cancellationPolicy!
              let freeDateStr = booking.checkIn || 'check-in'
              if (booking.checkIn) {
                const checkInDate = new Date(`${booking.checkIn}T15:00:00`)
                checkInDate.setHours(checkInDate.getHours() - policy.fullRefundUntilHoursBeforeCheckIn)
                freeDateStr = checkInDate.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })
              }
              return (
                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl font-bold flex items-center gap-3 mb-4">
                  <IconCheck /> Free cancellation before {freeDateStr}
                </div>
              )
            })()}
            
            {showPolicy && (
              <div className="space-y-3 text-sm text-gray-600 bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4">
                {(() => {
                  const policy = booking.cancellationPolicy!
                  return (
                    <>
                      <p><strong>Up to {policy.fullRefundUntilHoursBeforeCheckIn} hours before check-in:</strong> Full refund, zero fees.</p>
                      <p><strong>Within {policy.fullRefundUntilHoursBeforeCheckIn} hours:</strong> {policy.cancellationFeeWithin24HoursPercentage}% cancellation fee applies.</p>
                      <p><strong>No-show:</strong> {policy.noShowFirstNightCharge ? 'Full charge for the first night.' : 'Standard penalty applies.'}</p>
                    </>
                  )
                })()}
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-gray-200">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center mt-0.5">
                  <input 
                    type="checkbox" 
                    checked={booking.agreedToTerms}
                    onChange={e => setBooking({ ...booking, agreedToTerms: e.target.checked })}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:outline-none checked:bg-emerald-600 checked:border-emerald-600 transition-all cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  I agree to the <a href="#" className="text-emerald-600 underline">Terms and Conditions</a>, <a href="#" className="text-emerald-600 underline">Privacy Policy</a>, and the stated cancellation rules.
                </span>
              </label>
            </div>
          </section>

        </div>

        {/* Right Column: Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
            
            {/* Hotel Mini Card */}
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-bold text-xl text-gray-900">{hotelData.name}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1"><IconMapPin /> {hotelData.location}</p>
            </div>

            <div className="p-6 border-b border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Check-in</p>
                  <p className="font-bold text-gray-900">{booking.checkIn || 'Not set'}</p>
                </div>
                <div className="w-8 h-[1px] bg-gray-300"></div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-500 uppercase">Check-out</p>
                  <p className="font-bold text-gray-900">{booking.checkOut || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-500 uppercase">Stay Duration</p>
                <p className="font-bold text-gray-900">{nights} Night{nights > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase mb-4">Price Breakdown</p>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                {selectedDetails.map((d, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-700">{d.quantity}x {d.room.name}</span>
                    <span className="font-medium text-gray-900">PKR {(d.room.price * d.quantity * nights).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-700">Taxes & Fees (10%)</span>
                <span className="font-medium text-gray-900">PKR {taxes.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-300">
                <span className="font-bold text-lg text-gray-900">Total Price</span>
                <span className="font-bold text-2xl text-emerald-700">PKR {finalTotal.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="p-6 bg-white border-t border-gray-100">
              <button 
                onClick={handleContinue}
                className="w-full py-4 rounded-full font-bold text-white shadow-xl hover:scale-105 transition-all duration-300 text-lg flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700"
              >
                Proceed to Payment
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
