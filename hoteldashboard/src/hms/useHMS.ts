import { useState, useEffect } from "react";

export type Role = "manager" | "receptionist";
export type RoomStatus = "Available" | "Reserved" | "Occupied" | "Dirty" | "Cleaning" | "Maintenance" | "Out of Order";
export type ResStatus = "Confirmed" | "Expected" | "Checked In" | "Checked Out" | "Completed" | "Cancelled" | "No-show";
export type IncidentStatus = "Pending Review" | "Approved" | "Rejected" | "Disputed" | "Closed";

export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  rate: number;
  floor: string;
  capacity: number;
  imageUrl?: string;
}

export interface Guest {
  id: string;
  name: string;
  phone: string;
  cnic: string;
  address?: string;
  notes: string;
}

export interface Reservation {
  id: string;
  guestId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rate: number;
  source: string;
  status: ResStatus;
}

export interface Stay {
  id: string;
  reservationId: string;
  roomId: string;
  guestId: string;
  status: "Active" | "Checked Out";
}

export interface Charge {
  id: string;
  stayId: string;
  category: string;
  description: string;
  total: number;
  date: string;
}

export interface Payment {
  id: string;
  stayId: string;
  amount: number;
  method: string;
  date: string;
}

export interface Incident {
  id: string;
  stayId: string;
  roomId: string;
  description: string;
  estimatedCost: number;
  status: IncidentStatus;
  date: string;
  reportedByUserId?: string;
  approvedByUserId?: string;
}


export interface HousekeepingTask {
  id: string;
  roomId: string;
  task: string;
  priority: 'Normal' | 'High' | 'Urgent';
  assigneeId: string;
  dueDate: string;
  status: 'Dirty' | 'In Progress' | 'Clean';
}

export interface Maintenance {
  id: string;
  roomId: string;
  roomNumber: string;
  problem: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  reportedDate: string;
  reportedTime: string;
  reportedBy: string;
  assignedStaffId: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  cost?: number;
  notes: string;
  resolvedDate?: string;
  closedDate?: string;
}

