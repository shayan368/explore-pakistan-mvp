const fs = require('fs');

function fixHMS(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Inject state hooks
  const hooks = `
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [payroll, setPayroll] = useState<Payroll[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);

  const logAction = (user: string, role: string, action: string, entity: string, entityId: string, details: string) => {
    const newLog = { id: 'log_' + Date.now() + Math.random(), user, role, action, entity, entityId, date: new Date().toISOString(), details };
    setAuditLog(prev => [newLog, ...prev]);
  };
  `;
  code = code.replace(/const \[maintenance, setMaintenance\] = useState<Maintenance\[\]>\(\[\]\);/, `$&${hooks}`);

  // Inject seeding inside loadData
  const seedStr = `
        localStorage.setItem("hms_staff", JSON.stringify([
          { id: 'stf_1', name: 'Shayan Ahmad', role: 'Manager', department: 'Management', phone: '03001234567', joiningDate: '2025-01-01', employmentType: 'Full-time', salaryType: 'Monthly', basicSalary: 150000, allowances: 20000, deductions: 5000, status: 'Active' },
          { id: 'stf_2', name: 'Ali Raza', role: 'Receptionist', department: 'Front Desk', phone: '03111234567', joiningDate: '2025-02-01', employmentType: 'Full-time', salaryType: 'Monthly', basicSalary: 80000, allowances: 5000, deductions: 2000, status: 'Active' },
          { id: 'stf_3', name: 'Fatima Bibi', role: 'Housekeeper', department: 'Housekeeping', phone: '03221234567', joiningDate: '2025-03-01', employmentType: 'Daily Worker', salaryType: 'Daily', basicSalary: 2000, allowances: 0, deductions: 0, status: 'Active' },
          { id: 'stf_4', name: 'Usman Tariq', role: 'Maintenance Worker', department: 'Maintenance', phone: '03331234567', joiningDate: '2025-04-01', employmentType: 'Contract', salaryType: 'Hourly', basicSalary: 500, allowances: 0, deductions: 0, status: 'Active' },
          { id: 'stf_5', name: 'Ayesha Khan', role: 'Restaurant Staff', department: 'F&B', phone: '03441234567', joiningDate: '2025-05-01', employmentType: 'Part-time', salaryType: 'Hourly', basicSalary: 400, allowances: 0, deductions: 0, status: 'Active' }
        ]));
        localStorage.setItem("hms_attendance", JSON.stringify([
          { id: 'att_1', staffId: 'stf_3', date: new Date().toISOString().split('T')[0], status: 'Present', checkIn: '08:00', checkOut: '', overtimeHours: 0, recordedBy: 'shayan@reception.com', approvalStatus: 'Pending' }
        ]));
        localStorage.setItem("hms_payroll", JSON.stringify([]));
        localStorage.setItem("hms_audit_log", JSON.stringify([]));
  `;
  code = code.replace(/localStorage\.setItem\("hms_maintenance", JSON\.stringify\(\[\{ id: "m1", roomId: "r6", problem: "AC not working", status: "Open", date: "2026-09-05" \}\]\)\);/, `$&${seedStr}`);

  // Inject loading
  const loadStr = `
      setStaff(JSON.parse(localStorage.getItem("hms_staff") || "[]"));
      setAttendance(JSON.parse(localStorage.getItem("hms_attendance") || "[]"));
      setPayroll(JSON.parse(localStorage.getItem("hms_payroll") || "[]"));
      setAuditLog(JSON.parse(localStorage.getItem("hms_audit_log") || "[]"));
  `;
  code = code.replace(/setMaintenance\(JSON\.parse\(localStorage\.getItem\("hms_maintenance"\) \|\| "\[\]"\)\);/, `$&${loadStr}`);

  // Inject saving inside useEffect dependency
  const saveStr = `
  useEffect(() => { localStorage.setItem("hms_staff", JSON.stringify(staff)); }, [staff]);
  useEffect(() => { localStorage.setItem("hms_attendance", JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem("hms_payroll", JSON.stringify(payroll)); }, [payroll]);
  useEffect(() => { localStorage.setItem("hms_audit_log", JSON.stringify(auditLog)); }, [auditLog]);
  `;
  code = code.replace(/useEffect\(\(\) => \{ localStorage\.setItem\("hms_maintenance", JSON\.stringify\(maintenance\)\); \}, \[maintenance\]\);/, `$&${saveStr}`);

  fs.writeFileSync(filename, code);
  console.log('Fixed HMS state!');
}
fixHMS('src/hms/useHMS.ts');
