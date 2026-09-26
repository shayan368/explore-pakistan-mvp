import SPOT_TEMPLATES_RAW from "../spotTypes.json"
import { useState, useRef, useEffect } from "react"
import type { NavigateFn } from "../types"
import {
  ChevronRight,
  Star,
  MapPin,
  Sun,
  Ticket,
  Mountain,
  CarFront,
  CheckCircle2,
  TriangleAlert,
  Car,
  Banknote,
  Navigation,
  Compass,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ArrowRight,
  Check,
  Trees,
  Waves,
  Clock,
} from "lucide-react"

import { allHotels, allRestaurants, allSpots } from './SearchResults';

type Props = { navigate: NavigateFn, spot?: any }

const DESTINATION = {
  id: "mahodand-lake",
  name: "Mahodand Lake",
  category: "Alpine Lake",
  rating: 4.9,
  location: "Upper Swat, Kalam Valley, Khyber Pakhtunkhwa",
  heroImage:
    "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=1600&h=700&fit=crop&auto=format",
  description:
    "Mahodand Lake is a breathtaking glacial lake situated at an altitude of 2,900 meters (9,514 ft) in the upper reaches of the Swat Valley. Known as one of the most beautiful alpine lakes in Pakistan, its crystal-clear turquoise waters reflect the surrounding snow-capped peaks in stunning clarity.\n\nThe lake is accessible via a scenic jeep track from Kalam, passing through lush meadows and ancient forests. The journey itself is an adventure, offering panoramic views at every turn. Local fishermen row traditional wooden boats across the lake, and the area is home to rainbow trout, making it a popular fishing destination.",
  information: [
    { label: "Open", value: "Sunrise to Sunset", icon: Sun },
    { label: "Entry Fee", value: "PKR 100 / person", icon: Ticket },
    { label: "Altitude", value: "2,900 m above sea", icon: Mountain },
    { label: "Access", value: "Jeep from Kalam", icon: CarFront },
  ],
  facilities: [
    "Jeep track accessible",
    "Boating available",
    "Fishing permitted",
    "Picnic area",
    "Local guides available",
    "Basic camping",
  ],
  warnings: ["No mobile network", "Altitude awareness advised"],
  photos: [
    "https://images.unsplash.com/photo-1662800291212-5d31184b861c?w=400&h=280&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1662297115734-12fdd59b383b?w=400&h=280&fit=crop&auto=format",
    "https://images.unsplash.com/photo-1580712500528-6b7862f68f26?w=400&h=280&fit=crop&auto=format",
  ],
  plan: [
    {
      label: "Best Time",
      value: "Best time: May to October",
      icon: CheckCircle2,
    },
    {
      label: "Drive",
      value: "Drive from Kalam: ~2.5 hours by jeep",
      icon: Car,
    },
    {
      label: "Weather",
      value: "Carry warm clothing — temperatures drop sharply",
      icon: TriangleAlert,
    },
    { label: "Cash", value: "No ATMs — carry cash", icon: Banknote },
  ],
  nearbyHotels: [
    {
      name: "Kalam Continental",
      location: "Kalam, 3 km",
      price: "PKR 6,200/night",
      rating: 4.6,
      img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&h=300&fit=crop&auto=format",
    },
    {
      name: "Ushu Valley Lodge",
      location: "Kalam, 5 km",
      price: "PKR 4,800/night",
      rating: 4.4,
      img: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&h=300&fit=crop&auto=format",
    },
  ],
  nearbyRestaurants: [
    {
      name: "Kalam Cuisine House",
      location: "Kalam Bazaar, 2 km",
      cuisine: "Pashtun · BBQ",
      rating: 4.7,
      img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=300&fit=crop&auto=format",
    },
    {
      name: "Trout Corner Cafe",
      location: "Kalam, 1.5 km",
      cuisine: "Seafood · Cafe",
      rating: 4.5,
      img: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&h=300&fit=crop&auto=format",
    },
  ],
}


const SPOT_TEMPLATES: Record<string, any> = SPOT_TEMPLATES_RAW

const ICON_MAP: Record<string, any> = { Sun, Ticket, Mountain, CarFront, Trees, Waves, Star, Clock, CheckCircle2, Car, TriangleAlert, Banknote }

