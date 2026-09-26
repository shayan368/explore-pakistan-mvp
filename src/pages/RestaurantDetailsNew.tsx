import React, { useState, useEffect } from "react"
import type { NavigateFn } from "../types"
import { useAuth } from "../context/AuthContext"
import RegistrationModal from "../components/auth/RegistrationModal"
import {
  ChevronRight,
  ChevronLeft,
  X,
  BadgeCheck,
  Clock,
  Clock3,
  MapPin,
  Phone,
  ParkingCircle,
  Trees,
  CreditCard,
  Users,
  Search,
  Star,
  CheckCircle2,
  CalendarDays,
  Minus,
  Plus,
} from "lucide-react"

type Props = { navigate: NavigateFn; viewBookingId?: string; startCancel?: boolean; restaurant?: any }

const IMGS = [
  "https://images.unsplash.com/photo-1634324092526-91f5e878b72f?w=1000&h=600&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=500&h=340&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1769681375998-1b231dcbe363?w=500&h=340&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=500&h=340&fit=crop&auto=format&crop=bottom",
  "https://images.unsplash.com/photo-1769681375998-1b231dcbe363?w=500&h=340&fit=crop&auto=format&crop=left",
]

const MENU = [
  {
    id: 1,
    name: "Chapli Kebab Platter",
    description: "Minced beef kebabs with fresh salad and naan",
    price: 850,
    popular: true,
    categories: ["BBQ", "Traditional"],
    image: IMGS[1]
  },
  {
    id: 2,
    name: "Sajji Whole Chicken",
    description: "Traditional whole roasted chicken, Balochi style",
    price: 2200,
    popular: false,
    categories: ["BBQ", "Traditional"],
    image: IMGS[2]
  },
  {
    id: 3,
    name: "Karahi Gosht",
    description: "Slow-cooked mutton in wok with fresh tomatoes",
    price: 1800,
    popular: true,
    categories: ["Curries", "Traditional"],
    image: IMGS[3]
  },
  {
    id: 4,
    name: "Fresh Rainbow Trout",
    description: "Locally caught trout, grilled or fried",
    price: 1500,
    popular: true,
    categories: ["Seafood"],
    image: IMGS[4]
  },
  {
    id: 5,
    name: "Maash Ki Daal",
    description: "Traditional lentil curry with ghee tadka",
    price: 350,
    popular: false,
    categories: ["Vegetarian", "Traditional"],
    image: IMGS[1]
  }
]

const TIME_SLOTS = [
  { time: "12:00 PM", status: "available" },
  { time: "12:30 PM", status: "available" },
  { time: "1:00 PM", status: "available" },
  { time: "1:30 PM", status: "limited" },
  { time: "7:00 PM", status: "available" },
  { time: "7:30 PM", status: "available" },
  { time: "8:00 PM", status: "limited" },
  { time: "8:30 PM", status: "unavailable" },
  { time: "9:00 PM", status: "available" }
]

