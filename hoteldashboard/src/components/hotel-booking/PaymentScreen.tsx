import { useState } from "react"
import type { Room, BookingState } from "./types"

type Props = {
  booking: BookingState
  setBooking: (b: BookingState) => void
  rooms: Room[]
  nights: number
  onSuccess: (updatedBooking?: BookingState) => void
  onBack: () => void
  hotelData: any
}

export default function PaymentScreen({ booking, setBooking, rooms, nights, onSuccess, onBack, hotelData }: Props) {
  const [method, setMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  
  // Mock form states
  const [cardName, setCardName] = useState(booking.guestName)
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [walletPhone, setWalletPhone] = useState(booking.guestPhone)
  
  // Failure toggle (removed)
  const [paymentFailed, setPaymentFailed] = useState(false)

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
  
  const finalTotal = totalPrice * 1.1 // including 10% taxes

  const handlePay = () => {
    // Validation
    if (method === "card") {
      if (!cardName.trim()) return setValidationError("Please enter the cardholder name.")
      if (cardNumber.replace(/\s/g, '').length < 15) return setValidationError("Please enter a valid card number.")
      if (!cardExpiry) return setValidationError("Please enter card expiry date.")
      if (!cardCvv) return setValidationError("Please enter CVV.")
    } else if (method === "wallet") {
      if (!walletPhone.trim()) return setValidationError("Please enter your Mobile Wallet number.")
    }
    
    setValidationError(null)
    setIsLoading(true)
    setPaymentFailed(false)
    
    setTimeout(() => {
      setIsLoading(false)
      const refId = "PAY-EP-" + Math.floor(100000 + Math.random() * 900000)
      const updated = { ...booking, paymentMethod: method as any, bookingId: refId }
      setBooking(updated)
      onSuccess(updated)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
          <h2 className="font-bold text-2xl text-gray-900">Processing payment...</h2>
          <p className="text-gray-500 mt-2">Please do not close this window</p>
        </div>
      </div>
    )
  }

  if (paymentFailed) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 flex flex-col items-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h2 className="font-bold text-2xl text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-8">We couldn't complete your payment. Please check your payment details and try again.</p>
          <div className="w-full space-y-3">
            <button 
              onClick={() => setPaymentFailed(false)}
              className="w-full py-4 rounded-full font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => {
                setPaymentFailed(false)
                setMethod("cash") // change method logic
              }}
              className="w-full py-4 rounded-full font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              Change Payment Method
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <button onClick={onBack} className="text-emerald-600 font-bold flex items-center gap-2 mb-8 hover:text-emerald-700">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Review
      </button>

      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
        <div className="bg-emerald-50 border-b border-emerald-100 p-6 flex justify-between items-center">
          <h2 className="font-bold text-2xl text-emerald-900">Payment</h2>
        </div>

        <div className="p-8 space-y-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-2">Booking Summary</h3>
            <p className="text-sm text-gray-600">{hotelData.name}</p>
            <p className="text-sm text-gray-600">{totalRooms} room{totalRooms > 1 ? "s" : ""} • {nights} night{nights > 1 ? "s" : ""} • {booking.adults + booking.children} Guest{booking.adults + booking.children > 1 ? "s" : ""}</p>
            <div className="flex justify-between items-center font-bold text-xl text-emerald-800 pt-4 mt-4 border-t border-gray-200">
              <span>Booking total</span>
              <span>PKR {finalTotal.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              {[
                { id: "card", label: "Credit or Debit Card", icon: "💳" },
                { id: "wallet", label: "Mobile Wallet (JazzCash / EasyPaisa)", icon: "📱" },
                { id: "cash", label: "Pay at Hotel", icon: "💵" },
              ].map((m) => (
                <div key={m.id} className={`rounded-xl border-2 transition-colors ${method === m.id ? "border-emerald-500 bg-emerald-50/20" : "border-gray-100 hover:border-emerald-200"}`}>
                  <label className="flex items-center gap-4 p-4 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value={m.id} 
                      checked={method === m.id} 
                      onChange={() => {
                        setMethod(m.id)
                        setValidationError(null)
                      }}
                      className="w-5 h-5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-2xl">{m.icon}</span>
                    <span className="font-bold text-gray-900">{m.label}</span>
                  </label>
                  
                  {method === m.id && m.id === "card" && (
                    <div className="p-4 pt-0 border-t border-emerald-100 space-y-4 mt-2">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Cardholder Name (Demo fields only)</label>
                        <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" placeholder="Ali Khan" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                        <input type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                          <input type="text" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" placeholder="MM/YY" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">CVV</label>
                          <input type="text" value={cardCvv} onChange={e => setCardCvv(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {method === m.id && m.id === "wallet" && (
                    <div className="p-4 pt-0 border-t border-emerald-100 mt-2">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Wallet Number</label>
                      <input type="tel" value={walletPhone} onChange={e => setWalletPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:border-emerald-500" placeholder="0300 1234567" />
                    </div>
                  )}

                  {method === m.id && m.id === "cash" && (
                    <div className="p-4 pt-0 border-t border-emerald-100 mt-2">
                      <p className="text-sm font-bold text-gray-700">No payment required today.</p>
                      <p className="text-sm text-gray-600 mt-1">Your booking will be confirmed according to the hotel's policy, and you will pay at the property.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {validationError && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {validationError}
            </div>
          )}

          <button 
            onClick={handlePay}
            disabled={isLoading}
            className="w-full py-4 rounded-full font-bold text-white text-xl bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-lg disabled:opacity-50"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  )
}
