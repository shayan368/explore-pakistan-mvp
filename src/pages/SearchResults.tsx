import { useState, useEffect } from "react"
import type { NavigateFn, SearchParams } from "../types"
import { Search } from "lucide-react"

type Props = {
  navigate: NavigateFn
  type: "hotels" | "restaurants" | "spots"
  searchParams?: SearchParams
}

export const IMG = {
  h1: "https://images.unsplash.com/photo-1706736231891-e61819a17d1d?w=500&h=340&fit=crop&auto=format",
  h2: "https://images.unsplash.com/photo-1664872759149-b7605ca5a3a7?w=500&h=340&fit=crop&auto=format",
  h3: "https://images.unsplash.com/photo-1727803391477-a13869aaa776?w=500&h=340&fit=crop&auto=format",
  h4: "https://images.unsplash.com/photo-1627670670903-71fd70b38ded?w=500&h=340&fit=crop&auto=format",
  h5: "https://images.unsplash.com/photo-1580712500528-6b7862f68f26?w=500&h=340&fit=crop&auto=format",
  h6: "https://images.unsplash.com/photo-1771583103394-b21ef7a0930e?w=500&h=340&fit=crop&auto=format",
  r1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  r2: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
  r3: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
  r4: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&h=600&fit=crop",
  r5: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  s1: "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=500&h=340&fit=crop&auto=format",
  s2: "https://images.unsplash.com/photo-1662297115734-12fdd59b383b?w=500&h=340&fit=crop&auto=format",
  s3: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=340&fit=crop&auto=format",
}

export const allHotels = [
  {
    name: "Swat Serena Lodge",
    location: "Mingora, Swat",
    rating: 4.8,
    reviews: 312,
    price: 8500,
    img: IMG.h1,
    facilities: ["Wi-Fi", "Parking", "Restaurant"],
    available: true,
  },
  {
    name: "Kalam Continental",
    location: "Kalam Valley, Swat",
    rating: 4.6,
    reviews: 218,
    price: 6200,
    img: IMG.h2,
    facilities: ["Wi-Fi", "Hot Water", "View Deck"],
    available: true,
  },
  {
    name: "Chitral Mountain View",
    location: "Chitral City",
    rating: 4.7,
    reviews: 156,
    price: 7800,
    img: IMG.h3,
    facilities: ["Wi-Fi", "Parking", "Heater"],
    available: true,
  },
  {
    name: "Nathiagali Forest Inn",
    location: "Nathiagali",
    rating: 4.5,
    reviews: 189,
    price: 5500,
    img: IMG.h4,
    facilities: ["Wi-Fi", "Restaurant", "Garden"],
    available: false,
  },
  {
    name: "Malam Jabba Resort",
    location: "Malam Jabba, Swat",
    rating: 4.9,
    reviews: 401,
    price: 12000,
    img: IMG.h5,
    facilities: ["Wi-Fi", "Pool", "Ski Access"],
    available: true,
  },
  {
    name: "Peshawar Palace Hotel",
    location: "University Road, Peshawar",
    rating: 4.4,
    reviews: 522,
    price: 4800,
    img: IMG.h6,
    facilities: ["Wi-Fi", "Parking", "Gym"],
    available: true,
  },
  {
    name: "Swat View Hotel",
    location: "Fizagat, Swat",
    rating: 4.3,
    reviews: 145,
    price: 4500,
    img: IMG.h1,
    facilities: ["Wi-Fi", "Restaurant", "River View"],
    available: true,
  },
  {
    name: "Kalam Pine Resort",
    location: "Ushu Road, Kalam",
    rating: 4.8,
    reviews: 276,
    price: 7500,
    img: IMG.h2,
    facilities: ["Wi-Fi", "Heater", "Bonfire"],
    available: true,
  },
  {
    name: "Chitral Inn",
    location: "Airport Road, Chitral",
    rating: 4.2,
    reviews: 89,
    price: 4000,
    img: IMG.h3,
    facilities: ["Wi-Fi", "Parking"],
    available: true,
  },
  {
    name: "Nathiagali Pines Resort",
    location: "Nathiagali",
    rating: 4.6,
    reviews: 320,
    price: 9000,
    img: IMG.h4,
    facilities: ["Wi-Fi", "Restaurant", "Heating"],
    available: false,
  },
  {
    name: "Peshawar Grand",
    location: "Saddar, Peshawar",
    rating: 4.7,
    reviews: 610,
    price: 8500,
    img: IMG.h5,
    facilities: ["Wi-Fi", "Pool", "Spa", "Gym"],
    available: true,
  },
  {
    name: "Malam Jabba Ski Resort",
    location: "Malam Jabba, Swat",
    rating: 4.9,
    reviews: 840,
    price: 15000,
    img: IMG.h6,
    facilities: ["Wi-Fi", "Skiing", "Chairlift", "Restaurant"],
    available: true,
  },
  {
    name: "Kalam Riverfront",
    location: "Kalam Valley",
    rating: 4.5,
    reviews: 198,
    price: 5000,
    img: IMG.h1,
    facilities: ["Wi-Fi", "Parking", "Fishing"],
    available: true,
  },
]