function generateSpotData(spot: any) {
  if (!spot) return DESTINATION
  const template = SPOT_TEMPLATES[spot.type] || SPOT_TEMPLATES["Lake"]
  
  const relatedSpots = allSpots.filter(s => s.location === spot.location && s.name !== spot.name);
  const otherSpots = allSpots.filter(s => s.location !== spot.location);
  const combined = [...relatedSpots, ...otherSpots];
  const dynamicPhotos = [combined[0].img, combined[1].img, combined[2].img];

  return {
    ...DESTINATION,
    name: spot.name,
    category: spot.type,
    rating: spot.rating,
    location: spot.location,
    heroImage: spot.img,
    photos: dynamicPhotos,
    description: template.desc.replace(/\{name\}/g, spot.name).replace(/\{location\}/g, spot.location),
    information: template.info.map((i: any) => ({ ...i, icon: ICON_MAP[i.icon] || Sun })),
    facilities: template.facilities,
    warnings: template.warnings,
    plan: template.plan.map((p: any) => ({ ...p, icon: ICON_MAP[p.icon] || CheckCircle2 })),
  }
}

export default function TouristSpotDetails({ navigate, spot }: Props) {
  const [isSaved, setIsSaved] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [shareText, setShareText] = useState("Share")

  const currentDest = generateSpotData(spot)

  const getCity = (loc: string) => {
    if (!loc) return "Kalam"
    const l = loc.toLowerCase()
    if (l.includes("swat") || l.includes("mingora")) return "Swat"
    if (l.includes("kalam")) return "Kalam"
    if (l.includes("chitral")) return "Chitral"
    if (l.includes("peshawar")) return "Peshawar"
    if (l.includes("nathiagali")) return "Nathiagali"
    return loc.split(",")[0]
  }

  const spotCity = getCity(currentDest.location)

  let dynamicNearbyHotels = allHotels.filter(h => h.location.toLowerCase().includes(spotCity.toLowerCase())).slice(0, 2)
  let dynamicNearbyRestaurants = allRestaurants.filter(r => r.location.toLowerCase().includes(spotCity.toLowerCase())).slice(0, 2)

  if (dynamicNearbyHotels.length === 0) dynamicNearbyHotels = DESTINATION.nearbyHotels as any
  if (dynamicNearbyRestaurants.length === 0) dynamicNearbyRestaurants = DESTINATION.nearbyRestaurants as any

  const nearbyRef = useRef<HTMLDivElement>(null)

  const allImages = [currentDest.heroImage, ...currentDest.photos]

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx)
    setLightboxOpen(true)
  }

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, allImages.length])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentDest.name,
        url: window.location.href,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(window.location.href)
      setShareText("Link copied!")
      setTimeout(() => setShareText("Share"), 2000)
    }
  }

  const scrollToNearby = () => {
    if (nearbyRef.current) {
      nearbyRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      className="min-h-screen pb-16"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate("home")} className="hover:text-emerald-700 transition-colors">
            Home
          </button>
          <ChevronRight className="w-4 h-4" />
          <button onClick={() => navigate("search-spots")} className="hover:text-emerald-700 transition-colors">
            Tourist Spots
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{currentDest.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Action Bar (Mobile/Desktop Top Right Actions) */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
            {isSaved ? "Saved" : "Save"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
          >
            <Share2 className="w-4 h-4" />
            {shareText}
          </button>
        </div>

        {/* Hero Section */}
        <div 
          className="relative w-full rounded-2xl overflow-hidden cursor-pointer group mb-8 h-[300px] md:h-[500px]"
          onClick={() => openLightbox(0)}
        >
          <img
            src={currentDest.heroImage}
            alt={currentDest.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-white">
                <div className="flex items-center bg-amber-500/90 px-2 py-1 rounded-md text-xs font-bold backdrop-blur-sm">
                  <Star className="w-3.5 h-3.5 mr-1 fill-white text-white" />
                  {currentDest.rating}
                </div>
                <span className="text-sm font-medium text-white/90 uppercase tracking-wider bg-black/30 px-3 py-1 rounded-full backdrop-blur-md">
                  {currentDest.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 font-display">
                {currentDest.name}
              </h1>
              <div className="flex items-center text-white/90 text-sm md:text-base">
                <MapPin className="w-4 h-4 mr-1.5" />
                {currentDest.location}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-4 font-display text-gray-900">
                About {currentDest.name}
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-4">
                {currentDest.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Quick Visit Info */}
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentDest.information.map((info, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 mb-1">
                      <info.icon className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{info.label}</p>
                    <p className="text-sm font-medium text-gray-900">{info.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Facilities & Accessibility */}
            <section>
              <h2 className="text-2xl font-bold mb-6 font-display text-gray-900">
                Facilities & Accessibility
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    Available Facilities
                  </h3>
                  <ul className="space-y-3">
                    {currentDest.facilities.map((fac, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{fac}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
                    Important Information
                  </h3>
                  <ul className="space-y-3">
                    {currentDest.warnings.map((warn, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-gray-700">
                        <TriangleAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>{warn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* More Photos */}
            <section>
              <h2 className="text-2xl font-bold mb-6 font-display text-gray-900">
                More Photos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentDest.photos.map((photo, idx) => (
                  <div 
                    key={idx} 
                    className="relative w-full h-48 rounded-xl overflow-hidden cursor-pointer group bg-gray-100"
                    onClick={() => openLightbox(idx + 1)}
                  >
                    <img 
                      src={photo} 
                      alt={`Gallery image ${idx + 1}`} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>
            </section>

            {/* Explore Nearby Section */}
            <section ref={nearbyRef} className="pt-4">
              <h2 className="text-2xl font-bold mb-6 font-display text-gray-900">
                Nearby Hotels
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {dynamicNearbyHotels.map((hotel, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <img src={hotel.img} alt={hotel.name} className="w-full h-32 object-cover" />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{hotel.name}</h3>
                        <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold text-amber-700">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {hotel.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="font-bold text-emerald-700">{hotel.price}</span>
                        <button 
                          onClick={() => navigate("hotel-details", { hotel })}
                          className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          View Hotel <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-6 font-display text-gray-900">
                Nearby Restaurants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicNearbyRestaurants.map((restaurant, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                    <img src={restaurant.img} alt={restaurant.name} className="w-full h-32 object-cover" />
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">{restaurant.name}</h3>
                        <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded text-xs font-bold text-amber-700">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {restaurant.rating}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                        <MapPin className="w-3.5 h-3.5" /> {restaurant.location}
                      </p>
                      <p className="text-sm text-gray-500 mb-4">{restaurant.cuisine}</p>
                      <div className="mt-auto flex items-center justify-end pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => navigate("restaurant-details", { restaurant })}
                          className="flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          View Restaurant <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
              <h3 className="text-xl font-bold mb-6 font-display text-gray-900">
                Plan Your Visit
              </h3>
              
              <div className="space-y-4 mb-8">
                {currentDest.plan.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`mt-0.5 shrink-0 ${item.icon === TriangleAlert ? 'text-amber-500' : 'text-emerald-600'}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium leading-relaxed">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <a
                  href="https://maps.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:bg-emerald-700 bg-emerald-600 shadow-md hover:shadow-lg"
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </a>
                
                <button
                  onClick={scrollToNearby}
                  className="w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                >
                  <Compass className="w-5 h-5" />
                  Explore Nearby
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm">
          <button 
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="absolute top-6 left-6 text-white font-medium tracking-widest text-sm bg-black/40 px-4 py-2 rounded-full">
            {lightboxIndex + 1} / {allImages.length}
          </div>

          <button 
            onClick={handlePrev}
            className="absolute left-4 md:left-10 text-white/70 hover:text-white p-3 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-md transition-all"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <img 
            src={allImages[lightboxIndex]} 
            alt="Gallery view" 
            className="max-h-[85vh] max-w-[90vw] object-contain select-none"
          />

          <button 
            onClick={handleNext}
            className="absolute right-4 md:right-10 text-white/70 hover:text-white p-3 bg-black/20 hover:bg-black/50 rounded-full backdrop-blur-md transition-all"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  )
}
