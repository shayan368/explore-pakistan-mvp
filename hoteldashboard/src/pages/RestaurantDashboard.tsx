import { useState } from "react"
import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }
type SidebarTab = "dashboard" | "tables" | "reservations" | "menu" | "reviews" | "earnings" | "settings"
type TableStatus = "available" | "reserved" | "held" | "occupied"

interface Table {
  id: string
  number: number
  seats: number
  status: TableStatus
  guest?: string
  time?: string
}

const initialTables: Table[] = [
  { id: "t1", number: 1, seats: 2, status: "available" },
  {
    id: "t2",
    number: 2,
    seats: 4,
    status: "occupied",
    guest: "Ahmed Hassan",
    time: "7:00 PM",
  },
  {
    id: "t3",
    number: 3,
    seats: 4,
    status: "reserved",
    guest: "Sara Malik",
    time: "8:00 PM",
  },
  { id: "t4", number: 4, seats: 6, status: "available" },
  {
    id: "t5",
    number: 5,
    seats: 2,
    status: "held",
    guest: "Online Hold",
    time: "Expires 8:15 PM",
  },
  { id: "t6", number: 6, seats: 8, status: "available" },
  {
    id: "t7",
    number: 7,
    seats: 4,
    status: "occupied",
    guest: "Usman Tariq",
    time: "7:30 PM",
  },
  {
    id: "t8",
    number: 8,
    seats: 2,
    status: "reserved",
    guest: "Fatima Khan",
    time: "9:00 PM",
  },
  { id: "t9", number: 9, seats: 6, status: "available" },
  {
    id: "t10",
    number: 10,
    seats: 4,
    status: "held",
    guest: "Online Hold",
    time: "Expires 7:55 PM",
  },
  {
    id: "t11",
    number: 11,
    seats: 2,
    status: "occupied",
    guest: "Ali Raza",
    time: "6:45 PM",
  },
  { id: "t12", number: 12, seats: 8, status: "available" },
]

const reservations = [
  {
    id: "RES-001",
    guest: "Ahmed Hassan",
    date: "Sep 1",
    time: "7:00 PM",
    guests: 4,
    table: "Table 2",
    status: "seated",
  },
  {
    id: "RES-002",
    guest: "Sara Malik",
    date: "Sep 1",
    time: "8:00 PM",
    guests: 3,
    table: "Table 3",
    status: "confirmed",
  },
  {
    id: "RES-003",
    guest: "Fatima Khan",
    date: "Sep 1",
    time: "9:00 PM",
    guests: 2,
    table: "Table 8",
    status: "confirmed",
  },
  {
    id: "RES-004",
    guest: "Bilal Ahmed",
    date: "Sep 2",
    time: "1:00 PM",
    guests: 6,
    table: "Table 6",
    status: "confirmed",
  },
  {
    id: "RES-005",
    guest: "Ayesha Khan",
    date: "Sep 2",
    time: "7:30 PM",
    guests: 2,
    table: "Table 1",
    status: "pending",
  },
]

const menuItems = [
  {
    name: "Chapli Kebab Platter",
    category: "Main Course",
    price: 850,
    available: true,
    popular: true,
  },
  {
    name: "Sajji Whole Chicken",
    category: "Main Course",
    price: 2200,
    available: true,
    popular: false,
  },
  {
    name: "Karahi Gosht",
    category: "Main Course",
    price: 1800,
    available: true,
    popular: true,
  },
  {
    name: "Fresh Rainbow Trout",
    category: "Seafood",
    price: 1500,
    available: false,
    popular: true,
  },
  {
    name: "Maash Ki Daal",
    category: "Lentils",
    price: 350,
    available: true,
    popular: false,
  },
  {
    name: "Naan Bread",
    category: "Bread",
    price: 50,
    available: true,
    popular: false,
  },
]

const tableStatusConfig: Record<TableStatus, {
  bg: string
  border: string
  text: string
  label: string
  icon: string
}> = {
  available: {
    bg: "#f0fdf4",
    border: "#86efac",
    text: "#15803d",
    label: "Available",
    icon: "○",
  },
  reserved: {
    bg: "#eff6ff",
    border: "#93c5fd",
    text: "#1d4ed8",
    label: "Reserved",
    icon: "◑",
  },
  held: {
    bg: "#fffbeb",
    border: "#fcd34d",
    text: "#d97706",
    label: "On Hold",
    icon: "⧖",
  },
  occupied: {
    bg: "#fef2f2",
    border: "#fca5a5",
    text: "#dc2626",
    label: "Occupied",
    icon: "●",
  },
}

