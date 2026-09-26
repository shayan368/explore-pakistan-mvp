import { useState, useEffect } from "react"
import type { NavigateFn, Page } from "../types"
import { useAuth } from "../context/AuthContext"
import RegistrationModal from "./auth/RegistrationModal"

type Props = { navigate: NavigateFn; currentPage: Page }

export default function Navbar({ navigate, currentPage }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">("login")
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const navLinks: { label: string page: Page }[] = [
    { label: "Explore", page: "home" },
    { label: "Hotels", page: "search-hotels" },
    { label: "Restaurants", page: "search-restaurants" },
    { label: "Tourist Spots", page: "search-spots" },
  ]

  const isActive = (p: Page) => currentPage === p

  return (
    <>
      <nav
        className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(255,255,255,0.96)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate("home")}
            className="flex items-center gap-2.5 shrink-0"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--color-primary)" }}
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
            <span
              className="font-display font-semibold text-base tracking-tight"
              style={{ color: "var(--color-primary)" }}
            >
              Explore Pakistan
            </span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => navigate(page, { resetSearch: true })}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: isActive(page)
                    ? "var(--color-primary)"
                    : "var(--color-stone)",
                  backgroundColor: isActive(page)
                    ? "var(--color-primary-pale)"
                    : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <button
                  onClick={() => {
                    setAuthModalMode("register")
                    setShowAuthModal(true)
                  }}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-gray-100"
                  style={{ color: "var(--color-ink)" }}
                >
                  Register
                </button>
                <button
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  onClick={() => {
                    setAuthModalMode("login")
                    setShowAuthModal(true)
                  }}
                >
                  Sign In
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm bg-emerald-600 hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  {user.avatarInitials}
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-bold text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <button onClick={() => { navigate("my-profile"); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Profile</button>
                        <button onClick={() => { navigate("my-trips"); setDropdownOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">My Trips</button>
                      </div>
                      <div className="border-t border-gray-100 py-1">
                        <button 
                          onClick={() => {
                            logout()
                            setDropdownOpen(false)
                          }} 
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden py-3 border-t"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(({ label, page }) => (
                <button
                  key={page}
                  onClick={() => {
                    navigate(page, { resetSearch: true })
                    setMenuOpen(false)
                  }}
                  className="text-left px-4 py-2.5 rounded-lg text-sm font-medium"
                  style={{ color: "var(--color-stone)" }}
                >
                  {label}
                </button>
              ))}
                {!user ? (
                  <>
                    <button
                      onClick={() => {
                        setAuthModalMode("register")
                        setShowAuthModal(true)
                        setMenuOpen(false)
                      }}
                      className="text-left px-4 py-2.5 rounded-lg text-sm font-medium"
                      style={{ color: "var(--color-stone)" }}
                    >
                      Register
                    </button>
                    <div
                      className="pt-2 mt-1 border-t"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <button
                        onClick={() => {
                          setAuthModalMode("login")
                          setShowAuthModal(true)
                          setMenuOpen(false)
                        }}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        Sign In
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate("my-trips")
                        setMenuOpen(false)
                      }}
                      className="text-left px-4 py-2.5 rounded-lg text-sm font-medium"
                      style={{ color: "var(--color-stone)" }}
                    >
                      My Trips
                    </button>
                    <button
                      onClick={() => {
                        navigate("my-profile")
                        setMenuOpen(false)
                      }}
                      className="text-left px-4 py-2.5 rounded-lg text-sm font-medium"
                      style={{ color: "var(--color-stone)" }}
                    >
                      My Profile
                    </button>
                    <div
                      className="pt-2 mt-1 border-t"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <button
                        onClick={() => {
                          logout()
                          setMenuOpen(false)
                        }}
                        className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <RegistrationModal 
        isOpen={showAuthModal}
        initialMode={authModalMode}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
        }}
      />
    </>
  )
}