const SEED_ROOMS: Room[] = [
  { id: "r1", number: "101", type: "Standard Queen", status: "Available", rate: 12000, floor: "Floor 1", capacity: 2, imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop" },
  { id: "r2", number: "102", type: "Deluxe King", status: "Available", rate: 18500, floor: "Floor 1", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop" },
  { id: "r3", number: "103", type: "Superior Twin", status: "Occupied", rate: 14500, floor: "Floor 1", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop" },
  { id: "r4", number: "104", type: "Junior Suite", status: "Available", rate: 26500, floor: "Floor 1", capacity: 5, imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop" },
  { id: "r5", number: "201", type: "Executive Suite", status: "Maintenance", rate: 39000, floor: "Floor 2", capacity: 4, imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop" },
  { id: "r6", number: "202", type: "Standard Queen", status: "Available", rate: 12000, floor: "Floor 2", capacity: 2, imageUrl: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=600&auto=format&fit=crop" },
  { id: "r7", number: "203", type: "Deluxe King", status: "Available", rate: 18500, floor: "Floor 2", capacity: 2, imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600&auto=format&fit=crop" },
  { id: "r8", number: "204", type: "Superior Twin", status: "Cleaning", rate: 14500, floor: "Floor 2", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?q=80&w=600&auto=format&fit=crop" },
  { id: "r9", number: "205", type: "Junior Suite", status: "Occupied", rate: 26500, floor: "Floor 2", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop" },
];

const SEED_GUESTS: Guest[] = [
  { id: "g1", name: "Ahmed Khan", phone: "03001234567", cnic: "12345-1234567-1", notes: "VIP guest" },
  { id: "g2", name: "Sara Malik", phone: "03211234567", cnic: "12345-1234567-2", notes: "" },
];

const SEED_RESERVATIONS: Reservation[] = [
  { id: "res1", guestId: "g1", roomId: "r2", checkIn: "2026-09-01", checkOut: "2026-09-10", guests: 2, rate: 12000, source: "Explore Pakistan", status: "Checked In" },
  { id: "res2", guestId: "g2", roomId: "r3", checkIn: "2026-09-06", checkOut: "2026-09-08", guests: 1, rate: 25000, source: "Walk-in", status: "Confirmed" },
];

const SEED_STAYS: Stay[] = [
  { id: "stay1", reservationId: "res1", roomId: "r2", guestId: "g1", status: "Active" },
];


export interface Staff {
  id: string;
  name: string;
  role: string;
  department: string;
  phone: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Daily Worker';
  salaryType: 'Monthly' | 'Daily' | 'Hourly';
  basicSalary: number;
  allowances: number;
  deductions: number;
  status: 'Active' | 'Inactive';
  notes?: string;
}

export interface Attendance {
  id: string;
  staffId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Leave' | 'Half Day' | 'Overtime';
  checkIn?: string;
  checkOut?: string;
  overtimeHours: number;
  notes?: string;
  recordedBy: string;
  approvedBy?: string;
  approvalStatus: 'Approved' | 'Approved' | 'Rejected';
}

export interface Payroll {
  id: string;
  staffId: string;
  period: string; // e.g., 'September 2026'
  basicSalary: number;
  allowances: number;
  overtime: number;
  bonus: number;
  deductions: number;
  advances: number;
  adjustments: number;
  grossSalary: number;
  netSalary: number;
  status: 'Pending' | 'Paid';
  approvedBy?: string;
  paidDate?: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  entity: string;
  entityId: string;
  date: string;
  details: string;
}

export function useHMS() {
  const [auth, setAuth] = useState<{ role: Role; email: string } | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stays, setStays] = useState<Stay[]>([]);
  const [charges, setCharges] = useState<Charge[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [maintenance, setMaintenance] = useState<Maintenance[]>([]);
  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);

  const logAction = (user: string, role: string, action: string, entity: string, entityId: string, details: string) => {
    const newLog = { id: 'log_' + Date.now() + Math.random(), user, role, action, entity, entityId, date: new Date().toISOString(), details };
    setAuditLog(prev => [newLog, ...prev]);
  };
  

  // Load from local storage on mount
  useEffect(() => {
    const loadData = () => {
      const authData = localStorage.getItem("hms_auth");
      if (authData) setAuth(JSON.parse(authData));

      const storedRooms = localStorage.getItem("hms_rooms");
      if (!storedRooms) {
        // Initialize seed data
        localStorage.setItem("hms_rooms", JSON.stringify(SEED_ROOMS));
        localStorage.setItem("hms_guests", JSON.stringify(SEED_GUESTS));
        localStorage.setItem("hms_reservations", JSON.stringify(SEED_RESERVATIONS));
        localStorage.setItem("hms_stays", JSON.stringify(SEED_STAYS));
        localStorage.setItem("hms_charges", JSON.stringify([]));
        localStorage.setItem("hms_payments", JSON.stringify([]));
        localStorage.setItem("hms_incidents", JSON.stringify([]));
        localStorage.setItem("hms_maintenance", JSON.stringify([{ id: "m1", roomId: "r5", roomNumber: "201", problem: "AC not working", description: "The AC unit in room 201 is blowing warm air. Guests complained.", priority: "High", reportedDate: "2026-09-05", reportedTime: "10:30 AM", reportedBy: "shayan@reception.com", assignedStaffId: "", status: "Open", notes: "Called maintenance team", cost: 0 }]));
        localStorage.setItem("hms_housekeeping", JSON.stringify([
          { id: "hk_1", roomId: "r2", task: "Full turnover clean", priority: "High", assigneeId: "stf_3", dueDate: new Date().toLocaleDateString(), status: "Dirty" },
          { id: "hk_2", roomId: "r4", task: "Evening turndown service", priority: "Normal", assigneeId: "stf_3", dueDate: new Date().toLocaleDateString(), status: "Dirty" }
        ]));
        localStorage.setItem("hms_staff", JSON.stringify([
          { id: 'stf_1', name: 'Shayan Ahmad', role: 'Manager', department: 'Management', phone: '03001234567', joiningDate: '2025-01-01', employmentType: 'Full-time', salaryType: 'Monthly', basicSalary: 150000, allowances: 20000, deductions: 5000, status: 'Active' },
          { id: 'stf_2', name: 'Ali Raza', role: 'Receptionist', department: 'Front Desk', phone: '03111234567', joiningDate: '2025-02-01', employmentType: 'Full-time', salaryType: 'Monthly', basicSalary: 80000, allowances: 5000, deductions: 2000, status: 'Active' },
          { id: 'stf_3', name: 'Fatima Bibi', role: 'Housekeeper', department: 'Housekeeping', phone: '03221234567', joiningDate: '2025-03-01', employmentType: 'Daily Worker', salaryType: 'Daily', basicSalary: 2000, allowances: 0, deductions: 0, status: 'Active' },
          { id: 'stf_4', name: 'Usman Tariq', role: 'Maintenance Worker', department: 'Maintenance', phone: '03331234567', joiningDate: '2025-04-01', employmentType: 'Contract', salaryType: 'Hourly', basicSalary: 500, allowances: 0, deductions: 0, status: 'Active' },
          { id: 'stf_5', name: 'Ayesha Khan', role: 'Restaurant Staff', department: 'F&B', phone: '03441234567', joiningDate: '2025-05-01', employmentType: 'Part-time', salaryType: 'Hourly', basicSalary: 400, allowances: 0, deductions: 0, status: 'Active' }
        ]));
        localStorage.setItem("hms_attendance", JSON.stringify([
          { id: 'att_1', staffId: 'stf_3', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '08:00', checkOut: '', overtimeHours: 0, recordedBy: 'shayan@reception.com', approvalStatus: 'Approved' }
        ]));
        localStorage.setItem("hms_payroll", JSON.stringify([]));
        localStorage.setItem("hms_audit_log", JSON.stringify([]));
  
      }

      setRooms(JSON.parse(localStorage.getItem("hms_rooms") || "[]"));
      setGuests(JSON.parse(localStorage.getItem("hms_guests") || "[]"));
      setReservations(JSON.parse(localStorage.getItem("hms_reservations") || "[]"));
      setStays(JSON.parse(localStorage.getItem("hms_stays") || "[]"));
      setCharges(JSON.parse(localStorage.getItem("hms_charges") || "[]"));
      setPayments(JSON.parse(localStorage.getItem("hms_payments") || "[]"));
      setIncidents(JSON.parse(localStorage.getItem("hms_incidents") || "[]"));
      setMaintenance(JSON.parse(localStorage.getItem("hms_maintenance") || "[]"));
      setHousekeeping(JSON.parse(localStorage.getItem("hms_housekeeping") || "[]"));
      setStaff(JSON.parse(localStorage.getItem("hms_staff") || "[]"));
      setAttendance(JSON.parse(localStorage.getItem("hms_attendance") || "[]"));
      setPayroll(JSON.parse(localStorage.getItem("hms_payroll") || "[]"));
      setAuditLog(JSON.parse(localStorage.getItem("hms_audit_log") || "[]"));
      setIsLoaded(true);
    };
    loadData();
  }, []);

  // Sync to local storage
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_rooms", JSON.stringify(rooms)); }, [rooms, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_guests", JSON.stringify(guests)); }, [guests, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_reservations", JSON.stringify(reservations)); }, [reservations, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_stays", JSON.stringify(stays)); }, [stays, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_charges", JSON.stringify(charges)); }, [charges, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_payments", JSON.stringify(payments)); }, [payments, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_incidents", JSON.stringify(incidents)); }, [incidents, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_maintenance", JSON.stringify(maintenance)); }, [maintenance, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_housekeeping", JSON.stringify(housekeeping)); }, [housekeeping, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_staff", JSON.stringify(staff)); }, [staff, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_attendance", JSON.stringify(attendance)); }, [attendance, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_payroll", JSON.stringify(payroll)); }, [payroll, isLoaded]);
  useEffect(() => { if (isLoaded) localStorage.setItem("hms_audit_log", JSON.stringify(auditLog)); }, [auditLog, isLoaded]);
  

  const login = (role: Role, email: string) => {
    const data = { role, email };
    setAuth(data);
    localStorage.setItem("hms_auth", JSON.stringify(data));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("hms_auth");
  };

  const resetDemoData = () => {
    localStorage.removeItem("hms_rooms");
    window.location.reload();
  };

  return {
    auth, login, logout, resetDemoData,
    rooms, setRooms,
    guests, setGuests,
    reservations, setReservations,
    stays, setStays,
    charges, setCharges,
    payments, setPayments,
    incidents, setIncidents,
    maintenance, setMaintenance, housekeeping, setHousekeeping,
    staff, setStaff, attendance, setAttendance, payroll, setPayroll, auditLog, setAuditLog, logAction };
}
