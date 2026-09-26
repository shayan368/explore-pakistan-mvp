import React, { useState } from "react";
import type { NavigateFn } from "../types";
import { useHMS, Room, Stay } from "./useHMS";
import { 
  LayoutDashboard, Users, CalendarDays, BedDouble, 
  Sparkles, CreditCard, LogOut, ArrowRight, CheckCircle2,
  AlertTriangle, UserCircle, DoorOpen, Plus, Banknote, Search, Wrench, ShieldAlert, BarChart3, FileText, Eye, Edit2, Trash2 , Building, List, Grid, RefreshCw , History, Printer , LayoutList } from "lucide-react";

export default function ReceptionistView({ navigate }: { navigate: NavigateFn }) {
  const { 
    auth, logout, staff, setStaff, attendance, setAttendance, payroll, setPayroll, auditLog, logAction,  rooms, setRooms, guests, setGuests, 
    reservations, setReservations, stays, setStays,
    charges, setCharges, payments, setPayments, incidents, setIncidents, maintenance, setMaintenance, housekeeping, setHousekeeping
  } = useHMS();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMaintId, setSelectedMaintId] = useState<string | null>(null);
  const [roomFilter, setRoomFilter] = useState('All');
  const [roomViewMode, setRoomViewMode] = useState<'grid'|'list'>('grid');
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupied = rooms.filter(r => r.status === "Occupied").length;
  const available = rooms.filter(r => r.status === "Available").length;
  const reserved = rooms.filter(r => r.status === "Reserved").length;
  const dirty = rooms.filter(r => r.status === "Dirty" || r.status === "Cleaning").length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningMaintRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length;
  
  const [alertConfig, setAlertConfig] = useState<any>({isOpen: false, title: '', message: '', type: 'info'});
  const [confirmConfig, setConfirmConfig] = useState<any>({isOpen: false, title: '', message: '', onConfirm: () => {}});
  const [promptConfig, setPromptConfig] = useState<any>({isOpen: false, title: '', fields: [], onSubmit: () => {}});
  const [promptData, setPromptData] = useState<any>({});

  const showAlert = (title: string, message: string, type: 'info'|'error'|'success'|'warning' = 'info') => setAlertConfig({isOpen: true, title, message, type});
  const showConfirm = (title: string, message: string, onConfirm: () => void) => setConfirmConfig({isOpen: true, title, message, onConfirm});
  const showPrompt = (title: string, fields: any[], onSubmit: (data: any) => void) => {
    const initialData: any = {};
    fields.forEach(f => initialData[f.name] = f.defaultValue || '');
    setPromptData(initialData);
    setPromptConfig({isOpen: true, title, fields, onSubmit});
  };
  
  const [printingStayId, setPrintingStayId] = useState<string | null>(null);
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [resForm, setResForm] = useState({ guestId: '', roomId: '', checkIn: '', checkOut: '', guests: 1, rate: 0, deposit: 0, paymentMethod: 'Card', source: 'Walk-in', specialRequest: '' });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [newGuestForm, setNewGuestForm] = useState({ name: '', phone: '', address: '', cnic: '', notes: '' });
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  
  const checkAvailability = (roomId: string, checkIn: string, checkOut: string, excludeResId?: string) => {
    // Basic date parsing
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (inDate >= outDate) return false;

    // Check existing reservations
    const overlappingRes = reservations.find(r => {
      if (r.id === excludeResId) return false;
      if (r.roomId !== roomId) return false;
      if (r.status === 'Cancelled' || r.status === 'Completed' || r.status === 'Checked Out') return false;
      const existingIn = new Date(r.checkIn);
      const existingOut = new Date(r.checkOut);
      // Overlap condition: in1 < out2 && in2 < out1
      return inDate < existingOut && existingIn < outDate;
    });

    if (overlappingRes) return false;

    // Check room status if today (simplification)
    if (checkIn === today) {
       const room = rooms.find(r => r.id === roomId);
       if (room && (room.status === 'Maintenance' || room.status === 'Out of Order')) return false;
    }

    return true;
  };
  
  const today = new Date().toISOString().split("T")[0];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const qLower = q.toLowerCase();
    const results: any[] = [];
    
    guests.forEach(g => { if (g.name.toLowerCase().includes(qLower) || g.phone.includes(qLower) || g.cnic.includes(qLower)) results.push({ type: 'Guest', label: g.name, id: g.id, data: g }); });
    rooms.forEach(r => { if (r.number.toLowerCase().includes(qLower)) results.push({ type: 'Room', label: 'Room ' + r.number, id: r.id, data: r }); });
    reservations.forEach(r => { if (r.id.toLowerCase().includes(qLower)) results.push({ type: 'Reservation', label: 'Res ' + r.id, id: r.id, data: r }); });
    activeStays.forEach(s => { if (s.id.toLowerCase().includes(qLower)) results.push({ type: 'Stay', label: 'Stay ' + s.id, id: s.id, data: s }); });
    payments.forEach(p => { if (p.id.toLowerCase().includes(qLower)) results.push({ type: 'Payment', label: 'Payment ' + p.id, id: p.id, data: p }); });
    incidents.forEach(i => { if (i.id.toLowerCase().includes(qLower)) results.push({ type: 'Incident', label: 'Incident ' + i.id, id: i.id, data: i }); });
    maintenance.forEach(m => { if (m.id.toLowerCase().includes(qLower)) results.push({ type: 'Maintenance', label: 'Maint ' + m.id, id: m.id, data: m }); });
    staff.forEach(s => { if (s.id.toLowerCase().includes(qLower) || s.name.toLowerCase().includes(qLower)) results.push({ type: 'Staff', label: s.name, id: s.id, data: s }); });
    
    setSearchResults(results.slice(0, 10)); // max 10 results
  };

  const handleSearchResultClick = (res: any) => {
    setSearchQuery('');
    setSearchResults([]);
    if (res.type === 'Guest') { setActiveTab('guests'); if(typeof setSelectedGuest === 'function') setSelectedGuest(res.data); }
    if (res.type === 'Room') { setActiveTab(false ? 'rooms' : 'room-board'); }
    if (res.type === 'Reservation') { setActiveTab('reservations'); if(typeof setSelectedReservation === 'function') setSelectedReservation(res.data); }
    if (res.type === 'Stay') { setActiveTab('active-stays'); }
    if (res.type === 'Payment') { setActiveTab(false ? 'payments' : 'folio-pos'); }
    if (res.type === 'Incident') { setActiveTab('incidents'); }
    if (res.type === 'Maintenance') { setActiveTab('maintenance'); }
    if (res.type === 'Staff') { setActiveTab('staff'); }
  };
  
  
  const maintCount = rooms.filter(r => r.status === "Maintenance" || r.status === "Out of Order").length;
  
  const arrivals = reservations.filter(r => r.checkIn === today && (r.status === "Confirmed" || r.status === "Expected"));
  const departures = stays.filter(s => {
    const res = reservations.find(r => r.id === s.reservationId);
    return s.status === "Active" && res?.checkOut === today;
  });
  
  const activeStays = stays.filter(s => s.status === "Active");
  const totalRevenue = payments.filter(p => p.date === today).reduce((sum, p) => sum + p.amount, 0);

  const handleCheckIn = (resId: string) => {
    const res = reservations.find(r => r.id === resId);
    if (!res) return;
    setReservations(reservations.map(r => r.id === resId ? { ...r, status: "Checked In" } : r));
    setRooms(rooms.map(rm => rm.id === res.roomId ? { ...rm, status: "Occupied" } : rm));
    
    const newStay: Stay = {
      id: "stay_" + Date.now(),
      reservationId: res.id,
      roomId: res.roomId,
      guestId: res.guestId,
      status: "Active"
    };
    setStays([newStay, ...stays]);
    
    const nights = Math.max(1, Math.floor((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 3600 * 24)));
    const totalRoomCharge = nights * res.rate;
    setCharges([...charges, {
      id: "chg_" + Date.now(),
      stayId: newStay.id,
      category: "Room",
      description: `Room Charge (\${nights} nights)`,
      total: totalRoomCharge,
      date: today
    }]);
    
    logAction(auth?.email || '', 'Receptionist', 'Checked In', 'Reservation', selectedReservation.id, `Checked in Room ${selectedRoom.number}`);
    showAlert('Check-in Successful', 'Guest successfully checked in!', 'success');
  };

  const handleCheckout = (stayId: string) => {
    const stay = stays.find(s => s.id === stayId);
    if (!stay) return;
    setStays(stays.map(s => s.id === stayId ? { ...s, status: "Checked Out" } : s));
    setReservations(reservations.map(r => r.id === stay.reservationId ? { ...r, status: "Completed" } : r));
    setRooms(rooms.map(r => r.id === stay.roomId ? { ...r, status: "Dirty" } : r));
    logAction(auth?.email || '', 'Receptionist', 'Checked Out', 'Stay', stay.id, `Checked out Stay ${stay.id}`);
    showAlert('Check-out Complete', 'Room is now marked as Dirty.', 'success');
  };

  const markRoomStatus = (roomId: string, status: any) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, status } : r));
  };

  const sidebarLinks = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "front-desk", label: "Front Desk", icon: DoorOpen },
    { id: "reservations", label: "Reservations", icon: CalendarDays },
    { id: "booking-history", label: "Booking History", icon: History },
    { id: "room-board", label: "Room Board", icon: BedDouble },
    { id: "guests", label: "Guests", icon: Users },
    { id: "active-stays", label: "Active Stays", icon: UserCircle },
    { id: "folio-pos", label: "Folio / POS", icon: FileText },
    { id: "payments", label: "Payments", icon: Banknote },
    { id: "housekeeping", label: "Housekeeping", icon: Sparkles },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "staff", label: "Staff", icon: Users },
    { id: "incidents", label: "Damage / Incidents", icon: ShieldAlert },
    { id: "reports", label: "Reports", icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Sidebar */}
      <div className={"w-64 bg-primary text-white border-r border-primary-light flex flex-col z-10 h-screen sticky top-0 print:hidden " + (printingStayId ? 'hidden' : '')}>
        <div className="p-6 border-b border-primary-light bg-primary-light/30">
          <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
            <UserCircle className="w-5 h-5" /> Front Desk
          </h2>
          <p className="text-xs text-white/80 mt-1">{auth?.email}</p>
        </div>
        <div className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? "bg-accent text-primary shadow-md" : "text-white hover:bg-primary-light/50 hover:text-white"}`}>
              <tab.icon className="w-5 h-5" /> {tab.label}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-primary-light">
          <button onClick={logout} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-primary-light/40 hover:bg-error hover:text-white transition-colors">
            <LogOut className="w-5 h-5" /> Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">

          <div className="relative w-96 ml-auto mr-4 mb-4 z-20">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-muted-text">🔍</span>
            </div>
            <input type="text" placeholder="Global Search (Guests, Rooms, IDs)..." className="w-full pl-10 pr-4 py-2 border border-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-surface" value={searchQuery} onChange={e => handleSearch(e.target.value)} />
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-surface border border-border rounded-xl shadow-2xl max-h-96 overflow-y-auto">
                {searchResults.map(res => (
                  <div key={res.id + res.type} onClick={() => handleSearchResultClick(res)} className="px-4 py-3 hover:bg-muted cursor-pointer border-b border-border last:border-0 flex justify-between items-center">
                    <div>
                      <span className="text-xs font-bold text-primary px-2 py-0.5 bg-primary-pale rounded mr-2 uppercase">{res.type}</span>
                      <span className="text-sm font-bold text-ink">{res.label}</span>
                    </div>
                    <span className="text-xs text-muted-text font-mono">{res.id}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
  
        
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Receptionist Dashboard</h1>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300"><p className="text-sm text-muted-text font-semibold mb-1">Available Rooms</p><p className="text-4xl font-display font-bold text-primary">{available} <span className="text-lg text-gray-400 font-normal">/ {totalRooms}</span></p></div>
              <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300"><p className="text-sm text-muted-text font-semibold mb-1">Occupied</p><p className="text-4xl font-display font-bold text-indigo-600">{occupied}</p></div>
              <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300"><p className="text-sm text-muted-text font-semibold mb-1">Arrivals Today</p><p className="text-4xl font-display font-bold text-primary">{arrivals.length}</p></div>
              <div className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300"><p className="text-sm text-muted-text font-semibold mb-1">Dirty / Cleaning</p><p className="text-4xl font-display font-bold text-orange-600">{dirty}</p></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 p-5">
                <h3 className="font-bold text-ink mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setActiveTab("reservations"); setSelectedReservation(null); setResForm({ guestId: '', roomId: '', checkIn: '', checkOut: '', guests: 1, rate: 0, deposit: 0, paymentMethod: 'Card', source: 'Walk-in', specialRequest: '' }); setIsResModalOpen(true); }} className="p-3 bg-muted border border-border hover:border-primary rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> New Reservation</button>
                  <button onClick={() => setActiveTab("room-board")} className="p-3 bg-muted border border-border hover:border-primary rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><DoorOpen className="w-4 h-4"/> Walk-in</button>
                  <button onClick={() => setActiveTab("folio-pos")} className="p-3 bg-muted border border-border hover:border-primary rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> Add Charge</button>
                  <button onClick={() => setActiveTab("payments")} className="p-3 bg-muted border border-border hover:border-primary rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Banknote className="w-4 h-4"/> Collect Payment</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 p-5">
                <h3 className="font-bold text-ink mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-orange-500" /> Needs Attention</h3>
                <div className="space-y-3">
                  {arrivals.length > 0 && <div className="p-3 bg-primary-pale text-primary rounded-xl border border-blue-100 text-sm font-semibold flex justify-between"><span>{arrivals.length} guests awaiting check-in</span><button onClick={() => setActiveTab("front-desk")} className="underline">View</button></div>}
                  {departures.length > 0 && <div className="p-3 bg-primary-pale text-indigo-800 rounded-xl border border-indigo-100 text-sm font-semibold flex justify-between"><span>{departures.length} departures today</span><button onClick={() => setActiveTab("front-desk")} className="underline">View</button></div>}
                  {dirty > 0 && <div className="p-3 bg-orange-50 text-orange-800 rounded-xl border border-orange-100 text-sm font-semibold flex justify-between"><span>{dirty} rooms need housekeeping</span><button onClick={() => setActiveTab("housekeeping")} className="underline">View</button></div>}
                  {maintCount > 0 && <div className="p-3 bg-red-50 text-red-800 rounded-xl border border-red-100 text-sm font-semibold flex justify-between"><span>{maintCount} maintenance issues pending</span><button onClick={() => setActiveTab("maintenance")} className="underline">View</button></div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FRONT DESK */}
        {activeTab === "front-desk" && (
          <div className="space-y-6 max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Front Desk Operations</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Arrivals */}
              <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-canvas"><h3 className="font-bold text-ink">Today's Arrivals</h3></div>
                <div className="divide-y divide-gray-100">
                  {arrivals.length === 0 ? <p className="p-5 text-sm text-muted-text">No arrivals pending today.</p> : arrivals.map(arr => {
                    const guest = guests.find(g => g.id === arr.guestId);
                    const room = rooms.find(r => r.id === arr.roomId);
                    return (
                      <div key={arr.id} className="p-4 flex items-center justify-between hover:bg-muted">
                        <div>
                          <p className="font-bold text-ink">{guest?.name}</p>
                          <p className="text-xs text-muted-text">Room {room?.number} • {arr.guests} Guests</p>
                        </div>
                        <button onClick={() => handleCheckIn(arr.id)} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-light">Check In</button>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Departures */}
              <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                <div className="px-5 py-4 border-b border-border bg-canvas"><h3 className="font-bold text-ink">Today's Departures</h3></div>
                <div className="divide-y divide-gray-100">
                  {departures.length === 0 ? <p className="p-5 text-sm text-muted-text">No departures today.</p> : departures.map(stay => {
                    const guest = guests.find(g => g.id === stay.guestId);
                    const room = rooms.find(r => r.id === stay.roomId);
                    return (
                      <div key={stay.id} className="p-4 flex items-center justify-between hover:bg-muted">
                        <div>
                          <p className="font-bold text-ink">{guest?.name}</p>
                          <p className="text-xs text-muted-text">Room {room?.number}</p>
                        </div>
                        <button onClick={() => {
                          if (window.confirm("Complete check-out? Room will be marked as Dirty.")) {
                            handleCheckout(stay.id);
                          }
                        }} className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">Check Out</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-display font-bold text-ink">Reservations</h1>
              <button onClick={() => {
                setSelectedReservation(null);
                setResForm({ guestId: '', roomId: '', checkIn: '', checkOut: '', guests: 1, rate: 0, deposit: 0, paymentMethod: 'Card', source: 'Walk-in', specialRequest: '' });
                setIsResModalOpen(true);
              }} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> New Reservation</button>
            </div>
            <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Guest</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Room</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Dates</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.map(res => {
                    const g = guests.find(g => g.id === res.guestId);
                    const r = rooms.find(r => r.id === res.roomId);
                    return (
                      <tr key={res.id} className="hover:bg-muted">
                        <td className="px-4 py-3 text-xs font-mono text-primary">{res.id}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-ink">{g?.name}</td>
                        <td className="px-4 py-3 text-sm text-muted-text">{r?.number}</td>
                        <td className="px-4 py-3 text-xs text-muted-text">{res.checkIn} to {res.checkOut}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-muted">{res.status}</span>
                        </td>
                        <td className="px-4 py-3">
                           <button onClick={() => {
                             setSelectedReservation(res);
                             setResForm({
                               guestId: res.guestId, roomId: res.roomId, checkIn: res.checkIn, checkOut: res.checkOut,
                               guests: res.guests, rate: res.rate, deposit: res.deposit || 0,
                               paymentMethod: res.paymentMethod || 'Card', source: res.source, specialRequest: res.specialRequest || ''
                             });
                             setIsResModalOpen(true);
                           }} className="text-sm font-bold text-primary hover:underline">Edit</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {isResModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
                <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-2xl my-auto">
                  <h2 className="text-2xl font-display font-bold mb-5">{selectedReservation ? 'Edit Reservation' : 'New Reservation'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-muted-text mb-1">Guest</label>
                      <select className="w-full border border-border rounded-lg p-2" value={resForm.guestId} onChange={e => setResForm({...resForm, guestId: e.target.value})}>
                        <option value="">Select a guest...</option>
                        {guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-muted-text mb-1">Room</label>
                      <select className="w-full border border-border rounded-lg p-2" value={resForm.roomId} onChange={e => {
                         const rId = e.target.value;
                         const rm = rooms.find(r => r.id === rId);
                         setResForm({...resForm, roomId: rId, rate: rm ? rm.rate : resForm.rate});
                      }}>
                        <option value="">Select a room...</option>
                        {rooms.filter(r => r.status !== 'Maintenance' && r.status !== 'Out of Order').map(r => <option key={r.id} value={r.id}>Room {r.number} ({r.type})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Check-in</label>
                      <input type="date" className="w-full border border-border rounded-lg p-2" value={resForm.checkIn} onChange={e => setResForm({...resForm, checkIn: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Check-out</label>
                      <input type="date" className="w-full border border-border rounded-lg p-2" value={resForm.checkOut} onChange={e => setResForm({...resForm, checkOut: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Guests</label>
                      <input type="number" min="1" className="w-full border border-border rounded-lg p-2" value={resForm.guests} onChange={e => setResForm({...resForm, guests: parseInt(e.target.value) || 1})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Rate (PKR)</label>
                      <input type="number" className="w-full border border-border rounded-lg p-2" value={resForm.rate} onChange={e => setResForm({...resForm, rate: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Deposit</label>
                      <input type="number" className="w-full border border-border rounded-lg p-2" value={resForm.deposit} onChange={e => setResForm({...resForm, deposit: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Payment Method</label>
                      <select className="w-full border border-border rounded-lg p-2" value={resForm.paymentMethod} onChange={e => setResForm({...resForm, paymentMethod: e.target.value})}>
                        <option>Card</option><option>Cash</option><option>Bank Transfer</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-muted-text mb-1">Booking Source</label>
                      <select className="w-full border border-border rounded-lg p-2" value={resForm.source} onChange={e => setResForm({...resForm, source: e.target.value})}>
                        <option>Walk-in</option><option>Phone</option><option>Website</option><option>Explore Pakistan</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-muted-text mb-1">Special Requests / Notes</label>
                      <textarea className="w-full border border-border rounded-lg p-2" value={resForm.specialRequest} onChange={e => setResForm({...resForm, specialRequest: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsResModalOpen(false)} className="px-4 py-2 bg-muted text-muted-text font-bold rounded-lg">Cancel</button>
                    <button onClick={() => {
                      if (!resForm.guestId || !resForm.roomId || !resForm.checkIn || !resForm.checkOut) {
                        showAlert('Missing Fields', 'Please fill out guest, room, check-in, and check-out dates.', 'error');
                        return;
                      }
                      
                      const isAvailable = checkAvailability(resForm.roomId, resForm.checkIn, resForm.checkOut, selectedReservation?.id);
                      if (!isAvailable) {
                        showAlert('Double Booking', 'Reservation rejected. Room is unavailable for the selected dates.', 'error');
                        return;
                      }

                      if (selectedReservation) {
                         // Edit
                         setReservations(reservations.map(r => r.id === selectedReservation.id ? {
                           ...r,
                           ...resForm
                         } : r));
                         showAlert('Success', 'Reservation updated successfully!', 'success');
                      } else {
                         // New
                         const newRes = {
                           id: 'res_' + Date.now(),
                           status: 'Confirmed',
                           ...resForm
                         };
                         setReservations([...reservations, newRes]);
                         
                         // Mark room as reserved if check-in is today
                         if (resForm.checkIn === today) {
                           setRooms(rooms.map(rm => rm.id === resForm.roomId ? { ...rm, status: 'Reserved' } : rm));
                         }
                         logAction(auth?.email || '', 'Receptionist', 'Created Reservation', 'Reservation', newRes.id, `Created for ${selectedGuest.name}`);
    showAlert('Success', 'Reservation created successfully!', 'success');
                      }
                      
                      setIsResModalOpen(false);
                    }} className="px-4 py-2 bg-primary text-white font-bold rounded-lg">Save Reservation</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROOMS */}
        {activeTab === "room-board" && (
          <div className="max-w-6xl pb-12">
            
            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-accent/20 rounded-xl"><Building className="w-6 h-6 text-accent" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{totalRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Total Rooms</p></div>
              </div>
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-success/20 rounded-xl"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{availableRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Available</p></div>
              </div>
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-orange-100 rounded-xl"><Users className="w-6 h-6 text-orange-600" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{occupiedRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Occupied</p></div>
              </div>
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-red-100 rounded-xl"><Sparkles className="w-6 h-6 text-red-600" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{cleaningMaintRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Cleaning / Maint.</p></div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-surface rounded-full border border-border shadow-sm p-2 mb-6 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-ink pl-4">Room Inventory</h2>
              <div className="flex items-center gap-4">
                {/* Filters */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-full">
                  {['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'].map(f => (
                    <button key={f} onClick={() => setRoomFilter(f)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all ${roomFilter === f ? 'bg-white text-ink shadow-sm' : 'text-stone hover:text-ink'}`}>{f}</button>
                  ))}
                </div>
                {/* View Toggles */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-full border border-border/50">
                  <button onClick={() => setRoomViewMode('list')} className={`p-1.5 rounded-full transition-all ${roomViewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-stone hover:text-ink'}`}><List className="w-4 h-4" /></button>
                  <button onClick={() => setRoomViewMode('grid')} className={`p-1.5 rounded-full transition-all ${roomViewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-stone hover:text-ink'}`}><Grid className="w-4 h-4" /></button>
                </div>
                {/* Add Button */}
                <button onClick={() => {
                  showPrompt('Add Room', [
                    { name: 'number', label: 'Room Number', type: 'text', defaultValue: '' },
                    { name: 'type', label: 'Room Type', type: 'text', defaultValue: 'Standard Queen' },
                    { name: 'floor', label: 'Floor', type: 'text', defaultValue: 'Floor 1' },
                    { name: 'capacity', label: 'Capacity (Sleeps)', type: 'number', defaultValue: 2 },
                    { name: 'rate', label: 'Rate (PKR)', type: 'number', defaultValue: 15000 },
                    { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Cleaning', 'Maintenance'], defaultValue: 'Available' },
                    { name: 'imageUrl', label: 'Room Image (Upload)', type: 'file', defaultValue: '' }
                  ], (data) => {
                    const newRoom = { id: 'r' + Date.now(), ...data, capacity: Number(data.capacity), rate: Number(data.rate) };
                    setRooms([...rooms, newRoom]);
                    logAction(auth?.email || '', 'Manager', 'Added Room', 'Rooms', newRoom.id, `Added Room ${data.number}`);
                  });
                }} className="px-5 py-2 bg-accent text-white rounded-full font-bold text-[13px] hover:bg-[#b59863] flex items-center gap-2 shadow-md transition-all"><Plus className="w-4 h-4" /> Add Room</button>
              </div>
            </div>

            {/* Grid View */}
            {roomViewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.filter(r => roomFilter === 'All' || r.status === roomFilter).map(room => (
                  <div key={room.id} className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col group">
                    {/* Image Section */}
                    <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                      {room.imageUrl ? (
                        <img src={room.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" alt={room.number} />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center"><BedDouble className="w-12 h-12 text-stone opacity-30" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent pointer-events-none" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white backdrop-blur-md ${
                          room.status === 'Available' ? 'bg-teal-500/80 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 
                          room.status === 'Occupied' ? 'bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 
                          'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        }`}>{room.status}</span>
                      </div>

                      {/* Room Name & Floor */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-display font-bold leading-tight drop-shadow-md">Room {room.number}</h3>
                        <p className="text-[11px] font-medium opacity-90 tracking-wide mt-1 drop-shadow-md">{room.type} • {room.floor || 'Floor 1'}</p>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-4 bg-white flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1.5 text-stone text-xs font-bold tracking-wide">
                          <Users className="w-3.5 h-3.5" /> Sleeps {room.capacity || 2}
                        </div>
                        <div className="text-accent font-bold text-sm tracking-wide">
                          PKR {room.rate.toLocaleString()}<span className="text-stone font-medium text-[10px]">/night</span>
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-border mb-3" />
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button onClick={() => {
                          showPrompt('Edit Room', [
                            { name: 'number', label: 'Room Number', type: 'text', defaultValue: room.number },
                            { name: 'type', label: 'Room Type', type: 'text', defaultValue: room.type },
                            { name: 'floor', label: 'Floor', type: 'text', defaultValue: room.floor || 'Floor 1' },
                            { name: 'capacity', label: 'Capacity (Sleeps)', type: 'number', defaultValue: room.capacity || 2 },
                            { name: 'rate', label: 'Rate (PKR)', type: 'number', defaultValue: room.rate },
                            { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Cleaning', 'Maintenance'], defaultValue: room.status },
                            { name: 'imageUrl', label: 'Room Image (Upload)', type: 'file', defaultValue: room.imageUrl || '' }
                          ], (data) => {
                            setRooms(rooms.map(r => r.id === room.id ? { ...r, ...data, capacity: Number(data.capacity), rate: Number(data.rate) } : r));
                            logAction(auth?.email || '', 'Manager', 'Edited Room', 'Rooms', room.id, `Updated Room ${data.number}`);
                          });
                        }} className="flex-1 flex justify-center items-center gap-1.5 text-[11px] font-bold text-stone hover:text-primary transition-colors py-1">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <div className="w-px h-5 bg-border" />
                        <button onClick={() => {
                          const nextStatus: Record<string, any> = { 'Available': 'Occupied', 'Occupied': 'Cleaning', 'Cleaning': 'Maintenance', 'Maintenance': 'Available' };
                          const newStatus = nextStatus[room.status] || 'Available';
                          setRooms(rooms.map(r => r.id === room.id ? { ...r, status: newStatus } : r));
                          logAction(auth?.email || '', 'Manager', 'Changed Room Status', 'Rooms', room.id, `Room ${room.number} changed to ${newStatus}`);
                        }} className="flex-1 flex justify-center items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-700 transition-colors py-1">
                          <RefreshCw className="w-3.5 h-3.5" /> Status
                        </button>
                        <div className="w-px h-5 bg-border" />
                        <button onClick={() => {
                          setConfirmConfig({
                            isOpen: true,
                            title: 'Delete Room',
                            message: `Are you sure you want to delete Room ${room.number}?`,
                            onConfirm: () => {
                              setRooms(rooms.filter(r => r.id !== room.id));
                              logAction(auth?.email || '', 'Manager', 'Deleted Room', 'Rooms', room.id, `Deleted Room ${room.number}`);
                            }
                          });
                        }} className="pl-3 py-1 flex items-center justify-center group/btn">
                          <div className="p-1.5 bg-red-50 text-error rounded-md group-hover/btn:bg-red-100 group-hover/btn:text-red-700 transition-colors"><Trash2 className="w-3.5 h-3.5" /></div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* List View */}
            {roomViewMode === 'list' && (
              <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Room</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Type</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Floor</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Capacity</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Rate</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rooms.filter(r => roomFilter === 'All' || r.status === roomFilter).map(room => (
                      <tr key={room.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-bold text-ink">{room.number}</td>
                        <td className="px-4 py-3 text-sm text-stone">{room.type}</td>
                        <td className="px-4 py-3 text-sm text-stone">{room.floor || 'Floor 1'}</td>
                        <td className="px-4 py-3 text-sm text-stone">{room.capacity || 2} Persons</td>
                        <td className="px-4 py-3 text-sm text-accent font-bold">PKR {room.rate.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            room.status === 'Available' ? 'bg-success text-white' : 
                            room.status === 'Occupied' ? 'bg-orange-500 text-white' : 
                            'bg-error text-white'
                          }`}>{room.status}</span>
                        </td>
                        <td className="px-4 py-3 flex gap-3">
                           <button onClick={() => {
                           showPrompt('Edit Room', [
                             { name: 'number', label: 'Room Number', type: 'text', defaultValue: room.number },
                             { name: 'type', label: 'Room Type', type: 'text', defaultValue: room.type },
                             { name: 'floor', label: 'Floor', type: 'text', defaultValue: room.floor || 'Floor 1' },
                             { name: 'capacity', label: 'Capacity (Sleeps)', type: 'number', defaultValue: room.capacity || 2 },
                             { name: 'rate', label: 'Rate (PKR)', type: 'number', defaultValue: room.rate },
                             { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Cleaning', 'Maintenance'], defaultValue: room.status },
                             { name: 'imageUrl', label: 'Room Image (Upload)', type: 'file', defaultValue: room.imageUrl || '' }
                           ], (data) => {
                             setRooms(rooms.map(r => r.id === room.id ? { ...r, ...data, capacity: Number(data.capacity), rate: Number(data.rate) } : r));
                             logAction(auth?.email || '', 'Manager', 'Edited Room', 'Rooms', room.id, `Updated Room ${data.number}`);
                           });
                         }} className="text-stone hover:text-primary" title="Edit"><Edit2 className="w-4 h-4" /></button>
                           <button onClick={() => {
                           const nextStatus: Record<string, any> = { 'Available': 'Occupied', 'Occupied': 'Cleaning', 'Cleaning': 'Maintenance', 'Maintenance': 'Available' };
                           const newStatus = nextStatus[room.status] || 'Available';
                           setRooms(rooms.map(r => r.id === room.id ? { ...r, status: newStatus } : r));
                           logAction(auth?.email || '', 'Manager', 'Changed Room Status', 'Rooms', room.id, `Room ${room.number} changed to ${newStatus}`);
                         }} className="text-blue-500 hover:text-blue-700" title="Cycle Status"><RefreshCw className="w-4 h-4" /></button>
                           <button onClick={() => {
                           setConfirmConfig({
                             isOpen: true,
                             title: 'Delete Room',
                             message: `Are you sure you want to delete Room ${room.number}?`,
                             onConfirm: () => {
                               setRooms(rooms.filter(r => r.id !== room.id));
                               logAction(auth?.email || '', 'Manager', 'Deleted Room', 'Rooms', room.id, `Deleted Room ${room.number}`);
                             }
                           });
                         }} className="text-error hover:text-red-700" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

        {/* FOLIO / POS */}
        {activeTab === "folio-pos" && (
          <div className="max-w-6xl">
            <h1 className={"text-3xl font-display font-bold text-ink mb-6 " + (printingStayId ? "hidden print:hidden" : "")}>Folio / POS</h1>
            <div className="space-y-6">
              {activeStays.filter(s => printingStayId ? s.id === printingStayId : true).map(stay => {
                const guest = guests.find(g => g.id === stay.guestId);
                const room = rooms.find(r => r.id === stay.roomId);
                const stayCharges = charges.filter(c => c.stayId === stay.id);
                const stayPayments = payments.filter(p => p.stayId === stay.id);
                const totalCharged = stayCharges.reduce((sum, c) => sum + c.total, 0);
                const totalPaid = stayPayments.reduce((sum, p) => sum + p.amount, 0);
                const balance = totalCharged - totalPaid;
                return (
                  <div key={stay.id} className={"bg-white p-6 " + (printingStayId ? "border-none shadow-none" : "rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300")}>
                    <div className={"flex justify-between items-center border-b border-border pb-4 mb-4 print:hidden " + (printingStayId ? "hidden" : "")}>
                      <h3 className="text-xl font-display font-bold text-ink">Folio: {guest?.name} (Room {room?.number})</h3>
                      <div className="flex gap-2">
                        <button onClick={() => {
                          showPrompt('Add Charge', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: '0' },
      { name: 'desc', label: 'Description', type: 'text', defaultValue: 'Restaurant/Service' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0) {
        setCharges([...charges, { id: 'chg_' + Date.now(), stayId: stay.id, category: 'Service', description: data.desc || 'Service', total: amount, date: today }]);
        showAlert('Charge Added', 'The charge was successfully posted to the folio.', 'success');
      }
    });
                        }} className="px-4 py-2 bg-muted text-stone text-sm font-bold rounded-lg hover:bg-gray-200">Add Charge</button>
                        <button onClick={() => {
                          showPrompt('Collect Payment', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: balance.toString() },
      { name: 'method', label: 'Payment Method', type: 'text', defaultValue: 'Cash' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0) {
        setPayments([...payments, { id: 'pay_' + Date.now(), stayId: stay.id, amount, method: data.method || 'Cash', date: today }]);
        logAction(auth?.email || '', 'Receptionist', 'Collected Payment', 'Stay', stay.id, `Collected payment`);
    showAlert('Payment Collected', 'The payment has been successfully recorded.', 'success');
      }
    });
                        }} className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-light">Collect Payment</button>
                        <button onClick={() => {
                           setPrintingStayId(stay.id);
                           setTimeout(() => {
                             window.print();
                             setPrintingStayId(null);
                           }, 300);
                        }} className="px-4 py-2 bg-muted text-stone text-sm font-bold rounded-lg hover:bg-gray-200">Print</button>
                      </div>
                    </div>
                    {printingStayId === stay.id && (
                      <div className="mb-8 text-center border-b pb-8">
                        <h1 className="text-4xl font-black text-ink tracking-tight">Explore Pakistan</h1>
                        <h2 className="text-xl text-muted-text mt-2 font-semibold">Guest Invoice</h2>
                        <div className="mt-6 flex justify-between text-left">
                          <div>
                            <p className="font-bold text-lg text-ink">{guest?.name}</p>
                            <p className="text-muted-text">Phone: {guest?.phone || 'N/A'}</p>
                            <p className="text-muted-text">CNIC: {guest?.cnic || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg text-ink">Room {room?.number}</p>
                            <p className="text-muted-text">{room?.type}</p>
                            <p className="text-muted-text">Date: {today}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-ink mb-3 flex items-center gap-2"><FileText className="w-4 h-4"/> Charges Ledger</h4>
                        <ul className="text-sm divide-y">
                          {stayCharges.map(c => (
                            <li key={c.id} className="py-2 flex justify-between text-muted-text">
                              <span>{c.description}</span><span className="font-bold text-ink">PKR {c.total.toLocaleString()}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-2 border-t font-bold flex justify-between">
                          <span>Total Charged</span><span>PKR {totalCharged.toLocaleString()}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-ink mb-3 flex items-center gap-2"><Banknote className="w-4 h-4"/> Payments Ledger</h4>
                        <ul className="text-sm divide-y">
                          {stayPayments.map(p => (
                            <li key={p.id} className="py-2 flex justify-between text-muted-text">
                              <span>{p.method} - {p.date}</span><span className="font-bold text-primary">PKR {p.amount.toLocaleString()}</span>
                            </li>
                          ))}
                          {stayPayments.length === 0 && <li className="py-2 text-muted-text italic">No payments yet.</li>}
                        </ul>
                        <div className="mt-4 pt-2 border-t font-bold flex justify-between">
                          <span>Total Paid</span><span className="text-primary">PKR {totalPaid.toLocaleString()}</span>
                        </div>
                        <div className={`mt-2 pt-2 border-t font-black flex justify-between \${balance > 0 ? "text-orange-600" : "text-primary"}`}>
                          <span>Balance Due</span><span>PKR {balance.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              {activeStays.length === 0 && <p className="text-muted-text">No active folios right now.</p>}
            </div>
          </div>
        )}

        {/* ACTIVE STAYS */}
        {activeTab === "active-stays" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Active Stays</h1>
            <div className="space-y-4">
              {activeStays.length === 0 ? <p className="text-muted-text">No active stays right now.</p> : activeStays.map(stay => {
                const guest = guests.find(g => g.id === stay.guestId);
                const room = rooms.find(r => r.id === stay.roomId);
                const res = reservations.find(r => r.id === stay.reservationId);
                const stayCharges = charges.filter(c => c.stayId === stay.id);
                const stayPayments = payments.filter(p => p.stayId === stay.id);
                const totalCharged = stayCharges.reduce((sum, c) => sum + c.total, 0);
                const totalPaid = stayPayments.reduce((sum, p) => sum + p.amount, 0);
                const balance = totalCharged - totalPaid;

                return (
                  <div key={stay.id} className={"bg-white p-6 " + (printingStayId ? "border-none shadow-none" : "rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300")}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-display font-bold text-ink">{guest?.name} <span className="text-sm font-normal text-muted-text ml-2">Room {room?.number}</span></h3>
                        <p className="text-sm text-muted-text mt-1">Check-out: {res?.checkOut}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-text">Balance Due</p>
                        <p className={`text-xl font-display font-bold \${balance > 0 ? "text-orange-600" : "text-primary"}`}>PKR {balance.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mt-6 border-t border-gray-100 pt-4">
                      <button onClick={() => showPrompt('Add Charge', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: '0' },
      { name: 'desc', label: 'Description', type: 'text', defaultValue: 'Restaurant/Service' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0 && data.desc) {
        setCharges([...charges, { id: 'chg_' + Date.now(), stayId: stay.id, category: 'Service', description: data.desc, total: amount, date: today }]);
        showAlert('Charge Added', 'The charge was successfully posted to the folio.', 'success');
      }
    })} className="px-4 py-2 bg-muted text-stone text-sm font-bold rounded-lg hover:bg-gray-200"><Plus className="w-4 h-4 inline mr-1" /> Add Charge</button>
                      <button onClick={() => showPrompt('Collect Payment', [{name:'amount',label:'Amount (PKR)',type:'number',defaultValue:balance.toString()},{name:'method',label:'Payment Method',type:'text',defaultValue:'Cash'}], (data) => {
         const amount = parseFloat(data.amount||'0');
         if(amount>0) {
           setPayments([...payments, {id:'pay_'+Date.now(), stayId: stay.id, amount, method: data.method||'Cash', date: today}]);
           logAction(auth?.email || '', 'Receptionist', 'Collected Payment', 'Stay', stay.id, `Collected payment`);
    showAlert('Payment Collected', 'The payment has been recorded successfully.', 'success');
         }
      })} className="px-4 py-2 bg-primary-pale text-primary text-sm font-bold rounded-lg hover:bg-blue-200"><Banknote className="w-4 h-4 inline mr-1" /> Collect Payment</button>
                      
                      <button onClick={() => showPrompt('Report Damage', [
      { name: 'desc', label: 'Incident Description', type: 'textarea', defaultValue: '' },
      { name: 'cost', label: 'Estimated Cost (PKR)', type: 'number', defaultValue: '0' }
    ], (data) => {
      if (data.desc) {
        const cost = parseFloat(data.cost || '0');
        setIncidents([...incidents, { id: 'inc_' + Date.now(), stayId: stay.id, roomId: stay.roomId, description: data.desc, estimatedCost: cost, status: 'Pending Review', date: today }]);
        showAlert('Damage Reported', 'Incident submitted for Manager approval.', 'success');
      }
    })} className="px-4 py-2 bg-red-100 text-red-800 text-sm font-bold rounded-lg hover:bg-red-200"><AlertTriangle className="w-4 h-4 inline mr-1" /> Report Damage</button>
                      
                      <div className="flex-1"></div>
                      <button onClick={() => setActiveTab("folio-pos")} className="px-4 py-2 text-primary text-sm font-bold hover:underline">View Folio</button>
                      <button onClick={() => {
                        if (balance > 0 && !window.confirm(`Guest has an outstanding balance of PKR \${balance}. Checkout anyway?`)) return;
                        handleCheckout(stay.id);
                      }} className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-light">Complete Check-out</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* PAYMENTS */}
        {activeTab === "payments" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Payment Ledger</h1>
            <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Method</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-muted">
                      <td className="px-4 py-3 text-xs font-mono text-primary">{p.id}</td>
                      <td className="px-4 py-3 text-sm text-muted-text">{p.date}</td>
                      <td className="px-4 py-3 text-sm font-medium text-ink">{p.method}</td>
                      <td className="px-4 py-3 text-sm font-bold text-primary">PKR {p.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-text">No payments recorded.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        
        {/* HOUSEKEEPING */}
        {activeTab === "housekeeping" && (
          <div className="max-w-7xl pb-12">
            
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-5 mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-display font-bold text-[#2d2d2d] mb-1">Housekeeping</h1>
                <p className="text-sm text-stone font-medium">
                  {housekeeping.filter(h => h.status !== 'Clean').length} open tasks • {rooms.filter(r => r.status === 'Dirty').length} rooms awaiting clean
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* View Toggles (Visual Only) */}
                <div className="flex bg-[#f3f1ec] rounded-lg p-1 border border-[#e5e1d8]">
                  <button className="px-3 py-1.5 bg-[#fceec9] text-[#b58c3f] rounded shadow-sm"><LayoutDashboard className="w-4 h-4" /></button>
                  <button className="px-3 py-1.5 text-stone hover:text-ink"><LayoutList className="w-4 h-4" /></button>
                </div>
                
                <button onClick={() => {
                  showPrompt('New Housekeeping Task', [
                    { name: 'roomId', label: 'Room', type: 'select', options: ['Select a Room', ...rooms.map(r => r.id + ' - Room ' + r.number)], defaultValue: 'Select a Room' },
                    { name: 'task', label: 'Task Description', type: 'text', defaultValue: 'Full turnover clean' },
                    { name: 'priority', label: 'Priority', type: 'select', options: ['Normal', 'High', 'Urgent'], defaultValue: 'Normal' },
                    { name: 'assigneeId', label: 'Assign To', type: 'select', options: ['None', ...(staff.filter(s => (s.department||'').toLowerCase().includes('housekeeping') || (s.role||'').toLowerCase().includes('house')).length > 0 ? staff.filter(s => (s.department||'').toLowerCase().includes('housekeeping') || (s.role||'').toLowerCase().includes('house')) : staff).map(s => s.id + ' - ' + s.name + ' (' + s.role + ')')], defaultValue: 'None' },
                    { name: 'dueDate', label: 'Due Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] }
                  ], (data) => {
                    if (data.roomId === 'Select a Room') { showAlert('Error', 'Please select a valid room', 'error'); return; }
                    const rId = data.roomId.split(' - ')[0];
                    const sId = data.assigneeId === 'None' ? '' : data.assigneeId.split(' - ')[0];
                    
                    const newTask = {
                      id: 'hk_' + Date.now(),
                      roomId: rId,
                      task: data.task,
                      priority: data.priority,
                      assigneeId: sId,
                      dueDate: new Date(data.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      status: 'Dirty'
                    };
                    
                    setHousekeeping([...housekeeping, newTask]);
                    setRooms(rooms.map(r => r.id === rId ? { ...r, status: 'Dirty' } : r));
                    showAlert('Task Created', 'Housekeeping task assigned successfully.', 'success');
                  });
                }} className="px-5 py-2.5 bg-[#b58c3f] text-white rounded-xl font-bold shadow-md hover:bg-[#a07a33] flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Task
                </button>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-[#f8f7f5] border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Room</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Task</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Due</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {housekeeping.map(hk => {
                      const room = rooms.find(r => r.id === hk.roomId);
                      const assignee = staff.find(s => s.id === hk.assigneeId);
                      
                      // Priority Colors
                      const prioColors = {
                        'Normal': 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]',
                        'High': 'bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]',
                        'Urgent': 'bg-[#fce7f3] text-[#db2777] border-[#fbcfe8]'
                      };
                      
                      // Status Colors
                      const statusColors = {
                        'Dirty': 'bg-[#fce7f3] text-[#db2777] border-[#fbcfe8]',
                        'In Progress': 'bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]',
                        'Clean': 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]'
                      };

                      return (
                        <tr key={hk.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#2d2d2d]">Room {room?.number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-stone">{hk.task}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${prioColors[hk.priority]}`}>
                              {hk.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-stone">{assignee?.name || 'Unassigned'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-stone">{hk.dueDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${statusColors[hk.status]}`}>
                              {hk.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex items-center justify-end gap-3">
                            {hk.status === 'Dirty' && (
                              <button onClick={() => {
                                setHousekeeping(housekeeping.map(h => h.id === hk.id ? { ...h, status: 'In Progress' } : h));
                                setRooms(rooms.map(r => r.id === hk.roomId ? { ...r, status: 'Cleaning' } : r));
                              }} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#b58c3f] hover:bg-[#a07a33] text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                                Start <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {hk.status === 'In Progress' && (
                              <button onClick={() => {
                                setHousekeeping(housekeeping.map(h => h.id === hk.id ? { ...h, status: 'Clean' } : h));
                                setRooms(rooms.map(r => r.id === hk.roomId ? { ...r, status: 'Available' } : r));
                              }} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#b58c3f] hover:bg-[#a07a33] text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                                Mark Done <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => {
                              showConfirm('Delete Task', 'Are you sure you want to remove this housekeeping task?', () => {
                                setHousekeeping(housekeeping.filter(h => h.id !== hk.id));
                              });
                            }} className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors" title="Delete Task">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {housekeeping.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-stone">No housekeeping tasks found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
{/* INCIDENTS */}
        {activeTab === "incidents" && (
          <div className="max-w-5xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Damage & Incidents</h1>
            <div className="space-y-4">
              {incidents.map(inc => {
                const r = rooms.find(room => room.id === inc.roomId);
                return (
                  <div key={inc.id} className="bg-white p-5 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 flex justify-between items-start">
                    <div>
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase \${inc.status === 'Pending Review' ? 'bg-orange-100 text-orange-800' : inc.status === 'Approved' ? 'bg-primary-pale text-primary' : 'bg-muted text-stone'}`}>{inc.status}</span>
                      <h3 className="font-bold text-ink mt-2">Room {r?.number} • {inc.date}</h3>
                      <p className="text-sm text-muted-text mt-1 max-w-2xl">{inc.description}</p>
                      <p className="text-sm font-black text-red-600 mt-3">Estimated Cost: PKR {inc.estimatedCost.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })}
              {incidents.length === 0 && <p className="text-muted-text">No incidents reported.</p>}
            </div>
          </div>
        )}

        
        {/* STAFF & ATTENDANCE (RECEPTIONIST) */}
        {activeTab === "staff" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Staff Directory & Attendance</h1>
            <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Staff ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Today's Attendance</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map(s => {
                    const todayAtt = attendance.find(a => a.staffId === s.id && a.date === today);
                    return (
                      <tr key={s.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-bold text-ink">{s.id}</td>
                        <td className="px-4 py-3 text-sm font-bold text-ink">{s.name}</td>
                        <td className="px-4 py-3 text-sm text-stone">{s.role}</td>
                        <td className="px-4 py-3 text-sm text-stone">{s.phone}</td>
                        <td className="px-4 py-3 text-sm">
                          {todayAtt ? (
                            <span className={`px-2 py-1 text-xs font-bold rounded ${todayAtt.status === 'Present' ? 'bg-success text-white' : todayAtt.status === 'Absent' || todayAtt.status === 'Leave' ? 'bg-error text-white' : 'bg-warning text-white'}`}>
                              {todayAtt.status} 
                              {['Present', 'Late', 'Half Day', 'Overtime'].includes(todayAtt.status) && ` (In: ${todayAtt.checkIn || '-'} | Out: ${todayAtt.checkOut || '-'})`}
                              
                            </span>
                          ) : (
                            <span className="text-muted-text text-xs italic">Not recorded</span>
                          )}
                        </td>
                        <td className="px-4 py-3 flex gap-3">
                          {!todayAtt && (
                            <button onClick={() => {
                               showPrompt('Record Attendance', [
                                 { name: 'status', label: 'Status', type: 'select', defaultValue: 'Present', options: ['Present', 'Absent', 'Late', 'Leave', 'Half Day'] },
                                 { name: 'checkIn', label: 'Check-in Time', type: 'time', defaultValue: '09:00' }
                               ], (data) => {
                                 setAttendance([...attendance, { id: 'att_' + Date.now(), staffId: s.id, date: today, status: data.status as any, checkIn: data.checkIn, overtimeHours: 0, recordedBy: auth?.email || '', approvalStatus: 'Approved' }]);
                                 logAction(auth?.email || '', 'Receptionist', 'Recorded Attendance', 'Attendance', s.id, `Marked ${s.name} as ${data.status}`);
                                 showAlert('Success', 'Attendance recorded.', 'success');
                               });
                            }} className="text-sm font-bold text-primary hover:underline">Mark Attendance</button>
                          )}
                          {todayAtt && !todayAtt.checkOut && ['Present', 'Late', 'Half Day', 'Overtime'].includes(todayAtt.status) && (
                             <button onClick={() => {
                               showPrompt('Check Out Staff', [
                                 { name: 'checkOut', label: 'Check-out Time', type: 'time', defaultValue: '17:00' }
                               ], (data) => {
                                 setAttendance(attendance.map(a => a.id === todayAtt.id ? { ...a, checkOut: data.checkOut } : a));
                                 logAction(auth?.email || '', 'Receptionist', 'Staff Checked Out', 'Attendance', todayAtt.id, `Marked check-out at ${data.checkOut}`);
                                 showAlert('Success', 'Check-out recorded.', 'success');
                               });
                             }} className="text-sm font-bold text-error hover:underline">Check Out</button>
                          )}
                          {todayAtt && (
                             <button onClick={() => {
                               showPrompt('Edit Attendance', [
                                 { name: 'status', label: 'Status', type: 'select', defaultValue: todayAtt.status, options: ['Present', 'Absent', 'Late', 'Leave', 'Half Day', 'Overtime'] },
                                 { name: 'checkIn', label: 'Check-in Time (Optional)', type: 'time', defaultValue: todayAtt.checkIn || '' },
                                 { name: 'checkOut', label: 'Check-out Time (Optional)', type: 'time', defaultValue: todayAtt.checkOut || '' }
                               ], (data) => {
                                 setAttendance(attendance.map(a => a.id === todayAtt.id ? { ...a, status: data.status, checkIn: data.checkIn, checkOut: data.checkOut } : a));
                                 logAction(auth?.email || '', 'Receptionist', 'Edited Attendance', 'Attendance', todayAtt.id, `Updated ${s.name} to ${data.status}`);
                                 showAlert('Success', 'Attendance updated.', 'success');
                               });
                             }} className="p-1.5 bg-muted text-stone hover:bg-primary-pale hover:text-primary rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
  
        
        {/* MAINTENANCE */}
        {activeTab === "maintenance" && (
          <div className="max-w-6xl pb-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-display font-bold text-ink">Maintenance Operations</h1>
              <button onClick={() => {
                showPrompt('Report Maintenance Issue', [
                  { name: 'roomId', label: 'Room', type: 'select', options: ['Select a Room', ...rooms.map(r => r.id + ' - Room ' + r.number)], defaultValue: 'Select a Room' },
                  { name: 'problem', label: 'Problem Summary', type: 'text', defaultValue: '' },
                  { name: 'description', label: 'Detailed Description', type: 'textarea', defaultValue: '' },
                  { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], defaultValue: 'Medium' },
                  { name: 'staffId', label: 'Assign To', type: 'select', options: ['None', ...(staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')).length > 0 ? staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')) : staff).map(s => s.id + ' - ' + s.name)], defaultValue: 'None' },
                  { name: 'roomUsability', label: 'Room Usability', type: 'select', options: ['Keep Operational', 'Mark Maintenance', 'Mark Out of Order'], defaultValue: 'Mark Maintenance' },
                  { name: 'notes', label: 'Initial Notes', type: 'text', defaultValue: '' }
                ], (data) => {
                  const roomSplit = data.roomId.split(' - ');
                  const rId = roomSplit[0];
                  const rNum = roomSplit[1].replace('Room ', '');
                  const sId = data.staffId === 'None' ? '' : data.staffId.split(' - ')[0];
                  
                  const newMaint = {
                    id: 'maint_' + Date.now(),
                    roomId: rId,
                    roomNumber: rNum,
                    problem: data.problem,
                    description: data.description,
                    priority: data.priority,
                    reportedDate: new Date().toLocaleDateString(),
                    reportedTime: new Date().toLocaleTimeString(),
                    reportedBy: auth?.email || 'Unknown',
                    assignedStaffId: sId,
                    status: 'Open',
                    notes: data.notes ? `[${new Date().toLocaleDateString()}] ${data.notes}` : ''
                  };
                  
                  setMaintenance([...maintenance, newMaint]);
                  logAction(auth?.email || '', 'Receptionist', 'Created Maintenance Issue', 'Maintenance', newMaint.id, `Reported ${data.problem} for Room ${rNum}`);
                  
                  if (data.roomUsability !== 'Keep Operational') {
                    const newStatus = data.roomUsability === 'Mark Maintenance' ? 'Maintenance' : 'Out of Order';
                    setRooms(rooms.map(r => r.id === rId ? { ...r, status: newStatus } : r));
                    logAction(auth?.email || '', 'Receptionist', 'Room Status Changed', 'Rooms', rId, `Room ${rNum} marked as ${newStatus} due to maintenance`);
                  }
                  
                  showAlert('Issue Reported', 'Maintenance task successfully logged.', 'success');
                });
              }} className="px-5 py-2.5 bg-accent text-white rounded-xl font-bold text-sm hover:bg-[#b59863] shadow-md flex items-center gap-2"><Plus className="w-4 h-4"/> Create Issue</button>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
              <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-display font-bold text-ink">{maintenance.filter(m => m.status === 'Open').length}</p>
                <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest mt-1">Open Issues</p>
              </div>
              <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-display font-bold text-blue-600">{maintenance.filter(m => m.status === 'In Progress').length}</p>
                <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest mt-1">In Progress</p>
              </div>
              <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-display font-bold text-success">{maintenance.filter(m => m.status === 'Resolved').length}</p>
                <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest mt-1">Resolved</p>
              </div>
              <div className="bg-surface p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-center items-center hover:shadow-md transition-shadow">
                <p className="text-3xl font-display font-bold text-stone">{maintenance.filter(m => m.status === 'Closed').length}</p>
                <p className="text-[10px] font-bold text-muted-text uppercase tracking-widest mt-1">Closed</p>
              </div>
              <div className="bg-surface p-4 rounded-2xl border border-red-200 shadow-sm flex flex-col justify-center items-center hover:shadow-md transition-shadow bg-red-50/30">
                <p className="text-3xl font-display font-bold text-error">{maintenance.filter(m => (m.priority === 'Critical' || m.priority === 'High') && m.status !== 'Closed').length}</p>
                <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1 text-center">High/Critical<br/>Active</p>
              </div>
              <div className="bg-surface p-4 rounded-2xl border border-orange-200 shadow-sm flex flex-col justify-center items-center hover:shadow-md transition-shadow bg-orange-50/30">
                <p className="text-3xl font-display font-bold text-orange-600">{rooms.filter(r => r.status === 'Maintenance' || r.status === 'Out of Order').length}</p>
                <p className="text-[10px] font-bold text-orange-700 uppercase tracking-widest mt-1 text-center">Rooms Under<br/>Repair</p>
              </div>
            </div>

            {!selectedMaintId ? (
              <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">ID / Room</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">Problem</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">Priority</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">Assigned To</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">Cost</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[...maintenance].reverse().map(m => {
                      const assignedUser = staff.find(s => s.id === m.assignedStaffId);
                      return (
                        <tr key={m.id} className="hover:bg-muted/50 transition-colors">
                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-ink cursor-pointer hover:text-primary transition-colors" onClick={() => setSelectedMaintId(m.id)}>Room {m.roomNumber}</p>
                            <p className="text-xs text-stone mt-0.5">{m.id}</p>
                          </td>
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-ink line-clamp-1">{m.problem}</p>
                            <p className="text-xs text-stone mt-0.5">{m.reportedDate}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${m.priority === 'Critical' ? 'bg-red-100 text-red-800' : m.priority === 'High' ? 'bg-orange-100 text-orange-800' : m.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{m.priority}</span>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-stone">
                            {assignedUser ? assignedUser.name : <span className="text-gray-400 italic">Unassigned</span>}
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-ink">
                            {m.cost ? `Rs ${m.cost.toLocaleString()}` : <span className="text-stone font-medium">-</span>}
                          </td>
                          <td className="px-5 py-4">
                            <span className={`px-3 py-1.5 text-[11px] font-bold rounded-lg ${m.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-200' : m.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' : m.status === 'Resolved' ? 'bg-success/10 text-success border border-success/20' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>{m.status}</span>
                          </td>
                          <td className="px-5 py-4 flex justify-end gap-2">
                            <button onClick={() => setSelectedMaintId(m.id)} className="p-2 text-stone hover:text-primary hover:bg-primary-pale rounded-lg transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      )
                    })}
                    {maintenance.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-8 text-center text-stone font-medium">No maintenance issues recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            ) : (() => {
              const m = maintenance.find(x => x.id === selectedMaintId);
              if (!m) return null;
              const assignedUser = staff.find(s => s.id === m.assignedStaffId);
              const room = rooms.find(r => r.id === m.roomId);
              return (
                <div className="bg-surface rounded-2xl border border-border shadow-lg p-8 relative animate-in fade-in zoom-in-95 duration-200">
                  <button onClick={() => setSelectedMaintId(null)} className="absolute top-6 right-6 text-stone hover:text-ink flex items-center gap-2 font-bold text-sm bg-muted px-4 py-2 rounded-xl transition-colors"><ArrowRight className="w-4 h-4 rotate-180" /> Back to List</button>
                  
                  <div className="flex items-start gap-4 mb-8">
                    <div className={`p-4 rounded-2xl ${m.status === 'Closed' ? 'bg-gray-100' : 'bg-orange-50'}`}>
                      <Wrench className={`w-8 h-8 ${m.status === 'Closed' ? 'text-gray-500' : 'text-orange-500'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-display font-bold text-ink">Room {m.roomNumber}</h2>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${m.status === 'Open' ? 'bg-red-100 text-red-800' : m.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : m.status === 'Resolved' ? 'bg-success/20 text-success' : 'bg-gray-100 text-gray-600'}`}>{m.status}</span>
                      </div>
                      <p className="text-stone font-medium text-lg mt-1">{m.problem}</p>
                      <p className="text-xs text-muted-text mt-2 font-bold tracking-widest uppercase">ID: {m.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8 mb-8">
                    <div className="col-span-2 space-y-6">
                      <div className="bg-muted p-5 rounded-xl border border-border">
                        <h4 className="text-xs font-bold text-stone uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-ink leading-relaxed text-sm whitespace-pre-wrap">{m.description || 'No description provided.'}</p>
                      </div>
                      
                      <div className="bg-muted p-5 rounded-xl border border-border">
                        <h4 className="text-xs font-bold text-stone uppercase tracking-wider mb-2">Issue Notes & Updates</h4>
                        <p className="text-ink leading-relaxed text-sm whitespace-pre-wrap">{m.notes || 'No notes available.'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Priority</p>
                        <p className={`font-bold ${m.priority === 'Critical' ? 'text-red-600' : m.priority === 'High' ? 'text-orange-600' : 'text-ink'}`}>{m.priority}</p>
                      </div>
                      <div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Reported By</p>
                        <p className="font-bold text-ink">{m.reportedBy}</p>
                        <p className="text-xs text-stone mt-1">{m.reportedDate} at {m.reportedTime}</p>
                      </div>
                      <div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Assigned Staff</p>
                        <p className="font-bold text-ink">{assignedUser ? assignedUser.name : 'Unassigned'}</p>
                        {assignedUser && <p className="text-xs text-stone mt-1">{assignedUser.role}</p>}
                      </div>
                      <div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Repair Cost</p>
                        <p className="font-bold text-ink">Rs {m.cost ? m.cost.toLocaleString() : '0'}</p>
                      </div>
                      <div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Current Room Status</p>
                        <p className={`font-bold ${room?.status === 'Maintenance' || room?.status === 'Out of Order' ? 'text-error' : room?.status === 'Dirty' ? 'text-orange-600' : 'text-success'}`}>{room?.status || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 flex flex-wrap gap-3">
                    {/* Action: Start Repair */}
                    {m.status === 'Open' && (
                      <button onClick={() => {
                        setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, status: 'In Progress', notes: x.notes + `\n[\n[${new Date().toLocaleDateString()}] Repair started by Receptionist.` } : x));
                        logAction(auth?.email || '', 'Receptionist', 'Started Maintenance Repair', 'Maintenance', m.id, `Marked ${m.id} as In Progress`);
                      }} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">Start Repair</button>
                    )}

                    {/* Action: Mark Resolved */}
                    {m.status === 'In Progress' && (
                      <button onClick={() => {
                        showPrompt('Mark as Resolved', [
                          { name: 'cost', label: 'Repair Cost (PKR)', type: 'number', defaultValue: '0' },
                          { name: 'resolution', label: 'Resolution Notes', type: 'textarea', defaultValue: '' }
                        ], (data) => {
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, status: 'Resolved', resolvedDate: new Date().toLocaleDateString(), cost: Number(data.cost) || 0, notes: x.notes + `\n\n[RESOLVED ${new Date().toLocaleDateString()}] Cost: PKR ${data.cost || 0}. ${data.resolution}` } : x));
                          logAction(auth?.email || '', 'Receptionist', 'Resolved Maintenance', 'Maintenance', m.id, `Resolution: ${data.resolution}`);
                        });
                      }} className="px-5 py-2.5 bg-success text-white font-bold rounded-xl shadow-md hover:bg-green-600 transition-colors">Mark as Resolved</button>
                    )}

                    {/* Action: Verify Room & Close */}
                    {m.status === 'Resolved' && (
                      <button onClick={() => {
                        showPrompt('Verify Room & Close Issue', [
                          { name: 'nextStatus', label: 'What is the physical state of the room now?', type: 'select', options: ['Available (Ready for guests)', 'Dirty (Needs Housekeeping)'], defaultValue: 'Dirty (Needs Housekeeping)' },
                          { name: 'notes', label: 'Verification Notes', type: 'text', defaultValue: 'Verified repair.' }
                        ], (data) => {
                          const isAvailable = data.nextStatus.includes('Available');
                          const newRoomStatus = isAvailable ? 'Available' : 'Dirty';
                          
                          setRooms(rooms.map(r => r.id === m.roomId ? { ...r, status: newRoomStatus } : r));
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, status: 'Closed', closedDate: new Date().toLocaleDateString(), notes: x.notes + `\n\n[CLOSED ${new Date().toLocaleDateString()}] Verified. Room set to ${newRoomStatus}. ${data.notes}` } : x));
                          
                          logAction(auth?.email || '', 'Receptionist', 'Closed Maintenance', 'Maintenance', m.id, `Verified and closed. Room ${m.roomNumber} set to ${newRoomStatus}.`);
                          showAlert('Maintenance Closed', `Issue closed. Room ${m.roomNumber} is now ${newRoomStatus}.`, 'success');
                          setSelectedMaintId(null);
                        });
                      }} className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-light transition-colors">Verify Room & Close Issue</button>
                    )}

                    {/* Action: Add Note */}
                    {m.status !== 'Closed' && (
                      <button onClick={() => {
                        showPrompt('Add Maintenance Note', [
                          { name: 'note', label: 'Note', type: 'textarea', defaultValue: '' }
                        ], (data) => {
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, notes: x.notes + `\n\n[${new Date().toLocaleDateString()}] ${data.note}` } : x));
                          logAction(auth?.email || '', 'Receptionist', 'Added Maintenance Note', 'Maintenance', m.id, `Added note`);
                        });
                      }} className="px-5 py-2.5 bg-white border border-border text-stone font-bold rounded-xl shadow-sm hover:bg-muted transition-colors">Add Note</button>
                    )}

                    {/* Action: Edit (Manager Only) */}
                    {('Receptionist' === 'Manager') && (
                      <button onClick={() => {
                        showPrompt('Edit Maintenance Issue', [
                          { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], defaultValue: m.priority },
                          { name: 'staffId', label: 'Assign To', type: 'select', options: ['None', ...(staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')).length > 0 ? staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')) : staff).map(s => s.id + ' - ' + s.name)], defaultValue: m.assignedStaffId ? m.assignedStaffId + ' - ' + (staff.find(s=>s.id===m.assignedStaffId)?.name) : 'None' },
                        ], (data) => {
                          const sId = data.staffId === 'None' ? '' : data.staffId.split(' - ')[0];
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, priority: data.priority, assignedStaffId: sId } : x));
                          logAction(auth?.email || '', 'Manager', 'Edited Maintenance', 'Maintenance', m.id, `Updated priority/staff.`);
                        });
                      }} className="px-5 py-2.5 bg-white border border-border text-stone font-bold rounded-xl shadow-sm hover:bg-muted transition-colors ml-auto flex items-center gap-2"><Edit2 className="w-4 h-4"/> Edit Issue</button>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        )}

        
        {/* BOOKING HISTORY */}
        {activeTab === 'booking-history' && (
          <div className="max-w-7xl pb-12">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Booking History</h1>
            
            <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Booking ID</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Customer Name</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Room Number</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Room Type</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Booking Date</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Check In</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Check Out</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Total Price</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Remaining Price</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Payment Status</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Occupants</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reservations.map(res => {
                      const guest = guests.find(g => g.id === res.guestId);
                      const room = rooms.find(r => r.id === res.roomId);
                      const stay = stays.find(s => s.reservationId === res.id);
                      
                      const nights = Math.max(1, Math.floor((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000*60*60*24)));
                      
                      let total = 0;
                      let paid = 0;
                      
                      if (stay) {
                        total = charges.filter(c => c.stayId === stay.id).reduce((sum, c) => sum + c.total, 0);
                        paid = payments.filter(p => p.stayId === stay.id).reduce((sum, p) => sum + p.amount, 0);
                      } else {
                        total = res.rate * nights;
                      }
                      
                      const remaining = Math.max(0, total - paid);
                      
                      let pmtStatus = 'Unpaid';
                      let pmtColor = 'text-red-700 bg-red-50';
                      if (remaining <= 0 && total > 0) {
                        pmtStatus = 'Paid';
                        pmtColor = 'text-green-700 bg-green-50';
                      } else if (paid > 0) {
                        pmtStatus = 'Partial';
                        pmtColor = 'text-orange-700 bg-orange-50';
                      }

                      return (
                        <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-ink">{res.id}</td>
                          <td className="px-4 py-4 text-sm font-medium text-ink">{guest?.name || 'Unknown'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{room?.number || 'N/A'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{room?.type || 'N/A'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.checkIn}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.checkIn}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.checkOut}</td>
                          <td className="px-4 py-4 text-sm font-bold text-ink">{total.toLocaleString()}</td>
                          <td className="px-4 py-4 text-sm font-bold text-ink">{remaining.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${pmtColor}`}>{pmtStatus}</span>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.guests}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => {
                              const receiptWindow = window.open('', '_blank', 'width=800,height=600');
                              if (receiptWindow) {
                                receiptWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Receipt - Booking ${res.id}</title>
                                      <style>
                                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: 0 auto; }
                                        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                                        .header h2 { margin: 0; color: #1a1a1a; }
                                        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                                        .bold { font-weight: bold; }
                                        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                                        th, td { padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left; }
                                        th { background-color: #f9fafb; color: #6b7280; font-size: 12px; text-transform: uppercase; }
                                        .totals { margin-top: 20px; border-top: 2px solid #333; padding-top: 20px; }
                                        .totals .row { margin-bottom: 5px; }
                                        .totals .bold-row { font-size: 1.2em; font-weight: bold; margin-top: 10px; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <h2>Hotel Booking Receipt</h2>
                                        <p style="color: #666; margin-top: 5px;">Booking ID: ${res.id}</p>
                                      </div>
                                      <div class="row"><span>Guest Name:</span> <span class="bold">${guest?.name || 'N/A'}</span></div>
                                      <div class="row"><span>Room:</span> <span class="bold">Room ${room?.number || 'N/A'} (${room?.type || 'N/A'})</span></div>
                                      <div class="row"><span>Check In:</span> <span class="bold">${res.checkIn}</span></div>
                                      <div class="row"><span>Check Out:</span> <span class="bold">${res.checkOut}</span></div>
                                      
                                      <table>
                                        <tr><th>Description</th><th style="text-align: right;">Amount (PKR)</th></tr>
                                        <tr><td>Total Charges</td><td style="text-align: right;">${total.toLocaleString()}</td></tr>
                                        <tr><td>Total Payments Made</td><td style="text-align: right;">-${paid.toLocaleString()}</td></tr>
                                      </table>
                                      
                                      <div class="totals">
                                        <div class="row bold-row"><span>Remaining Balance:</span> <span>PKR ${remaining.toLocaleString()}</span></div>
                                      </div>
                                      
                                      <script>
                                        window.onload = function() { 
                                          setTimeout(() => {
                                            window.print();
                                            window.close();
                                          }, 500);
                                        }
                                      </script>
                                    </body>
                                  </html>
                                `);
                                receiptWindow.document.close();
                                logAction(auth?.email || '', 'User', 'Printed Receipt', 'Reservation', res.id, 'Printed Booking Receipt');
                              } else {
                                showAlert('Popup Blocked', 'Please allow popups to print the receipt.', 'error');
                              }
                            }} className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                              <Printer className="w-3.5 h-3.5" />
                              Print Receipt
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {reservations.length === 0 && (
                      <tr><td colSpan={12} className="px-4 py-8 text-center text-stone">No bookings found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

{/* GUESTS */}
        {activeTab === 'guests' && (
          <div className="max-w-6xl">
            {!selectedGuest ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-display font-bold text-ink">Guest Directory</h1>
                  <button onClick={() => setIsAddGuestModalOpen(true)} className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Add Guest</button>
                </div>
                
                <div className="bg-white rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Phone</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">ID / CNIC</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Address</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Notes</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {guests.map(g => (
                        <tr key={g.id} className="hover:bg-muted">
                          <td className="px-4 py-3 text-sm font-bold text-ink">{g.name}</td>
                          <td className="px-4 py-3 text-sm text-muted-text">{g.phone}</td>
                          <td className="px-4 py-3 text-xs text-muted-text">{g.cnic}</td>
                          <td className="px-4 py-3 text-sm text-stone">{g.address || '-'}</td>
                          <td className="px-4 py-3 text-sm text-stone max-w-[150px] truncate" title={g.notes || ''}>{g.notes || '-'}</td>
                          <td className="px-4 py-3 flex gap-3">
                            <button onClick={() => setSelectedGuest(g)} className="text-sm font-bold text-primary hover:underline" title="View Profile"><Eye className="w-4 h-4" /></button>
                            <button onClick={() => {
                              showPrompt('Edit Guest', [
                                { name: 'name', label: 'Name', type: 'text', defaultValue: g.name },
                                { name: 'phone', label: 'Phone', type: 'text', defaultValue: g.phone },
                                { name: 'email', label: 'Email', type: 'text', defaultValue: g.email },
                                { name: 'cnic', label: 'CNIC / ID', type: 'text', defaultValue: g.cnic },
                                { name: 'address', label: 'Address', type: 'text', defaultValue: g.address },
                                { name: 'notes', label: 'Notes', type: 'textarea', defaultValue: g.notes || '' }
                              ], (data) => {
                                setGuests(guests.map(guest => guest.id === g.id ? { ...guest, ...data } : guest));
                                logAction(auth?.email || '', auth?.role || 'User', 'Edited Guest', 'Guest', g.id, `Updated details for ${data.name}`);
                                showAlert('Success', 'Guest details updated successfully.', 'success');
                              });
                            }} className="p-1.5 bg-muted text-stone hover:bg-primary-pale hover:text-primary rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => {
                              setConfirmConfig({
                                isOpen: true,
                                title: 'Delete Guest',
                                message: `Are you sure you want to delete ${g.name}? This action cannot be undone.`,
                                onConfirm: () => {
                                  setGuests(guests.filter(guest => guest.id !== g.id));
                                  logAction(auth?.email || '', auth?.role || 'User', 'Deleted Guest', 'Guest', g.id, `Deleted ${g.name}`);
                                }
                              });
                            }} className="p-1.5 bg-red-50 text-error hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                      {guests.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-muted-text">No guests found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-display font-bold text-ink">Guest Profile: {selectedGuest.name}</h1>
                  <button onClick={() => setSelectedGuest(null)} className="px-4 py-2 bg-muted text-stone rounded-lg font-bold text-sm">Back to Directory</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Details */}
                  <div className="col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="font-bold text-ink border-b pb-2 mb-4">Contact & Identity</h3>
                      <div className="space-y-3 text-sm">
                        <p><span className="text-muted-text block text-xs">Name</span> <strong className="text-ink">{selectedGuest.name}</strong></p>
                        <p><span className="text-muted-text block text-xs">Phone</span> <span className="text-ink">{selectedGuest.phone || '-'}</span></p>
                        <p><span className="text-muted-text block text-xs">Address</span> <span className="text-ink">{selectedGuest.address || '-'}</span></p>
                        <p><span className="text-muted-text block text-xs">CNIC / Passport</span> <span className="text-ink">{selectedGuest.cnic || '-'}</span></p>
                        <p><span className="text-muted-text block text-xs">Notes</span> <span className="text-ink">{selectedGuest.notes || '-'}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: History */}
                  <div className="col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="font-bold text-ink border-b pb-2 mb-4">Folio & Payments</h3>
                      <ul className="divide-y text-sm">
                        {payments.filter(p => stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id).includes(p.stayId)).map(pay => (
                             <li key={pay.id} className="py-3 flex justify-between items-center">
                               <div>
                                 <p className="font-bold">{pay.date}</p>
                                 <p className="text-xs text-muted-text mt-1">{pay.method}</p>
                               </div>
                               <span className="text-primary font-bold">PKR {pay.amount.toLocaleString()}</span>
                             </li>
                        ))}
                        {payments.filter(p => stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id).includes(p.stayId)).length === 0 && <p className="text-muted-text py-2 text-xs">No payments on record.</p>}
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="font-bold text-ink border-b pb-2 mb-4">Stays & Reservations</h3>
                      <ul className="divide-y text-sm">
                        {reservations.filter(r => r.guestId === selectedGuest.id).map(r => {
                           const st = stays.find(s => s.reservationId === r.id);
                           const rm = rooms.find(room => room.id === r.roomId);
                           return (
                             <li key={r.id} className="py-3 flex justify-between items-center">
                               <div>
                                 <p className="font-bold">Room {rm?.number} <span className="text-muted-text font-normal ml-2">{r.checkIn} to {r.checkOut}</span></p>
                                 <p className="text-xs text-muted-text mt-1">Status: {r.status} {st ? `| Stay: ${st.status}` : ''}</p>
                               </div>
                               <span className={`px-2 py-1 text-xs font-bold rounded ${r.status === 'Checked In' ? 'bg-indigo-100 text-indigo-800' : 'bg-muted text-stone'}`}>{r.status}</span>
                             </li>
                           )
                        })}
                        {reservations.filter(r => r.guestId === selectedGuest.id).length === 0 && <p className="text-muted-text py-2 text-xs">No reservations on record.</p>}
                      </ul>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-border shadow-md hover:shadow-lg transition-shadow duration-300">
                      <h3 className="font-bold text-ink border-b pb-2 mb-4">Incidents & Damage</h3>
                      <ul className="divide-y text-sm">
                        {incidents.filter(i => {
                          const guestStays = stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id);
                          return guestStays.includes(i.stayId);
                        }).map(inc => (
                             <li key={inc.id} className="py-3 flex justify-between items-center">
                               <div>
                                 <p className="font-bold">{inc.date}</p>
                                 <p className="text-xs text-muted-text mt-1 max-w-sm truncate">{inc.description}</p>
                               </div>
                               <span className={`px-2 py-1 text-xs font-bold rounded ${inc.status === 'Approved' ? 'bg-red-100 text-red-800' : 'bg-muted'}`}>{inc.status}</span>
                             </li>
                        ))}
                        {incidents.filter(i => stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id).includes(i.stayId)).length === 0 && <p className="text-muted-text py-2 text-xs">No incidents on record.</p>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAddGuestModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
                  <h2 className="text-2xl font-display font-bold mb-5">Add New Guest</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Full Name</label>
                      <input type="text" className="w-full border border-border rounded-lg p-2" value={newGuestForm.name} onChange={e => setNewGuestForm({...newGuestForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Phone</label>
                      <input type="text" className="w-full border border-border rounded-lg p-2" value={newGuestForm.phone} onChange={e => setNewGuestForm({...newGuestForm, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Address</label>
                      <input type="text" className="w-full border border-border rounded-lg p-2" value={newGuestForm.address} onChange={e => setNewGuestForm({...newGuestForm, address: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">CNIC / Passport</label>
                      <input type="text" className="w-full border border-border rounded-lg p-2" value={newGuestForm.cnic} onChange={e => setNewGuestForm({...newGuestForm, cnic: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-muted-text mb-1">Notes</label>
                      <textarea className="w-full border border-border rounded-lg p-2" value={newGuestForm.notes} onChange={e => setNewGuestForm({...newGuestForm, notes: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsAddGuestModalOpen(false)} className="px-4 py-2 bg-muted text-muted-text font-bold rounded-lg">Cancel</button>
                    <button onClick={() => {
                      if(!newGuestForm.name) { showAlert('Missing Field', 'Guest Name is required.', 'error'); return; }
                      setGuests([...guests, { id: 'g_' + Date.now(), name: newGuestForm.name, phone: newGuestForm.phone, address: newGuestForm.address, cnic: newGuestForm.cnic, notes: newGuestForm.notes }]);
                      setIsAddGuestModalOpen(false);
                      setNewGuestForm({ name: '', phone: '', address: '', cnic: '', notes: '' });
                    }} className="px-4 py-2 bg-primary text-white font-bold rounded-lg">Save Guest</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Daily Reports</h1>
            <p className="text-muted-text">Refer to the Manager Portal for full financial reports.</p>
          </div>
        )}

  
      {/* GLOBAL MODALS */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-8 rounded-2xl max-w-sm w-full shadow-2xl border-t-4 border-accent animate-in fade-in zoom-in-95 duration-200">
            <h3 className={"text-2xl font-display font-bold mb-3 " + (alertConfig.type === 'error' ? 'text-error' : alertConfig.type === 'success' ? 'text-success' : 'text-ink')}>{alertConfig.title}</h3>
            <p className="text-stone mb-6">{alertConfig.message}</p>
            <div className="flex justify-end">
              <button onClick={() => setAlertConfig({...alertConfig, isOpen: false})} className="w-full py-3 bg-primary text-accent-light font-bold tracking-wide rounded-xl hover:bg-primary-light shadow-md">OK</button>
            </div>
          </div>
        </div>
      )}

      {confirmConfig.isOpen && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-8 rounded-2xl max-w-sm w-full shadow-2xl border-t-4 border-accent animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-display font-bold mb-3 text-ink">{confirmConfig.title}</h3>
            <p className="text-stone mb-6">{confirmConfig.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmConfig({...confirmConfig, isOpen: false})} className="px-5 py-2.5 bg-canvas border border-border text-stone font-bold rounded-xl hover:bg-muted">Cancel</button>
              <button onClick={() => { confirmConfig.onConfirm(); setConfirmConfig({...confirmConfig, isOpen: false}); }} className="px-5 py-2.5 bg-primary text-accent-light font-bold rounded-xl hover:bg-primary-light shadow-md">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {promptConfig.isOpen && (
        <div className="fixed inset-0 bg-ink/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-8 rounded-2xl max-w-md w-full shadow-2xl border-t-4 border-accent animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <h3 className="text-2xl font-display font-bold mb-5 text-ink">{promptConfig.title}</h3>
            <div className="space-y-4 mb-6 overflow-y-auto pr-2">
              {promptConfig.fields.map((f: any) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-stone mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  ) : f.type === 'select' ? (
                    <select className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})}>
                      {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'file' ? (
                    <div className="border border-border rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary flex flex-col gap-2">
                      {promptData[f.name] && <img src={promptData[f.name]} alt="Preview" className="h-24 w-auto object-cover rounded-md border border-border" />}
                      <input type="file" accept="image/*" className="w-full text-sm text-stone file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const MAX_WIDTH = 600;
                              let width = img.width;
                              let height = img.height;
                              if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, width, height);
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                              setPromptData(prev => ({...prev, [f.name]: dataUrl}));
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  ) : (
                    <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name] || ''} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 mt-auto shrink-0 pt-2">
              <button onClick={() => setPromptConfig({...promptConfig, isOpen: false})} className="px-5 py-2.5 bg-canvas border border-border text-stone font-bold rounded-xl hover:bg-muted">Cancel</button>
              <button onClick={() => { promptConfig.onSubmit(promptData); setPromptConfig({...promptConfig, isOpen: false}); }} className="px-5 py-2.5 bg-primary text-accent-light font-bold rounded-xl hover:bg-primary-light shadow-md">Submit</button>
            </div>
          </div>
        </div>
      )}
  
    </div>
    </div>
  );
}
