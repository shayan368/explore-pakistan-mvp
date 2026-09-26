import { useState } from "react"
import type { NavigateFn } from "../types"
import { useAuth } from "../context/AuthContext"
import { IconCheck } from "../components/hotel-booking/icons"

type Props = { navigate: NavigateFn }
type Tab = "upcoming" | "active" | "completed" | "cancelled"

const statusColors: Record<string, { bg: string, text: string }> = {
  confirmed: { bg: "#dcfce7", text: "#15803d" },
  active: { bg: "#dbeafe", text: "#1d4ed8" },
  completed: { bg: "var(--color-muted)", text: "var(--color-muted-text)" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
  pending: { bg: "#fef3c7", text: "#d97706" },
  no_show: { bg: "#ffedd5", text: "#c2410c" }
}

function ActiveTripCard({
  trip,
  navigate,
}: {
  trip: any
  navigate: NavigateFn
}) {
  const activities = [
    { time: "09:00", label: "Hotel Check-in", type: "hotel", icon: "🏨" },
    {
      time: "13:00",
      label: "Lunch Time",
      type: "restaurant",
      icon: "🍽",
    },
    { time: "15:30", label: "Local Sightseeing", type: "spot", icon: "🗺" },
    {
      time: "20:00",
      label: "Dinner",
      type: "restaurant",
      icon: "🍽",
    },
  ]

  return (
    <div
      className="mb-8 rounded-2xl overflow-hidden shadow-md"
      style={{
        border: "2px solid var(--color-primary)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white font-semibold text-sm">Active Trip</span>
        </div>
        <span className="text-xs text-white/70">{trip.id}</span>
      </div>

      <div className="p-5">
        <div
          className="flex items-center gap-4 mb-5 pb-5"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div
            className="w-16 h-12 rounded-xl overflow-hidden shrink-0"
            style={{ backgroundColor: "var(--color-muted)" }}
          >
            <img src={trip.img} alt="" className="w-full h-full object-cover" />
          </div>
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: "var(--color-ink)" }}
            >
              {trip.name}
            </p>
            <p className="text-xs" style={{ color: "var(--color-muted-text)" }}>
              {trip.location} · {trip.date}
            </p>
          </div>
        </div>

        <p
          className="text-xs font-semibold mb-3"
          style={{ color: "var(--color-muted-text)" }}
        >
          TODAY&apos;S ITINERARY
        </p>
        <div className="space-y-2.5 mb-5">
          {activities.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="text-xs font-mono font-semibold w-12 shrink-0"
                style={{ color: "var(--color-primary)" }}
              >
                {a.time}
              </span>
              <div
                className="w-0.5 h-full"
                style={{ backgroundColor: "var(--color-border)" }}
              />
              <span className="text-base">{a.icon}</span>
              <span
                className="text-xs font-medium"
                style={{ color: "var(--color-ink)" }}
              >
                {a.label}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            className="py-2 rounded-xl text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Get Directions
          </button>
          <button
            className="py-2 rounded-xl text-xs font-semibold"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-stone)",
            }}
          >
            Contact Hotel
          </button>
          <button
            className="py-2 rounded-xl text-xs font-semibold"
            style={{
              border: "1px solid var(--color-error)",
              color: "var(--color-error)",
            }}
          >
            Emergency
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MyTrips({ navigate }: Props) {
  const { bookings, user } = useAuth()
  const [tab, setTab] = useState<Tab>("upcoming")

  const dynamicBookings = bookings.map(b => {
    if (b.type === 'restaurant') {
      return {
        id: b.id,
        type: "restaurant",
        name: b.restaurantData.name,
        location: b.restaurantData.location,
        date: `${b.reservationData.date} at ${b.reservationData.time}`,
        status: b.reservationData.status,
        img: b.restaurantData.img,
        refund: null,
        totalPrice: null,
        raw: b
      }
    }
    return {
      id: b.id,
      type: "hotel",
      name: b.hotelData?.name || '',
      location: b.hotelData?.location || '',
      date: b.date,
      status: b.bookingData?.status || '',
      img: b.hotelData?.img || '',
      refund: b.bookingData?.refund,
      totalPrice: b.totalPrice,
      raw: b
    }
  })

  const trips = {
    upcoming: dynamicBookings.filter(b => b.status === "confirmed" || b.status === "pending"),
    active: dynamicBookings.filter(b => b.status === "active"),
    completed: dynamicBookings.filter(b => b.status === "completed"),
    cancelled: dynamicBookings.filter(b => b.status === "cancelled" || b.status === "hotel_cancelled" || b.status === "no_show")
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming", label: "Upcoming", count: trips.upcoming.length },
    { id: "active", label: "Active", count: trips.active.length },
    { id: "completed", label: "Completed", count: trips.completed.length },
    { id: "cancelled", label: "Cancelled", count: trips.cancelled.length },
  ]

  const currentTrips = trips[tab]

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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1
            className="font-display font-semibold text-2xl mb-1"
            style={{ color: "var(--color-ink)" }}
          >
            My Trips
          </h1>
          <p className="text-sm" style={{ color: "var(--color-muted-text)" }}>
            Manage and view all your bookings and reservations.
          </p>
        </div>
        {/* Tabs */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-0 overflow-x-auto hide-scrollbar">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="px-5 py-3.5 text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 border-b-2"
                style={{
                  borderBottomColor:
                    tab === t.id ? "var(--color-primary)" : "transparent",
                  color:
                    tab === t.id
                      ? "var(--color-primary)"
                      : "var(--color-muted-text)",
                }}
              >
                {t.label}
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                  style={{
                    backgroundColor:
                      tab === t.id
                        ? "var(--color-primary-pale)"
                        : "var(--color-muted)",
                    color:
                      tab === t.id
                        ? "var(--color-primary)"
                        : "var(--color-muted-text)",
                  }}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active trip card first */}
        {tab === "active" && trips.active.length > 0 && (
          <ActiveTripCard trip={trips.active[0]} navigate={navigate} />
        )}

        {currentTrips.length === 0 && (
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
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3
              className="font-semibold mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              No {tab} trips
            </h3>
            <p
              className="text-sm mb-5"
              style={{ color: "var(--color-muted-text)" }}
            >
              Start exploring and book your next adventure.
            </p>
            <button
              onClick={() => navigate("home")}
              className="px-6 py-3 rounded-xl font-semibold text-white text-sm"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Explore KPK
            </button>
          </div>
        )}

        <div className="space-y-4">
          {currentTrips.map((trip) => {
            const statusStyle =
              statusColors[trip.status] || statusColors.confirmed
            return (
              <div
                key={trip.id}
                className="rounded-2xl overflow-hidden transition-shadow hover:shadow-md"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className="w-20 h-16 rounded-xl overflow-hidden shrink-0"
                    style={{ backgroundColor: "var(--color-muted)" }}
                  >
                    <img
                      src={trip.img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {trip.name}
                      </h3>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        {trip.status === 'no_show' ? 'No-Show' : trip.status}
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
                      {trip.location}
                    </div>
                    <p
                      className="text-xs mb-3"
                      style={{ color: "var(--color-stone)" }}
                    >
                      📅 {trip.date}
                    </p>
                    
                    {trip.refund && (
                      <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-500">Original total:</span>
                          <span className="font-semibold">PKR {trip.refund.originalAmount.toLocaleString()}</span>
                        </div>
                        {trip.refund.cancellationFee > 0 && (
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-500">Cancellation fee:</span>
                            <span className="font-semibold text-red-600">PKR {trip.refund.cancellationFee.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-1 mt-1 border-t border-gray-200">
                          <span className="text-gray-500">Refund:</span>
                          <span className="font-bold text-emerald-600">PKR {trip.refund.refundAmount.toLocaleString()}</span>
                        </div>
                        <div className="mt-2 text-emerald-700 font-semibold flex items-center gap-1">
                          <IconCheck /> 
                          {trip.refund.refundAmount === trip.refund.originalAmount ? 'Full Refund' : 
                           trip.refund.refundAmount > 0 ? 'Partial Refund' : 'No Refund'} · {trip.refund.status}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-xs mb-2"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {trip.id}
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => navigate(trip.type === 'restaurant' ? "restaurant-details" : "hotel-details", { viewBookingId: trip.id })}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                        style={{
                          backgroundColor: "var(--color-primary-pale)",
                          color: "var(--color-primary)",
                        }}
                      >
                        View
                      </button>
                      {tab === "completed" && (
                        <button
                          onClick={() => navigate("review")}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ backgroundColor: "var(--color-accent)" }}
                        >
                          Review
                        </button>
                      )}
                      {tab === "upcoming" && (
                        <button
                          onClick={() => navigate(trip.type === 'restaurant' ? "restaurant-details" : "hotel-details", { viewBookingId: trip.id, startCancel: true })}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{
                            border: "1px solid var(--color-error)",
                            color: "var(--color-error)",
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
