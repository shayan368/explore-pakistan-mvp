import React, { useState } from "react";
import type { NavigateFn } from "../types";
import { useHMS } from "../hms/useHMS";
import { Lock, UserCircle, Briefcase } from "lucide-react";

// Importers for individual views
import ReceptionistView from "../hms/ReceptionistView";
import ManagerView from "../hms/ManagerView";

type Props = { navigate: NavigateFn };

export default function HotelDashboard({ navigate }: Props) {
  const { auth, login } = useHMS();
  const [portalMode, setPortalMode] = useState<"select" | "login">("select");
  const [loginRole, setLoginRole] = useState<"manager" | "receptionist" | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (auth) {
    if (auth.role === "manager") return <ManagerView navigate={navigate} />;
    return <ReceptionistView navigate={navigate} />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginRole === "manager" && email === "shayan@manager.com" && password === "12345678") {
      login("manager", email);
    } else if (loginRole === "receptionist" && email === "shayan@reception.com" && password === "12345678") {
      login("receptionist", email);
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  if (portalMode === "login") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-emerald-50">
            <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              {loginRole === "manager" ? "Manager Login" : "Receptionist Login"}
            </h2>
            <p className="text-sm text-emerald-700/80 mt-1">Please enter your credentials to access the system.</p>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg font-medium">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder={loginRole === "manager" ? "shayan@manager.com" : "shayan@reception.com"} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="12345678" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm transition-colors">
              Sign In
            </button>
            <button type="button" onClick={() => setPortalMode("select")} className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm font-semibold">
              ← Back to Portal Selection
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 mb-2">Hotel Management System</h1>
        <p className="text-gray-500">Select how you want to access the hotel system.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
            <Briefcase className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">MANAGER PORTAL</h2>
          <p className="text-gray-500 text-sm mb-8 flex-1">Hotel overview, financial monitoring, reports, approvals and operational control.</p>
          <button onClick={() => { setLoginRole("manager"); setPortalMode("login"); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors">
            Continue as Manager
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <UserCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">RECEPTIONIST PORTAL</h2>
          <p className="text-gray-500 text-sm mb-8 flex-1">Reservations, guests, rooms, check-in, payments, billing and daily front-desk operations.</p>
          <button onClick={() => { setLoginRole("receptionist"); setPortalMode("login"); }} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors">
            Continue as Receptionist
          </button>
        </div>
      </div>
    </div>
  );
}
