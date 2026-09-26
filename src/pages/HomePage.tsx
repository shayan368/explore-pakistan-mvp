import { useState } from "react"
import type { NavigateFn, SearchParams } from "../types"

type Props = {
  navigate: NavigateFn
  setSearchParams: React.Dispatch<React.SetStateAction<SearchParams>>
}

const IMG = {
  hero: "https://images.unsplash.com/photo-1550586678-f7225f03c44b?w=1800&h=900&fit=crop&auto=format",
  swat: "https://images.unsplash.com/photo-1679951124125-50cc4029d727?w=600&h=450&fit=crop&auto=format",
  kalam:
    "https://images.unsplash.com/photo-1662800291212-5d31184b861c?w=600&h=450&fit=crop&auto=format",
  malamJabba:
    "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?w=600&h=450&fit=crop&auto=format",
  chitral:
    "https://images.unsplash.com/photo-1671431557335-a152d68e4fdf?w=600&h=450&fit=crop&auto=format",
  peshawar:
    "https://images.unsplash.com/photo-1637679149566-6af21b6e933a?w=600&h=450&fit=crop&auto=format",
  nathiagali:
    "https://images.unsplash.com/photo-1682465340902-176de71e647e?w=600&h=450&fit=crop&auto=format",
  hotelsCat:
    "https://images.unsplash.com/photo-1771583103394-b21ef7a0930e?w=800&h=500&fit=crop&auto=format",
  restCat:
    "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=800&h=500&fit=crop&auto=format",
  spotsCat:
    "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=800&h=500&fit=crop&auto=format",
  hotel1:
    "https://images.unsplash.com/photo-1706736231891-e61819a17d1d?w=600&h=400&fit=crop&auto=format",
  hotel2:
    "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?w=600&h=400&fit=crop&auto=format",
  hotel3:
    "https://images.unsplash.com/photo-1727803391477-a13869aaa776?w=600&h=400&fit=crop&auto=format",
  hotel4:
    "https://images.unsplash.com/photo-1627670670903-71fd70b38ded?w=600&h=400&fit=crop&auto=format",
  rest1:
    "https://images.unsplash.com/photo-1634324092526-91f5e878b72f?w=600&h=400&fit=crop&auto=format",
  rest2:
    "https://images.unsplash.com/photo-1617692855027-33b14f061079?w=600&h=400&fit=crop&auto=format",
  rest3:
    "https://images.unsplash.com/photo-1769681375998-1b231dcbe363?w=600&h=400&fit=crop&auto=format",
  spot1:
    "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=800&h=500&fit=crop&auto=format",
  spot2:
    "https://images.unsplash.com/photo-1662297115734-12fdd59b383b?w=800&h=500&fit=crop&auto=format",
  spot3:
    "https://images.unsplash.com/photo-1580712500528-6b7862f68f26?w=800&h=500&fit=crop&auto=format",
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "#f59e0b" : "#d1d5db"}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
      style={{
        backgroundColor: "var(--color-primary-pale)",
        color: "var(--color-primary)",
      }}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Verified
    </span>
  )
}

