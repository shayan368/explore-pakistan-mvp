import type { Room, BookingState } from "./types"
import { IconCheck } from "./icons"

type Props = {
  booking: BookingState
  rooms: Room[]
  nights: number
  onViewBooking: () => void
  onBackToHotel: () => void
  hotelData: any
}

export default function BookingConfirmation({ booking, rooms, nights, onViewBooking, onBackToHotel, hotelData }: Props) {
  const selectedDetails = booking.selectedRooms.map((sr) => {
    const room = rooms.find(r => r.id === sr.roomId)!
    return { room, quantity: sr.quantity }
  })

  let totalPrice = 0
  selectedDetails.forEach(({ room, quantity }) => {
    totalPrice += room.price * quantity * nights
  })
  
  const finalTotal = totalPrice * 1.1

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 text-center">
        <div className="bg-emerald-600 p-12 text-white">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 className="font-display font-bold text-4xl mb-4">Booking Confirmed!</h1>
          <p className="text-emerald-100 text-xl font-medium">Your stay at {hotelData.name} is confirmed.</p>
        </div>

        <div className="p-10 text-left space-y-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 flex justify-between items-center">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Booking ID</p>
              <p className="font-bold text-2xl text-gray-900">{booking.bookingId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Total Paid</p>
              <p className="font-bold text-2xl text-emerald-800">PKR {finalTotal.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-100 pb-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Hotel</p>
                <p className="font-bold text-lg text-gray-900">{hotelData.name}</p>
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Room(s)</p>
                <div className="font-bold text-gray-900 space-y-1">
                  {selectedDetails.map((d, i) => <p key={i}>{d.quantity} × {d.room.name}</p>)}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Guests</p>
                <p className="font-bold text-gray-900">{booking.adults} Adult{booking.adults > 1 ? "s" : ""}{booking.children > 0 ? `, ${booking.children} Child${booking.children > 1 ? "ren" : ""}` : ""}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Dates</p>
                <p className="font-bold text-gray-900">{booking.checkIn} → {booking.checkOut}</p>
                <p className="text-sm text-gray-600 font-medium mt-1">{nights} night{nights > 1 ? "s" : ""}</p>
              </div>
              
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Payment</p>
                <p className="font-bold text-emerald-700 bg-emerald-50 inline-block px-3 py-1 rounded-lg">
                  {booking.paymentMethod === 'cash' ? 'Pay at Hotel' : 'Paid'}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3 font-bold text-gray-700">
              <span className="text-emerald-600"><IconCheck /></span> Free cancellation before check-in
            </div>
            <div className="flex items-center gap-3 font-bold text-gray-700">
              <span className="text-emerald-600"><IconCheck /></span> Verified by Explore Pakistan
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onClick={onViewBooking}
              className="w-full py-4 rounded-full font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors shadow-sm"
            >
              View My Booking
            </button>
            <button 
              onClick={() => alert("Simulating frontend PDF generation for confirmation...")}
              className="w-full py-4 rounded-full font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm"
            >
              Download Confirmation
            </button>
            <button 
              onClick={onBackToHotel}
              className="w-full py-4 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg"
            >
              Back to Hotel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
