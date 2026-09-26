import { useState, useEffect } from "react"
import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }

type Step = 1 | 2 | 3 | 4

const HOLD_SECONDS = 582 // ~9:42

function formatTime(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${String(sec).padStart(2, "0")}`
}

function StepIndicator({ step }: { step: Step }) {
  const steps = ["Select", "Review", "Payment", "Confirmed"]
  return (
    <div className="flex items-center gap-0 w-full max-w-lg mx-auto mb-10">
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < step
        const active = num === step
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors"
                style={{
                  backgroundColor:
                    done || active
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                  color: done || active ? "white" : "var(--color-muted-text)",
                }}
              >
                {done ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  color: active
                    ? "var(--color-primary)"
                    : "var(--color-muted-text)",
                }}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-1 mb-5"
                style={{
                  backgroundColor: done
                    ? "var(--color-primary)"
                    : "var(--color-border)",
                }}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

function InventoryTimer({
  seconds,
  onExpire,
}: {
  seconds: number
  onExpire: () => void
}) {
  const pct = (seconds / HOLD_SECONDS) * 100
  const color =
    seconds < 120
      ? "var(--color-error)"
      : seconds < 300
        ? "var(--color-warning)"
        : "var(--color-primary)"

  return (
    <div
      className="rounded-2xl p-5 mb-6"
      style={{
        border: `2px solid ${
          seconds < 120 ? "var(--color-error)" : "var(--color-border)"
        }`,
        backgroundColor:
          seconds < 120 ? "#fef2f2" : "var(--color-primary-pale)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: color }}
          />
          <p
            className="text-xs font-semibold"
            style={{
              color:
                seconds < 120 ? "var(--color-error)" : "var(--color-primary)",
            }}
          >
            {seconds > 0
              ? "Your selection is temporarily held"
              : "Hold expired"}
          </p>
        </div>
        <span
          className="font-bold text-lg font-mono tabular-nums"
          style={{ color }}
        >
          {formatTime(seconds)}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full"
        style={{ backgroundColor: "var(--color-border)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      {seconds === 0 && (
        <div className="mt-3 flex items-center justify-between">
          <p
            className="text-xs font-medium"
            style={{ color: "var(--color-error)" }}
          >
            Your reservation hold has expired.
          </p>
          <button
            onClick={onExpire}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            Check Availability Again
          </button>
        </div>
      )}
    </div>
  )
}

function Step1({ onNext }: { onNext: () => void }) {
  return (
    <div>
      <h2
        className="font-display font-semibold text-2xl mb-2"
        style={{ color: "var(--color-ink)" }}
      >
        Select Your Room
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted-text)" }}>
        Choose your preferred room type and dates.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div
          className="rounded-xl p-4"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            Check-in Date
          </label>
          <input
            type="date"
            defaultValue="2026-09-15"
            className="w-full text-sm font-medium outline-none bg-transparent"
            style={{ color: "var(--color-ink)" }}
          />
        </div>
        <div
          className="rounded-xl p-4"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            Check-out Date
          </label>
          <input
            type="date"
            defaultValue="2026-09-18"
            className="w-full text-sm font-medium outline-none bg-transparent"
            style={{ color: "var(--color-ink)" }}
          />
        </div>
      </div>

      {[
        {
          name: "Standard Room",
          beds: "Twin beds",
          guests: 2,
          price: 6200,
          available: 5,
        },
        {
          name: "Deluxe Mountain View",
          beds: "King bed",
          guests: 2,
          price: 8500,
          available: 2,
        },
      ].map((r, i) => (
        <div
          key={r.name}
          className={`rounded-xl p-4 mb-3 cursor-pointer transition-all ${
            i === 0 ? "ring-2" : ""
          }`}
          style={{
            border:
              i === 0
                ? "2px solid var(--color-primary)"
                : "1px solid var(--color-border)",
            backgroundColor:
              i === 0 ? "var(--color-primary-pale)" : "var(--color-surface)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {i === 0 && (
                  <div
                    className="w-4 h-4 rounded-full border-4 border-white flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--color-primary)",
                      outline: "2px solid var(--color-primary)",
                    }}
                  />
                )}
                {i !== 0 && (
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                )}
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  {r.name}
                </h3>
                <span
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "#dcfce7", color: "#15803d" }}
                >
                  {r.available} rooms left
                </span>
              </div>
              <p
                className="text-xs ml-6"
                style={{ color: "var(--color-muted-text)" }}
              >
                🛏 {r.beds} · 👤 Up to {r.guests} guests
              </p>
            </div>
            <div className="text-right">
              <p
                className="font-bold"
                style={{ color: "var(--color-primary)" }}
              >
                PKR {r.price.toLocaleString()}
              </p>
              <p
                className="text-xs"
                style={{ color: "var(--color-muted-text)" }}
              >
                per night
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 mt-2"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Continue to Review →
      </button>
    </div>
  )
}

function Step2({
  onNext,
  holdSeconds,
}: {
  onNext: () => void
  holdSeconds: number
}) {
  return (
    <div>
      <h2
        className="font-display font-semibold text-2xl mb-2"
        style={{ color: "var(--color-ink)" }}
      >
        Review Your Booking
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted-text)" }}>
        Please review all details before proceeding to payment.
      </p>

      <InventoryTimer seconds={holdSeconds} onExpire={() => {}} />

      <div
        className="rounded-2xl overflow-hidden mb-5"
        style={{ border: "1px solid var(--color-border)" }}
      >
        <div
          className="flex items-center gap-4 p-4"
          style={{
            backgroundColor: "var(--color-surface)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-20 h-16 rounded-xl overflow-hidden shrink-0"
            style={{ backgroundColor: "var(--color-muted)" }}
          >
            <img
              src="https://images.unsplash.com/photo-1706736231891-e61819a17d1d?w=200&h=150&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: "var(--color-ink)" }}
            >
              Swat Serena Lodge
            </p>
            <p className="text-xs" style={{ color: "var(--color-muted-text)" }}>
              Mingora, Swat · Deluxe Mountain View
            </p>
            <p
              className="text-xs font-semibold mt-1"
              style={{ color: "var(--color-primary)" }}
            >
              ✓ Verified Hotel
            </p>
          </div>
        </div>

        {[
          ["Check-in", "Sep 15, 2026 (Mon)"],
          ["Check-out", "Sep 18, 2026 (Thu)"],
          ["Duration", "3 nights"],
          ["Room Type", "Deluxe Mountain View"],
          ["Guests", "2 Adults"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between px-4 py-3"
            style={{
              borderBottom: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--color-muted-text)" }}
            >
              {label}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              {value}
            </span>
          </div>
        ))}

        <div
          className="px-4 py-4"
          style={{ backgroundColor: "var(--color-muted)" }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-xs" style={{ color: "var(--color-stone)" }}>
              PKR 8,500 × 3 nights
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-ink)" }}
            >
              PKR 25,500
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-xs" style={{ color: "var(--color-stone)" }}>
              Taxes &amp; fees (16%)
            </span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-ink)" }}
            >
              PKR 4,080
            </span>
          </div>
          <div
            className="flex justify-between pt-2"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-ink)" }}
            >
              Total
            </span>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--color-primary)" }}
            >
              PKR 29,580
            </span>
          </div>
        </div>
      </div>

      <p className="text-xs mb-4" style={{ color: "var(--color-muted-text)" }}>
        ✓ Free cancellation before Sep 14, 2026 &nbsp;·&nbsp; ✓ No hidden fees
      </p>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        Proceed to Payment →
      </button>
    </div>
  )
}

function Step3({ onNext }: { onNext: () => void }) {
  const [method, setMethod] = useState<"card" | "easypaisa" | "jazzcash">(
    "card",
  )

  return (
    <div>
      <h2
        className="font-display font-semibold text-2xl mb-2"
        style={{ color: "var(--color-ink)" }}
      >
        Secure Payment
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--color-muted-text)" }}>
        Your payment is protected by 256-bit SSL encryption.
      </p>

      {/* Payment methods */}
      <div className="flex gap-2 mb-6">
        {([
          { id: "card", label: "Credit / Debit Card" },
          { id: "easypaisa", label: "Easypaisa" },
          { id: "jazzcash", label: "JazzCash" },
        ] as const).map((m) => (
          <button
            key={m.id}
            onClick={() => setMethod(m.id)}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-colors"
            style={{
              backgroundColor:
                method === m.id ? "var(--color-primary)" : "var(--color-muted)",
              color: method === m.id ? "white" : "var(--color-stone)",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {method === "card" && (
        <div className="space-y-3 mb-6">
          <div
            className="rounded-xl p-4"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: "var(--color-muted-text)" }}
            >
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="Ahmed Ali Khan"
              className="w-full text-sm outline-none bg-transparent"
              style={{ color: "var(--color-ink)" }}
            />
          </div>
          <div
            className="rounded-xl p-4"
            style={{
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: "var(--color-muted-text)" }}
            >
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full text-sm outline-none bg-transparent font-mono"
              style={{ color: "var(--color-ink)" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: "var(--color-muted-text)" }}
              >
                Expiry
              </label>
              <input
                type="text"
                placeholder="MM / YY"
                className="w-full text-sm outline-none bg-transparent font-mono"
                style={{ color: "var(--color-ink)" }}
              />
            </div>
            <div
              className="rounded-xl p-4"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <label
                className="block text-xs font-semibold mb-2"
                style={{ color: "var(--color-muted-text)" }}
              >
                CVV
              </label>
              <input
                type="text"
                placeholder="•••"
                className="w-full text-sm outline-none bg-transparent font-mono"
                style={{ color: "var(--color-ink)" }}
              />
            </div>
          </div>
        </div>
      )}

      {(method === "easypaisa" || method === "jazzcash") && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
        >
          <label
            className="block text-xs font-semibold mb-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="+92 300 0000000"
            className="w-full text-sm outline-none bg-transparent"
            style={{ color: "var(--color-ink)" }}
          />
          <p
            className="text-xs mt-2"
            style={{ color: "var(--color-muted-text)" }}
          >
            You will receive a confirmation PIN on this number.
          </p>
        </div>
      )}

      <div
        className="rounded-xl p-4 mb-6 flex items-center justify-between"
        style={{ backgroundColor: "var(--color-muted)" }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--color-ink)" }}
        >
          Total Amount
        </span>
        <span
          className="font-bold text-xl"
          style={{ color: "var(--color-primary)" }}
        >
          PKR 29,580
        </span>
      </div>

      <button
        onClick={onNext}
        className="w-full py-3.5 rounded-xl font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        Pay PKR 29,580 Securely
      </button>
    </div>
  )
}

function Step4({ navigate }: { navigate: NavigateFn }) {
  return (
    <div className="text-center py-6">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "var(--color-primary-pale)" }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ color: "var(--color-primary)" }}
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h2
        className="font-display font-semibold text-3xl mb-2"
        style={{ color: "var(--color-ink)" }}
      >
        Booking Confirmed!
      </h2>
      <p
        className="text-base mb-8"
        style={{ color: "var(--color-muted-text)" }}
      >
        Your reservation has been successfully placed.
      </p>

      <div
        className="rounded-2xl p-6 text-left mb-8"
        style={{
          backgroundColor: "var(--color-surface)",
          border: "1px solid var(--color-border)",
        }}
      >
        <div
          className="flex items-center justify-between mb-4 pb-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--color-muted-text)" }}
          >
            Booking Reference
          </span>
          <span
            className="font-bold text-sm font-mono"
            style={{ color: "var(--color-primary)" }}
          >
            EP-2026-78341
          </span>
        </div>
        {[
          ["Hotel", "Swat Serena Lodge"],
          ["Room", "Deluxe Mountain View"],
          ["Check-in", "Sep 15, 2026"],
          ["Check-out", "Sep 18, 2026"],
          ["Guests", "2 Adults"],
          ["Amount Paid", "PKR 29,580"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between py-2"
            style={{ borderBottom: "1px solid var(--color-border)" }}
          >
            <span
              className="text-xs"
              style={{ color: "var(--color-muted-text)" }}
            >
              {label}
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--color-ink)" }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate("my-trips")}
          className="flex-1 py-3.5 rounded-xl font-semibold text-white"
          style={{ backgroundColor: "var(--color-primary)" }}
        >
          View My Booking
        </button>
        <button
          onClick={() => navigate("home")}
          className="flex-1 py-3.5 rounded-xl font-semibold"
          style={{
            color: "var(--color-primary)",
            border: "1.5px solid var(--color-primary)",
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default function BookingFlow({ navigate }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [holdSeconds, setHoldSeconds] = useState(HOLD_SECONDS)

  useEffect(() => {
    if (step < 2 || step > 3) return
    if (holdSeconds <= 0) return
    const t = setTimeout(() => setHoldSeconds((s) => Math.max(0, s - 1)), 1000)
    return () => clearTimeout(t)
  }, [step, holdSeconds])

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      <div className="max-w-xl mx-auto px-4">
        {/* Back button */}
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex items-center gap-1.5 text-sm font-medium mb-6 hover:opacity-70"
            style={{ color: "var(--color-stone)" }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5m7-7-7 7 7 7" />
            </svg>
            Back
          </button>
        )}

        <StepIndicator step={step} />

        <div
          className="rounded-2xl p-6 shadow-sm"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {step === 2 && (
            <Step2 onNext={() => setStep(3)} holdSeconds={holdSeconds} />
          )}
          {step === 3 && <Step3 onNext={() => setStep(4)} />}
          {step === 4 && <Step4 navigate={navigate} />}
        </div>
      </div>
    </div>
  )
}
