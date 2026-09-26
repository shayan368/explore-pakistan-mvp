import { useState } from "react"
import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }
type Tab = "dashboard" | "providers" | "bookings" | "disputes" | "settings"

const pendingProviders = [
  {
    id: "PRV-001",
    name: "Malam Jabba Lodge",
    type: "Hotel",
    location: "Malam Jabba, Swat",
    submitted: "Aug 28, 2026",
    status: "under_review",
    docs: 3,
  },
  {
    id: "PRV-002",
    name: "Chitral Riverside Restaurant",
    type: "Restaurant",
    location: "Chitral City",
    submitted: "Aug 30, 2026",
    status: "pending",
    docs: 2,
  },
  {
    id: "PRV-003",
    name: "Naran Valley Lodge",
    type: "Hotel",
    location: "Naran, KPK",
    submitted: "Sep 1, 2026",
    status: "pending",
    docs: 4,
  },
]

const allBookings = [
  {
    id: "EP-2026-78341",
    customer: "Ahmed Hassan",
    provider: "Swat Serena Lodge",
    type: "Hotel",
    date: "Sep 15",
    amount: 29580,
    status: "confirmed",
  },
  {
    id: "EP-2026-79102",
    customer: "Sara Malik",
    provider: "Kalam Cuisine House",
    type: "Restaurant",
    date: "Sep 20",
    amount: 0,
    status: "pending",
  },
  {
    id: "EP-2026-77891",
    customer: "Usman Tariq",
    provider: "Chitral Mountain View",
    type: "Hotel",
    date: "Sep 1",
    amount: 36000,
    status: "active",
  },
  {
    id: "EP-2026-74521",
    customer: "Bilal Ahmed",
    provider: "Malam Jabba Resort",
    type: "Hotel",
    date: "Aug 25",
    amount: 24000,
    status: "cancelled",
  },
  {
    id: "EP-2026-71230",
    customer: "Fatima Khan",
    provider: "Peshawar Chapli House",
    type: "Restaurant",
    date: "Aug 10",
    amount: 0,
    status: "completed",
  },
]

const disputes = [
  {
    id: "DIS-001",
    issue: "Room not as described",
    customer: "Ahmed Hassan",
    provider: "Kalam Continental",
    booking: "EP-2026-71234",
    date: "Aug 15, 2026",
    priority: "high",
    status: "open",
  },
  {
    id: "DIS-002",
    issue: "Refund not received",
    customer: "Sara Malik",
    provider: "Malam Jabba Resort",
    booking: "EP-2026-74521",
    date: "Aug 30, 2026",
    priority: "medium",
    status: "in_review",
  },
  {
    id: "DIS-003",
    issue: "Restaurant was closed on reservation time",
    customer: "Bilal Ahmed",
    provider: "Riverside Sajji Grill",
    booking: "EP-2026-72341",
    date: "Sep 1, 2026",
    priority: "low",
    status: "resolved",
  },
]

const providerStatusColors: Record<string, { bg: string text: string }> = {
  pending: { bg: "#fef3c7", text: "#d97706" },
  under_review: { bg: "#dbeafe", text: "#1d4ed8" },
  verified: { bg: "#dcfce7", text: "#15803d" },
  rejected: { bg: "#fee2e2", text: "#dc2626" },
}

const bookingStatusColors: Record<string, { bg: string text: string }> = {
  confirmed: { bg: "#dcfce7", text: "#15803d" },
  active: { bg: "#dbeafe", text: "#1d4ed8" },
  completed: { bg: "#f3f4f6", text: "#6b7280" },
  cancelled: { bg: "#fee2e2", text: "#dc2626" },
  pending: { bg: "#fef3c7", text: "#d97706" },
}

const disputePriorityColors: Record<string, { bg: string text: string }> = {
  high: { bg: "#fee2e2", text: "#dc2626" },
  medium: { bg: "#fef3c7", text: "#d97706" },
  low: { bg: "#dcfce7", text: "#15803d" },
}

