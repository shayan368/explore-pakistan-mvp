import { useState, useEffect } from "react"
import type { NavigateFn, SearchParams } from "../types"
import { allHotels, allRestaurants, allSpots } from "./SearchResults"

type Props = {
  navigate: NavigateFn
  type: "hotels" | "restaurants" | "spots" | "all"
  searchParams?: SearchParams
  setSearchParams?: React.Dispatch<React.SetStateAction<SearchParams>>
}

const CAT_IMG = {
  hero: "https://images.unsplash.com/photo-1550586678-f7225f03c44b?w=1800&h=900&fit=crop&auto=format",
  hotelsCat: "https://images.unsplash.com/photo-1771583103394-b21ef7a0930e?w=800&h=500&fit=crop&auto=format",
  restCat: "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=800&h=500&fit=crop&auto=format",
  spotsCat: "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=800&h=500&fit=crop&auto=format",
}

export default function CustomSearchFlowResults({
  navigate,
  type,
  searchParams,
  setSearchParams,
}: Props) {
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams?.toLocation || "All",
  )
  const [activeCategory, setActiveCategory] = useState<"all" | "hotels" | "restaurants" | "spots" | "">(
    type === "all" ? "" : type
  )

  const [fromLocation, setFromLocation] = useState(searchParams?.fromLocation || "")
  const [toLocation, setToLocation] = useState(searchParams?.toLocation || "")
  const [fromDate, setFromDate] = useState(searchParams?.fromDate || "")
  const [toDate, setToDate] = useState(searchParams?.toDate || "")
  const [adults, setAdults] = useState(searchParams?.guests || 1)
  const [children, setChildren] = useState(0)
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false)
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = () => {
    if (!fromLocation.trim() || !toLocation.trim() || !fromDate || !toDate) {
      setError("Please fill in all search fields to continue.")
      return
    }
    setError("")
    if (setSearchParams) {
      setSearchParams({
        fromLocation,
        toLocation,
        fromDate,
        toDate,
        guests: adults + children,
      })
    }
    // Update local state directly so it feels responsive without a full remount if already here
    setSelectedLocation(toLocation)
    setActiveCategory("")
  }

  useEffect(() => {
    if (searchParams?.toLocation) {
      setSelectedLocation(searchParams.toLocation)
    }
  }, [searchParams])

  const hotels = allHotels.filter(
    (h) =>
      selectedLocation === "All" ||
      h.location.toLowerCase().includes(selectedLocation.toLowerCase()),
  )
  const restaurants = allRestaurants.filter(
    (r) =>
      selectedLocation === "All" ||
      r.location.toLowerCase().includes(selectedLocation.toLowerCase()),
  )
  const spots = allSpots.filter(
    (s) =>
      selectedLocation === "All" ||
      s.location.toLowerCase().includes(selectedLocation.toLowerCase()),
  )

  const count = (hotels.length + restaurants.length + spots.length)
  const locationText = selectedLocation !== "All" && selectedLocation.trim() !== "" ? selectedLocation : "Khyber Pakhtunkhwa"

  const renderHotels = () => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
      {hotels.map((h) => (
        <div
          key={h.name}
          onClick={() => navigate("hotel-details", { hotel: h })}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="h-48 relative">
            <img src={h.img} className="w-full h-full object-cover" alt={h.name} />
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold shadow-sm">★ {h.rating}</div>
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-1">{h.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{h.location}</p>
            <div className="flex items-center justify-between mt-4">
              <span className="font-bold text-emerald-700">PKR {h.price.toLocaleString()}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">View</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderRestaurants = () => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
      {restaurants.map((r) => (
        <div
          key={r.name}
          onClick={() => navigate("restaurant-details", { restaurant: r })}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="h-48 relative">
            <img src={r.img} className="w-full h-full object-cover" alt={r.name} />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-1">{r.name}</h3>
            <p className="text-xs text-gray-500 mb-1">{r.location}</p>
            <p className="text-xs text-emerald-600 font-medium mb-3">{r.cuisine}</p>
            <div className="flex items-center justify-between mt-2">
              <StarRating rating={r.rating} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderSpots = () => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
      {spots.map((s) => (
        <div
          key={s.name}
          onClick={() => navigate("tourist-spot-details", { spot: s })}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="h-48 relative">
            <img src={s.img} className="w-full h-full object-cover" alt={s.name} />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{s.location}</p>
            <div className="flex items-center justify-between">
              <StarRating rating={s.rating} />
              <span className="text-xs font-semibold px-2 py-1 bg-gray-100 text-gray-700 rounded">{s.type}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-canvas)" }}>
      <div className="relative h-64 sm:h-80 w-full overflow-hidden flex items-end pb-12">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${CAT_IMG.hero})` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <p className="text-sm font-semibold st text-emerald-300 mb-2">
            Custom Travel Search
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">
            Everything in {locationText}
          </h1>
          <p className="opacity-90">
            {count} options perfectly matching your search criteria.
          </p>
        </div>
      </div>

      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-10">
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
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold st mb-2" style={{ color: "var(--color-accent)" }}>
            Find What You Need
          </p>
          <h2 className="font-display font-semibold text-3xl sm:text-4xl" style={{ color: "var(--color-ink)" }}>
            Explore by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              id: "hotels",
              title: "Hotels",
              desc: `${hotels.length} places to stay in ${locationText}.`,
              img: CAT_IMG.hotelsCat,
            },
            {
              id: "restaurants",
              title: "Restaurants",
              desc: `${restaurants.length} places to eat in ${locationText}.`,
              img: CAT_IMG.restCat,
            },
            {
              id: "spots",
              title: "Tourist Spots",
              desc: `${spots.length} beautiful spots in ${locationText}.`,
              img: CAT_IMG.spotsCat,
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all ${activeCategory === cat.id ? 'ring-4 ring-emerald-500 shadow-xl scale-[1.02]' : 'hover:scale-[1.02]'}`}
              style={{
                minHeight: "260px",
                backgroundColor: "var(--color-muted)",
              }}
              onClick={() => setActiveCategory(activeCategory === cat.id ? "" : cat.id as any)}
            >
              <img
                src={cat.img}
                alt={cat.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(10,30,20,0.95) 0%, rgba(10,30,20,0.4) 50%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <h3 className="font-display font-semibold text-2xl text-white mb-2">
                  {cat.title}
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  {cat.desc}
                </p>
                <div className={`inline-flex items-center text-sm font-semibold ${activeCategory === cat.id ? 'text-emerald-400' : 'text-white'}`}>
                  {activeCategory === cat.id ? 'Viewing Results' : 'Explore Category'}
                  <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          {activeCategory === "hotels" && hotels.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Hotels in {locationText}</h2>
              </div>
              {renderHotels()}
            </div>
          )}
          
          {activeCategory === "restaurants" && restaurants.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Restaurants in {locationText}</h2>
              </div>
              {renderRestaurants()}
            </div>
          )}
          
          {activeCategory === "spots" && spots.length > 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Tourist Spots in {locationText}</h2>
              </div>
              {renderSpots()}
            </div>
          )}
          
          {count === 0 && (
            <div className="col-span-full py-20 text-center">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
              <p className="text-gray-500">We couldn't find any match for your search in "{locationText}".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      <svg className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
      <span className="text-xs font-semibold text-gray-700 ml-1">{rating}</span>
    </div>
  )
}
