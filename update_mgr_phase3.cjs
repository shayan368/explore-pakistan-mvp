const fs = require('fs');

function updateManager(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add search state, payroll, auditlog, logAction
  const importsHook = `staff, setStaff, attendance, setAttendance, payroll, setPayroll, auditLog, logAction,`;
  code = code.replace(/const \{\s*rooms,\s*setRooms,/, `const { ${importsHook} rooms, setRooms,`);

  const searchState = `
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
    if (res.type === 'Guest') { setActiveTab('guests'); setSelectedGuest(res.data); }
    if (res.type === 'Room') { setActiveTab('rooms'); }
    if (res.type === 'Reservation') { setActiveTab('reservations'); setSelectedReservation(res.data); }
    if (res.type === 'Stay') { setActiveTab('active-stays'); }
    if (res.type === 'Payment') { setActiveTab('payments'); }
    if (res.type === 'Incident') { setActiveTab('incidents'); }
    if (res.type === 'Maintenance') { setActiveTab('maintenance'); }
    if (res.type === 'Staff') { setActiveTab('staff'); }
  };
  `;
  code = code.replace(/const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/, `$&${searchState}`);

  // Inject Staff Tab into sidebarLinks
  code = code.replace(
    /\{ id: "reports", label: "Reports", icon: BarChart3 \},/,
    `{ id: "staff", label: "Staff", icon: Users },
    { id: "payroll", label: "Payroll", icon: Banknote },
    { id: "audit-log", label: "Audit Log", icon: FileText },
    $&`
  );

  // Global Search UI
  const globalSearchUI = `
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
  `;
  code = code.replace(/<div className="flex-1 overflow-y-auto p-8">/, `<div className="flex-1 overflow-y-auto p-8">\n${globalSearchUI}`);

  // New Tabs UI (Staff, Payroll, Audit Log)
  const tabsUI = `
        {/* STAFF & ATTENDANCE (MANAGER) */}
        {activeTab === "staff" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Staff Management & Attendance</h1>
            <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto mb-8">
              <div className="p-4 bg-muted border-b border-border flex justify-between items-center">
                <h2 className="text-lg font-bold text-ink">Staff Directory</h2>
                <button onClick={() => {
                  showPrompt('Add Staff Member', [
                    { name: 'name', label: 'Name', type: 'text', defaultValue: '' },
                    { name: 'role', label: 'Role', type: 'text', defaultValue: '' },
                    { name: 'phone', label: 'Phone', type: 'text', defaultValue: '' },
                    { name: 'basicSalary', label: 'Basic Salary', type: 'number', defaultValue: '0' }
                  ], (data) => {
                    const newStaff = { id: 'stf_' + Date.now(), name: data.name, role: data.role, department: 'General', phone: data.phone, joiningDate: today, employmentType: 'Full-time' as any, salaryType: 'Monthly' as any, basicSalary: parseFloat(data.basicSalary || '0'), allowances: 0, deductions: 0, status: 'Active' as any };
                    setStaff([...staff, newStaff]);
                    logAction(auth?.email || '', 'Manager', 'Added Staff', 'Staff', newStaff.id, \`Added \${data.name}\`);
                    showAlert('Success', 'Staff member added successfully.', 'success');
                  });
                }} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow hover:bg-primary-light">
                  + Add Staff
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Staff ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Role</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Basic Salary</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map(s => (
                    <tr key={s.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm font-bold text-ink">{s.id}</td>
                      <td className="px-4 py-3 text-sm font-bold text-ink">{s.name}</td>
                      <td className="px-4 py-3 text-sm text-stone">{s.role}</td>
                      <td className="px-4 py-3 text-sm text-stone">PKR {s.basicSalary}</td>
                      <td className="px-4 py-3 text-sm text-stone">{s.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h1 className="text-3xl font-display font-bold text-ink mb-6">Attendance Approvals</h1>
            <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Staff Name</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Date</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Recorded By</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {attendance.filter(a => a.approvalStatus === 'Pending').map(a => {
                    const s = staff.find(st => st.id === a.staffId);
                    return (
                      <tr key={a.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-bold text-ink">{s?.name || a.staffId}</td>
                        <td className="px-4 py-3 text-sm text-stone">{a.date}</td>
                        <td className="px-4 py-3 text-sm font-bold text-ink">{a.status}</td>
                        <td className="px-4 py-3 text-sm text-stone">{a.recordedBy}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => {
                            setAttendance(attendance.map(att => att.id === a.id ? { ...att, approvalStatus: 'Approved', approvedBy: auth?.email } : att));
                            logAction(auth?.email || '', 'Manager', 'Approved Attendance', 'Attendance', a.id, \`Approved for \${s?.name}\`);
                          }} className="px-3 py-1 bg-success text-white rounded text-xs font-bold mr-2">Approve</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYROLL */}
        {activeTab === "payroll" && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-display font-bold text-ink">Payroll Processing</h1>
              <button onClick={() => {
                showPrompt('Generate Payroll', [
                  { name: 'staffId', label: 'Staff ID (e.g. stf_1)', type: 'text', defaultValue: '' },
                  { name: 'period', label: 'Period (e.g. Sep 2026)', type: 'text', defaultValue: 'Sep 2026' }
                ], (data) => {
                  const s = staff.find(st => st.id === data.staffId);
                  if (s) {
                    const gross = s.basicSalary + s.allowances;
                    const net = gross - s.deductions;
                    const p: any = { id: 'prl_' + Date.now(), staffId: s.id, period: data.period, basicSalary: s.basicSalary, allowances: s.allowances, overtime: 0, bonus: 0, deductions: s.deductions, advances: 0, adjustments: 0, grossSalary: gross, netSalary: net, status: 'Pending' };
                    setPayroll([...payroll, p]);
                    logAction(auth?.email || '', 'Manager', 'Generated Payroll', 'Payroll', p.id, \`Generated for \${s.name}\`);
                    showAlert('Success', 'Payroll generated.', 'success');
                  } else {
                    showAlert('Error', 'Staff not found.', 'error');
                  }
                });
              }} className="px-4 py-2 bg-primary text-white font-bold rounded-lg shadow-md hover:bg-primary-light">Generate Payroll</button>
            </div>
            
            <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Staff</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Period</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Net Salary</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payroll.map(p => {
                    const s = staff.find(st => st.id === p.staffId);
                    return (
                      <tr key={p.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm text-stone">{p.id}</td>
                        <td className="px-4 py-3 text-sm font-bold text-ink">{s?.name || p.staffId}</td>
                        <td className="px-4 py-3 text-sm text-stone">{p.period}</td>
                        <td className="px-4 py-3 text-sm font-bold text-ink">PKR {p.netSalary}</td>
                        <td className="px-4 py-3 text-sm text-stone">{p.status}</td>
                        <td className="px-4 py-3 flex gap-2">
                          {p.status === 'Pending' && (
                            <button onClick={() => {
                              setPayroll(payroll.map(pr => pr.id === p.id ? { ...pr, status: 'Approved', approvedBy: auth?.email } : pr));
                              logAction(auth?.email || '', 'Manager', 'Approved Payroll', 'Payroll', p.id, \`Approved for \${s?.name}\`);
                            }} className="px-3 py-1 bg-accent text-primary rounded text-xs font-bold">Approve</button>
                          )}
                          {p.status === 'Approved' && (
                            <button onClick={() => {
                              setPayroll(payroll.map(pr => pr.id === p.id ? { ...pr, status: 'Paid', paidDate: today } : pr));
                              logAction(auth?.email || '', 'Manager', 'Marked Salary Paid', 'Payroll', p.id, \`Paid to \${s?.name}\`);
                            }} className="px-3 py-1 bg-success text-white rounded text-xs font-bold">Mark Paid</button>
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

        {/* AUDIT LOG */}
        {activeTab === "audit-log" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">System Audit Log</h1>
            <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Date/Time</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">User (Role)</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Entity</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLog.map(log => (
                    <tr key={log.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 text-xs text-stone">{new Date(log.date).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-bold text-ink">{log.user} <span className="text-xs font-normal text-muted-text">({log.role})</span></td>
                      <td className="px-4 py-3 text-sm font-bold text-primary">{log.action}</td>
                      <td className="px-4 py-3 text-sm text-stone">{log.entity} <span className="text-xs text-muted-text">({log.entityId})</span></td>
                      <td className="px-4 py-3 text-sm text-stone">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
  `;
  code = code.replace(/\{\/\* INCIDENTS \*\/\}/, `${tabsUI}\n        {/* INCIDENTS */}`);

  // Add contextual staff info to Incidents
  code = code.replace(
    /const incident = incidents\.find\(i => i\.id === incidentId\);/g,
    `$& const incidentStaff = incident?.reportedByUserId ? staff.find(s => s.id === incident?.reportedByUserId) : null;`
  );

  // Update audit log in incident approvals
  code = code.replace(
    /alert\("Incident approved and folio updated\."\);/,
    `logAction(auth?.email || '', 'Manager', 'Approved Damage', 'Incident', incident.id, \`Approved \${newAmount}\`);\n                        $&`
  );
  code = code.replace(
    /alert\("Incident rejected\."\);/,
    `logAction(auth?.email || '', 'Manager', 'Rejected Damage', 'Incident', incident.id, \`Rejected incident\`);\n                        $&`
  );

  fs.writeFileSync(filename, code);
  console.log('Updated ' + filename);
}

updateManager('src/hms/ManagerView.tsx');
