import { useState } from "react"
import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }
type SidebarTab = "dashboard" | "rooms" | "availability" | "bookings" | "reviews" | "earnings" | "settings"

const bookings = [
  {
    id: "EP-2026-78341",
    guest: "Ahmed Hassan",
    room: "Deluxe Mountain View",
    checkIn: "Sep 15",
    checkOut: "Sep 18",
    amount: 29580,
    status: "confirmed",
  },
  {
    id: "EP-2026-79102",
    guest: "Sara Malik",
    room: "Standard Room",
    checkIn: "Sep 20",
    checkOut: "Sep 22",
    amount: 12400,
    status: "pending",
  },
  {
    id: "EP-2026-77891",
    guest: "Usman Tariq",
    room: "Family Suite",
    checkIn: "Sep 1",
    checkOut: "Sep 4",
    amount: 36000,
    status: "active",
  },
  {
    id: "EP-2026-76543",
    guest: "Fatima Khan",
    room: "Deluxe Mountain View",
    checkIn: "Aug 25",
    checkOut: "Aug 28",
    amount: 25500,
    status: "completed",
  },
  {
    id: "EP-2026-75112",
    guest: "Bilal Ahmed",
    room: "Standard Room",
    checkIn: "Aug 18",
    checkOut: "Aug 20",
    amount: 12400,
    status: "cancelled",
  },
]

const rooms = [
  { name: "Standard Room", total: 8, occupied: 5, held: 1, available: 2 },
  {
    name: "Deluxe Mountain View",
    total: 5,
    occupied: 3,
    held: 1,
    available: 1,
  },
  { name: "Family Suite", total: 3, occupied: 1, held: 0, available: 2 },
  { name: "Presidential Suite", total: 1, occupied: 0, held: 0, available: 1 },
]

const availability = [
  { room: "Deluxe Room", d10: 3, d11: 2, d12: 2, d13: 4, d14: 4, d15: 0 },
  { room: "Standard Room", d10: 5, d11: 5, d12: 3, d13: 3, d14: 5, d15: 5 },
  { room: "Family Suite", d10: 1, d11: 1, d12: 0, d13: 0, d14: 1, d15: 1 },
  { room: "Presidential", d10: 1, d11: 0, d12: 1, d13: 1, d14: 1, d15: 1 },
]

const statusColors: Record<string, { bg: string text: string }> = {
  confirmed: { bg: "#dcfce7", text: "#15803d" },
  active: { bg: "#dbeafe", text: "#1d4ed8" },
  completed: { bg: "#f3f4f6", text: "#6b7280" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
  pending: { bg: "#fef3c7", text: "#d97706" },
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string
  value: string
  sub?: string
  icon: string
  color: string
}) {
  return (
    <div
      className="rounded-2xl p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ backgroundColor: color + "20" }}
        >
          {icon}
        </div>
        {sub && (
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-success)" }}
          >
            {sub}
          </span>
        )}
      </div>
      <p
        className="font-bold text-2xl mb-0.5"
        style={{ color: "var(--color-ink)" }}
      >
        {value}
      </p>
      <p className="text-xs" style={{ color: "var(--color-muted-text)" }}>
        {label}
      </p>
    </div>
  )
}