function StatCard({
  label,
  value,
  icon,
  change,
}: {
  label: string
  value: string
  icon: string
  change?: string
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
        <span className="text-2xl">{icon}</span>
        {change && (
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-success)" }}
          >
            {change}
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
  const labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
  return (
    <div className="flex items-end gap-2 h-28 mt-4">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-lg"
            style={{
              height: `${(val / max) * 90}px`,
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

export default function SuperAdmin({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [verifyModal, setVerifyModal] = useState<string | null>(null)

  const sidebarItems: { id: Tab label: string icon: string badge?: number }[] =
    [
      { id: "dashboard", label: "Dashboard", icon: "◈" },
      { id: "providers", label: "Providers", icon: "🏢", badge: 3 },
      { id: "bookings", label: "Bookings", icon: "📋" },
      { id: "disputes", label: "Disputes", icon: "⚠", badge: 2 },
      { id: "settings", label: "Settings", icon: "⚙" },
    ]

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0"
        style={{
          background: "linear-gradient(180deg, #0f2a1d 0%, #1a4731 100%)",
          minHeight: "100vh",
        }}
      >
        <div
          className="px-5 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
              style={{ backgroundColor: "var(--color-accent)", color: "white" }}
            >
              A
            </div>
            <div>
              <p className="text-white font-semibold text-xs leading-tight">
                Explore Pakistan
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                Super Admin
              </p>
            </div>
          </div>
        </div>

        <div
          className="px-5 py-4"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white mb-2"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            S
          </div>
          <p className="text-white text-xs font-semibold">Super Admin</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            admin@explorepakistan.pk
          </p>
        </div>

        <nav className="px-3 py-4 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{
                backgroundColor:
                  activeTab === item.id
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                color:
                  activeTab === item.id ? "white" : "rgba(255,255,255,0.5)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
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
          className="px-3 mt-4"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "16px",
          }}
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
            Exit Admin
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
              Explore Pakistan Platform · Sep 1, 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                Platform Health
              </p>
              <p className="text-xs text-green-600 font-medium">
                All systems operational
              </p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </header>

        <div className="p-6">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Total Users"
                  value="12,847"
                  icon="👤"
                  change="+234 this week"
                />
                <StatCard
                  label="Active Providers"
                  value="386"
                  icon="🏢"
                  change="+12 this month"
                />
                <StatCard
                  label="Total Bookings"
                  value="8,291"
                  icon="📋"
                  change="+18% vs last month"
                />
                <StatCard
                  label="Platform Revenue"
                  value="PKR 48.2M"
                  icon="💰"
                  change="+22% YoY"
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Hotels Listed" value="218" icon="🏨" />
                <StatCard label="Restaurants" value="94" icon="🍽" />
                <StatCard label="Tourist Spots" value="74" icon="📍" />
                <StatCard
                  label="Pending Verification"
                  value="3"
                  icon="⏳"
                  change="Needs action"
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
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Monthly Bookings
                  </p>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    Apr – Sep 2026
                  </p>
                  <SimpleBarChart
                    data={[620, 890, 1100, 1340, 1520, 1740]}
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
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Revenue (PKR M)
                  </p>
                  <p
                    className="text-xs mb-2"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    Apr – Sep 2026
                  </p>
                  <SimpleBarChart
                    data={[4.2, 6.1, 7.8, 9.5, 10.8, 9.8]}
                    color="var(--color-accent)"
                  />
                </div>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Pending Provider Verifications
                  </p>
                  <button
                    onClick={() => setActiveTab("providers")}
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    View all
                  </button>
                </div>
                {pendingProviders.map((p) => {
                  const sc = providerStatusColors[p.status]
                  return (
                    <div
                      key={p.id}
                      className="flex items-center justify-between gap-4 py-3"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          {p.name[0]}
                        </div>
                        <div>
                          <p
                            className="text-xs font-semibold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {p.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: "var(--color-muted-text)" }}
                          >
                            {p.type} · {p.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text }}
                        >
                          {p.status.replace("_", " ")}
                        </span>
                        <button
                          onClick={() => setVerifyModal(p.id)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* PROVIDERS */}
          {activeTab === "providers" && (
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
                  Provider Verification Queue
                </p>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: "#fef3c7", color: "#d97706" }}
                >
                  3 pending
                </span>
              </div>
              <div
                className="divide-y"
                style={{ borderColor: "var(--color-border)" }}
              >
                {pendingProviders.map((p) => {
                  const sc = providerStatusColors[p.status]
                  return (
                    <div key={p.id} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
                            style={{ backgroundColor: "var(--color-primary)" }}
                          >
                            {p.name[0]}
                          </div>
                          <div>
                            <p
                              className="font-semibold text-sm"
                              style={{ color: "var(--color-ink)" }}
                            >
                              {p.name}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: "var(--color-muted-text)" }}
                            >
                              {p.type} · {p.location}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "var(--color-stone)" }}
                            >
                              Submitted: {p.submitted} · {p.docs} documents
                            </p>
                            <div className="flex gap-2 mt-2">
                              {[
                                "Pending",
                                "Under Review",
                                "Verified",
                                "Rejected",
                              ].map((stage, i) => {
                                const curr =
                                  p.status === "pending"
                                    ? 0
                                    : p.status === "under_review"
                                      ? 1
                                      : p.status === "verified"
                                        ? 2
                                        : 3
                                return (
                                  <div
                                    key={stage}
                                    className="flex items-center gap-1"
                                  >
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor:
                                          i <= curr
                                            ? "var(--color-primary)"
                                            : "var(--color-border)",
                                      }}
                                    />
                                    <span
                                      className="text-xs"
                                      style={{
                                        color:
                                          i <= curr
                                            ? "var(--color-primary)"
                                            : "var(--color-muted-text)",
                                      }}
                                    >
                                      {stage}
                                    </span>
                                    {i < 3 && (
                                      <div
                                        className="w-4 h-0.5"
                                        style={{
                                          backgroundColor:
                                            i < curr
                                              ? "var(--color-primary)"
                                              : "var(--color-border)",
                                        }}
                                      />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full text-center"
                            style={{ backgroundColor: sc.bg, color: sc.text }}
                          >
                            {p.status.replace("_", " ")}
                          </span>
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                            style={{ backgroundColor: "var(--color-primary)" }}
                          >
                            Verify
                          </button>
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-xl"
                            style={{
                              border: "1px solid var(--color-error)",
                              color: "var(--color-error)",
                            }}
                          >
                            Reject
                          </button>
                          <button
                            className="text-xs font-semibold px-4 py-2 rounded-xl"
                            style={{
                              border: "1px solid var(--color-border)",
                              color: "var(--color-stone)",
                            }}
                          >
                            Request Info
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BOOKINGS */}
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
                  All Platform Bookings
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-muted)" }}>
                      {[
                        "Booking ID",
                        "Customer",
                        "Provider",
                        "Type",
                        "Date",
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
                    {allBookings.map((b) => {
                      const sc =
                        bookingStatusColors[b.status] ||
                        bookingStatusColors.confirmed
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
                            {b.customer}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {b.provider}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs px-2 py-0.5 rounded-full font-medium"
                              style={{
                                backgroundColor: "var(--color-primary-pale)",
                                color: "var(--color-primary)",
                              }}
                            >
                              {b.type}
                            </span>
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {b.date}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-semibold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {b.amount > 0
                              ? `PKR ${b.amount.toLocaleString()}`
                              : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                              style={{ backgroundColor: sc.bg, color: sc.text }}
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
          )}

          {/* DISPUTES */}
          {activeTab === "disputes" && (
            <div className="space-y-4">
              {disputes.map((d) => {
                const pc = disputePriorityColors[d.priority]
                const sc =
                  bookingStatusColors[
                    d.status === "open"
                      ? "pending"
                      : d.status === "in_review"
                        ? "active"
                        : "completed"
                  ] || bookingStatusColors.pending
                return (
                  <div
                    key={d.id}
                    className="rounded-2xl p-5"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      border: `1px solid ${
                        d.priority === "high"
                          ? "var(--color-error)"
                          : "var(--color-border)"
                      }`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs font-bold"
                            style={{ color: "var(--color-muted-text)" }}
                          >
                            {d.id}
                          </span>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: pc.bg, color: pc.text }}
                          >
                            {d.priority} priority
                          </span>
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: sc.bg, color: sc.text }}
                          >
                            {d.status.replace("_", " ")}
                          </span>
                        </div>
                        <h3
                          className="font-semibold text-sm mb-1"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {d.issue}
                        </h3>
                        <div
                          className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs"
                          style={{ color: "var(--color-stone)" }}
                        >
                          <span>
                            Customer:{" "}
                            <strong style={{ color: "var(--color-ink)" }}>
                              {d.customer}
                            </strong>
                          </span>
                          <span>
                            Provider:{" "}
                            <strong style={{ color: "var(--color-ink)" }}>
                              {d.provider}
                            </strong>
                          </span>
                          <span>
                            Booking:{" "}
                            <strong style={{ color: "var(--color-primary)" }}>
                              {d.booking}
                            </strong>
                          </span>
                          <span>
                            Filed:{" "}
                            <strong style={{ color: "var(--color-ink)" }}>
                              {d.date}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        Review Case
                      </button>
                      <button
                        className="text-xs font-semibold px-4 py-2 rounded-xl"
                        style={{
                          border: "1px solid var(--color-border)",
                          color: "var(--color-stone)",
                        }}
                      >
                        Contact Customer
                      </button>
                      <button
                        className="text-xs font-semibold px-4 py-2 rounded-xl"
                        style={{
                          border: "1px solid var(--color-border)",
                          color: "var(--color-stone)",
                        }}
                      >
                        Contact Provider
                      </button>
                      {d.status !== "resolved" && (
                        <button
                          className="text-xs font-semibold px-4 py-2 rounded-xl"
                          style={{
                            backgroundColor: "var(--color-success)",
                            color: "white",
                          }}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "settings" && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-3xl mb-3">⚙</p>
              <p
                className="font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                Platform Settings
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                Global configuration, payment gateway, and notification
                settings.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Verify modal */}
      {verifyModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-md"
            style={{ backgroundColor: "var(--color-surface)" }}
          >
            <h3
              className="font-semibold text-base mb-2"
              style={{ color: "var(--color-ink)" }}
            >
              Review Provider
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "var(--color-muted-text)" }}
            >
              {pendingProviders.find((p) => p.id === verifyModal)?.name} —{" "}
              {pendingProviders.find((p) => p.id === verifyModal)?.type}
            </p>
            <div className="space-y-2 mb-5">
              {[
                "Business Registration Certificate",
                "CNIC / ID Document",
                "Property / Location Proof",
              ].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: "var(--color-muted)" }}
                >
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-ink)" }}
                  >
                    {doc}
                  </span>
                  <button
                    className="text-xs font-semibold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setVerifyModal(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Verify Provider
              </button>
              <button
                onClick={() => setVerifyModal(null)}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  border: "1px solid var(--color-error)",
                  color: "var(--color-error)",
                }}
              >
                Reject
              </button>
              <button
                onClick={() => setVerifyModal(null)}
                className="px-4 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-stone)",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
