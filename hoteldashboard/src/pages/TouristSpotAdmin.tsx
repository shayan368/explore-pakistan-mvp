import { useState } from "react"
import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }
type SidebarTab = "dashboard" | "info" | "hours" | "facilities" | "photos" | "visitors" | "reviews" | "settings"

const spotPhotos = [
  "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=400&h=280&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1662800291212-5d31184b861c?w=400&h=280&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1662297115734-12fdd59b383b?w=400&h=280&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1580712500528-6b7862f68f26?w=400&h=280&fit=crop&auto=format",
]

const visitorLog = [
  {
    id: "VIS-001",
    name: "Ahmed Hassan",
    date: "Sep 1, 2026",
    type: "Individual",
    paid: "PKR 100",
    status: "visited",
  },
  {
    id: "VIS-002",
    name: "Malik Family Group",
    date: "Sep 1, 2026",
    type: "Group (8)",
    paid: "PKR 800",
    status: "visited",
  },
  {
    id: "VIS-003",
    name: "Tariq & Sara",
    date: "Sep 1, 2026",
    type: "Couple",
    paid: "PKR 200",
    status: "visited",
  },
  {
    id: "VIS-004",
    name: "Lahore Trekking Club",
    date: "Sep 2, 2026",
    type: "Group (14)",
    paid: "PKR 1,400",
    status: "upcoming",
  },
]

const facilities = [
  { icon: "🚗", label: "Jeep Track Access", enabled: true },
  { icon: "⛵", label: "Boating", enabled: true },
  { icon: "🎣", label: "Fishing Permitted", enabled: true },
  { icon: "🏕", label: "Camping Area", enabled: true },
  { icon: "🧭", label: "Local Guides", enabled: true },
  { icon: "🅿", label: "Jeep Parking", enabled: true },
  { icon: "🚻", label: "Washrooms", enabled: false },
  { icon: "📶", label: "Mobile Coverage", enabled: false },
  { icon: "🛒", label: "Souvenir Shop", enabled: false },
  { icon: "🍽", label: "Food Stalls", enabled: true },
]

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