const resStatusColors: Record<string, { bg: string text: string }> = {
  seated: { bg: "#dbeafe", text: "#1d4ed8" },
  confirmed: { bg: "#dcfce7", text: "#15803d" },
  pending: { bg: "#fef3c7", text: "#d97706" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
}

function SimpleBarChart({ data, color }: { data: number[] color: string }) {
  const max = Math.max(...data)
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  return (
    <div className="flex items-end gap-2 h-20 mt-3">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${(val / max) * 68}px`,
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

export default function RestaurantDashboard({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard")
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)

  const sidebarItems: {
    id: SidebarTab
    label: string
    icon: string
    badge?: number
  }[] = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "tables", label: "Table Layout", icon: "🪑" },
    { id: "reservations", label: "Reservations", icon: "📅", badge: 2 },
    { id: "menu", label: "Menu", icon: "🍽" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "earnings", label: "Earnings", icon: "💰" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ]

  const available = tables.filter((t) => t.status === "available").length
  const occupied = tables.filter((t) => t.status === "occupied").length
  const reserved = tables.filter((t) => t.status === "reserved").length
  const held = tables.filter((t) => t.status === "held").length

  const cycleStatus = (table: Table) => {
    const cycle: TableStatus[] = ["available", "occupied", "reserved", "held"]
    const idx = cycle.indexOf(table.status)
    const next = cycle[(idx + 1) % cycle.length]
    setTables((prev) =>
      prev.map((t) =>
        t.id === table.id
          ? {
              ...t,
              status: next,
              guest: next !== "available" ? t.guest || "Walk-in" : undefined,
            }
          : t,
      ),
    )
  }

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0"
        style={{ backgroundColor: "#1c1917", minHeight: "100vh" }}
      >
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
                Restaurant Portal
              </p>
            </div>
          </button>
        </div>

        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-10 h-10 rounded-xl overflow-hidden mb-2"
            style={{ backgroundColor: "var(--color-muted)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1634324092526-91f5e878b72f?w=80&h=80&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-white text-xs font-semibold">
            Kalam Cuisine House
          </p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            Kalam, Swat
          </p>
          <div className="flex items-center gap-1 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Open · Closes 11 PM
            </span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{
                backgroundColor:
                  activeTab === item.id
                    ? "rgba(255,255,255,0.1)"
                    : "transparent",
                color:
                  activeTab === item.id ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              <div className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: "var(--color-error)" }}
                >
                  {item.badge}
                </span>
              )}
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
              Sep 1, 2026 · Evening Service
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
              style={{ backgroundColor: "#dcfce7" }}
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700">
                Restaurant Open
              </span>
            </div>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              K
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Today's Reservations",
                    value: "18",
                    icon: "📅",
                    sub: "+3 walk-ins",
                    bg: "#e8f0ec",
                  },
                  {
                    label: "Tables Available",
                    value: String(available),
                    icon: "🟢",
                    sub: `of ${tables.length} total`,
                    bg: "#f0fdf4",
                  },
                  {
                    label: "Tables Occupied",
                    value: String(occupied + reserved),
                    icon: "🪑",
                    sub: `${Math.round(((occupied + reserved) / tables.length) * 100)}% capacity`,
                    bg: "#fef3c7",
                  },
                  {
                    label: "Today's Revenue",
                    value: "PKR 48,500",
                    icon: "💰",
                    sub: "+12% vs yesterday",
                    bg: "#f5eddd",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
                      style={{ backgroundColor: s.bg }}
                    >
                      {s.icon}
                    </div>
                    <p
                      className="font-bold text-2xl mb-0.5"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {s.value}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {s.label}
                    </p>
                    <p
                      className="text-xs mt-1 font-semibold"
                      style={{ color: "var(--color-success)" }}
                    >
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div
                  className="lg:col-span-2 rounded-2xl p-5"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Reservations This Week
                  </p>
                  <SimpleBarChart
                    data={[12, 18, 14, 22, 19, 28, 24]}
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
                    className="font-semibold text-sm mb-4"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Table Status Now
                  </p>
                  <div className="space-y-3">
                    {([
                      ["available", available],
                      ["occupied", occupied],
                      ["reserved", reserved],
                      ["held", held],
                    ] as const).map(([status, count]) => {
                      const cfg = tableStatusConfig[status]
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: cfg.border }}
                            />
                            <span
                              className="text-xs font-medium"
                              style={{ color: "var(--color-stone)" }}
                            >
                              {cfg.label}
                            </span>
                          </div>
                          <span
                            className="text-sm font-bold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {count}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Upcoming reservations */}
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
                    Today&apos;s Reservations
                  </p>
                  <button
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary)" }}
                    onClick={() => setActiveTab("reservations")}
                  >
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: "var(--color-muted)" }}>
                        {[
                          "Guest",
                          "Time",
                          "Guests",
                          "Table",
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
                      {reservations.slice(0, 4).map((r) => {
                        const sc =
                          resStatusColors[r.status] || resStatusColors.confirmed
                        return (
                          <tr
                            key={r.id}
                            style={{
                              borderBottom: "1px solid var(--color-border)",
                            }}
                          >
                            <td
                              className="px-4 py-3 text-xs font-semibold"
                              style={{ color: "var(--color-ink)" }}
                            >
                              {r.guest}
                            </td>
                            <td
                              className="px-4 py-3 text-xs"
                              style={{ color: "var(--color-stone)" }}
                            >
                              {r.time}
                            </td>
                            <td
                              className="px-4 py-3 text-xs"
                              style={{ color: "var(--color-stone)" }}
                            >
                              👤 {r.guests}
                            </td>
                            <td
                              className="px-4 py-3 text-xs font-medium"
                              style={{ color: "var(--color-stone)" }}
                            >
                              {r.table}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                                style={{
                                  backgroundColor: sc.bg,
                                  color: sc.text,
                                }}
                              >
                                {r.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                className="text-xs font-semibold"
                                style={{ color: "var(--color-primary)" }}
                              >
                                Manage
                              </button>
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

          {/* TABLE LAYOUT */}
          {activeTab === "tables" && (
            <div>
              {/* Legend */}
              <div className="flex items-center gap-5 mb-6 flex-wrap">
                {(Object.entries(
                  tableStatusConfig,
                ) as [TableStatus, typeof tableStatusConfig[TableStatus]][]).map(
                  ([status, cfg]) => (
                    <div key={status} className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{
                          backgroundColor: cfg.bg,
                          border: `2px solid ${cfg.border}`,
                        }}
                      />
                      <span
                        className="text-xs font-medium"
                        style={{ color: "var(--color-stone)" }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  ),
                )}
                <p
                  className="text-xs ml-auto"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Click any table to cycle status
                </p>
              </div>

              {/* Summary row */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {([
                  ["available", available],
                  ["occupied", occupied],
                  ["reserved", reserved],
                  ["held", held],
                ] as const).map(([status, count]) => {
                  const cfg = tableStatusConfig[status]
                  return (
                    <div
                      key={status}
                      className="rounded-xl p-3 text-center"
                      style={{
                        backgroundColor: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                      }}
                    >
                      <p
                        className="font-bold text-xl"
                        style={{ color: cfg.text }}
                      >
                        {count}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: cfg.text }}
                      >
                        {cfg.label}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Floor plan */}
              <div
                className="rounded-2xl p-6 relative"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  minHeight: "520px",
                }}
              >
                <p
                  className="text-xs font-semibold mb-5"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  FLOOR PLAN — KALAM CUISINE HOUSE
                </p>

                {/* Restaurant layout sections */}
                <div className="space-y-8">
                  {/* Indoor section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="h-px flex-1"
                        style={{ backgroundColor: "var(--color-border)" }}
                      />
                      <span
                        className="text-xs font-semibold px-3"
                        style={{ color: "var(--color-muted-text)" }}
                      >
                        INDOOR
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{ backgroundColor: "var(--color-border)" }}
                      />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                      {tables.slice(0, 8).map((table) => {
                        const cfg = tableStatusConfig[table.status]
                        return (
                          <button
                            key={table.id}
                            onClick={() => {
                              cycleStatus(table)
                              setSelectedTable(table)
                            }}
                            className="rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: cfg.bg,
                              border: `2px solid ${cfg.border}`,
                            }}
                          >
                            <span
                              className="text-lg"
                              style={{ color: cfg.text }}
                            >
                              {cfg.icon}
                            </span>
                            <p
                              className="text-xs font-bold leading-tight"
                              style={{ color: cfg.text }}
                            >
                              T{table.number}
                            </p>
                            <p
                              className="text-xs leading-tight"
                              style={{ color: cfg.text }}
                            >
                              👤{table.seats}
                            </p>
                            {table.guest && (
                              <p
                                className="text-xs text-center leading-tight truncate w-full"
                                style={{ color: cfg.text, fontSize: "9px" }}
                              >
                                {table.guest}
                              </p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Terrace section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="h-px flex-1"
                        style={{ backgroundColor: "var(--color-border)" }}
                      />
                      <span
                        className="text-xs font-semibold px-3"
                        style={{ color: "var(--color-muted-text)" }}
                      >
                        OUTDOOR TERRACE
                      </span>
                      <div
                        className="h-px flex-1"
                        style={{ backgroundColor: "var(--color-border)" }}
                      />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {tables.slice(8).map((table) => {
                        const cfg = tableStatusConfig[table.status]
                        return (
                          <button
                            key={table.id}
                            onClick={() => {
                              cycleStatus(table)
                              setSelectedTable(table)
                            }}
                            className="rounded-xl p-3 flex flex-col items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: cfg.bg,
                              border: `2px solid ${cfg.border}`,
                            }}
                          >
                            <span
                              className="text-lg"
                              style={{ color: cfg.text }}
                            >
                              {cfg.icon}
                            </span>
                            <p
                              className="text-xs font-bold leading-tight"
                              style={{ color: cfg.text }}
                            >
                              T{table.number}
                            </p>
                            <p
                              className="text-xs leading-tight"
                              style={{ color: cfg.text }}
                            >
                              👤{table.seats}
                            </p>
                            {table.guest && (
                              <p
                                className="text-xs text-center leading-tight truncate w-full"
                                style={{ color: cfg.text, fontSize: "9px" }}
                              >
                                {table.guest}
                              </p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected table info */}
              {selectedTable && (
                <div
                  className="mt-4 rounded-2xl p-4 flex items-center justify-between"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Table {selectedTable.number} —{" "}
                      {tableStatusConfig[selectedTable.status].label}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {selectedTable.seats} seats
                      {selectedTable.guest ? ` · ${selectedTable.guest}` : ""}
                      {selectedTable.time ? ` · ${selectedTable.time}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-xs font-semibold px-3 py-2 rounded-xl text-white"
                      style={{ backgroundColor: "var(--color-primary)" }}
                    >
                      Assign Guest
                    </button>
                    <button
                      className="text-xs font-semibold px-3 py-2 rounded-xl"
                      style={{
                        border: "1px solid var(--color-border)",
                        color: "var(--color-stone)",
                      }}
                    >
                      Clear Table
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESERVATIONS */}
          {activeTab === "reservations" && (
            <div
              className="rounded-2xl overflow-hidden"
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
                  All Reservations
                </p>
                <button
                  className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  + Add Walk-in
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-muted)" }}>
                      {[
                        "ID",
                        "Guest",
                        "Date",
                        "Time",
                        "Guests",
                        "Table",
                        "Status",
                        "Actions",
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
                    {reservations.map((r) => {
                      const sc =
                        resStatusColors[r.status] || resStatusColors.confirmed
                      return (
                        <tr
                          key={r.id}
                          style={{
                            borderBottom: "1px solid var(--color-border)",
                          }}
                        >
                          <td
                            className="px-4 py-3 text-xs font-mono"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {r.id}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-semibold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {r.guest}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {r.date}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-medium"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {r.time}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            👤 {r.guests}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {r.table}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                              style={{ backgroundColor: sc.bg, color: sc.text }}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button
                                className="text-xs font-semibold px-2 py-1 rounded-lg"
                                style={{
                                  backgroundColor: "var(--color-primary-pale)",
                                  color: "var(--color-primary)",
                                }}
                              >
                                Seat
                              </button>
                              <button
                                className="text-xs font-semibold px-2 py-1 rounded-lg"
                                style={{
                                  border: "1px solid var(--color-border)",
                                  color: "var(--color-stone)",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MENU */}
          {activeTab === "menu" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-sm"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  {menuItems.length} items ·{" "}
                  {menuItems.filter((m) => m.available).length} available
                </p>
                <button
                  className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  + Add Item
                </button>
              </div>
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="rounded-2xl p-4 flex items-center justify-between gap-4"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "var(--color-ink)" }}
                      >
                        {item.name}
                      </h3>
                      {item.popular && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: "var(--color-accent-light)",
                            color: "var(--color-stone)",
                          }}
                        >
                          Popular
                        </span>
                      )}
                      {!item.available && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-semibold"
                          style={{
                            backgroundColor: "#fee2e2",
                            color: "#dc2626",
                          }}
                        >
                          Unavailable
                        </span>
                      )}
                    </div>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {item.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className="font-bold text-sm"
                      style={{ color: "var(--color-primary)" }}
                    >
                      PKR {item.price.toLocaleString()}
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div
                        className="w-9 h-5 rounded-full relative transition-colors"
                        style={{
                          backgroundColor: item.available
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                        }}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            item.available ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </label>
                    <button
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                      style={{
                        border: "1px solid var(--color-border)",
                        color: "var(--color-stone)",
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {(activeTab === "reviews" ||
            activeTab === "earnings" ||
            activeTab === "settings") && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-3xl mb-3">
                {activeTab === "reviews"
                  ? "⭐"
                  : activeTab === "earnings"
                    ? "💰"
                    : "⚙"}
              </p>
              <p
                className="font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {activeTab === "reviews"
                  ? "Guest Reviews"
                  : activeTab === "earnings"
                    ? "Earnings & Payouts"
                    : "Restaurant Settings"}
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