export const allRestaurants = [
  {
    name: "Kalam Cuisine House",
    location: "Kalam, Swat",
    cuisine: "Pashtun · BBQ",
    rating: Number(4.2),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Riverside Sajji Grill",
    location: "Kalam, Swat",
    cuisine: "BBQ · Sajji",
    rating: Number(4.9),
    priceLevel: "$",
    open: false,
    img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop",
  },
  {
    name: "Valley Cafe",
    location: "Kalam, Swat",
    cuisine: "BBQ · Sajji",
    rating: Number(4.2),
    priceLevel: "$$",
    open: true,
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop",
  },
  {
    name: "River Kitchen",
    location: "Kalam, Swat",
    cuisine: "Chitrali · Traditional",
    rating: Number(4.4),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800&h=600&fit=crop",
  },
  {
    name: "Alpine Diner",
    location: "Kalam, Swat",
    cuisine: "Cafe · Continental",
    rating: Number(4.0),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Pine Restaurant",
    location: "Kalam, Swat",
    cuisine: "Fast Food · Burgers",
    rating: Number(4.2),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop",
  },
  {
    name: "Mountain Eatery",
    location: "Kalam, Swat",
    cuisine: "Desi · Karahi",
    rating: Number(4.9),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop",
  },
  {
    name: "Peshawar Chapli House",
    location: "Saddar, Peshawar",
    cuisine: "Traditional · Chapli Kebab",
    rating: Number(4.7),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?w=800&h=600&fit=crop",
  },
  {
    name: "Khyber Cuisine House",
    location: "Saddar, Peshawar",
    cuisine: "Steakhouse · Grill",
    rating: Number(4.8),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&h=600&fit=crop",
  },
  {
    name: "Saddar Grill",
    location: "Saddar, Peshawar",
    cuisine: "Baking · Desserts",
    rating: Number(3.5),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop",
  },
  {
    name: "Qissa Khwani Cafe",
    location: "Saddar, Peshawar",
    cuisine: "Pashtun · BBQ",
    rating: Number(4.9),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&h=600&fit=crop",
  },
  {
    name: "Heritage Kitchen",
    location: "Saddar, Peshawar",
    cuisine: "Traditional · Chapli Kebab",
    rating: Number(4.8),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop",
  },
  {
    name: "Namak Mandi Diner",
    location: "Saddar, Peshawar",
    cuisine: "BBQ · Sajji",
    rating: Number(4.8),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop",
  },
  {
    name: "City Restaurant",
    location: "Saddar, Peshawar",
    cuisine: "Chitrali · Traditional",
    rating: Number(3.9),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Chitral Heritage Kitchen",
    location: "Chitral Bazaar",
    cuisine: "Chitrali · Traditional",
    rating: Number(4.1),
    priceLevel: "$$",
    open: true,
    img: "https://images.unsplash.com/photo-1587574293340-e0011c4e8ecf?w=800&h=600&fit=crop",
  },
  {
    name: "Kalash Lounge",
    location: "Chitral Bazaar",
    cuisine: "Fast Food · Burgers",
    rating: Number(4.7),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Tirich Mir Cuisine House",
    location: "Chitral Bazaar",
    cuisine: "Desi · Karahi",
    rating: Number(4.4),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1592861956120-e524fc739696?w=800&h=600&fit=crop",
  },
  {
    name: "Hindukush Grill",
    location: "Chitral Bazaar",
    cuisine: "Seafood · Trout",
    rating: Number(3.6),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?w=800&h=600&fit=crop",
  },
  {
    name: "Northern Cafe",
    location: "Chitral Bazaar",
    cuisine: "Steakhouse · Grill",
    rating: Number(4.6),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&h=600&fit=crop",
  },
  {
    name: "Valley Kitchen",
    location: "Chitral Bazaar",
    cuisine: "Baking · Desserts",
    rating: Number(4.8),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop",
  },
  {
    name: "Bazaar Diner",
    location: "Chitral Bazaar",
    cuisine: "Pashtun · BBQ",
    rating: Number(4.2),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&h=600&fit=crop",
  },
  {
    name: "Mountain Dew Cafe",
    location: "Nathiagali",
    cuisine: "Cafe · Continental",
    rating: Number(4.1),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Pine Eatery",
    location: "Nathiagali",
    cuisine: "BBQ · Sajji",
    rating: Number(4.4),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&h=600&fit=crop",
  },
  {
    name: "Cloud Lounge",
    location: "Nathiagali",
    cuisine: "Chitrali · Traditional",
    rating: Number(4.0),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Hilltop Cuisine House",
    location: "Nathiagali",
    cuisine: "Cafe · Continental",
    rating: Number(4.9),
    priceLevel: "$$$",
    open: true,
    img: "https://images.unsplash.com/photo-1576867757603-05b134ebc379?w=800&h=600&fit=crop",
  },
  {
    name: "Muree Road Grill",
    location: "Nathiagali",
    cuisine: "Fast Food · Burgers",
    rating: Number(5.0),
    priceLevel: "$$",
    open: false,
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
  },
  {
    name: "Galiyat Cafe",
    location: "Nathiagali",
    cuisine: "Desi · Karahi",
    rating: Number(4.4),
    priceLevel: "$",
    open: true,
    img: "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800&h=600&fit=crop",
  },
  {
    name: "Peak Kitchen",
    location: "Nathiagali",
    cuisine: "Seafood · Trout",
    rating: Number(4.4),
    priceLevel: "$$",
    open: true,
    img: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=800&h=600&fit=crop",
  }
]

