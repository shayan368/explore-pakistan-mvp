const fs = require('fs');

function addCheckOut(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Update the Attendance cell rendering
  const oldCell = /<td className="px-4 py-3 text-sm">\s*\{todayAtt \? \(\s*<span className=\{\\?`px-2 py-1 text-xs font-bold rounded \\\?\$\{todayAtt\.status === 'Present' \? 'bg-success text-white' : 'bg-warning text-white'\}\\?`\}>\{todayAtt\.status\} \(\{todayAtt\.checkIn \|\| '-'\}\) \[\{todayAtt\.approvalStatus\}\]<\/span>\s*\) : \(\s*<span className="text-muted-text text-xs italic">Not recorded<\/span>\s*\)\}\s*<\/td>/;

  const newCell = `<td className="px-4 py-3 text-sm">
                          {todayAtt ? (
                            <span className={\`px-2 py-1 text-xs font-bold rounded \${todayAtt.status === 'Present' ? 'bg-success text-white' : 'bg-warning text-white'}\`}>{todayAtt.status} (In: {todayAtt.checkIn || '-'} | Out: {todayAtt.checkOut || '-'}) [{todayAtt.approvalStatus}]</span>
                          ) : (
                            <span className="text-muted-text text-xs italic">Not recorded</span>
                          )}
                        </td>`;

  code = code.replace(oldCell, newCell);

  // Update the Action cell rendering
  const oldAction = /<td className="px-4 py-3">\s*\{\!todayAtt && \(\s*<button onClick=\{\(\) => \{\s*showPrompt\('Record Attendance', \[\s*\{ name: 'status', label: 'Status \(Present\/Absent\/Late\)', type: 'text', defaultValue: 'Present' \},\s*\{ name: 'checkIn', label: 'Check-in Time', type: 'time', defaultValue: '09:00' \}\s*\], \(data\) => \{\s*setAttendance\(\[\.\.\.attendance, \{ id: 'att_' \+ Date\.now\(\), staffId: s\.id, date: today, status: data\.status as any, checkIn: data\.checkIn, overtimeHours: 0, recordedBy: auth\?\.email \|\| '', approvalStatus: 'Pending' \}\]\);\s*logAction\(auth\?\.email \|\| '', 'Receptionist', 'Recorded Attendance', 'Attendance', s\.id, \\?`Marked \\\?\$\{s\.name\} as \\\?\$\{data\.status\}\\?`\);\s*showAlert\('Success', 'Attendance recorded\.', 'success'\);\s*\}\);\s*\}\} className="text-sm font-bold text-primary hover:underline">Mark Attendance<\/button>\s*\)\}\s*<\/td>/;

  const newAction = `<td className="px-4 py-3 flex gap-3">
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
                          {todayAtt && !todayAtt.checkOut && (
                             <button onClick={() => {
                               showPrompt('Check Out Staff', [
                                 { name: 'checkOut', label: 'Check-out Time', type: 'time', defaultValue: '17:00' }
                               ], (data) => {
                                 setAttendance(attendance.map(a => a.id === todayAtt.id ? { ...a, checkOut: data.checkOut } : a));
                                 logAction(auth?.email || '', 'Receptionist', 'Staff Checked Out', 'Attendance', todayAtt.id, \`Marked check-out at \${data.checkOut}\`);
                                 showAlert('Success', 'Check-out recorded.', 'success');
                               });
                             }} className="text-sm font-bold text-error hover:underline">Check Out</button>
                          )}
                        </td>`;

  code = code.replace(oldAction, newAction);

  fs.writeFileSync(filename, code);
  console.log('Fixed checkout in ' + filename);
}

// apply to both if applicable, but ReceptionistView has the staff directory
addCheckOut('src/hms/ReceptionistView.tsx');