function SimpleBarChart({ data, color }: { data: number[] color: string }) {
  const max = Math.max(...data)
  const labels = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"]
  return (
    <div className="flex items-end gap-2 h-24 mt-3">
      {data.map((val, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div
            className="w-full rounded-t-md"
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

export default function TouristSpotAdmin({ navigate }: Props) {
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard")
  const [facilitiesState, setFacilitiesState] = useState(facilities)
  const [openStatus, setOpenStatus] = useState(true)
  const [entryFee, setEntryFee] = useState("100")
  const [photoList, setPhotoList] = useState(spotPhotos)
  const [hours, setHours] = useState<Record<string, {
    open: boolean
    from: string
    to: string
  }>>(
    Object.fromEntries(
      weekdays.map((d) => [
        d,
        { open: d !== "Tuesday", from: "07:00", to: "18:00" },
      ]),
    ),
  )

  const toggleFacility = (label: string) => {
    setFacilitiesState((prev) =>
      prev.map((f) => (f.label === label ? { ...f, enabled: !f.enabled } : f)),
    )
  }

  const sidebarItems: { id: SidebarTab label: string icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "◈" },
    { id: "info", label: "Spot Information", icon: "📍" },
    { id: "hours", label: "Opening Hours", icon: "🕒" },
    { id: "facilities", label: "Facilities", icon: "✓" },
    { id: "photos", label: "Photos", icon: "📷" },
    { id: "visitors", label: "Visitors", icon: "👤" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
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
          background: "linear-gradient(180deg, #0d2318 0%, #1a4731 100%)",
          minHeight: "100vh",
        }}
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
                Spot Provider Portal
              </p>
            </div>
          </button>
        </div>

        {/* Spot card */}
        <div
          className="mx-3 my-4 rounded-xl overflow-hidden"
          style={{ border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="relative h-24">
            <img
              src={spotPhotos[0]}
              alt="Mahodand Lake"
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            />
            <div className="absolute bottom-2 left-3 right-3">
              <p className="text-white text-xs font-semibold leading-tight">
                Mahodand Lake
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                Upper Swat
              </p>
            </div>
          </div>
          <div
            className="px-3 py-2 flex items-center justify-between"
            style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  openStatus ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {openStatus ? "Open" : "Closed"}
              </span>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(200,169,110,0.3)",
                color: "var(--color-accent)",
              }}
            >
              ★ 4.9
            </span>
          </div>
        </div>

        <nav className="px-3 space-y-0.5">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors"
              style={{
                backgroundColor:
                  activeTab === item.id
                    ? "rgba(255,255,255,0.12)"
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
          className="px-3 py-4 mt-4"
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
              Mahodand Lake · Sep 1, 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenStatus(!openStatus)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              style={{
                backgroundColor: openStatus ? "#dcfce7" : "#fee2e2",
                color: openStatus ? "#15803d" : "#dc2626",
              }}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  openStatus ? "bg-green-500" : "bg-red-500"
                } animate-pulse`}
              />
              {openStatus ? "Spot Open" : "Spot Closed"}
            </button>
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              M
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
                    label: "Visitors Today",
                    value: "124",
                    icon: "👤",
                    sub: "+34% vs yesterday",
                  },
                  {
                    label: "Avg. Daily Visitors",
                    value: "89",
                    icon: "📊",
                    sub: "Last 30 days",
                  },
                  {
                    label: "Today's Entry Fees",
                    value: "PKR 12,400",
                    icon: "💰",
                    sub: "124 × PKR 100",
                  },
                  {
                    label: "Rating",
                    value: "4.9 ★",
                    icon: "⭐",
                    sub: "(412 reviews)",
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
                    <div className="text-2xl mb-3">{s.icon}</div>
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
                    Monthly Visitors
                  </p>
                  <SimpleBarChart
                    data={[340, 580, 890, 1240, 1560, 980]}
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
                    Quick Status
                  </p>
                  <div className="space-y-3">
                    {[
                      {
                        label: "Spot Status",
                        value: openStatus
                          ? "Open to visitors"
                          : "Currently closed",
                        color: openStatus ? "#15803d" : "#dc2626",
                      },
                      {
                        label: "Entry Fee",
                        value: `PKR ${entryFee} / person`,
                        color: "var(--color-stone)",
                      },
                      {
                        label: "Peak Season",
                        value: "June – October",
                        color: "var(--color-stone)",
                      },
                      {
                        label: "Active Facilities",
                        value: `${facilitiesState.filter((f) => f.enabled).length} of ${facilitiesState.length}`,
                        color: "var(--color-stone)",
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between py-2"
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <span
                          className="text-xs"
                          style={{ color: "var(--color-muted-text)" }}
                        >
                          {item.label}
                        </span>
                        <span
                          className="text-xs font-semibold"
                          style={{ color: item.color }}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent visitors */}
              <div
                className="rounded-2xl"
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
                    Recent Visitors
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: "var(--color-muted)" }}>
                        {[
                          "ID",
                          "Name",
                          "Date",
                          "Type",
                          "Fees Paid",
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
                      {visitorLog.map((v) => (
                        <tr
                          key={v.id}
                          style={{
                            borderBottom: "1px solid var(--color-border)",
                          }}
                        >
                          <td
                            className="px-4 py-3 text-xs font-mono"
                            style={{ color: "var(--color-primary)" }}
                          >
                            {v.id}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-semibold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {v.name}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {v.date}
                          </td>
                          <td
                            className="px-4 py-3 text-xs"
                            style={{ color: "var(--color-stone)" }}
                          >
                            {v.type}
                          </td>
                          <td
                            className="px-4 py-3 text-xs font-semibold"
                            style={{ color: "var(--color-ink)" }}
                          >
                            {v.paid}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor:
                                  v.status === "visited"
                                    ? "#dcfce7"
                                    : "#dbeafe",
                                color:
                                  v.status === "visited"
                                    ? "#15803d"
                                    : "#1d4ed8",
                              }}
                            >
                              {v.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SPOT INFORMATION */}
          {activeTab === "info" && (
            <div className="space-y-5 max-w-2xl">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h2
                  className="font-semibold text-sm mb-4"
                  style={{ color: "var(--color-ink)" }}
                >
                  Basic Information
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      label: "Spot Name",
                      value: "Mahodand Lake",
                      type: "text",
                    },
                    {
                      label: "Location / Address",
                      value: "Upper Swat Valley, Kalam Road, KPK",
                      type: "text",
                    },
                    {
                      label: "Short Description",
                      value:
                        "A breathtaking glacial lake at 2,900m altitude in upper Swat Valley.",
                      type: "textarea",
                    },
                    {
                      label: "Entry Fee (PKR per person)",
                      value: entryFee,
                      type: "number",
                    },
                    { label: "Spot Type", value: "Alpine Lake", type: "text" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label
                        className="block text-xs font-semibold mb-1.5"
                        style={{ color: "var(--color-muted-text)" }}
                      >
                        {field.label}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea
                          defaultValue={field.value}
                          rows={3}
                          className="w-full text-sm px-4 py-3 rounded-xl outline-none resize-none"
                          style={{
                            border: "1px solid var(--color-border)",
                            color: "var(--color-ink)",
                            backgroundColor: "var(--color-canvas)",
                          }}
                        />
                      ) : (
                        <input
                          type={field.type}
                          defaultValue={field.value}
                          onChange={
                            field.label.includes("Fee")
                              ? (e) => setEntryFee(e.target.value)
                              : undefined
                          }
                          className="w-full text-sm px-4 py-3 rounded-xl outline-none"
                          style={{
                            border: "1px solid var(--color-border)",
                            color: "var(--color-ink)",
                            backgroundColor: "var(--color-canvas)",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <button
                    className="text-sm font-semibold px-6 py-3 rounded-xl text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h2
                  className="font-semibold text-sm mb-4"
                  style={{ color: "var(--color-ink)" }}
                >
                  Accessibility Information
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "Wheelchair Accessible", enabled: false },
                    { label: "Child Friendly", enabled: true },
                    { label: "Senior Friendly", enabled: false },
                    { label: "Requires Physical Fitness", enabled: true },
                    { label: "High Altitude Warning", enabled: true },
                  ].map((a) => (
                    <div
                      key={a.label}
                      className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: "1px solid var(--color-border)" }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-stone)" }}
                      >
                        {a.label}
                      </span>
                      <div
                        className="w-10 h-5 rounded-full relative transition-colors cursor-pointer"
                        style={{
                          backgroundColor: a.enabled
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                        }}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            a.enabled ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* OPENING HOURS */}
          {activeTab === "hours" && (
            <div className="max-w-lg">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h2
                    className="font-semibold text-sm"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Weekly Opening Hours
                  </h2>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: "var(--color-primary-pale)",
                      color: "var(--color-primary)",
                    }}
                  >
                    Apply to All
                  </button>
                </div>
                <div className="space-y-3">
                  {weekdays.map((day) => {
                    const dayHours = hours[day]
                    return (
                      <div
                        key={day}
                        className="flex items-center gap-3 py-2"
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <div
                          className="w-9 h-5 rounded-full relative transition-colors cursor-pointer shrink-0"
                          style={{
                            backgroundColor: dayHours.open
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                          }}
                          onClick={() =>
                            setHours((prev) => ({
                              ...prev,
                              [day]: { ...prev[day], open: !prev[day].open },
                            }))
                          }
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              dayHours.open
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </div>
                        <span
                          className="text-sm w-24 shrink-0 font-medium"
                          style={{
                            color: dayHours.open
                              ? "var(--color-ink)"
                              : "var(--color-muted-text)",
                          }}
                        >
                          {day}
                        </span>
                        {dayHours.open ? (
                          <div className="flex items-center gap-2 flex-1">
                            <input
                              type="time"
                              value={dayHours.from}
                              onChange={(e) =>
                                setHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], from: e.target.value },
                                }))
                              }
                              className="text-xs px-2 py-1.5 rounded-lg outline-none flex-1"
                              style={{
                                border: "1px solid var(--color-border)",
                                color: "var(--color-ink)",
                              }}
                            />
                            <span
                              className="text-xs"
                              style={{ color: "var(--color-muted-text)" }}
                            >
                              to
                            </span>
                            <input
                              type="time"
                              value={dayHours.to}
                              onChange={(e) =>
                                setHours((prev) => ({
                                  ...prev,
                                  [day]: { ...prev[day], to: e.target.value },
                                }))
                              }
                              className="text-xs px-2 py-1.5 rounded-lg outline-none flex-1"
                              style={{
                                border: "1px solid var(--color-border)",
                                color: "var(--color-ink)",
                              }}
                            />
                          </div>
                        ) : (
                          <span
                            className="text-xs flex-1"
                            style={{ color: "var(--color-muted-text)" }}
                          >
                            Closed
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
                <button
                  className="mt-5 text-sm font-semibold px-6 py-3 rounded-xl text-white w-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  Save Hours
                </button>
              </div>

              <div
                className="mt-4 rounded-2xl p-4"
                style={{
                  backgroundColor: "var(--color-accent-light)",
                  border: "1px solid var(--color-accent)",
                }}
              >
                <p
                  className="text-xs font-semibold mb-1"
                  style={{ color: "var(--color-stone)" }}
                >
                  Season Notice
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Mahodand Lake is typically only accessible May through October
                  due to snow. Hours shown above apply during open season.
                  Winter closure (Nov – Apr) can be set below.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div
                    className="w-9 h-5 rounded-full relative"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    <div className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white shadow" />
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--color-stone)" }}
                  >
                    Enable seasonal closure (Nov 1 – Apr 30)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* FACILITIES */}
          {activeTab === "facilities" && (
            <div className="max-w-2xl">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Facilities &amp; Amenities
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {facilitiesState.filter((f) => f.enabled).length} of{" "}
                      {facilitiesState.length} enabled
                    </p>
                  </div>
                  <button
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    Save Changes
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {facilitiesState.map((fac) => (
                    <div
                      key={fac.label}
                      className="flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-colors"
                      style={{
                        backgroundColor: fac.enabled
                          ? "var(--color-primary-pale)"
                          : "var(--color-muted)",
                        border: `1px solid ${
                          fac.enabled
                            ? "var(--color-primary)"
                            : "var(--color-border)"
                        }`,
                      }}
                      onClick={() => toggleFacility(fac.label)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{fac.icon}</span>
                        <span
                          className="text-xs font-semibold"
                          style={{
                            color: fac.enabled
                              ? "var(--color-primary)"
                              : "var(--color-muted-text)",
                          }}
                        >
                          {fac.label}
                        </span>
                      </div>
                      <div
                        className="w-9 h-5 rounded-full relative shrink-0 transition-colors"
                        style={{
                          backgroundColor: fac.enabled
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                        }}
                      >
                        <div
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            fac.enabled ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PHOTOS */}
          {activeTab === "photos" && (
            <div className="max-w-3xl">
              <div
                className="rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2
                      className="font-semibold text-sm"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Spot Photos
                    </h2>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      {photoList.length} photos · First photo is the cover image
                    </p>
                  </div>
                  <button
                    className="text-xs font-semibold px-4 py-2 rounded-xl text-white"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    + Upload Photos
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photoList.map((img, i) => (
                    <div
                      key={img}
                      className="relative group rounded-xl overflow-hidden"
                      style={{
                        aspectRatio: "4/3",
                        backgroundColor: "var(--color-muted)",
                      }}
                    >
                      <img
                        src={img}
                        alt={`Spot photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <button
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white"
                          style={{ color: "var(--color-ink)" }}
                        >
                          Set Cover
                        </button>
                        <button
                          onClick={() =>
                            setPhotoList((prev) =>
                              prev.filter((_, idx) => idx !== i),
                            )
                          }
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
                          style={{ backgroundColor: "var(--color-error)" }}
                        >
                          Remove
                        </button>
                      </div>
                      {i === 0 && (
                        <div className="absolute top-2 left-2">
                          <span
                            className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: "var(--color-primary)" }}
                          >
                            Cover
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    className="rounded-xl flex flex-col items-center justify-center gap-2 transition-colors hover:bg-gray-50"
                    style={{
                      aspectRatio: "4/3",
                      border: "2px dashed var(--color-border)",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <span
                      className="text-xs"
                      style={{ color: "var(--color-muted-text)" }}
                    >
                      Add Photo
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "visitors" && (
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
                  Visitor Log
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ backgroundColor: "var(--color-muted)" }}>
                      {[
                        "ID",
                        "Name / Group",
                        "Date",
                        "Type",
                        "Fees Collected",
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
                    {visitorLog.map((v) => (
                      <tr
                        key={v.id}
                        style={{
                          borderBottom: "1px solid var(--color-border)",
                        }}
                      >
                        <td
                          className="px-4 py-3 text-xs font-mono"
                          style={{ color: "var(--color-primary)" }}
                        >
                          {v.id}
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-semibold"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {v.name}
                        </td>
                        <td
                          className="px-4 py-3 text-xs"
                          style={{ color: "var(--color-stone)" }}
                        >
                          {v.date}
                        </td>
                        <td
                          className="px-4 py-3 text-xs"
                          style={{ color: "var(--color-stone)" }}
                        >
                          {v.type}
                        </td>
                        <td
                          className="px-4 py-3 text-xs font-semibold"
                          style={{ color: "var(--color-ink)" }}
                        >
                          {v.paid}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              backgroundColor:
                                v.status === "visited" ? "#dcfce7" : "#dbeafe",
                              color:
                                v.status === "visited" ? "#15803d" : "#1d4ed8",
                            }}
                          >
                            {v.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === "reviews" || activeTab === "settings") && (
            <div
              className="rounded-2xl p-10 text-center"
              style={{
                backgroundColor: "var(--color-surface)",
                border: "1px solid var(--color-border)",
              }}
            >
              <p className="text-3xl mb-3">
                {activeTab === "reviews" ? "⭐" : "⚙"}
              </p>
              <p
                className="font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {activeTab === "reviews" ? "Visitor Reviews" : "Spot Settings"}
              </p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                Full management available in the provider portal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
