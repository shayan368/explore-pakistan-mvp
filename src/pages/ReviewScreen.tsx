import { useState } from "react"
import type { NavigateFn } from "../types"

type Props = { navigate: NavigateFn }

type Category = "hotel" | "restaurant" | "spot"

const subjects: Record<Category, {
  name: string
  location: string
  date: string
  img: string
  verifiedLabel: string
  aspects: string[]
}> = {
  hotel: {
    name: "Swat Serena Lodge",
    location: "Mingora, Swat Valley",
    date: "Aug 10 – 13, 2026",
    img: "https://images.unsplash.com/photo-1706736231891-e61819a17d1d?w=200&h=160&fit=crop&auto=format",
    verifiedLabel: "Verified Stay",
    aspects: [
      "Cleanliness",
      "Service",
      "Location",
      "Value for Money",
      "Comfort",
      "Food",
    ],
  },
  restaurant: {
    name: "Kalam Cuisine House",
    location: "Kalam, Swat",
    date: "Jul 22, 2026 · 1:00 PM",
    img: "https://images.unsplash.com/photo-1634324092526-91f5e878b72f?w=200&h=160&fit=crop&auto=format",
    verifiedLabel: "Verified Visit",
    aspects: [
      "Food Quality",
      "Service",
      "Ambience",
      "Value for Money",
      "Cleanliness",
    ],
  },
  spot: {
    name: "Mahodand Lake",
    location: "Upper Swat",
    date: "Jun 5, 2026",
    img: "https://images.unsplash.com/photo-1786378986151-31c16e55cea8?w=200&h=160&fit=crop&auto=format",
    verifiedLabel: "Verified Visit",
    aspects: [
      "Scenery",
      "Accessibility",
      "Facilities",
      "Value for Money",
      "Safety",
    ],
  },
}

const ratingLabels: Record<number, string> = {
  1: "Terrible",
  2: "Poor",
  3: "Average",
  4: "Very Good",
  5: "Excellent",
}

function StarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="transition-transform hover:scale-110"
        >
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill={i <= display ? "#f59e0b" : "none"}
            stroke={i <= display ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
      {display > 0 && (
        <span
          className="ml-2 text-sm font-semibold"
          style={{ color: "#f59e0b" }}
        >
          {ratingLabels[display]}
        </span>
      )}
    </div>
  )
}

function SmallStarInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const display = hovered || value
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={i <= display ? "#f59e0b" : "none"}
            stroke={i <= display ? "#f59e0b" : "#d1d5db"}
            strokeWidth="1.5"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  )
}

