import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"

type Props = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  initialMode?: "register" | "login"
}

export default function RegistrationModal({ isOpen, onClose, onSuccess, initialMode = "register" }: Props) {
  const { login } = useAuth()
  
  const [mode, setMode] = useState<"register" | "login">(initialMode)
  
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
      setErrors({})
      setIsLoading(false)
    }
  }, [isOpen, initialMode])

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (mode === "register") {
      if (!fullName.trim()) newErrors.fullName = "Full name is required"
      if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Please enter a valid email address"
      if (!phone.trim()) newErrors.phone = "Phone number is required"
      if (!password || password.length < 8) newErrors.password = "Password must be at least 8 characters"
      if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    } else {
      if (!email.trim()) newErrors.email = "Email is required"
      if (!password) newErrors.password = "Password is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    
    setTimeout(() => {
      setIsLoading(false)

      const usersDbStr = localStorage.getItem("ep_mock_users_db") || "{}"
      const usersDb = JSON.parse(usersDbStr)
      
      let finalFullName = fullName
      let finalPhone = phone

      if (mode === "register") {
        usersDb[email] = { fullName, phone }
        localStorage.setItem("ep_mock_users_db", JSON.stringify(usersDb))
      } else {
        const existing = usersDb[email]
        if (existing) {
          finalFullName = existing.fullName
          finalPhone = existing.phone
        } else {
          // Derive name from email if they somehow login without registering in this browser
          const emailPrefix = email.split('@')[0]
          finalFullName = emailPrefix.split(/[._-]/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
          finalPhone = "+92 300 0000000"
        }
      }

      const initials = finalFullName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
      
      login({
        id: "mock-user-id-" + Date.now(),
        fullName: finalFullName,
        email: email,
        phone: finalPhone,
        avatarInitials: initials || "U",
        createdAt: new Date().toISOString()
      })
      
      onSuccess()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
        
        {isLoading ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-6"></div>
            <h2 className="font-bold text-2xl text-gray-900 mb-2">
              {mode === "register" ? "Creating your account..." : "Signing you in..."}
            </h2>
            <p className="text-gray-500 text-sm">Please wait a moment</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-display font-bold text-3xl text-gray-900 mb-2">
                {mode === "register" ? "Create your Explore Pakistan account" : "Sign in to your account"}
              </h2>
              <p className="text-gray-500 text-sm">
                {mode === "register" 
                  ? "Create an account to continue with your booking."
                  : "Welcome back! Please enter your details."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} focus:ring-2 outline-none`}
                    placeholder="e.g. Shayan Ahmad"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs font-bold mt-1">{errors.fullName}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} focus:ring-2 outline-none`}
                  placeholder="e.g. shayan@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} focus:ring-2 outline-none`}
                    placeholder="e.g. 0300 1234567"
                  />
                  {errors.phone && <p className="text-red-500 text-xs font-bold mt-1">{errors.phone}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} focus:ring-2 outline-none`}
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs font-bold mt-1">{errors.password}</p>}
              </div>

              {mode === "register" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-emerald-500 focus:border-emerald-500'} focus:ring-2 outline-none`}
                    placeholder="••••••••"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs font-bold mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              <button
                type="submit"
                className="w-full mt-6 py-4 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors focus:ring-4 focus:ring-emerald-200"
              >
                {mode === "register" ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm font-medium">
              {mode === "register" ? (
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button onClick={() => setMode("login")} className="text-emerald-600 hover:underline font-bold">Sign In</button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button onClick={() => setMode("register")} className="text-emerald-600 hover:underline font-bold">Create Account</button>
                </p>
              )}
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
