import { useState, useRef, useEffect } from "react"
import { IconUser } from "./icons"

type Props = {
  adults: number
  children: number
  onChange: (adults: number, children: number) => void
}

export default function GuestSelector({ adults, children, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <label className="block text-xs font-bold mb-1 text-gray-500 uppercase tracking-wide">
        Guests
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-transparent text-sm outline-none font-semibold text-gray-900 pb-1 border-b border-transparent focus:border-emerald-500 transition-colors flex justify-between items-center"
      >
        <span>
          {adults} Adult{adults > 1 ? "s" : ""}
          {children > 0
            ? `, ${children} Child${children > 1 ? "ren" : ""}`
            : ""}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Adults</p>
                <p className="text-xs text-gray-500">Ages 13 or above</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onChange(Math.max(1, adults - 1), children)}
                  disabled={adults <= 1}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-4 text-center font-semibold">{adults}</span>
                <button
                  type="button"
                  onClick={() => onChange(adults + 1, children)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Children</p>
                <p className="text-xs text-gray-500">Ages 0-12</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onChange(adults, Math.max(0, children - 1))}
                  disabled={children <= 0}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="w-4 text-center font-semibold">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => onChange(adults, children + 1)}
                  className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-emerald-700 font-bold">
            <IconUser />
            {adults + children} guest{adults + children > 1 ? "s" : ""}
          </div>
        </div>
      )}
    </div>
  )
}