export const allSpots = [
  // Swat
  { name: 'Malam Jabba Ski Resort', location: 'Swat', rating: 4.8, type: 'Resort', img: IMG.h1 },
  { name: 'Fizagat Park', location: 'Swat', rating: 4.5, type: 'Park', img: IMG.s2 },
  { name: 'Miandam Valley', location: 'Swat', rating: 4.7, type: 'Valley', img: IMG.h2 },
  { name: 'White Palace Marghuzar', location: 'Swat', rating: 4.6, type: 'Historical', img: IMG.h3 },
  // Kalam
  { name: 'Mahodand Lake', location: 'Kalam', rating: 4.9, type: 'Lake', img: IMG.s1 },
  { name: 'Ushu Forest', location: 'Kalam', rating: 4.8, type: 'Forest', img: IMG.h5 },
  { name: 'Kundol Lake', location: 'Kalam', rating: 4.7, type: 'Lake', img: IMG.s2 },
  { name: 'Blue Waters', location: 'Kalam', rating: 4.8, type: 'River', img: IMG.s3 },
  // Chitral
  { name: 'Kalash Valley', location: 'Chitral', rating: 4.9, type: 'Cultural', img: IMG.h4 },
  { name: 'Tirich Mir Base Camp', location: 'Chitral', rating: 4.8, type: 'Mountain', img: IMG.h6 },
  { name: 'Shandur Pass', location: 'Chitral', rating: 4.7, type: 'Pass', img: IMG.r1 },
  { name: 'Chitral Fort', location: 'Chitral', rating: 4.6, type: 'Historical', img: IMG.r2 },
  // Peshawar
  { name: 'Qissa Khwani Bazaar', location: 'Peshawar', rating: 4.5, type: 'Market', img: IMG.r3 },
  { name: 'Bala Hisar Fort', location: 'Peshawar', rating: 4.7, type: 'Historical', img: IMG.r4 },
  { name: 'Mahabat Khan Mosque', location: 'Peshawar', rating: 4.8, type: 'Cultural', img: IMG.h1 },
  { name: 'Khyber Pass', location: 'Peshawar', rating: 4.9, type: 'Historical', img: IMG.h2 },
  // Nathiagali
  { name: 'Mukshpuri Top', location: 'Nathiagali', rating: 4.8, type: 'Trek', img: IMG.h3 },
  { name: 'Dunga Gali Pine Line', location: 'Nathiagali', rating: 4.7, type: 'Trail', img: IMG.h4 },
  { name: 'Miranjani Trek', location: 'Nathiagali', rating: 4.8, type: 'Trek', img: IMG.h5 },
  { name: 'Ayubia National Park', location: 'Nathiagali', rating: 4.6, type: 'Park', img: IMG.h6 }
]

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

