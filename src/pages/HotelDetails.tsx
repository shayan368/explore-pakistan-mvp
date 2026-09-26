import { useState, useRef, useEffect } from "react"
import type { NavigateFn } from "../types"
import type { Room, Review, BookingState } from "../components/hotel-booking/types"
import RoomCard from "../components/hotel-booking/RoomCard"
import BookingSummary from "../components/hotel-booking/BookingSummary"
import BookingReview from "../components/hotel-booking/BookingReview"
import PaymentScreen from "../components/hotel-booking/PaymentScreen"
import BookingConfirmation from "../components/hotel-booking/BookingConfirmation"
import MyBooking from "../components/hotel-booking/MyBooking"
import RegistrationModal from "../components/auth/RegistrationModal"
import { useAuth } from "../context/AuthContext"
import {
  IconWifi,
  IconCar,
  IconUtensils,
  IconDroplet,
  IconThermometer,
  IconMountain,
  IconShield,
  IconSparkles,
} from "../components/hotel-booking/icons"

type Props = { navigate: NavigateFn; hotel?: any; viewBookingId?: string; startCancel?: boolean }

const IMGS = [
  "https://images.unsplash.com/photo-1706736231891-e61819a17d1d?w=1600&h=800&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1771583103394-b21ef7a0930e?w=800&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1754406208573-03487c67c514?w=800&h=600&fit=crop&auto=format",
]

const INITIAL_ROOMS: Room[] = [
  {
    id: "r1",
    name: "Standard Room",
    beds: "Twin beds",
    capacity: 2,
    maxAdults: 2,
    maxChildren: 1,
    size: "28 m²",
    price: 6200,
    facilities: ["Wi-Fi", "TV", "Hot Shower"],
    available: 5,
    img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&h=300&fit=crop&auto=format",
  },
  {
    id: "r2",
    name: "Deluxe Mountain View",
    beds: "1 King bed",
    capacity: 2,
    maxAdults: 2,
    maxChildren: 1,
    size: "38 m²",
    price: 12500,
    facilities: ["Wi-Fi", "TV", "Balcony", "Mini-Bar"],
    available: 2,
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop&auto=format",
  },
  {
    id: "r3",
    name: "Family Suite",
    beds: "1 King bed & 2 Twin beds",
    capacity: 4,
    maxAdults: 4,
    maxChildren: 2,
    size: "56 m²",
    price: 18000,
    facilities: ["Wi-Fi", "TV", "Kitchen", "Living Room"],
    available: 1,
    img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=500&h=300&fit=crop&auto=format",
  },
]

const reviews: Review[] = [
  {
    id: 1,
    name: "Ahmad Ali",
    date: "Dec 2026",
    rating: 5,
    text: "Absolutely stunning views from the room. The heating worked perfectly during the cold night, and the staff was very accommodating.",
  },
  {
    id: 2,
    name: "Sarah Khan",
    date: "Nov 2026",
    rating: 4,
    text: "Great location for exploring Swat. The breakfast could have more variety, but the rooms were exceptionally clean and comfortable.",
  },
  {
    id: 3,
    name: "Tariq Mahmood",
    date: "Oct 2026",
    rating: 5,
    text: "Booked the family suite and it was spacious enough for all of us. The hot water supply was consistent, which is a big plus in this region.",
  },
  {
    id: 4,
    name: "Fatima Noor",
    date: "Aug 2026",
    rating: 5,
    text: "The mountain view from our balcony was breathtaking. Waking up to the serene environment was exactly what we needed. Highly recommended!",
  },
  {
    id: 5,
    name: "Zain Ahmed",
    date: "Apr 2026",
    rating: 5,
    text: "Loved every second of our stay. The amenities are top-notch and the views are just incredible.",
  },
]

