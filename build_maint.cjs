const fs = require('fs');

function buildMaintenance(filename, role) {
  let code = fs.readFileSync(filename, 'utf8');

  // Inject selectedMaintId state if not present
  if (!code.includes('selectedMaintId')) {
    code = code.replace(/const \[activeTab, setActiveTab\] = useState\((.*?)\);/, 
      `const [activeTab, setActiveTab] = useState($1);\n  const [selectedMaintId, setSelectedMaintId] = useState<string | null>(null);`);
  }

  // Find the `{/* MAINTENANCE */}` block
  const startTag = '{/* MAINTENANCE */}';
  
  // Need to find where it ends. We look for the next `{/*`
  const startIdx = code.indexOf(startTag);
  if (startIdx === -1) {
    console.log('Could not find maintenance block in ' + filename);
    return;
  }
  
  let endIdx = code.indexOf('{/*', startIdx + startTag.length);
  if (endIdx === -1) {
    // maybe it's the last block
    endIdx = code.indexOf('</div>\n    </div>\n  );');
  }

  if (startIdx > -1 && endIdx > -1) {
    const before = code.substring(0, startIdx);
    const after = code.substring(endIdx);

    const maintBlock = `
        {/* MAINTENANCE */}
        {activeTab === "maintenance" && (
          <div className="max-w-6xl pb-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-display font-bold text-ink">Maintenance Operations</h1>
              <button onClick={() => {
                showPrompt('Report Maintenance Issue', [
                  { name: 'roomId', label: 'Room', type: 'select', options: rooms.map(r => r.id + ' - Room ' + r.number), defaultValue: rooms[0]?.id + ' - Room ' + rooms[0]?.number },
                  { name: 'problem', label: 'Problem Summary', type: 'text', defaultValue: '' },
                  { name: 'description', label: 'Detailed Description', type: 'textarea', defaultValue: '' },
                  { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], defaultValue: 'Medium' },
                  { name: 'staffId', label: 'Assign To', type: 'select', options: ['None', ...staff.filter(s => s.role.toLowerCase().includes('main') || s.role.toLowerCase().includes('eng')).map(s => s.id + ' - ' + s.name)], defaultValue: 'None' },
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
                    notes: data.notes ? \`[\${new Date().toLocaleDateString()}] \${data.notes}\` : ''
                  };
                  
                  setMaintenance([...maintenance, newMaint]);
                  logAction(auth?.email || '', '${role}', 'Created Maintenance Issue', 'Maintenance', newMaint.id, \`Reported \${data.problem} for Room \${rNum}\`);
                  
                  if (data.roomUsability !== 'Keep Operational') {
                    const newStatus = data.roomUsability === 'Mark Maintenance' ? 'Maintenance' : 'Out of Order';
                    setRooms(rooms.map(r => r.id === rId ? { ...r, status: newStatus } : r));
                    logAction(auth?.email || '', '${role}', 'Room Status Changed', 'Rooms', rId, \`Room \${rNum} marked as \${newStatus} due to maintenance\`);
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
                            <span className={\`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full \${m.priority === 'Critical' ? 'bg-red-100 text-red-800' : m.priority === 'High' ? 'bg-orange-100 text-orange-800' : m.priority === 'Medium' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}\`}>{m.priority}</span>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-stone">
                            {assignedUser ? assignedUser.name : <span className="text-gray-400 italic">Unassigned</span>}
                          </td>
                          <td className="px-5 py-4">
                            <span className={\`px-3 py-1.5 text-[11px] font-bold rounded-lg \${m.status === 'Open' ? 'bg-red-50 text-red-700 border border-red-200' : m.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-200' : m.status === 'Resolved' ? 'bg-success/10 text-success border border-success/20' : 'bg-gray-100 text-gray-600 border border-gray-200'}\`}>{m.status}</span>
                          </td>
                          <td className="px-5 py-4 flex justify-end gap-2">
                            <button onClick={() => setSelectedMaintId(m.id)} className="p-2 text-stone hover:text-primary hover:bg-primary-pale rounded-lg transition-colors" title="View Details"><Eye className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      )
                    })}
                    {maintenance.length === 0 && (
                      <tr><td colSpan={6} className="px-5 py-8 text-center text-stone font-medium">No maintenance issues recorded.</td></tr>
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
                    <div className={\`p-4 rounded-2xl \${m.status === 'Closed' ? 'bg-gray-100' : 'bg-orange-50'}\`}>
                      <Wrench className={\`w-8 h-8 \${m.status === 'Closed' ? 'text-gray-500' : 'text-orange-500'}\`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-display font-bold text-ink">Room {m.roomNumber}</h2>
                        <span className={\`px-3 py-1 text-xs font-bold rounded-full \${m.status === 'Open' ? 'bg-red-100 text-red-800' : m.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : m.status === 'Resolved' ? 'bg-success/20 text-success' : 'bg-gray-100 text-gray-600'}\`}>{m.status}</span>
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
                        <p className={\`font-bold \${m.priority === 'Critical' ? 'text-red-600' : m.priority === 'High' ? 'text-orange-600' : 'text-ink'}\`}>{m.priority}</p>
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
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Current Room Status</p>
                        <p className={\`font-bold \${room?.status === 'Maintenance' || room?.status === 'Out of Order' ? 'text-error' : room?.status === 'Dirty' ? 'text-orange-600' : 'text-success'}\`}>{room?.status || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-6 flex flex-wrap gap-3">
                    {/* Action: Start Repair */}
                    {m.status === 'Open' && (
                      <button onClick={() => {
                        setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, status: 'In Progress', notes: x.notes + \`\\n[\\n[\${new Date().toLocaleDateString()}] Repair started by Receptionist.\` } : x));
                        logAction(auth?.email || '', '${role}', 'Started Maintenance Repair', 'Maintenance', m.id, \`Marked \${m.id} as In Progress\`);
                      }} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-colors">Start Repair</button>
                    )}

                    {/* Action: Mark Resolved */}
                    {m.status === 'In Progress' && (
                      <button onClick={() => {
                        showPrompt('Mark as Resolved', [
                          { name: 'resolution', label: 'Resolution Notes', type: 'textarea', defaultValue: '' }
                        ], (data) => {
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, status: 'Resolved', resolvedDate: new Date().toLocaleDateString(), notes: x.notes + \`\\n\\n[RESOLVED \${new Date().toLocaleDateString()}] \${data.resolution}\` } : x));
                          logAction(auth?.email || '', '${role}', 'Resolved Maintenance', 'Maintenance', m.id, \`Resolution: \${data.resolution}\`);
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
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, status: 'Closed', closedDate: new Date().toLocaleDateString(), notes: x.notes + \`\\n\\n[CLOSED \${new Date().toLocaleDateString()}] Verified. Room set to \${newRoomStatus}. \${data.notes}\` } : x));
                          
                          logAction(auth?.email || '', '${role}', 'Closed Maintenance', 'Maintenance', m.id, \`Verified and closed. Room \${m.roomNumber} set to \${newRoomStatus}.\`);
                          showAlert('Maintenance Closed', \`Issue closed. Room \${m.roomNumber} is now \${newRoomStatus}.\`, 'success');
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
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, notes: x.notes + \`\\n\\n[\${new Date().toLocaleDateString()}] \${data.note}\` } : x));
                          logAction(auth?.email || '', '${role}', 'Added Maintenance Note', 'Maintenance', m.id, \`Added note\`);
                        });
                      }} className="px-5 py-2.5 bg-white border border-border text-stone font-bold rounded-xl shadow-sm hover:bg-muted transition-colors">Add Note</button>
                    )}

                    {/* Action: Edit (Manager Only) */}
                    {('${role}' === 'Manager') && (
                      <button onClick={() => {
                        showPrompt('Edit Maintenance Issue', [
                          { name: 'priority', label: 'Priority', type: 'select', options: ['Low', 'Medium', 'High', 'Critical'], defaultValue: m.priority },
                          { name: 'staffId', label: 'Assign To', type: 'select', options: ['None', ...staff.map(s => s.id + ' - ' + s.name)], defaultValue: m.assignedStaffId ? m.assignedStaffId + ' - ' + (staff.find(s=>s.id===m.assignedStaffId)?.name) : 'None' },
                        ], (data) => {
                          const sId = data.staffId === 'None' ? '' : data.staffId.split(' - ')[0];
                          setMaintenance(maintenance.map(x => x.id === m.id ? { ...x, priority: data.priority, assignedStaffId: sId } : x));
                          logAction(auth?.email || '', 'Manager', 'Edited Maintenance', 'Maintenance', m.id, \`Updated priority/staff.\`);
                        });
                      }} className="px-5 py-2.5 bg-white border border-border text-stone font-bold rounded-xl shadow-sm hover:bg-muted transition-colors ml-auto flex items-center gap-2"><Edit2 className="w-4 h-4"/> Edit Issue</button>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        )}
\n        `;

    code = before + maintBlock + after;
    fs.writeFileSync(filename, code);
    console.log('Successfully injected advanced Maintenance module into ' + filename);
  }
}

buildMaintenance('src/hms/ManagerView.tsx', 'Manager');
buildMaintenance('src/hms/ReceptionistView.tsx', 'Receptionist');
