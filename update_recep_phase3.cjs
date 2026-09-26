const fs = require('fs');

function updateReceptionist(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add search state and audit log actions to the component
  const importsHook = `staff, attendance, setAttendance, logAction,`;
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
    if (res.type === 'Room') { setActiveTab('room-board'); }
    if (res.type === 'Reservation') { setActiveTab('reservations'); setSelectedReservation(res.data); }
    if (res.type === 'Stay') { setActiveTab('active-stays'); }
    if (res.type === 'Payment') { setActiveTab('folio-pos'); }
    if (res.type === 'Incident') { setActiveTab('incidents'); }
    if (res.type === 'Maintenance') { setActiveTab('maintenance'); }
    if (res.type === 'Staff') { setActiveTab('staff'); }
  };
  `;
  code = code.replace(/const today = new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\];/, `$&${searchState}`);

  // Inject Staff Tab into sidebarLinks
  code = code.replace(
    /\{ id: "maintenance", label: "Maintenance", icon: Wrench \},/,
    `$&
    { id: "staff", label: "Staff", icon: Users },`
  );

  // Inject Staff Tab UI
  const staffTabUI = `
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
                            <span className={\`px-2 py-1 text-xs font-bold rounded \${todayAtt.status === 'Present' ? 'bg-success text-white' : 'bg-warning text-white'}\`}>{todayAtt.status} ({todayAtt.checkIn || '-'}) [{todayAtt.approvalStatus}]</span>
                          ) : (
                            <span className="text-muted-text text-xs italic">Not recorded</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {!todayAtt && (
                            <button onClick={() => {
                               showPrompt('Record Attendance', [
                                 { name: 'status', label: 'Status (Present/Absent/Late)', type: 'text', defaultValue: 'Present' },
                                 { name: 'checkIn', label: 'Check-in Time', type: 'time', defaultValue: '09:00' }
                               ], (data) => {
                                 setAttendance([...attendance, { id: 'att_' + Date.now(), staffId: s.id, date: today, status: data.status as any, checkIn: data.checkIn, overtimeHours: 0, recordedBy: auth?.email || '', approvalStatus: 'Pending' }]);
                                 logAction(auth?.email || '', 'Receptionist', 'Recorded Attendance', 'Attendance', s.id, \`Marked \${s.name} as \${data.status}\`);
                                 showAlert('Success', 'Attendance recorded.', 'success');
                               });
                            }} className="text-sm font-bold text-primary hover:underline">Mark Attendance</button>
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
  `;
  code = code.replace(/\{\/\* MAINTENANCE \*\/\}/, `${staffTabUI}\n        {/* MAINTENANCE */}`);

  // Inject Global Search UI into the header area
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

  // Contextual reference for Maintenance
  code = code.replace(
    /onClick=\{\(\) => showPrompt\('Report Maintenance', \[\s*\{\s*name: 'roomNum', label: 'Room Number', type: 'text', defaultValue: ''\s*\},/g,
    `onClick={() => showPrompt('Report Maintenance', [\n      { name: 'roomNum', label: 'Room Number', type: 'text', defaultValue: '' },\n      { name: 'staffId', label: 'Assign Staff ID (optional)', type: 'text', defaultValue: '' },`
  );
  code = code.replace(
    /setMaintenance\(\[\.\.\.maintenance, \{ id: 'maint_' \+ Date\.now\(\), roomId: room\.id, description: data\.desc, status: 'Pending', date: today \}\]\);/,
    `setMaintenance([...maintenance, { id: 'maint_' + Date.now(), roomId: room.id, description: data.desc, status: 'Pending', date: today, assignedStaffId: data.staffId }]);\n        logAction(auth?.email || '', 'Receptionist', 'Reported Maintenance', 'Room', room.number, \`Reported: \${data.desc}\`);`
  );

  // Contextual reference for Housekeeping
  code = code.replace(/<button onClick=\{\(\) => setHousekeeping\(\[\.\.\.housekeeping, \{ id: "hk_" \+ Date\.now\(\), roomId: room\.id, date: today, status: "Cleaning", assignedTo: "Housekeeping Team" \}\]\)\}/g, 
    `<button onClick={() => {
        showPrompt('Start Cleaning', [{name:'staffId', label:'Assigned Staff ID (e.g. stf_3)', type:'text', defaultValue:''}], (data) => {
          setHousekeeping([...housekeeping, { id: "hk_" + Date.now(), roomId: room.id, date: today, status: "Cleaning", assignedTo: "Housekeeping Team", assignedStaffId: data.staffId }]);
          logAction(auth?.email || '', 'Receptionist', 'Updated Housekeeping', 'Room', room.number, \`Marked Cleaning. Assigned: \${data.staffId}\`);
        });
    }}`
  );

  // Add audit logs
  code = code.replace(/showAlert\('Check-in Successful', 'Guest successfully checked in!', 'success'\);/g, `logAction(auth?.email || '', 'Receptionist', 'Checked In', 'Reservation', selectedReservation.id, \`Checked in Room \${selectedRoom.number}\`);\n    $&`);
  code = code.replace(/showAlert\('Check-out Complete', 'Room is now marked as Dirty\.', 'success'\);/g, `logAction(auth?.email || '', 'Receptionist', 'Checked Out', 'Stay', stay.id, \`Checked out Stay \${stay.id}\`);\n    $&`);
  code = code.replace(/showAlert\('Success', 'Reservation created successfully!', 'success'\);/g, `logAction(auth?.email || '', 'Receptionist', 'Created Reservation', 'Reservation', newRes.id, \`Created for \${selectedGuest.name}\`);\n    $&`);
  code = code.replace(/showAlert\('Payment Collected'/g, `logAction(auth?.email || '', 'Receptionist', 'Collected Payment', 'Stay', stay.id, \`Collected payment\`);\n    $&`);
  
  fs.writeFileSync(filename, code);
  console.log('Updated ' + filename);
}

updateReceptionist('src/hms/ReceptionistView.tsx');
