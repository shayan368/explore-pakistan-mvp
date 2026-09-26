import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { BookingState } from "../components/hotel-booking/types"

export type User = {
  id: string
  fullName: string
  email: string
  phone: string
  avatarInitials: string
  createdAt: string
}

export type GlobalBooking = {
  id: string
  type?: 'hotel' | 'restaurant'
  bookingData?: BookingState
  hotelData?: any
  nights?: number
  totalPrice?: number
  date: string
  
  // Restaurant specific fields
  restaurantData?: any
  reservationData?: any
}

type AuthContextType = {
  user: User | null
  login: (user: User) => void
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  bookings: GlobalBooking[]
  addBooking: (booking: GlobalBooking) => void
  updateBookingStatus: (id: string, status: string) => void
  updateBookingData: (id: string, data: any) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("ep_user")
    return saved ? JSON.parse(saved) : null
  })
  
  const [bookings, setBookings] = useState<GlobalBooking[]>(() => {
    const saved = localStorage.getItem("ep_bookings")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    if (user) {
      localStorage.setItem("ep_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("ep_user")
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem("ep_bookings", JSON.stringify(bookings))
  }, [bookings])

  const login = (newUser: User) => setUser(newUser)
  const logout = () => {
    setUser(null)
  }
  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => prev ? { ...prev, ...data } : null)
  }
  const addBooking = (booking: GlobalBooking) => {
    setBookings((prev) => [booking, ...prev])
  }
  const updateBookingStatus = (id: string, status: string) => {
    setBookings((prev) => prev.map(b => {
      if (b.id === id) {
        if (b.type === 'restaurant') {
          return { ...b, reservationData: { ...b.reservationData, status } }
        }
        return { ...b, bookingData: { ...(b.bookingData as any), status } }
      }
      return b
    }))
  }
  const updateBookingData = (id: string, data: any) => {
    setBookings((prev) => prev.map(b => {
      if (b.id === id) {
        if (b.type === 'restaurant') {
          return { ...b, reservationData: { ...b.reservationData, ...data } }
        }
        return { ...b, bookingData: { ...(b.bookingData as any), ...data } }
      }
      return b
    }))
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, bookings, addBooking, updateBookingStatus, updateBookingData }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