export default function ReviewScreen({ navigate }: Props) {
  const [category] = useState<Category>("hotel")
  const [overallRating, setOverallRating] = useState(0)
  const [aspectRatings, setAspectRatings] = useState<Record<string, number>>({})
  const [reviewText, setReviewText] = useState("")
  const [title, setTitle] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [photoCount, setPhotoCount] = useState(0)

  const subject = subjects[category]

  const setAspect = (aspect: string, val: number) => {
    setAspectRatings((prev) => ({ ...prev, [aspect]: val }))
  }

  const canSubmit =
    overallRating > 0 && reviewText.length >= 20 && title.length > 0

  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-12 px-4"
        style={{ backgroundColor: "var(--color-canvas)" }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "var(--color-primary-pale)" }}
          >
            <svg
              width="44"
              height="44"
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
            className="font-display font-semibold text-3xl mb-3"
            style={{ color: "var(--color-ink)" }}
          >
            Thank you for your review!
          </h2>
          <p
            className="text-base leading-relaxed mb-3"
            style={{ color: "var(--color-stone)" }}
          >
            Your review of <strong>{subject.name}</strong> has been submitted
            and is pending verification.
          </p>
          <p
            className="text-sm mb-8"
            style={{ color: "var(--color-muted-text)" }}
          >
            Reviews are published within 24 hours after our team confirms
            authenticity.
          </p>

          <div
            className="rounded-2xl p-5 mb-6 text-left"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={i <= overallRating ? "#f59e0b" : "#d1d5db"}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span
                className="text-xs font-semibold"
                style={{ color: "var(--color-ink)" }}
              >
                {ratingLabels[overallRating]}
              </span>
            </div>
            <p
              className="font-semibold text-sm mb-1"
              style={{ color: "var(--color-ink)" }}
            >
              {title}
            </p>
            <p className="text-sm" style={{ color: "var(--color-stone)" }}>
              {reviewText}
            </p>
            <p
              className="text-xs mt-3 font-medium"
              style={{ color: "var(--color-primary)" }}
            >
              ✓ {subject.verifiedLabel}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("my-trips")}
              className="flex-1 py-3.5 rounded-xl font-semibold text-white"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              Back to My Trips
            </button>
            <button
              onClick={() => navigate("home")}
              className="flex-1 py-3.5 rounded-xl font-semibold"
              style={{
                color: "var(--color-primary)",
                border: "1.5px solid var(--color-primary)",
              }}
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-10"
      style={{ backgroundColor: "var(--color-canvas)" }}
    >
      <div className="max-w-2xl mx-auto px-4">
        {/* Back */}
        <button
          onClick={() => navigate("my-trips")}
          className="flex items-center gap-1.5 text-sm font-medium mb-8 hover:opacity-70 transition-opacity"
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
          Back to My Trips
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-2"
            style={{ color: "var(--color-accent)" }}
          >
            Share Your Experience
          </p>
          <h1
            className="font-display font-semibold text-3xl mb-2"
            style={{ color: "var(--color-ink)" }}
          >
            How was your experience?
          </h1>
          <p className="text-sm" style={{ color: "var(--color-muted-text)" }}>
            Your review helps other travelers make better decisions.
          </p>
        </div>

        {/* Facility card */}
        <div
          className="rounded-2xl p-4 mb-6 flex items-center gap-4"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            className="w-20 h-16 rounded-xl overflow-hidden shrink-0"
            style={{ backgroundColor: "var(--color-muted)" }}
          >
            <img
              src={subject.img}
              alt={subject.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3
                className="font-semibold text-sm"
                style={{ color: "var(--color-ink)" }}
              >
                {subject.name}
              </h3>
              <span
                className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--color-primary-pale)",
                  color: "var(--color-primary)",
                }}
              >
                <svg
                  width="9"
                  height="9"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                {subject.verifiedLabel}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--color-muted-text)" }}>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ display: "inline", marginRight: 3 }}
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {subject.location}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-stone)" }}
            >
              📅 {subject.date}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p
              className="text-xs font-mono font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              EP-2026-71234
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-muted-text)" }}
            >
              Booking ID
            </p>
          </div>
        </div>

        {/* Overall rating */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="font-semibold text-base mb-1"
            style={{ color: "var(--color-ink)" }}
          >
            Overall Rating
          </h2>
          <p
            className="text-xs mb-4"
            style={{ color: "var(--color-muted-text)" }}
          >
            How would you rate your overall experience?
          </p>
          <StarInput value={overallRating} onChange={setOverallRating} />
        </div>

        {/* Aspect ratings */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="font-semibold text-base mb-1"
            style={{ color: "var(--color-ink)" }}
          >
            Rate by Category
          </h2>
          <p
            className="text-xs mb-5"
            style={{ color: "var(--color-muted-text)" }}
          >
            Optional — helps other travelers understand what to expect.
          </p>
          <div className="space-y-4">
            {subject.aspects.map((aspect) => (
              <div
                key={aspect}
                className="flex items-center justify-between gap-4"
              >
                <span
                  className="text-sm font-medium w-36 shrink-0"
                  style={{ color: "var(--color-stone)" }}
                >
                  {aspect}
                </span>
                <SmallStarInput
                  value={aspectRatings[aspect] || 0}
                  onChange={(v) => setAspect(aspect, v)}
                />
                {aspectRatings[aspect] > 0 && (
                  <span
                    className="text-xs w-16 shrink-0"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    {ratingLabels[aspectRatings[aspect]]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Written review */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="font-semibold text-base mb-4"
            style={{ color: "var(--color-ink)" }}
          >
            Write Your Review
          </h2>

          <div className="mb-4">
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: "var(--color-muted-text)" }}
            >
              Review Title *
            </label>
            <input
              type="text"
              placeholder="Summarize your experience in a few words"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-3 rounded-xl outline-none"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-canvas)",
                color: "var(--color-ink)",
              }}
            />
          </div>

          <div>
            <label
              className="block text-xs font-semibold mb-2"
              style={{ color: "var(--color-muted-text)" }}
            >
              Your Review *{" "}
              <span
                style={{ color: "var(--color-muted-text)", fontWeight: 400 }}
              >
                (min. 20 characters)
              </span>
            </label>
            <textarea
              placeholder="Share the details of your experience — what was great, what could be improved, tips for future visitors..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
              className="w-full text-sm px-4 py-3 rounded-xl outline-none resize-none"
              style={{
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-canvas)",
                color: "var(--color-ink)",
                lineHeight: "1.6",
              }}
            />
            <p
              className="text-xs mt-1 text-right"
              style={{
                color:
                  reviewText.length < 20
                    ? "var(--color-muted-text)"
                    : "var(--color-success)",
              }}
            >
              {reviewText.length} / 20 min
            </p>
          </div>
        </div>

        {/* Photo upload */}
        <div
          className="rounded-2xl p-6 mb-5"
          style={{
            backgroundColor: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2
            className="font-semibold text-base mb-1"
            style={{ color: "var(--color-ink)" }}
          >
            Add Photos{" "}
            <span
              className="font-normal text-xs"
              style={{ color: "var(--color-muted-text)" }}
            >
              Optional
            </span>
          </h2>
          <p
            className="text-xs mb-4"
            style={{ color: "var(--color-muted-text)" }}
          >
            Photos from verified stays get featured in our destination guides.
          </p>

          <div className="flex gap-3 items-start flex-wrap">
            {Array.from({ length: photoCount }).map((_, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-xl relative"
                style={{
                  backgroundColor: "var(--color-primary-pale)",
                  border: "2px solid var(--color-primary)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    style={{ color: "var(--color-primary)" }}
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <button
                  onClick={() => setPhotoCount(photoCount - 1)}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: "var(--color-error)" }}
                >
                  ×
                </button>
              </div>
            ))}

            {photoCount < 6 && (
              <button
                onClick={() => setPhotoCount(photoCount + 1)}
                className="w-20 h-20 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors hover:bg-gray-50"
                style={{ border: "2px dashed var(--color-border)" }}
              >
                <svg
                  width="20"
                  height="20"
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
                  Add
                </span>
              </button>
            )}
          </div>

          {photoCount > 0 && (
            <p className="text-xs mt-3" style={{ color: "var(--color-stone)" }}>
              {photoCount} photo{photoCount > 1 ? "s" : ""} selected · Up to 6
              photos allowed
            </p>
          )}
        </div>

        {/* Guidelines */}
        <div
          className="rounded-2xl p-4 mb-6"
          style={{
            backgroundColor: "var(--color-accent-light)",
            border: "1px solid var(--color-accent)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--color-stone)" }}
          >
            Review Guidelines
          </p>
          <ul
            className="text-xs space-y-1"
            style={{ color: "var(--color-muted-text)" }}
          >
            <li>
              • Be honest and specific — your experience matters to other
              travelers
            </li>
            <li>• Reviews are only accepted from verified stays and visits</li>
            <li>• Offensive, spam, or fake reviews will be removed</li>
            <li>• Do not include personal contact information</li>
          </ul>
        </div>

        {/* Submit */}
        <button
          onClick={() => canSubmit && setSubmitted(true)}
          disabled={!canSubmit}
          className="w-full py-4 rounded-xl font-semibold text-white text-base transition-opacity"
          style={{
            backgroundColor: "var(--color-primary)",
            opacity: canSubmit ? 1 : 0.4,
            cursor: canSubmit ? "pointer" : "not-allowed",
          }}
        >
          Submit Review
        </button>

        {!canSubmit && (
          <p
            className="text-xs text-center mt-3"
            style={{ color: "var(--color-muted-text)" }}
          >
            {overallRating === 0
              ? "Please add an overall rating"
              : reviewText.length < 20
                ? `Write at least ${20 - reviewText.length} more characters`
                : "Please add a review title"}
          </p>
        )}
      </div>
    </div>
  )
}
