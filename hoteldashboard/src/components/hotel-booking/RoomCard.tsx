import type { Room } from "./types"
import { IconThermometer, IconCar, IconMountain } from "./icons"

type Props = {
  room: Room
  quantity: number
  onQuantityChange: (qty: number) => void
  guestValidationMessage: string | null
}

export default function RoomCard({
  room,
  quantity,
  onQuantityChange,
  guestValidationMessage,
}: Props) {
  const isUnavailable = room.available === 0
  const isSelected = quantity > 0

  return (
    <div
      className={`rounded-2xl border-2 transition-all overflow-hidden flex flex-col md:flex-row ${
        isSelected
          ? "border-emerald-500 bg-emerald-50/50"
          : "border-gray-100 hover:border-emerald-200"
      } ${isUnavailable ? "opacity-60 grayscale" : ""}`}
    >
      <div className="w-full md:w-1/3 h-48 md:h-auto shrink-0 relative">
        <img
          src={room.img}
          alt={room.name}
          className="w-full h-full object-cover"
        />
        {room.available > 0 && room.available <= 2 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            Only {room.available} left!
          </div>
        )}
        {isUnavailable && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg">
              Unavailable
            </span>
          </div>
        )}
      </div>
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-bold text-xl text-gray-900">{room.name}</h3>
            <div className="text-right">
              <p className="font-bold text-xl text-emerald-700">
                PKR {room.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">per night</p>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-600 mb-4 font-medium">
            <span className="flex items-center gap-1">
              <IconThermometer /> {room.beds}
            </span>
            <span className="flex items-center gap-1">
              <IconCar /> {room.capacity} guests
            </span>
            <span className="flex items-center gap-1">
              <IconMountain /> {room.size}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap mb-4">
            {room.facilities.map((f) => (
              <span
                key={f}
                className="text-xs px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium shadow-sm"
              >
                {f}
              </span>
            ))}
          </div>

          {guestValidationMessage && (
            <p className="text-xs font-bold text-red-500 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">
              {guestValidationMessage}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
          <div className="text-sm font-bold text-gray-600">
            {room.available > 0 ? (
              <span>
                {room.available} room{room.available > 1 ? "s" : ""} available
              </span>
            ) : (
              <span className="text-red-500">No rooms available</span>
            )}
          </div>

          {!isUnavailable && (
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-700">Rooms:</span>
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-full p-1 shadow-sm">
                <button
                  type="button"
                  onClick={() => onQuantityChange(quantity - 1)}
                  disabled={quantity <= 0}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                >
                  -
                </button>
                <span className="w-4 text-center font-bold text-emerald-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => onQuantityChange(quantity + 1)}
                  disabled={quantity >= room.available}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:hover:bg-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
