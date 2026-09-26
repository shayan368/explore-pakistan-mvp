import { useState } from "react"
import type { NavigateFn } from "../types"
import { useAuth } from "../context/AuthContext"
import { IconUser, IconCheck } from "../components/hotel-booking/icons"

type Props = { navigate: NavigateFn }

export default function MyProfile({ navigate }: Props) {
  const { user, updateProfile } = useAuth()
  
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user?.fullName || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [saved, setSaved] = useState(false)

  if (!user) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Please sign in to view your profile</h2>
        <button onClick={() => navigate("home")} className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold">Go to Home</button>
      </div>
    )
  }

  const handleSave = () => {
    updateProfile({ fullName, phone, avatarInitials: fullName.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2) })
    setIsEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("home")} className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h1 className="font-display font-bold text-3xl text-gray-900">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 h-32 w-full"></div>
          <div className="px-8 pb-8">
            <div className="flex justify-between items-start -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                <div className="w-full h-full rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-display font-bold text-3xl">
                  {user.avatarInitials}
                </div>
              </div>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="mt-14 px-6 py-2 rounded-full border border-gray-300 font-bold text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {saved && (
              <div className="mb-6 bg-emerald-50 text-emerald-800 px-4 py-3 rounded-xl flex items-center gap-3 font-medium">
                <IconCheck /> Profile updated successfully!
              </div>
            )}

            {isEditing ? (
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 focus:ring-2 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed outline-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 focus:ring-2 outline-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200">
                    Cancel
                  </button>
                  <button onClick={handleSave} className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase mb-1">Full Name</p>
                  <p className="font-semibold text-lg text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase mb-1">Email Address</p>
                  <p className="font-semibold text-lg text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase mb-1">Phone Number</p>
                  <p className="font-semibold text-lg text-gray-900">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase mb-1">Member Since</p>
                  <p className="font-semibold text-lg text-gray-900">{new Date(user.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
