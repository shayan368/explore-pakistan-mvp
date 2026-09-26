const fs = require('fs');

function updateUseHMS(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add new interfaces
  const newInterfaces = `
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
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
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
  status: 'Pending' | 'Approved' | 'Paid';
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
`;

  // Insert interfaces before export function useHMS
  code = code.replace(/export function useHMS\(\)/, newInterfaces + '\nexport function useHMS()');

  // Add properties to existing interfaces
  code = code.replace(/export interface Maintenance \{([\s\S]*?)\}/, `export interface Maintenance {$1  assignedStaffId?: string;\n}`);
  code = code.replace(/export interface Housekeeping \{([\s\S]*?)\}/, `export interface Housekeeping {$1  assignedStaffId?: string;\n}`);
  code = code.replace(/export interface Incident \{([\s\S]*?)\}/, `export interface Incident {$1  reportedByUserId?: string;\n  approvedByUserId?: string;\n}`);

  // Add state hooks
  const newHooks = `
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);

  const logAction = (user: string, role: string, action: string, entity: string, entityId: string, details: string) => {
    const newLog = { id: 'log_' + Date.now() + Math.random(), user, role, action, entity, entityId, date: new Date().toISOString(), details };
    setAuditLog(prev => [newLog, ...prev]);
  };
  `;
  code = code.replace(/const \[settings, setSettings\] = useState\(.*?\);/, `const [settings, setSettings] = useState({taxRate: 15, checkoutTime: '12:00', cancellationFee: 50});${newHooks}`);

  // Load from localStorage
  const newLoads = `
    const savedStaff = localStorage.getItem('hms_staff');
    if (savedStaff) setStaff(JSON.parse(savedStaff));
    const savedAttendance = localStorage.getItem('hms_attendance');
    if (savedAttendance) setAttendance(JSON.parse(savedAttendance));
    const savedPayroll = localStorage.getItem('hms_payroll');
    if (savedPayroll) setPayroll(JSON.parse(savedPayroll));
    const savedAuditLog = localStorage.getItem('hms_audit_log');
    if (savedAuditLog) setAuditLog(JSON.parse(savedAuditLog));
  `;
  code = code.replace(/const savedSettings = localStorage\.getItem\('hms_settings'\);\s*if \(savedSettings\) setSettings\(JSON\.parse\(savedSettings\)\);/, `const savedSettings = localStorage.getItem('hms_settings');\n    if (savedSettings) setSettings(JSON.parse(savedSettings));${newLoads}`);

  // Save to localStorage
  const newSaves = `
    localStorage.setItem('hms_staff', JSON.stringify(staff));
    localStorage.setItem('hms_attendance', JSON.stringify(attendance));
    localStorage.setItem('hms_payroll', JSON.stringify(payroll));
    localStorage.setItem('hms_audit_log', JSON.stringify(auditLog));
  `;
  code = code.replace(/localStorage\.setItem\('hms_settings', JSON\.stringify\(settings\)\);/, `localStorage.setItem('hms_settings', JSON.stringify(settings));${newSaves}`);

  // Add to returned object
  code = code.replace(/return \{([\s\S]*?)\};/, `return {$1, staff, setStaff, attendance, setAttendance, payroll, setPayroll, auditLog, setAuditLog, logAction };`);

  // Initial Seed Data Modification
  const seedStaffData = `
        localStorage.setItem('hms_staff', JSON.stringify([
          { id: 'stf_1', name: 'Shayan Ahmad', role: 'Manager', department: 'Management', phone: '03001234567', joiningDate: '2025-01-01', employmentType: 'Full-time', salaryType: 'Monthly', basicSalary: 150000, allowances: 20000, deductions: 5000, status: 'Active' },
          { id: 'stf_2', name: 'Ali Raza', role: 'Receptionist', department: 'Front Desk', phone: '03111234567', joiningDate: '2025-02-01', employmentType: 'Full-time', salaryType: 'Monthly', basicSalary: 80000, allowances: 5000, deductions: 2000, status: 'Active' },
          { id: 'stf_3', name: 'Fatima Bibi', role: 'Housekeeper', department: 'Housekeeping', phone: '03221234567', joiningDate: '2025-03-01', employmentType: 'Daily Worker', salaryType: 'Daily', basicSalary: 2000, allowances: 0, deductions: 0, status: 'Active' },
          { id: 'stf_4', name: 'Usman Tariq', role: 'Maintenance Worker', department: 'Maintenance', phone: '03331234567', joiningDate: '2025-04-01', employmentType: 'Contract', salaryType: 'Hourly', basicSalary: 500, allowances: 0, deductions: 0, status: 'Active' },
          { id: 'stf_5', name: 'Ayesha Khan', role: 'Restaurant Staff', department: 'F&B', phone: '03441234567', joiningDate: '2025-05-01', employmentType: 'Part-time', salaryType: 'Hourly', basicSalary: 400, allowances: 0, deductions: 0, status: 'Active' }
        ]));
        localStorage.setItem('hms_attendance', JSON.stringify([
          { id: 'att_1', staffId: 'stf_3', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '08:00', checkOut: '', overtimeHours: 0, recordedBy: 'stf_2', approvalStatus: 'Pending' }
        ]));
        localStorage.setItem('hms_payroll', JSON.stringify([]));
        localStorage.setItem('hms_audit_log', JSON.stringify([]));
  `;
  code = code.replace(/localStorage\.setItem\('hms_incidents',\s*JSON\.stringify\(\[\s*\{[\s\S]*?\}\s*\]\)\);/, `$&${seedStaffData}`);

  fs.writeFileSync(filename, code);
  console.log('Updated useHMS.ts');
}

updateUseHMS('src/hms/useHMS.ts');