const amenities = [
  { icon: <IconWifi />, label: "Free Wi-Fi" },
  { icon: <IconCar />, label: "Free Parking" },
  { icon: <IconUtensils />, label: "Restaurant" },
  { icon: <IconDroplet />, label: "Hot Water" },
  { icon: <IconThermometer />, label: "Room Heater" },
  { icon: <IconMountain />, label: "Mountain View" },
  { icon: <IconShield />, label: "24h Security" },
  { icon: <IconSparkles />, label: "Daily Housekeeping" },
]

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rating ? "#f59e0b" : "#d1d5db"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function HotelDetails({ navigate, hotel, viewBookingId, startCancel }: Props) {
  const { user, addBooking, bookings } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const hotelData = hotel || {
    name: "Swat Serena Lodge",
    location: "Mingora, Swat Valley, KPK",
    rating: 4.8,
    reviews: 312,
    img: IMGS[0]
  }

  const [rooms, setRooms] = useState<Room[]>(() => {
    if (!hotel?.price) return INITIAL_ROOMS;
    
    // Create a copy of the rooms
    const dynamicRooms = JSON.parse(JSON.stringify(INITIAL_ROOMS));
    
    // Set standard room price to exactly match the advertised card price
    dynamicRooms[0].price = hotel.price;
    // Scale Deluxe & Suite prices based on base price roughly (x2 and x3)
    dynamicRooms[1].price = Math.round((hotel.price * 1.9) / 100) * 100;
    dynamicRooms[2].price = Math.round((hotel.price * 2.8) / 100) * 100;
    
    return dynamicRooms;
  })
  const [step, setStep] = useState<'details' | 'review' | 'payment' | 'confirmation' | 'my-booking'>('details')
  const [validationError, setValidationError] = useState<string | null>(null)
  
  const [booking, setBooking] = useState<BookingState>({
    checkIn: "",
    checkOut: "",
    adults: 2,
    children: 0,
    selectedRooms: [],
    guestName: user ? user.fullName : "",
    guestEmail: user ? user.email : "",
    guestPhone: user ? user.phone : "",
    specialRequests: "",
    agreedToTerms: false,
    status: 'draft',
    cancellationPolicy: {
      fullRefundUntilHoursBeforeCheckIn: 24,
      cancellationFeeWithin24HoursPercentage: 50,
      noShowFirstNightCharge: true
    }
  })

  useEffect(() => {
    if (viewBookingId) {
      const found = bookings.find(b => b.id === viewBookingId)
      if (found) {
        setBooking(found.bookingData)
        setStep('my-booking')
      }
    }
  }, [viewBookingId, bookings])

  const roomsRef = useRef<HTMLDivElement>(null)

  const scrollToRooms = () => {
    roomsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  const getSelectedNights = () => {
    if (!booking.checkIn || !booking.checkOut) return 0
    const start = new Date(booking.checkIn)
    const end = new Date(booking.checkOut)
    const diffDays = Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 0
  }

  const handleBookingSuccess = (updatedBooking?: BookingState) => {
    // update rooms availability
    const newRooms = rooms.map(r => {
      const selected = booking.selectedRooms.find(sr => sr.roomId === r.id)
      if (selected) return { ...r, available: r.available - selected.quantity }
      return r
    })
    setRooms(newRooms)
    
    // Add to global AuthContext
    const finalBooking = { ...(updatedBooking || booking), status: 'confirmed' as const }
    if (!finalBooking.bookingId) finalBooking.bookingId = "PAY-EP-" + Math.floor(100000 + Math.random() * 900000)
    
    setBooking(finalBooking)
    setStep('confirmation')

    // Calculate total price for global booking
    let totalPrice = 0
    finalBooking.selectedRooms.forEach(sr => {
      const room = INITIAL_ROOMS.find(r => r.id === sr.roomId)
      if (room) {
        totalPrice += room.price * sr.quantity * getSelectedNights()
      }
    })
    
    addBooking({
      id: finalBooking.bookingId,
      bookingData: finalBooking,
      hotelData: hotelData,
      nights: getSelectedNights(),
      totalPrice: totalPrice,
      date: `${finalBooking.checkIn} to ${finalBooking.checkOut}`
    })
  }

  if (step === 'review') {
    return <BookingReview booking={booking} setBooking={setBooking} rooms={rooms} nights={getSelectedNights()} onBack={() => setStep('details')} onContinue={() => setStep('payment')} hotelData={hotelData} />
  }

  if (step === 'payment') {
    return <PaymentScreen booking={booking} setBooking={setBooking} rooms={rooms} nights={getSelectedNights()} onBack={() => setStep('review')} onSuccess={handleBookingSuccess} hotelData={hotelData} />
  }

  if (step === 'confirmation') {
    return <BookingConfirmation booking={booking} rooms={rooms} nights={getSelectedNights()} onViewBooking={() => setStep('my-booking')} onBackToHotel={() => {
      setBooking({ checkIn: "", checkOut: "", adults: 2, children: 0, selectedRooms: [], guestName: "", guestEmail: "", guestPhone: "", specialRequests: "", agreedToTerms: false, status: 'draft', cancellationPolicy: { fullRefundUntilHoursBeforeCheckIn: 24, cancellationFeeWithin24HoursPercentage: 50, noShowFirstNightCharge: true } })
      setStep('details')
    }} hotelData={hotelData} />
  }

  if (step === 'my-booking') {
    return <MyBooking booking={booking} setBooking={setBooking} rooms={rooms} nights={getSelectedNights()} startCancel={startCancel} onBackToHotel={() => {
      if (viewBookingId) {
        navigate("my-trips")
      } else {
        setBooking({ checkIn: "", checkOut: "", adults: 2, children: 0, selectedRooms: [], guestName: "", guestEmail: "", guestPhone: "", specialRequests: "", agreedToTerms: false, status: 'draft', cancellationPolicy: { fullRefundUntilHoursBeforeCheckIn: 24, cancellationFeeWithin24HoursPercentage: 50, noShowFirstNightCharge: true } })
        setStep('details')
      }
    }} hotelData={hotelData} />
  }

  return (
    <div
      style={{ backgroundColor: "var(--color-canvas)" }}
      className="min-h-screen pb-12"
    >
      {/* Breadcrumb */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
        className="relative z-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div
            className="flex items-center gap-2 text-xs"
            style={{ color: "var(--color-muted-text)" }}
          >
            <button
              onClick={() => navigate("home")}
              className="hover:underline"
            >
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("search-hotels")}
              className="hover:underline"
            >
              Hotels
            </button>
            <span>/</span>
            <span style={{ color: "var(--color-ink)" }}>
              {hotelData.name}
            </span>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ── HERO IMAGE SECTION ── */}
      <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hotelData.img})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div className="relative z-10 text-center flex flex-col items-center mt-20">
          <button
            onClick={scrollToRooms}
            className="px-8 py-4 rounded-full font-bold text-lg text-white shadow-xl hover:scale-105 transition-transform duration-300"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Available Rooms
          </button>
        </div>
      </section>

      {/* ── MAIN CONTENT AREA ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-20 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Verified Hotel
                </span>
                <span className="text-xs px-3 py-1.5 rounded-full font-medium bg-gray-100 text-gray-700">
                  3-star
                </span>
              </div>
              <h1 className="font-display font-bold text-4xl mb-3 text-gray-900">
                {hotelData.name}
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={Math.floor(hotelData.rating)} size={18} />
                  <span className="font-bold text-lg text-gray-900">{hotelData.rating}</span>
                  <span className="text-gray-500 font-medium">
                    ({hotelData.reviews} reviews)
                  </span>
                </div>
                <span className="text-gray-300">|</span>
                <div className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {hotelData.location}
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-bold text-2xl mb-4 text-gray-900">
                About this Hotel
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">
                Nestled in the heart of Swat Valley with breathtaking views of
                the Swat River and surrounding mountains, Swat Serena Lodge
                offers a perfect blend of comfort and natural beauty. Our lodge
                is designed to make you feel at home while immersing you in the
                stunning landscape of Khyber Pakhtunkhwa.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                Each room is thoughtfully furnished with local craftsmanship and
                modern amenities. Our restaurant serves authentic Pashtun
                cuisine made from locally sourced ingredients, ensuring an
                unforgettable culinary experience during your stay.
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-bold text-2xl mb-6 text-gray-900">
                Amenities & Facilities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {amenities.map((a) => (
                  <div
                    key={a.label}
                    className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-colors group"
                  >
                    <div className="text-gray-400 group-hover:text-emerald-600 transition-colors">
                      {a.icon}
                    </div>
                    <span className="text-sm font-semibold text-gray-700 text-center">
                      {a.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Rooms */}
            <div ref={roomsRef} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-bold text-2xl mb-6 text-gray-900">Available Rooms</h2>
              <div className="space-y-6">
                {rooms.map((room) => {
                  const totalGuests = booking.adults + booking.children
                  const selectedRoom = booking.selectedRooms.find(sr => sr.roomId === room.id)
                  const quantity = selectedRoom ? selectedRoom.quantity : 0
                  
                  let guestValidationMessage = null
                  
                  return (
                    <RoomCard 
                      key={room.id}
                      room={room}
                      quantity={quantity}
                      onQuantityChange={(qty) => {
                        let newSelectedRooms = [...booking.selectedRooms]
                        if (qty === 0) {
                          newSelectedRooms = newSelectedRooms.filter(sr => sr.roomId !== room.id)
                        } else {
                          const existing = newSelectedRooms.find(sr => sr.roomId === room.id)
                          if (existing) {
                            existing.quantity = qty
                          } else {
                            newSelectedRooms.push({ roomId: room.id, quantity: qty })
                          }
                        }
                        
                        const newBooking = { ...booking, selectedRooms: newSelectedRooms }
                        setBooking(newBooking)
                        
                        let totalCapacity = 0
                        newSelectedRooms.forEach((sr) => {
                          const r = rooms.find(r => r.id === sr.roomId)!
                          totalCapacity += r.capacity * sr.quantity
                        })
                        if (newSelectedRooms.length > 0 && totalGuests <= totalCapacity) {
                          setValidationError(null)
                        } else if (newSelectedRooms.length > 0) {
                          setValidationError(`${totalGuests} guests require additional room capacity.`)
                        }
                      }}
                      guestValidationMessage={guestValidationMessage}
                    />
                  )
                })}
              </div>
            </div>

            {/* Reviews Slider */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-2xl text-gray-900">Guest Reviews</h2>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-3xl text-gray-900">4.8</span>
                  <div>
                    <StarRating rating={5} size={16} />
                    <p className="text-sm font-medium text-gray-500">312 reviews</p>
                  </div>
                </div>
              </div>
              
              <div className="relative w-full -mx-4 px-4 overflow-hidden mask-image-fade">
                <div className="animate-marquee flex gap-6 pb-4">
                  {[...reviews, ...reviews].map((r, idx) => (
                    <div key={idx} className="w-[320px] shrink-0 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white bg-emerald-600">
                            {r.name[0]}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{r.name}</p>
                            <p className="text-xs text-gray-500">{r.date}</p>
                          </div>
                        </div>
                        <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded">
                          {r.rating}.0
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-700 mb-3">{r.text}</p>
                      <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                        Verified Stay
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <style>{`
                .mask-image-fade {
                  mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                  -webkit-mask-image: linear-gradient(to right, transparent, black 5%, black 95%, transparent);
                }
              `}</style>
            </div>
          </div>

          {/* ── SIDEBAR BOOKING CARD ── */}
          <div className="lg:col-span-1">
            <BookingSummary 
              booking={booking} 
              setBooking={(newBooking) => {
                setBooking(newBooking)
                const totalGuests = newBooking.adults + newBooking.children
                let totalCapacity = 0
                newBooking.selectedRooms.forEach((sr) => {
                  const r = rooms.find(r => r.id === sr.roomId)!
                  totalCapacity += r.capacity * sr.quantity
                })
                
                if (newBooking.selectedRooms.length > 0 && totalGuests > totalCapacity) {
                  setValidationError(`${totalGuests} guests require additional room capacity.`)
                } else {
                  if (validationError?.includes("require additional")) setValidationError(null)
                }
              }} 
              rooms={rooms} 
              onBookNow={() => {
                if (!user) {
                  setShowAuthModal(true)
                } else {
                  setStep('review')
                }
              }}
              validationError={validationError}
              setValidationError={setValidationError}
            />
          </div>
        </div>
      </div>

      <RegistrationModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          setStep('review')
        }}
      />
    </div>
  )
}