function SimpleBarChart({ data, color }: { data: number[] color: string }) {
  const max = Math.max(...data)
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <div className="flex items-end gap-2 h-24 mt-4">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${(val / max) * 80}px`,
              backgroundColor: color,
              opacity: 0.85,
            }}
          />
          <span
            className="text-xs"
            style={{ color: "var(--color-muted-text)" }}
          >
            {labels[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function HotelDashboard({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard")

  const sidebarItems: { id: SidebarTab label: string icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "rooms", label: "Rooms", icon: "🛏" },
    { id: "availability", label: "Availability", icon: "📅" },
    { id: "bookings", label: "Bookings", icon: "📋" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ]

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 flex flex-col"
        style={{ backgroundColor: "var(--color-ink)", minHeight: "100vh" }}
      >
        {/* Brand */}
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--color-accent)" }}
            >
              <span className="text-white font-bold text-xs">E</span>
            </div>
            <div>
              <p className="text-white font-semibold text-xs leading-tight">
                Explore Pakistan
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Hotel Portal
              </p>
            </div>
          </button>
        </div>

        {/* Hotel info */}
        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-10 h-10 rounded-xl overflow-hidden mb-2"
            style={{ backgroundColor: "var(--color-muted)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1706736231891-e61819a17d1d?w=80&h=80&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white text-xs font-semibold">Swat Serena Lodge</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Mingora, Swat
          </p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Active Listing
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{
                backgroundColor:
                  activeTab === item.id
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                color:
                  activeTab === item.id ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              <span className="text-base">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div
          className="px-3 py-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <button
            onClick={() => navigate("home")}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Exit to Customer Site
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header
          className="px-6 py-4 flex items-center justify-between"
          style={{
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <h1
              className="font-semibold text-base"
              style={{ color: "var(--color-ink)" }}
            >
              {sidebarItems.find((s) => s.id === activeTab)?.label}
            </h1>
            <p className="text-xs" style={{ color: "var(--color-muted-text)" }}>
              Sep 1, 2026 · Tuesday
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="w-8 h-8 rounded-xl flex items-center justify-center relative"
              style={{ backgroundColor: "var(--color-muted)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: "var(--color-error)" }}
              />
            </button>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              A
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Today's Bookings"
                  value="7"
                  sub="+2 new"
                  icon="📋"
                  color="#1a4731"
                />
                <StatCard
                  label="Available Rooms"
                  value="6"
                  sub="of 17 total"
                  icon="🟢"
                  color="#16a34a"
                />
                <StatCard
                  label="Occupied Rooms"
                  value="9"
                  sub="53% occupancy"
                  icon="🏨"
                  color="#d97706"
                />
                <StatCard
                  label="Monthly Revenue"
                  value="PKR 2.4M"
                  sub="+18% vs last"
                  icon="💰"
                  color="#c8a96e"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Bookings This Week
                  </p>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    Daily booking count
                  </p>
                  <SimpleBarChart
                    data={[4, 7, 5, 8, 6, 9, 7]}
                    color="var(--color-primary)"
                  />
                </div>
                <div
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Revenue (PKR 000s)
                  </p>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    Daily revenue trend
                  </p>
                  <SimpleBarChart
                    data={[180, 240, 160, 320, 280, 410, 350]}
                    color="var(--color-accent)"
                  />
                </div>
              </div>

              {/* Recent bookings */}
              <div
                className="rounded-2xl"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div
                  className="px-5 py-4 flex items-center justify-between"
                  style={{ borderBottom: "1px solid var(--color-border)" }}
                >
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Recent Bookings
                  </p>
                  <button
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary)" }}
                    onClick={() => setActiveTab("bookings")}
                  >
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: "var(--color-muted)" }}>
                        {[
                          "Booking ID",
                          "Guest",
                          "Room",
                          "Check-in",
                          "Amount",
                          "Status",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-semibold"
                            style={{ color: "var(--color-muted-text)" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.slice(0, 4).map((b) => {
                        const sc =
                          statusColors[b.status] || statusColors.confirmed
                        return (
                          <tr
                            key={b.id}
                            style={{
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            <td
                              className="px-4 py-3 text-xs font-mono font-semibold"
                              style={{ color: "var(--color-primary)" }}
                            >
                              {b.id}
                            </td>
                            <td
                              className="px-4 py-3 text-xs font-medium"
                              style={{ color: "var(--color-ink)" }}
                            >
                              {b.guest}
                            </td>
                            <td
                              className="px-4 py-3 text-xs"
                              style={{ color: "var(--color-stone)" }}
                            >
                              {b.room}
                            </td>
                            <td
                              className="px-4 py-3 text-xs"
                              style={{ color: "var(--color-stone)" }}
                            >
                              {b.checkIn}
                            </td>
                            <td
                              className="px-4 py-3 text-xs font-semibold"
                              style={{ color: "var(--color-ink)" }}
                            >
                              PKR {b.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                                style={{
                                  backgroundColor: sc.bg,
                                  color: sc.text,
                                }}
                              >
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Rooms */}
          {activeTab === "rooms" && (
            <div className="space-y-4">
              {rooms.map((r) => (
                <div
                  key={r.name}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {r.name}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-muted-text)" }}
                      >
                        Total: {r.total} rooms
                      </p>
                    </div>
                    <button
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: "var(--color-primary-pale)",
                        color: "var(--color-primary)",
                      }}
                    >
                      Manage
                    </button>
                  </div>
                  <div className="flex gap-4">
                    {[
                      {
                        label: "Available",
                        val: r.available,
                        color: "#16a34a",
                        bg: "#dcfce7",
                      },
                      {
                        label: "Occupied",
                        val: r.occupied,
                        color: "#1d4ed8",
                        bg: "#dbeafe",
                      },
                      {
                        label: "On Hold",
                        val: r.held,
                        color: "#d97706",
                        bg: "#fef3c7",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex-1 text-center py-3 rounded-xl"
                        style={{ backgroundColor: s.bg }}
                      >
                        <p
                          className="font-bold text-lg"
                          style={{ color: s.color }}
                        >
                          {s.val}
                        </p>
                        <p
                          className="text-xs font-medium"
                          style={{ color: s.color }}
                        >
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Availability Calendar */}
          {activeTab === "availability" && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="px-5 py-4"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  Room Availability — September 2026
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-muted)" }}>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold"
                        style={{ color: "var(--color-muted-text)" }}
                      >
                        Room Type
                      </th>
                      {[
                        "Sep 10",
                        "Sep 11",
                        "Sep 12",
                        "Sep 13",
                        "Sep 14",
                        "Sep 15",
                      ].map((d) => (
                        <th
                          key={d}
                          className="px-4 py-3 text-center text-xs font-semibold"
                          style={{ color: "var(--color-muted-text)" }}
                        >
                          {d}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {availability.map((row) => (
                      <tr
                        key={row.room}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <td
                          className="px-4 py-3 text-xs font-semibold"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {row.room}
                        </td>
                        {[
                          row.d10,
                          row.d11,
                          row.d12,
                          row.d13,
                          row.d14,
                          row.d15,
                        ].map((val, i) => (
                          <td key={i} className="px-4 py-3 text-center">
                            <span
                              className="text-xs font-bold px-3 py-1 rounded-lg"
                              style={{
                                backgroundColor:
                                  val === 0
                                    ? "#fee2e2"
                                    : val <= 1
                                      ? "#fef3c7"
                                      : "#dcfce7",
                                color:
                                  val === 0
                                    ? "#dc2626"
                                    : val <= 1
                                      ? "#d97706"
                                      : "#15803d",
                              }}
                            >
                              {val === 0 ? "Full" : val}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="px-5 py-4 flex items-center gap-6"
                style={{ borderTop: "1px solid var(--color-border)" }}
              >
                {[
                  { color: "#dcfce7", text: "#15803d", label: "Available" },
                  { color: "#fef3c7", text: "#d97706", label: "Low (1 left)" },
                  { color: "#fee2e2", text: "#dc2626", label: "Fully Booked" },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: s.color }}
                    />
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All bookings */}
          {activeTab === "bookings" && (
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <div
                className="px-5 py-4"
                style={{ borderBottom: "1px solid var(--color-border)" }}
              >
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  All Bookings
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-muted)" }}>
                      {[
                        "Booking ID",
                        "Guest",
                        "Room",
                        "Check-in",
                        "Check-out",
                        "Amount",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold"
                          style={{ color: "var(--color-muted-text)" }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => {
                      const sc =
                        statusColors[b.status] || statusColors.confirmed
                      return (
                        <tr
                          key={b.id}
                          style={{
                            borderBottom: "1px solid var(--color-border)",
                          }}
                        >
                          <td
                            className="px-4 py-3 text-xs font-mono"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {b.id}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-medium"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {b.guest}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {b.room}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {b.checkIn}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {b.checkOut}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-semibold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            PKR {b.amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                              style={{ backgroundColor: sc.bg, color: sc.text }}
                            >
                              {b.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              className="text-xs font-semibold"
                              style={{ color: "var(--color-primary)" }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              {[
                {
                  guest: "Ahmed Hassan",
                  rating: 5,
                  date: "Aug 2026",
                  text: "Absolutely stunning views and exceptional service. The staff were so welcoming and the food was delicious.",
                  verified: true,
                },
                {
                  guest: "Sara Malik",
                  rating: 5,
                  date: "Jul 2026",
                  text: "Perfect getaway in Swat. Clean rooms, beautiful mountain scenery right from the window.",
                  verified: true,
                },
                {
                  guest: "Usman Tariq",
                  rating: 4,
                  date: "Jun 2026",
                  text: "Great location near the river. Rooms are spacious and the hot water was much appreciated.",
                  verified: true,
                },
              ].map((r) => (
                <div
                  key={r.guest}
                  className="rounded-2xl p-5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        {r.guest[0]}
                      </div>
                      <div>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {r.guest}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--color-muted-text)" }}
                        >
                          {r.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill={i <= r.rating ? "#f59e0b" : "#d1d5db"}
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-stone)" }}
                  >
                    {r.text}
                  </p>
                  {r.verified && (
                    <p
                      className="text-xs mt-2 font-medium"
                      style={{ color: "var(--color-primary)" }}
                    >
                      ✓ Verified Stay
                    </p>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: "var(--color-primary-pale)",
                        color: "var(--color-primary)",
                      }}
                    >
                      Reply
                    </button>
                    <button
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        border: "1px solid var(--color-border)",
                        color: "var(--color-stone)",
                      }}
                    >
                      Flag
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === "earnings" || activeTab === "settings") && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-3xl mb-3">
                {activeTab === "earnings" ? "💰" : "⚙"}
              </p>
              <p
                className="font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {activeTab === "earnings"
                  ? "Earnings & Payouts"
                  : "Hotel Settings"}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                This section is available in the full provider portal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