const RESTAURANT_REVIEWS = [
  { name: "Ahmed Khan", date: "August 2026", rating: 5, text: "The absolute best food I've had in the area! The atmosphere was perfect.", avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop" },
  { name: "Sara Ali", date: "July 2026", rating: 4, text: "Great service and delicious meals. The wait time was a bit long, but worth it.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
  { name: "Omar Tariq", date: "July 2026", rating: 5, text: "Highly recommend the signature dishes! We reserved a table and it was ready on arrival.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Zainab R.", date: "June 2026", rating: 5, text: "A beautiful place for family dinners. The staff was incredibly welcoming.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" }
]

export default function RestaurantDetails({ navigate, viewBookingId, startCancel, restaurant }: Props) {
  const { user, addBooking, bookings, updateBookingStatus } = useAuth()
  
  const defaultRes = { name: "Kalam Cuisine House", location: "Kalam, Swat Valley", cuisine: "Pashtun · BBQ", rating: 4.7, img: IMGS[0] }
  const currentRes = restaurant || defaultRes

  const dynamicImgs = [currentRes.img, IMGS[1], IMGS[2], IMGS[3], IMGS[4]]
  const dynamicMenu = MENU.map(item => ({
    ...item,
    name: restaurant ? `${currentRes.name.split(' ')[0]} Special ${item.name}` : item.name,
    categories: currentRes.cuisine.includes('BBQ') ? item.categories : ['Signature', ...item.categories.slice(1)]
  }))
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [step, setStep] = useState<'details' | 'review' | 'confirming' | 'confirmed' | 'my-reservation'>('details')
  
  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIdx, setLightboxIdx] = useState(0)

  // Menu State
  const [activeCategory, setActiveCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMenuItem, setSelectedMenuItem] = useState<typeof MENU[0] | null>(null)
  
  // Reservation State
  const [resDate, setResDate] = useState("")
  const [resGuests, setResGuests] = useState(2)
  const [resTime, setResTime] = useState("")
  const [specialRequest, setSpecialRequest] = useState("")
  const [activeReservation, setActiveReservation] = useState<any>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)

  const categories = ["All", "BBQ", "Traditional", "Seafood", "Curries", "Vegetarian"]

  useEffect(() => {
    if (viewBookingId) {
      const found = bookings.find(b => b.id === viewBookingId)
      if (found) {
        setActiveReservation(found)
        setStep('my-reservation')
        if (startCancel && found.reservationData.status !== 'cancelled') {
          setShowCancelModal(true)
        }
      }
    }
  }, [viewBookingId, bookings, startCancel])

  // Filter Menu
  const filteredMenu = dynamicMenu.filter(item => {
    const matchesCat = activeCategory === "All" || item.categories.includes(activeCategory)
    const q = searchQuery.toLowerCase()
    const matchesSearch = item.name.toLowerCase().includes(q) || 
                          item.description.toLowerCase().includes(q) || 
                          item.categories.some(c => c.toLowerCase().includes(q))
    return matchesCat && matchesSearch
  })

  // Handlers
  const handleReserveClick = () => {
    if (!resDate || !resTime || resGuests < 1 || resGuests > 80) return
    if (!user) {
      setShowAuthModal(true)
    } else {
      setStep('review')
    }
  }

  const handleConfirmReservation = () => {
    setStep('confirming')
    setTimeout(() => {
      const id = "EP-RES-" + Math.floor(10000 + Math.random() * 90000)
      const resData = {
        id,
        restaurantId: "kalam-cuisine",
        date: resDate,
        time: resTime,
        guests: resGuests,
        customer: user,
        specialRequest,
        status: "confirmed",
        createdAt: new Date().toISOString()
      }
      
      const newBooking = {
        id,
        type: 'restaurant' as const,
        date: resDate,
        restaurantData: {
          name: currentRes.name,
          location: currentRes.location,
          img: currentRes.img
        },
        reservationData: resData
      }
      addBooking(newBooking)
      setActiveReservation(newBooking)
      setStep('confirmed')
    }, 1500)
  }

  const handleCancelReservation = () => {
    if (activeReservation) {
      updateBookingStatus(activeReservation.id, 'cancelled')
      setActiveReservation({
        ...activeReservation,
        reservationData: { ...activeReservation.reservationData, status: 'cancelled' }
      })
    }
    setShowCancelModal(false)
  }

  const today = new Date().toISOString().split('T')[0]

  // Render Views
  if (step === 'review') {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => setStep('details')} className="flex items-center text-emerald-700 font-bold mb-6 hover:underline">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back
          </button>
          
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-6">Review Your Reservation</h1>
            
            <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Restaurant</p>
                <p className="font-bold text-gray-900 text-lg">{currentRes.name}</p>
                <p className="text-sm text-gray-600">{currentRes.location}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Details</p>
                <p className="font-bold text-gray-900 text-lg">{resDate}</p>
                <p className="text-sm text-gray-600">{resTime} · {resGuests} guests</p>
              </div>
              <div className="col-span-2 pt-4 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Customer</p>
                <p className="font-bold text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-600">{user?.email} · {user?.phone}</p>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-900 mb-2">Special Request (Optional)</label>
              <textarea 
                className="w-full rounded-xl border border-gray-200 p-4 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all resize-none"
                rows={3}
                placeholder="Any special requests? Seating preference, occasion, dietary notes, etc."
                value={specialRequest}
                onChange={e => setSpecialRequest(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-2">Special requests are subject to restaurant availability.</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 mb-8 flex gap-3">
              <BadgeCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-sm text-emerald-900">
                <p className="font-bold mb-1">No charge until you arrive · Free cancellation</p>
                <ul className="list-disc ml-4 space-y-1 text-emerald-800">
                  <li>No payment required at reservation</li>
                  <li>Table availability depends on restaurant capacity</li>
                  <li>Please arrive on time</li>
                </ul>
              </div>
            </div>

            <button onClick={handleConfirmReservation} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
              Confirm Reservation
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'confirming') {
    return (
      <div className="min-h-screen bg-gray-50 py-24 px-4 flex items-center justify-center text-center">
        <div>
          <div className="w-16 h-16 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirming your table...</h2>
          <p className="text-gray-500">Please wait while we secure your reservation.</p>
        </div>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-gray-50 py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 shadow-sm border border-gray-100 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Reservation Confirmed</h1>
          <p className="text-lg text-gray-600 mb-8">Your table has been reserved at <span className="font-bold text-gray-900">{currentRes.name}</span>.</p>
          
          <div className="bg-gray-50 rounded-2xl p-6 text-left mb-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
              <span className="text-sm font-bold text-gray-500 uppercase">Reservation ID</span>
              <span className="font-bold text-gray-900">{activeReservation?.id}</span>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <CalendarDays className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{resDate} at {resTime}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{resGuests} guests</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="font-medium">{currentRes.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="font-medium">+92 300 1234567</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <button onClick={() => navigate('my-trips')} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">
              View My Reservations
            </button>
            <button onClick={() => navigate('home')} className="w-full py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold border border-gray-200 transition-colors">
              Back to Explore Pakistan
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'my-reservation' && activeReservation) {
    const resData = activeReservation.reservationData
    const isCancelled = resData.status === 'cancelled'
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('my-trips')} className="flex items-center text-emerald-700 font-bold mb-6 hover:underline">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Trips
          </button>
          
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50 flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Reservation ID</p>
                <h1 className="text-2xl font-display font-bold text-gray-900">{resData.id}</h1>
              </div>
              {isCancelled ? (
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold text-sm">Cancelled</span>
              ) : (
                <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Confirmed
                </span>
              )}
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <section>
                  <h3 className="font-bold text-gray-900 mb-3">Restaurant</h3>
                  <p className="text-lg font-bold text-gray-900">{activeReservation.restaurantData.name}</p>
                  <p className="text-gray-600">{activeReservation.restaurantData.location}</p>
                  <p className="text-gray-600">+92 300 1234567</p>
                </section>
                <section>
                  <h3 className="font-bold text-gray-900 mb-3">Reservation Details</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex justify-between"><span className="text-gray-500">Date</span> <span className="font-bold text-gray-900">{resData.date}</span></p>
                    <p className="flex justify-between"><span className="text-gray-500">Time</span> <span className="font-bold text-gray-900">{resData.time}</span></p>
                    <p className="flex justify-between"><span className="text-gray-500">Guests</span> <span className="font-bold text-gray-900">{resData.guests}</span></p>
                  </div>
                </section>
                {resData.specialRequest && (
                  <section>
                    <h3 className="font-bold text-gray-900 mb-3">Special Request</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-xl border border-gray-100">{resData.specialRequest}</p>
                  </section>
                )}
              </div>
              
              <div className="space-y-6">
                <section>
                  <h3 className="font-bold text-gray-900 mb-3">Customer</h3>
                  <p className="font-bold text-gray-900">{resData.customer?.fullName}</p>
                  <p className="text-gray-600">{resData.customer?.email}</p>
                  <p className="text-gray-600">{resData.customer?.phone}</p>
                </section>
                <section className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">Cancellation Policy</h3>
                  <p className="text-sm text-gray-600 mb-2">Free cancellation. No charge until you arrive.</p>
                  <p className="text-xs text-gray-500">Please cancel if you cannot make it, to allow others to dine.</p>
                </section>
                
                {!isCancelled && (
                  <button onClick={() => setShowCancelModal(true)} className="w-full py-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors">
                    Cancel Reservation
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancel Reservation?</h2>
              <p className="text-gray-600 mb-8">Are you sure you want to cancel your reservation at {currentRes.name}? There is no cancellation fee.</p>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowCancelModal(false)} className="py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full font-bold transition-colors">Keep Reservation</button>
                <button onClick={handleCancelReservation} className="py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition-colors">Yes, Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // --- Main Details Page ---
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center text-sm text-gray-500 font-medium">
            <button onClick={() => navigate('home')} className="hover:text-emerald-700 transition-colors">Home</button>
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            <button onClick={() => navigate('search-restaurants')} className="hover:text-emerald-700 transition-colors">Restaurants</button>
            <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
            <span className="text-gray-900 font-semibold">{currentRes.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Gallery */}
        <div className="hidden md:flex gap-3 h-[450px] mb-8 rounded-3xl overflow-hidden cursor-pointer group" onClick={() => { setLightboxIdx(0); setLightboxOpen(true) }}>
          <div className="w-[65%] h-full relative overflow-hidden">
            <img src={dynamicImgs[0]} alt="Restaurant" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          <div className="w-[35%] grid grid-cols-2 grid-rows-2 gap-3 h-full">
            {dynamicImgs.slice(1, 5).map((img, i) => (
              <div key={i} className="relative overflow-hidden w-full h-full">
                <img src={img} alt="Food" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Gallery Carousel */}
        <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory gap-2 mb-6 -mx-4 px-4 pb-4 hide-scrollbar">
          {dynamicImgs.map((img, i) => (
            <div key={i} className="w-[85vw] shrink-0 h-[250px] snap-center rounded-2xl overflow-hidden shadow-sm" onClick={() => { setLightboxIdx(i); setLightboxOpen(true) }}>
              <img src={img} alt="Gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-10">
            {/* Identity & Status */}
            <div>
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <BadgeCheck className="w-4 h-4 text-emerald-600" /> Verified Restaurant
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                  <Clock className="w-4 h-4 text-emerald-600" /> Open Now · Until 11 PM
                </span>
              </div>
              
              <h1 className="text-4xl font-display font-bold text-gray-900 mb-3">{currentRes.name}</h1>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-700 font-medium text-sm mb-4">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <span className="font-bold text-gray-900 ml-1">{currentRes.rating}</span>
                  <span className="text-gray-500">(284 reviews)</span>
                </div>
                <span className="text-gray-300">•</span>
                <span>{currentRes.cuisine}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600 font-medium">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{currentRes.location}</span>
                <button className="text-emerald-600 font-bold ml-2 text-sm hover:underline">Get Directions</button>
              </div>
            </div>

            {/* Information Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurant Information</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Clock3, label: "Hours", val: "12 PM – 11 PM" },
                  { icon: Phone, label: "Contact", val: "+92 300 1234567" },
                  { icon: ParkingCircle, label: "Parking", val: "Available" },
                  { icon: Trees, label: "Outdoor", val: "Terrace Seating" },
                  { icon: CreditCard, label: "Payment", val: "Cash & Card" },
                  { icon: Users, label: "Capacity", val: "80 Guests" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 items-start">
                    <item.icon className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-0.5">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Menu Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Highlights</h2>
              
              {/* Menu Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-1 md:pb-0">
                  {categories.map(cat => (
                    <button 
                      key={cat} 
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                        activeCategory === cat 
                          ? 'bg-gray-900 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    placeholder="Search menu..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full md:w-64 pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Menu Grid */}
              {filteredMenu.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {filteredMenu.map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => setSelectedMenuItem(item)}
                      className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-emerald-100"
                    >
                      <div className="w-full h-40 bg-gray-100 overflow-hidden relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-base pr-2">{item.name}</h3>
                          {item.popular && (
                            <span className="text-[10px] uppercase tracking-wide font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded shrink-0">Popular</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed flex-1">{item.description}</p>
                        <div className="flex justify-between items-center mt-auto">
                          <span className="font-bold text-gray-900">PKR {item.price.toLocaleString()}</span>
                          <span className="text-emerald-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            View <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-gray-900 font-bold text-lg mb-2">No menu items found</p>
                  <p className="text-gray-500 mb-6 text-sm">Try another category or search term.</p>
                  <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="px-6 py-2 bg-white border border-gray-200 rounded-full font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Reviews Slider */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold text-2xl text-gray-900">Guest Reviews</h2>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-3xl text-gray-900">{currentRes.rating}</span>
                  <div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i <= Math.floor(currentRes.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={i <= Math.floor(currentRes.rating) ? "text-amber-400" : "text-gray-300"}>
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-500">284 reviews</p>
                  </div>
                </div>
              </div>
              
              <div className="relative w-full -mx-4 px-4 overflow-hidden mask-image-fade">
                <div className="animate-marquee flex gap-6 pb-4">
                  {[...RESTAURANT_REVIEWS, ...RESTAURANT_REVIEWS].map((r, idx) => (
                    <div key={idx} className="w-[320px] shrink-0 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
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
                        Verified Diner
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
            </div>
          </div>

          {/* Reservation Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/40">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reserve a Table</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Choose your date, number of guests, and preferred time.</p>
              
              <div className="space-y-4 mb-6">
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:border-gray-300 transition-colors">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Date</label>
                  <input 
                    type="date" 
                    min={today}
                    value={resDate} 
                    onChange={e => setResDate(e.target.value)}
                    className="w-full bg-transparent font-bold text-gray-900 outline-none" 
                  />
                </div>
                
                <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50 hover:border-gray-300 transition-colors">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Guests</label>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{resGuests} guest{resGuests !== 1 ? 's' : ''}</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setResGuests(Math.max(1, resGuests - 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <button onClick={() => setResGuests(Math.min(80, resGuests + 1))} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {resGuests > 10 && (
                <div className="bg-amber-50 text-amber-800 text-xs font-bold p-3 rounded-xl mb-6 border border-amber-100">
                  For groups larger than 10, please contact the restaurant directly after booking.
                </div>
              )}

              <div className="mb-8">
                <h4 className="text-sm font-bold text-gray-900 mb-3">Available Times</h4>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map(t => {
                    const isSelected = resTime === t.time
                    const isAvail = t.status === 'available'
                    const isLim = t.status === 'limited'
                    const disabled = t.status === 'unavailable'
                    
                    return (
                      <button 
                        key={t.time}
                        disabled={disabled}
                        onClick={() => setResTime(t.time)}
                        className={`py-2 rounded-xl text-sm font-bold transition-all border ${
                          isSelected ? 'bg-gray-900 text-white border-gray-900 shadow-md' :
                          disabled ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed' :
                          isLim ? 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' :
                          'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                        }`}
                      >
                        {t.time}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                onClick={handleReserveClick}
                disabled={!resDate || !resTime || resGuests < 1 || resGuests > 80}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-colors shadow-lg shadow-emerald-200/50 mb-4"
              >
                Reserve Table
              </button>
              
              <div className="text-center space-y-1">
                <p className="text-xs font-bold text-gray-500">No charge until you arrive · Free cancellation</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Lightbox Gallery */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
          <div className="flex justify-between items-center p-6 text-white">
            <span className="font-medium tracking-widest text-sm">{lightboxIdx + 1} / {dynamicImgs.length}</span>
            <button onClick={() => setLightboxOpen(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 relative">
            <button 
              onClick={() => setLightboxIdx(prev => prev === 0 ? dynamicImgs.length - 1 : prev - 1)}
              className="absolute left-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <img src={dynamicImgs[lightboxIdx]} alt="Gallery" className="max-h-[85vh] max-w-full object-contain rounded-lg" />
            <button 
              onClick={() => setLightboxIdx(prev => (prev + 1) % dynamicImgs.length)}
              className="absolute right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {selectedMenuItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="relative h-64 bg-gray-100">
              <img src={selectedMenuItem.image} alt={selectedMenuItem.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedMenuItem(null)} 
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMenuItem.name}</h2>
                  <div className="flex gap-2">
                    {selectedMenuItem.popular && (
                      <span className="text-[10px] uppercase tracking-wide font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">Popular</span>
                    )}
                    <span className="text-[10px] uppercase tracking-wide font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">{selectedMenuItem.categories[0]}</span>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900 shrink-0 ml-4">PKR {selectedMenuItem.price.toLocaleString()}</span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-8">{selectedMenuItem.description}</p>
              <button onClick={() => setSelectedMenuItem(null)} className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-bold transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <RegistrationModal 
          isOpen={true}
          initialMode="register"
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            setStep('review')
          }}
        />
      )}
    </div>
  )
}
