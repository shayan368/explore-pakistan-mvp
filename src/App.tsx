import { useState } from "react"
import type { Page, SearchParams } from "./types"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import CategorySelection from "./pages/CategorySelection"
import SearchResults from "./pages/SearchResults"
import HotelDetails from "./pages/HotelDetails"
import RestaurantDetails from "./pages/RestaurantDetailsNew"
import TouristSpotDetails from "./pages/TouristSpotDetails"
import BookingFlow from "./pages/BookingFlow"
import MyTrips from "./pages/MyTrips"
import MyProfile from "./pages/MyProfile"
import ReviewScreen from "./pages/ReviewScreen"
import HotelDashboard from "./pages/HotelDashboard"
import RestaurantDashboard from "./pages/RestaurantDashboard"
import TouristSpotAdmin from "./pages/TouristSpotAdmin"
import SuperAdmin from "./pages/SuperAdmin"
import CustomSearchFlowResults from "./pages/CustomSearchFlowResults"

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [pageParams, setPageParams] = useState<any>(null)
  const [searchParams, setSearchParams] = useState<SearchParams>({
    fromLocation: "",
    toLocation: "",
    fromDate: "",
    toDate: "",
    guests: 1,
  })

  const navigate = (p: Page, params?: any) => {
    setPage(p)
    if (params?.resetSearch) {
      setSearchParams({ fromLocation: "", toLocation: "", fromDate: "", toDate: "", guests: 1 })
    }
    if (params !== undefined) setPageParams(params)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const isDashboard =
    page === "hotel-dashboard" ||
    page === "restaurant-dashboard" ||
    page === "tourist-spot-admin" ||
    page === "super-admin"

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {!isDashboard && <Navbar navigate={navigate} currentPage={page} />}
      <main className="flex-1">
        {page === "home" && (
          <HomePage navigate={navigate} setSearchParams={setSearchParams} />
        )}
        {page === "category-selection" && (
          <CategorySelection
            navigate={navigate}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
        {page === "custom-search-all" && (
          <CustomSearchFlowResults
            navigate={navigate}
            type="all"
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />
        )}
        {page === "custom-search-hotels" && (
          <CustomSearchFlowResults
            navigate={navigate}
            type="hotels"
            searchParams={searchParams}
          />
        )}
        {page === "custom-search-restaurants" && (
          <CustomSearchFlowResults
            navigate={navigate}
            type="restaurants"
            searchParams={searchParams}
          />
        )}
        {page === "custom-search-spots" && (
          <CustomSearchFlowResults
            navigate={navigate}
            type="spots"
            searchParams={searchParams}
          />
        )}
        {page === "search-hotels" && (
          <SearchResults
            navigate={navigate}
            type="hotels"
            searchParams={searchParams}
          />
        )}
        {page === "search-restaurants" && (
          <SearchResults
            navigate={navigate}
            type="restaurants"
            searchParams={searchParams}
          />
        )}
        {page === "search-spots" && (
          <SearchResults
            navigate={navigate}
            type="spots"
            searchParams={searchParams}
          />
        )}
        {page === "hotel-details" && <HotelDetails navigate={navigate} hotel={pageParams?.hotel} viewBookingId={pageParams?.viewBookingId} startCancel={pageParams?.startCancel} />}
        {page === "restaurant-details" && (
          <RestaurantDetails navigate={navigate} viewBookingId={pageParams?.viewBookingId} startCancel={pageParams?.startCancel} restaurant={pageParams?.restaurant} />
        )}
        {page === "tourist-spot-details" && (
          <TouristSpotDetails navigate={navigate} spot={pageParams?.spot} />
        )}
        {page === "booking-flow" && <BookingFlow navigate={navigate} />}
        {page === "my-trips" && <MyTrips navigate={navigate} />}
        {page === "my-profile" && <MyProfile navigate={navigate} />}
        {page === "review" && <ReviewScreen navigate={navigate} />}
        {page === "hotel-dashboard" && <HotelDashboard navigate={navigate} />}
        {page === "restaurant-dashboard" && (
          <RestaurantDashboard navigate={navigate} />
        )}
        {page === "tourist-spot-admin" && (
          <TouristSpotAdmin navigate={navigate} />
        )}
        {page === "super-admin" && <SuperAdmin navigate={navigate} />}
      </main>
      {!isDashboard && <Footer navigate={navigate} />}
    </div>
  )
}
