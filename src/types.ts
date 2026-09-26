export type Page = "home" | "category-selection" | "search-hotels" | "search-restaurants" | "search-spots" | "custom-search-hotels" | "custom-search-restaurants" | "custom-search-spots" | "hotel-details" | "restaurant-details" | "tourist-spot-details" | "booking-flow" | "my-trips" | "my-profile" | "review" | "hotel-dashboard" | "restaurant-dashboard" | "tourist-spot-admin" | "super-admin"

export type NavigateFn = (page: Page, params?: any) => void

export type SearchParams = {
  fromLocation: string
  toLocation: string
  fromDate: string
  toDate: string
  guests: number
}
