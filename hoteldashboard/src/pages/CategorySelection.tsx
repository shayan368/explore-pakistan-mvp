import { useState } from "react"
import type { NavigateFn, SearchParams } from "../types"

type Props = {
  navigate: NavigateFn
  searchParams?: SearchParams
  setSearchParams?: React.Dispatch<React.SetStateAction<SearchParams>>
}

const IMG = {
  hero: "https://images.unsplash.com/photo-1550586678-f7225f03c44b?w=1800&h=900&fit=crop&auto=format",
  hotelsCat:
    "https://images.unsplash.com/photo-1771583103394-b21ef7a0930e?w=800&h=500&fit=crop&auto=format",
  restCat:
    "https://images.unsplash.com/photo-1728910156510-77488f19b152?w=800&h=500&fit=crop&auto=format",
  spotsCat:
    "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=800&h=500&fit=crop&auto=format",
}

export default function CategorySelection({
  navigate,
  searchParams,
  setSearchParams,
}: Props) {
  const [fromLocation, setFromLocation] = useState(
    searchParams?.fromLocation || "",
  )
  const [toLocation, setToLocation] = useState(searchParams?.toLocation || "")
  const [fromDate, setFromDate] = useState(searchParams?.fromDate || "")
  const [toDate, setToDate] = useState(searchParams?.toDate || "")
  const [adults, setAdults] = useState(searchParams?.guests || 1)
  const [children, setChildren] = useState(0)
  const [showPeopleDropdown, setShowPeopleDropdown] = useState(false)
  const [error, setError] = useState("")

  const handleUpdateSearch = () => {
    if (!fromLocation.trim() || !toLocation.trim() || !fromDate || !toDate) {
      setError("Please fill in all search fields.")
      return false
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
    return true
  }

  const navigateToCategory = (page: string) => {
    const isValid = handleUpdateSearch()
    if (isValid) {
      navigate(page as any)
    }
  }

  return (
    <div style={{ backgroundColor: "var(--color-canvas)" }}>
      {/* ── HERO ── */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${IMG.hero})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400 mb-4">
            What are you looking for?
          </p>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-6">
            Choose a Category
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Select the type of place you want to explore next. You can find
            comfortable stays, amazing food, and breathtaking spots.
          </p>
        </div>
      </section>

      {/* ── SEARCH CARD ── */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 mb-16">
        <div
          className="rounded-2xl p-4 shadow-2xl w-full mx-auto"
          style={{
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          <div className="flex flex-col xl:flex-row items-center gap-3 w-full relative">
            {/* From Input */}
            <div
              className="flex-1 w-full p-2 rounded-xl"
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
                  list="cities-list"
                  placeholder="e.g. Peshawar"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
            </div>

            {/* To Input */}
            <div
              className="flex-1 w-full p-2 rounded-xl"
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
                  list="cities-list"
                  placeholder="e.g. Kalam"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
            </div>

            <datalist id="cities-list">
              <option value="Peshawar" />
              <option value="Kalam" />
              <option value="Swat" />
              <option value="Chitral" />
              <option value="Malam Jabba" />
              <option value="Nathiagali" />
            </datalist>

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
              onClick={handleUpdateSearch}
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
                <path d="M5 13l4 4L19 7" />
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

      {/* ── CATEGORIES ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Hotels",
              desc: "Find a comfortable place to stay across KPK.",
              cta: "Explore Hotels",
              img: IMG.hotelsCat,
              page: "custom-search-hotels",
            },
            {
              title: "Restaurants",
              desc: "Discover places to eat and reserve your table.",
              cta: "Explore Restaurants",
              img: IMG.restCat,
              page: "custom-search-restaurants",
            },
            {
              title: "Tourist Spots",
              desc: "Discover beautiful places across KPK.",
              cta: "Explore Places",
              img: IMG.spotsCat,
              page: "custom-search-spots",
            },
          ].map((cat) => (
            <div
              key={cat.title}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              style={{
                minHeight: "420px",
                backgroundColor: "var(--color-muted)",
              }}
              onClick={() => navigateToCategory(cat.page)}
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
                    "linear-gradient(to top, rgba(10,30,20,0.92) 0%, rgba(10,30,20,0.3) 60%, transparent 100%)",
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display font-semibold text-3xl text-white mb-3">
                  {cat.title}
                </h3>
                <p
                  className="text-base mb-8"
                  style={{ color: "rgba(255,255,255,0.8)" }}
                >
                  {cat.desc}
                </p>
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-xl text-white transition-transform group-hover:translate-x-2"
                  style={{ backgroundColor: "var(--color-accent)" }}
                >
                  {cat.cta}
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
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