export default function HomePage({ navigate, setSearchParams }: Props) {
  const [fromLocation, setFromLocation] = useState("")
  const [toLocation, setToLocation] = useState("")
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [searchCategory, setSearchCategory] = useState("Hotels")

  const destinations = [
    {
      name: "Swat Valley",
      info: "The Switzerland of Pakistan",
      spots: 48,
      img: IMG.swat,
    },
    {
      name: "Kalam",
      info: "Alpine meadows & glacial lakes",
      spots: 31,
      img: IMG.kalam,
    },
    {
      name: "Malam Jabba",
      info: "Ski resort & snow paradise",
      spots: 22,
      img: IMG.malamJabba,
    },
    {
      name: "Chitral",
      info: "Ancient Kalash culture",
      spots: 35,
      img: IMG.chitral,
    },
    {
      name: "Peshawar",
      info: "Historic Silk Road city",
      spots: 67,
      img: IMG.peshawar,
    },
    {
      name: "Nathiagali",
      info: "Lush pine forests & cool air",
      spots: 29,
      img: IMG.nathiagali,
    },
  ]

  const hotels = [
    {
      name: "Swat Serena Lodge",
      location: "Mingora, Swat",
      rating: 4.8,
      reviews: 312,
      price: "PKR 8,500",
      img: IMG.hotel1,
      facilities: ["Wi-Fi", "Parking", "Restaurant"],
    },
    {
      name: "Kalam Continental",
      location: "Kalam Valley, Swat",
      rating: 4.6,
      reviews: 218,
      price: "PKR 6,200",
      img: IMG.hotel2,
      facilities: ["Wi-Fi", "Hot Water", "View Deck"],
    },
    {
      name: "Chitral Mountain View",
      location: "Chitral City",
      rating: 4.7,
      reviews: 156,
      price: "PKR 7,800",
      img: IMG.hotel3,
      facilities: ["Wi-Fi", "Parking", "Heater"],
    },
    {
      name: "Nathiagali Forest Inn",
      location: "Nathiagali, Abbottabad",
      rating: 4.5,
      reviews: 189,
      price: "PKR 5,500",
      img: IMG.hotel4,
      facilities: ["Wi-Fi", "Restaurant", "Garden"],
    },
  ]

  const restaurants = [
    {
      name: "Kalam Cuisine House",
      location: "Kalam, Swat",
      cuisine: "Pashtun · BBQ",
      rating: 4.7,
      priceLevel: "$$",
      open: true,
      img: IMG.rest1,
    },
    {
      name: "Peshawar Chapli House",
      location: "Saddar, Peshawar",
      cuisine: "Traditional · Chapli Kebab",
      rating: 4.8,
      priceLevel: "$",
      open: true,
      img: IMG.rest2,
    },
    {
      name: "Riverside Sajji Grill",
      location: "Swat River, Mingora",
      cuisine: "BBQ · Sajji",
      rating: 4.6,
      priceLevel: "$$",
      open: false,
      img: IMG.rest3,
    },
  ]

  const spots = [
    {
      name: "Mahodand Lake",
      location: "Upper Swat",
      rating: 4.9,
      desc: "A stunning alpine lake surrounded by snow-capped peaks, accessible by jeep track from Kalam.",
      img: IMG.spot1,
    },
    {
      name: "Swat River",
      location: "Swat Valley",
      rating: 4.7,
      desc: "The legendary river winding through lush green valleys — perfect for rafting and riverside camping.",
      img: IMG.spot2,
    },
    {
      name: "Ushu Forest",
      location: "Kalam",
      rating: 4.8,
      desc: "Ancient pine and deodar forests blanketing mountain slopes with magical mist and wildlife trails.",
      img: IMG.spot3,
    },
  ]

  const why = [
    {
      icon: "✓",
      title: "Verified Providers",
      desc: "Every hotel, restaurant, and tourist spot is reviewed and verified before listing.",
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      desc: "Book hotels and reserve restaurant tables in seconds, with real-time availability.",
    },
    {
      icon: "🗺",
      title: "Explore KPK",
      desc: "Discover beautiful destinations across all of Khyber Pakhtunkhwa in one place.",
    },
    {
      icon: "◈",
      title: "One Platform",
      desc: "Plan, book, and manage your entire KPK travel experience without switching apps.",
    },
  ]

  const [error, setError] = useState("")

  const handleSearch = () => {
    if (!fromLocation.trim() || !toLocation.trim() || !fromDate || !toDate) {
      setError("Please fill in all search fields to continue.")
      return
    }
    setError("")
    setSearchParams({
      fromLocation,
      toLocation,
      fromDate,
      toDate,
      guests: adults + children,
    })
    navigate("custom-search-all")
  }

  return (
    <div>
      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG.hero})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,30,20,0.55) 0%, rgba(10,30,20,0.7) 60%, rgba(10,30,20,0.85) 100%)",
          }}
        />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
              style={{
                backgroundColor: "rgba(200,169,110,0.2)",
                border: "1px solid rgba(200,169,110,0.4)",
                color: "var(--color-accent)",
              }}
            >
              <span>✦</span>
              <span>Khyber Pakhtunkhwa&apos;s Premier Travel Platform</span>
            </div>

            <h1
              className="font-display font-semibold leading-[1.05] text-white mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Explore Pakistan
              <br />
              {/* <span style={{ color: 'var(--color-accent)' }}>Pakhtunkhwa</span> */}
            </h1>

            <p
              className="text-lg leading-relaxed mb-10"
              style={{ color: "rgba(255,255,255,0.75)", maxWidth: "520px" }}
            >
              Discover amazing places, stay at trusted hotels, and find the best
              restaurants across pakistan — all in one premium travel platform.
            </p>

            <div className="flex gap-8 mt-10">
              {[
                ["2,400+", "Listed Facilities"],
                ["48K+", "Happy Travelers"],
                ["4.8★", "Average Rating"],
              ].map(([num, lbl]) => (
                <div key={lbl}>
                  <p className="font-display font-semibold text-2xl text-white">
                    {num}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "rgba(255,255,255,0.6)" }}
                  >
                    {lbl}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background:
              "linear-gradient(to top, var(--color-canvas), transparent)",
          }}
        />
      </section>

      {/* ── SEARCH CARD (MOVED FROM HERO) ── */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 mb-10">
        <div
          className="rounded-2xl p-4 shadow-2xl w-full mx-auto"
          style={{
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          <div className="flex flex-col xl:flex-row items-center gap-3 w-full relative">
            {/* From Input */}
            <div
              className="flex-1 w-full p-2 rounded-xl relative"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                From
              </label>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="e.g. Peshawar"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onFocus={() => setShowFromDropdown(true)}
                  onBlur={() => setShowFromDropdown(false)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              {showFromDropdown && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-72 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 ">Trending destinations</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { city: "Swat", country: "Pakistan" },
                      { city: "Kalam", country: "Pakistan" },
                      { city: "Chitral", country: "Pakistan" },
                      { city: "Peshawar", country: "Pakistan" },
                      { city: "Nathiagali", country: "Pakistan" }
                    ].map((dest, idx) => (
                      <div
                        key={dest.city}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFromLocation(dest.city);
                          if ('showFromDropdown' === 'showFromDropdown') setShowFromDropdown(false);
                          else setShowToDropdown(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${idx !== 4 ? 'border-b border-gray-50' : ''}`}
                      >
                        <div className="text-gray-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{dest.city}</span>
                          <span className="text-xs text-gray-500">{dest.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* To Input */}
            <div
              className="flex-1 w-full p-2 rounded-xl relative"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                To
              </label>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  placeholder="e.g. Kalam"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  onFocus={() => setShowToDropdown(true)}
                  onBlur={() => setShowToDropdown(false)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              {showToDropdown && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-72 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 ">Trending destinations</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { city: "Swat", country: "Pakistan" },
                      { city: "Kalam", country: "Pakistan" },
                      { city: "Chitral", country: "Pakistan" },
                      { city: "Peshawar", country: "Pakistan" },
                      { city: "Nathiagali", country: "Pakistan" }
                    ].map((dest, idx) => (
                      <div
                        key={dest.city}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setToLocation(dest.city);
                          if ('showToDropdown' === 'showFromDropdown') setShowFromDropdown(false);
                          else setShowToDropdown(false);
                        }}
                        className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${idx !== 4 ? 'border-b border-gray-50' : ''}`}
                      >
                        <div className="text-gray-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{dest.city}</span>
                          <span className="text-xs text-gray-500">{dest.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </div>

            

            {/* Dates Input */}
            <div
              className="flex-[1.5] w-full p-2 rounded-xl flex gap-2 items-center"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div className="flex-1">
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
              <div className="w-px h-8 bg-gray-300 mx-1"></div>
              <div className="flex-1">
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
            </div>

            {/* People Input Dropdown */}
            <div className="flex-1 w-full relative">
              <div
                className="p-2 rounded-xl cursor-pointer h-full"
                style={{
                  border: "1px solid var(--color-border)",
                  minHeight: "58px",
                }}
                onClick={() => setShowPeopleDropdown(!showPeopleDropdown)}
              >
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Travelers
                </label>
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {adults + children} People
                </div>
              </div>

              {showPeopleDropdown && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-64 bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Adults
                      </p>
                      <p className="text-xs text-gray-500">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {adults}
                      </span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Children
                      </p>
                      <p className="text-xs text-gray-500">Ages 0-12</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {children}
                      </span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="w-full xl:w-auto h-[58px] px-8 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 flex-shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search
            </button>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600 px-2 font-medium">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold st mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              Discover KPK
            </p>
            <h2
              className="font-display font-semibold text-4xl"
              style={{ color: "var(--color-ink)" }}
            >
              Popular Destinations
            </h2>
          </div>
          <button
            onClick={() => navigate("search-hotels")}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            View all{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d) => (
            <button
              key={d.name}
              onClick={() => navigate("search-hotels")}
              className="group relative rounded-2xl overflow-hidden text-left transition-transform hover:-translate-y-1 duration-300"
              style={{
                aspectRatio: "4/3",
                backgroundColor: "var(--color-muted)",
              }}
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-display font-semibold text-xl text-white">
                  {d.name}
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.7)" }}
                >
                  {d.info}
                </p>
                <p
                  className="text-xs font-semibold mt-2"
                  style={{ color: "var(--color-accent)" }}
                >
                  {d.spots} places to explore
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── EXPLORE BY CATEGORY ── */}
      <section
        className="py-16"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p
              className="text-xs font-semibold st mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              Find What You Need
            </p>
            <h2
              className="font-display font-semibold text-4xl"
              style={{ color: "var(--color-ink)" }}
            >
              Explore by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Hotels",
                desc: "Find a comfortable place to stay across KPK.",
                cta: "Explore Hotels",
                img: IMG.hotelsCat,
                page: "search-hotels" as const,
              },
              {
                title: "Restaurants",
                desc: "Discover places to eat and reserve your table.",
                cta: "Explore Restaurants",
                img: IMG.restCat,
                page: "search-restaurants" as const,
              },
              {
                title: "Tourist Spots",
                desc: "Discover beautiful places across KPK.",
                cta: "Explore Places",
                img: IMG.spotsCat,
                page: "search-spots" as const,
              },
            ].map((cat) => (
              <div
                key={cat.title}
                className="group relative rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  minHeight: "340px",
                  backgroundColor: "var(--color-muted)",
                }}
                onClick={() => navigate(cat.page)}
              >
                <img
                  src={cat.img}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(10,30,20,0.88) 0%, rgba(10,30,20,0.3) 60%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <h3 className="font-display font-semibold text-2xl text-white mb-2">
                    {cat.title}
                  </h3>
                  <p
                    className="text-sm mb-5"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {cat.desc}
                  </p>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    {cat.cta}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED HOTELS ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold st mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              Top Rated
            </p>
            <h2
              className="font-display font-semibold text-4xl"
              style={{ color: "var(--color-ink)" }}
            >
              Featured Hotels
            </h2>
          </div>
          <button
            onClick={() => navigate("search-hotels")}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            View all{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hotels.map((h) => (
            <div
              key={h.name}
              className="rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-xl"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
              onClick={() => navigate("hotel-details")}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  aspectRatio: "4/3",
                  backgroundColor: "var(--color-muted)",
                }}
              >
                <img
                  src={h.img}
                  alt={h.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <VerifiedBadge />
                </div>
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <h3
                  className="font-semibold text-sm mb-1"
                  style={{ color: "var(--color-ink)" }}
                >
                  {h.name}
                </h3>
                <div
                  className="flex items-center gap-1 text-xs mb-2"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {h.location}
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <StarRating rating={h.rating} />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {h.rating}
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    ({h.reviews})
                  </span>
                </div>
                <div className="flex gap-1 flex-wrap mb-4">
                  {h.facilities.map((f) => (
                    <span
                      key={f}
                      className="text-xs px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: "var(--color-muted)",
                        color: "var(--color-stone)",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      From{" "}
                    </span>
                    <span
                      className="font-bold text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {h.price}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      /night
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate("hotel-details")
                    }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── POPULAR RESTAURANTS ── */}
      <section
        className="py-16"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-xs font-semibold st mb-2"
                style={{ color: "var(--color-accent)" }}
              >
                Taste KPK
              </p>
              <h2
                className="font-display font-semibold text-4xl"
                style={{ color: "var(--color-ink)" }}
              >
                Popular Restaurants
              </h2>
            </div>
            <button
              onClick={() => navigate("search-restaurants")}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:opacity-70"
              style={{ color: "var(--color-primary)" }}
            >
              View all{" "}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <div
                key={r.name}
                className="rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-lg"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
                onClick={() => navigate("restaurant-details")}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: "16/10",
                    backgroundColor: "var(--color-muted)",
                  }}
                >
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.open ? "text-green-700" : "text-red-600"
                      }`}
                      style={{
                        backgroundColor: r.open ? "#dcfce7" : "#fee2e2",
                      }}
                    >
                      {r.open ? "Open Now" : "Closed"}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3
                    className="font-semibold text-sm mb-1"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {r.name}
                  </h3>
                  <div
                    className="flex items-center gap-1 text-xs mb-2"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {r.location}
                  </div>
                  <p
                    className="text-xs mb-3"
                    style={{ color: "var(--color-stone)" }}
                  >
                    {r.cuisine}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarRating rating={r.rating} />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {r.rating}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-muted-text)" }}
                      >
                        {r.priceLevel}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate("restaurant-details")
                      }}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: "var(--color-primary-pale)",
                        color: "var(--color-primary)",
                      }}
                    >
                      Reserve Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOURIST SPOTS ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p
              className="text-xs font-semibold st mb-2"
              style={{ color: "var(--color-accent)" }}
            >
              Natural Wonders
            </p>
            <h2
              className="font-display font-semibold text-4xl"
              style={{ color: "var(--color-ink)" }}
            >
              Tourist Spots
            </h2>
          </div>
          <button
            onClick={() => navigate("search-spots")}
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            View all{" "}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14m-7-7 7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {spots.map((s, i) => (
            <div
              key={s.name}
              className={`rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-xl ${
                i === 0 ? "lg:row-span-2" : ""
              }`}
              style={{ backgroundColor: "var(--color-muted)" }}
              onClick={() => navigate("tourist-spot-details")}
            >
              <div
                className="relative overflow-hidden w-full h-full"
                style={{ minHeight: i === 0 ? "420px" : "200px" }}
              >
                <img
                  src={s.img}
                  alt={s.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(200,169,110,0.9)",
                        color: "white",
                      }}
                    >
                      ★ {s.rating}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "rgba(255,255,255,0.7)" }}
                    >
                      {s.location}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white mb-1">
                    {s.name}
                  </h3>
                  {i === 0 && (
                    <p
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.75)" }}
                    >
                      {s.desc}
                    </p>
                  )}
                  <button
                    className="mt-3 text-xs font-semibold px-4 py-2 rounded-lg text-white inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    Explore Spot{" "}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M5 12h14m-7-7 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY EXPLORE PAKISTAN ── */}
      <section
        className="py-20"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p
              className="text-xs font-semibold st mb-3"
              style={{ color: "var(--color-accent)" }}
            >
              Our Promise
            </p>
            <h2 className="font-display font-semibold text-4xl text-white">
              Why Explore Pakistan?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {why.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ backgroundColor: "rgba(200,169,110,0.2)" }}
                >
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, var(--color-primary-pale) 0%, var(--color-accent-light) 100%)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p
            className="text-xs font-semibold st mb-3"
            style={{ color: "var(--color-accent)" }}
          >
            Ready to Explore?
          </p>
          <h2
            className="font-display font-semibold text-4xl mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            Your KPK Adventure Starts Here
          </h2>
          <p
            className="text-base mb-8 max-w-xl mx-auto"
            style={{ color: "var(--color-stone)" }}
          >
            Join thousands of travelers who have discovered the magic of Khyber
            Pakhtunkhwa through Explore Pakistan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("search-hotels")}
              className="px-8 py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Start Exploring
            </button>
            <button
              className="px-8 py-3.5 rounded-xl font-semibold transition-colors hover:bg-white/60"
              style={{
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
              }}
            >
              List Your Business
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
