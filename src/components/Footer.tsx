import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }

export default function Footer({ navigate }: Props) {
  return (
    <footer
      style={{ backgroundColor: "var(--color-ink)" }}
      className="text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <span className="font-display font-semibold text-base">
                Explore Pakistan
              </span>
            </div>
            <p
              className="text-sm leading-relaxed"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              Discover the beauty of Khyber Pakhtunkhwa. Hotels, restaurants,
              and unforgettable places — all in one platform.
            </p>
            <div className="flex gap-3 mt-5">
              {["facebook", "instagram", "twitter"].map((social) => (
                <div
                  key={social}
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                >
                  <span className="text-xs font-bold text-white/70">
                    {social[0].toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Explore</h4>
            <div className="flex flex-col gap-2.5">
              {[
                "Swat Valley",
                "Kalam",
                "Chitral",
                "Peshawar",
                "Nathiagali",
                "Malam Jabba",
              ].map((d) => (
                <button
                  key={d}
                  onClick={() => navigate("search-hotels")}
                  className="text-left text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm mb-4">Services</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Hotels", page: "search-hotels" as const },
                { label: "Restaurants", page: "search-restaurants" as const },
                { label: "Tourist Spots", page: "search-spots" as const },
                { label: "My Trips", page: "my-trips" as const },
              ].map(({ label, page }) => (
                <button
                  key={label}
                  onClick={() => navigate(page)}
                  className="text-left text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* For Providers */}
          <div>
            <h4 className="font-semibold text-sm mb-4">For Providers</h4>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Hotel Dashboard", page: "hotel-dashboard" as const },
                {
                  label: "Restaurant Dashboard",
                  page: "restaurant-dashboard" as const,
                },
                {
                  label: "Tourist Spot Admin",
                  page: "tourist-spot-admin" as const,
                },
                { label: "Super Admin", page: "super-admin" as const },
              ].map(({ label, page }) => (
                <button
                  key={label}
                  onClick={() => navigate(page)}
                  className="text-left text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {label}
                </button>
              ))}
              {[
                "List Your Hotel",
                "List Your Restaurant",
                "Register a Tourist Spot",
              ].map((item) => (
                <button
                  key={item}
                  className="text-left text-sm hover:text-white transition-colors"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            &copy; 2026 Explore Pakistan. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Support"].map((item) => (
              <button
                key={item}
                className="text-xs hover:text-white transition-colors"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
