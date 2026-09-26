import { useEffect, useState } from "react"
import type { Room, BookingState } from "./types"
import GuestSelector from "./GuestSelector"
import { IconCheck } from "./icons"

type Props = {
  booking: BookingState
  setBooking: (b: BookingState) => void
  rooms: Room[]
  onBookNow: () => void
  validationError: string | null
  setValidationError: (err: string | null) => void
}

export default function BookingSummary({ 
  booking, 
  setBooking, 
  rooms, 
  onBookNow,
  validationError,
  setValidationError
}: Props) {
  const [nights, setNights] = useState(0)
  
  useEffect(() => {
    if (booking.checkIn && booking.checkOut) {
      const start = new Date(booking.checkIn)
      const end = new Date(booking.checkOut)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays > 0 ? diffDays : 0)
    } else {
      setNights(0)
    }
  }, [booking.checkIn, booking.checkOut])

  const today = new Date().toISOString().split("T")[0]

  const totalGuests = booking.adults + booking.children

  let totalCapacity = 0
  let totalPrice = 0
  const selectedDetails = booking.selectedRooms.map((sr) => {
    const room = rooms.find(r => r.id === sr.roomId)!
    totalCapacity += room.capacity * sr.quantity
    totalPrice += room.price * sr.quantity * nights
    return { room, quantity: sr.quantity, price: room.price }
  })

  const hasRooms = booking.selectedRooms.length > 0

  const handleBookNowClick = () => {
    if (!booking.checkIn) {
      setValidationError("Please select your check-in date.")
      return
    }
    if (!booking.checkOut) {
      setValidationError("Please select your check-out date.")
      return
    }
    if (nights <= 0) {
      setValidationError("Check-out must be after check-in.")
      return
    }
    if (!hasRooms) {
      setValidationError("Please select at least one room.")
      return
    }
    if (totalGuests > totalCapacity) {
      setValidationError(`${totalGuests} guests require additional room capacity.`)
      return
    }
    if (booking.adults < 1) {
      setValidationError("At least one adult is required.")
      return
    }
    
    setValidationError(null)
    onBookNow()
  }

  return (
    <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
      <div className="mb-6">
        <h3 className="font-bold text-gray-900 text-xl mb-1">Your Stay</h3>
        <p className="text-gray-500 font-medium">Swat Serena Lodge</p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-4 bg-gray-50 border border-gray-200">
            <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wide">
              Check-in
            </label>
            <input 
              type="date" 
              min={today}
              value={booking.checkIn} 
              onChange={(e) => setBooking({ ...booking, checkIn: e.target.value })} 
              className="w-full text-sm outline-none bg-transparent font-semibold text-gray-900 cursor-pointer" 
            />
          </div>
          <div className="rounded-2xl p-4 bg-gray-50 border border-gray-200">
            <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wide">
              Check-out
            </label>
            <input 
              type="date"
              min={booking.checkIn || today}
              value={booking.checkOut} 
              onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })} 
              className="w-full text-sm outline-none bg-transparent font-semibold text-gray-900 cursor-pointer" 
            />
          </div>
        </div>
        
        {nights > 0 && (
          <div className="text-right text-xs font-bold text-emerald-600 px-2">
            {nights} night{nights > 1 ? "s" : ""}
          </div>
        )}
        
        <div className="rounded-2xl p-4 bg-gray-50 border border-gray-200">
          <GuestSelector 
            adults={booking.adults} 
            children={booking.children}
            onChange={(adults, children) => setBooking({ ...booking, adults, children })}
          />
        </div>
      </div>

      {hasRooms && (
        <div className="rounded-2xl p-4 mb-6 bg-emerald-50 border border-emerald-100 space-y-3">
          <p className="text-sm font-bold text-emerald-800">
            Accommodation
          </p>
          <div className="space-y-2 pb-3 border-b border-emerald-200/50">
            {selectedDetails.map((detail, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm">
                <div>
                  <span className="font-bold text-gray-900">{detail.quantity} × {detail.room.name}</span>
                  {nights > 0 && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      PKR {detail.price.toLocaleString()} × {detail.quantity} room{detail.quantity > 1 ? "s" : ""} × {nights} night{nights > 1 ? "s" : ""}
                    </div>
                  )}
                </div>
                {nights > 0 && (
                  <span className="font-bold text-gray-700">PKR {(detail.price * detail.quantity * nights).toLocaleString()}</span>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-600">Capacity</span>
            <span className={`${totalCapacity >= totalGuests ? 'text-emerald-700' : 'text-red-600'}`}>{totalCapacity} guests</span>
          </div>
          
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-gray-600">Guests</span>
            <span className="text-gray-900">{totalGuests} guests</span>
          </div>

          <div className="mt-2 text-xs font-bold">
            {totalCapacity >= totalGuests ? (
              <span className="text-emerald-600 flex items-center gap-1">✓ Room capacity matched</span>
            ) : (
              <span className="text-red-600 flex items-center gap-1">⚠ Capacity exceeded</span>
            )}
          </div>

          {nights > 0 && (
            <div className="pt-3 border-t border-emerald-200/50 space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Room charges</span>
                <span>PKR {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Taxes & fees (10%)</span>
                <span>PKR {(totalPrice * 0.1).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-emerald-900 text-lg pt-2 border-t border-emerald-200/50">
                <span>Total</span>
                <span>PKR {(totalPrice * 1.1).toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {validationError && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
          {validationError}
        </div>
      )}

      <button
        onClick={handleBookNowClick}
        className="w-full py-4 rounded-full font-bold text-white text-lg transition-all hover:scale-[1.02] shadow-lg bg-emerald-600 hover:bg-emerald-700"
      >
        Book Now
      </button>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <IconCheck /> Free cancellation before check-in
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <IconCheck /> No payment needed today
        </div>
        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <IconCheck /> Verified by Explore Pakistan
        </div>
      </div>
    </div>
  )
}