export default function SearchResults({ navigate, type, searchParams }: Props) {
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [priceMax, setPriceMax] = useState(15000)
  const [minRating, setMinRating] = useState(0)
  const [availableOnly, setAvailableOnly] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams?.toLocation || "All",
  )
  const [searchQuery, setSearchQuery] = useState("")
  const [showSortDropdown, setShowSortDropdown] = useState(false)

  useEffect(() => {
    if (searchParams?.toLocation) {
      // Find case-insensitive match from predefined locations
      const locations = [
        "All",
        "Swat",
        "Kalam",
        "Chitral",
        "Peshawar",
        "Nathiagali",
      ]
      const exactMatch = locations.find(
        (l) => l.toLowerCase() === searchParams.toLocation.toLowerCase(),
      )
      if (exactMatch) setSelectedLocation(exactMatch)
      else setSelectedLocation(searchParams.toLocation)
    } else {
      setSelectedLocation("All")
    }
  }, [searchParams])

  const typeLabel =
    type === "hotels"
      ? "Hotels"
      : type === "restaurants"
        ? "Restaurants"
        : "Tourist Spots"
  const typeIcon =
    type === "hotels" ? "🏨" : type === "restaurants" ? "🍽️" : "📍"

  const defaultLocations = [
    "All",
    "Swat",
    "Kalam",
    "Chitral",
    "Peshawar",
    "Nathiagali",
  ]

  const locations = defaultLocations.includes(selectedLocation)
    ? defaultLocations
    : [...defaultLocations, selectedLocation]

  const matchesSearch = (item: any) => 
    !searchQuery || 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.location.toLowerCase().includes(searchQuery.toLowerCase())

  const sortFn = (a: any, b: any) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
    if (sortBy === "price-low" || sortBy === "price-high") {
      const priceA = a.price ?? (a.priceLevel ? a.priceLevel.length * 1000 : 0)
      const priceB = b.price ?? (b.priceLevel ? b.priceLevel.length * 1000 : 0)
      return sortBy === "price-low" ? priceA - priceB : priceB - priceA
    }
    return 0
  }

  const hotels = allHotels
    .filter((h) => minRating === 0 || h.rating >= minRating)
    .filter((h) => h.price <= priceMax)
    .filter((h) => !availableOnly || h.available)
    .filter(
      (h) =>
        selectedLocation === "All" ||
        h.location.toLowerCase().includes(selectedLocation.toLowerCase()),
    )
    .filter(matchesSearch)
    .sort(sortFn)

  const restaurants = allRestaurants
    .filter((r) => minRating === 0 || r.rating >= minRating)
    .filter(
      (r) =>
        selectedLocation === "All" ||
        r.location.toLowerCase().includes(selectedLocation.toLowerCase()),
    )
    .filter(matchesSearch)
    .sort(sortFn)

  const spots = allSpots
    .filter((s) => minRating === 0 || s.rating >= minRating)
    .filter(
      (s) =>
        selectedLocation === "All" ||
        s.location.toLowerCase().includes(selectedLocation.toLowerCase()),
    )
    .filter(matchesSearch)
    .sort(sortFn)

  const count =
    type === "hotels"
      ? hotels.length
      : type === "restaurants"
        ? restaurants.length
        : spots.length

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">{typeIcon}</span>
                <h1
                  className="font-display font-semibold text-2xl"
                  style={{ color: "var(--color-ink)" }}
                >
                  {typeLabel} in KPK
                </h1>
              </div>
              <p className="text-sm" style={{ color: "var(--color-muted-text)" }}>
                <span
                  className="font-semibold"
                  style={{ color: "var(--color-primary)" }}
                >
                  {count} {typeLabel.toLowerCase()}
                </span>{" "}
                found across Khyber Pakhtunkhwa
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative max-w-md w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={`Search ${typeLabel.toLowerCase()} by name or location...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border rounded-xl leading-5 bg-gray-50 border-gray-200 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 sm:text-sm transition-all text-gray-900"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* ── SIDEBAR FILTERS ── */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div
              className="sticky top-24 rounded-2xl p-5"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3
                className="font-semibold text-sm mb-5"
                style={{ color: "var(--color-ink)" }}
              >
                Filters
              </h3>

              {/* Location */}
              <div className="mb-5">
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Location
                </p>
                <div className="flex flex-col gap-1.5">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => setSelectedLocation(loc)}
                      className="text-left text-sm px-3 py-1.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor:
                          selectedLocation === loc
                            ? "var(--color-primary-pale)"
                            : "transparent",
                        color:
                          selectedLocation === loc
                            ? "var(--color-primary)"
                            : "var(--color-stone)",
                        fontWeight: selectedLocation === loc ? "600" : "400",
                      }}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Rating */}
              <div
                className="mb-5"
                style={{
                  borderTop: "1px solid var(--color-border)",
                  paddingTop: "16px",
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-wide mb-3"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Min. Rating
                </p>
                <div className="flex gap-1.5 flex-wrap">
                  {[0, 4, 4.5, 4.7].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                      style={{
                        backgroundColor:
                          minRating === r
                            ? "var(--color-primary)"
                            : "var(--color-muted)",
                        color: minRating === r ? "white" : "var(--color-stone)",
                      }}
                    >
                      {r === 0 ? "Any" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price (hotels only) */}
              {type === "hotels" && (
                <div
                  className="mb-5"
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "16px",
                  }}
                >
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-3"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    Max Price / night
                  </p>
                  <input
                    type="range"
                    min={3000}
                    max={15000}
                    step={500}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-green-800"
                  />
                  <p
                    className="text-sm font-semibold mt-2"
                    style={{ color: "var(--color-primary)" }}
                  >
                    Up to PKR {priceMax.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Availability (hotels only) */}
              {type === "hotels" && (
                <div
                  style={{
                    borderTop: "1px solid var(--color-border)",
                    paddingTop: "16px",
                  }}
                >
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      className="w-10 h-5 rounded-full relative transition-colors"
                      style={{
                        backgroundColor: availableOnly
                          ? "var(--color-primary)"
                          : "var(--color-border)",
                      }}
                      onClick={() => setAvailableOnly(!availableOnly)}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                          availableOnly ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--color-stone)" }}
                    >
                      Available Only
                    </span>
                  </label>
                </div>
              )}
            </div>
          </aside>

          {/* ── RESULTS ── */}
          <div className="flex-1 min-w-0">
            {/* Sort + View toggle bar */}
            <div className="flex items-center justify-between mb-6">
              {type === "hotels" ? (
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    Sort:
                  </span>
                  <div className="relative" tabIndex={0} onBlur={() => setShowSortDropdown(false)}>
                      <div
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center justify-between gap-2 text-sm font-semibold rounded-lg px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50 min-w-[200px]"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-ink)",
                        }}
                      >
                        <span>{sortBy === 'rating' ? 'Highest Rated' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Newest'}</span>
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>

                      {showSortDropdown && (
                        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Sort Options</p>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {[
                              { id: 'rating', label: 'Highest Rated', desc: 'Top reviewed hotels' },
                              { id: 'price-low', label: 'Price: Low to High', desc: 'Most affordable first' },
                              { id: 'price-high', label: 'Price: High to Low', desc: 'Luxury and premium first' },
                              { id: 'newest', label: 'Newest', desc: 'Recently added properties' }
                            ].map((opt, idx) => (
                              <div
                                key={opt.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSortBy(opt.id);
                                  setShowSortDropdown(false);
                                }}
                                className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${idx !== 3 ? 'border-b border-gray-50' : ''}`}
                              >
                                <div className={sortBy === opt.id ? "text-emerald-500" : "text-gray-400"}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m21 16-4 4-4-4"/>
                                    <path d="M17 20V4"/>
                                    <path d="m3 8 4-4 4 4"/>
                                    <path d="M7 4v16"/>
                                  </svg>
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-sm font-bold ${sortBy === opt.id ? 'text-emerald-700' : 'text-gray-900'}`}>{opt.label}</span>
                                  <span className="text-xs text-gray-500">{opt.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                </div>
              ) : (
                <div />
              )}
              <div
                className="flex gap-1 p-1 rounded-lg"
                style={{ backgroundColor: "var(--color-muted)" }}
              >
                {(["grid", "list"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className="p-1.5 rounded-md transition-colors"
                    style={{
                      backgroundColor:
                        viewMode === mode
                          ? "var(--color-surface)"
                          : "transparent",
                    }}
                  >
                    {mode === "grid" ? (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Hotel Results */}
            {type === "hotels" && (
              <div
                className={`grid gap-5 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {hotels.map((h) => (
                  <div
                    key={h.name}
                    className={`rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-lg ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                    onClick={() => navigate("hotel-details", { hotel: h })}
                  >
                    <div
                      className={`relative overflow-hidden shrink-0 ${
                        viewMode === "list" ? "w-56" : "w-full"
                      }`}
                      style={{
                        aspectRatio: viewMode === "list" ? "4/3" : "4/3",
                        backgroundColor: "var(--color-muted)",
                      }}
                    >
                      <img
                        src={h.img}
                        alt={h.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {!h.available && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                        >
                          <span
                            className="text-xs font-bold text-white px-3 py-1.5 rounded-full"
                            style={{ backgroundColor: "var(--color-error)" }}
                          >
                            Fully Booked
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {h.name}
                        </h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                          style={{
                            backgroundColor: "var(--color-accent)",
                            color: "white",
                          }}
                        >
                          ★ {h.rating}
                        </span>
                      </div>
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
                          className="text-xs"
                          style={{ color: "var(--color-muted-text)" }}
                        >
                          ({h.reviews} reviews)
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
                            className="font-bold"
                            style={{ color: "var(--color-primary)" }}
                          >
                            PKR {h.price.toLocaleString()}
                          </span>
                          <span
                            className="text-xs ml-1"
                            style={{ color: "var(--color-muted-text)" }}
                          >
                            /night
                          </span>
                        </div>
                        <button
                          className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                          style={{
                            backgroundColor: h.available
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                            cursor: h.available ? "pointer" : "not-allowed",
                          }}
                          disabled={!h.available}
                        >
                          {h.available ? "View Hotel" : "Unavailable"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Restaurant Results */}
            {type === "restaurants" && (
              <div
                className={`grid gap-5 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {restaurants.map((r) => (
                  <div
                    key={r.name}
                    className={`rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-lg ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                    onClick={() => navigate("restaurant-details", { restaurant: r })}
                  >
                    <div
                      className={`relative overflow-hidden shrink-0 ${
                        viewMode === "list" ? "w-56" : "w-full"
                      }`}
                      style={{
                        aspectRatio: "4/3",
                        backgroundColor: "var(--color-muted)",
                      }}
                    >
                      <img
                        src={r.img}
                        alt={r.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span
                        className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                          r.open ? "text-green-700" : "text-red-600"
                        }`}
                        style={{
                          backgroundColor: r.open ? "#dcfce7" : "#fee2e2",
                        }}
                      >
                        {r.open ? "Open" : "Closed"}
                      </span>
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {r.name}
                        </h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                          style={{
                            backgroundColor: "var(--color-accent)",
                            color: "white",
                          }}
                        >
                          ★ {r.rating}
                        </span>
                      </div>
                      <div
                        className="flex items-center gap-1 text-xs mb-1"
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
                        </div>
                        <button
                          className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          Reserve
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Spot Results */}
            {type === "spots" && (
              <div
                className={`grid gap-5 ${
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                }`}
              >
                {spots.map((s) => (
                  <div
                    key={s.name}
                    className={`rounded-2xl overflow-hidden cursor-pointer group transition-shadow hover:shadow-lg ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                    onClick={() => navigate("tourist-spot-details", { spot: s })}
                  >
                    <div
                      className={`relative overflow-hidden shrink-0 ${
                        viewMode === "list" ? "w-56" : "w-full"
                      }`}
                      style={{
                        aspectRatio: "4/3",
                        backgroundColor: "var(--color-muted)",
                      }}
                    >
                      <img
                        src={s.img}
                        alt={s.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3
                          className="font-semibold text-sm"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {s.name}
                        </h3>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-md shrink-0"
                          style={{
                            backgroundColor: "var(--color-accent)",
                            color: "white",
                          }}
                        >
                          ★ {s.rating}
                        </span>
                      </div>
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
                        {s.location}
                      </div>
                      <span
                        className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                        style={{
                          backgroundColor: "var(--color-primary-pale)",
                          color: "var(--color-primary)",
                        }}
                      >
                        {s.type}
                      </span>
                      <div className="mt-4">
                        <button
                          className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          Explore Spot
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {count === 0 && (
              <div className="text-center py-20">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: "var(--color-muted)" }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <h3
                  className="font-semibold mb-2"
                  style={{ color: "var(--color-ink)" }}
                >
                  No results found
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Try adjusting your filters or search in a different location.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
