const fs = require('fs');

function fixHousekeepingDropdowns(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix Room Dropdown
  const roomRegex = /\{ name: 'roomId', label: 'Room', type: 'select', options: rooms\.map\(r => r\.id \+ ' - Room ' \+ r\.number\), defaultValue: rooms\[0\]\?\.id \+ ' - Room ' \+ rooms\[0\]\?\.number \}/g;
  const newRoomStr = `{ name: 'roomId', label: 'Room', type: 'select', options: rooms.map(r => r.id + ' - Room ' + r.number), defaultValue: rooms.length > 0 ? (rooms[0].id + ' - Room ' + rooms[0].number) : '' }`;
  code = code.replace(roomRegex, newRoomStr);

  // Fix Assignee Dropdown (apply fallback)
  const assignRegex = /\{ name: 'assigneeId', label: 'Assign To', type: 'select', options: \['None', \.\.\.staff\.filter\(s => s\.department === 'Housekeeping' \|\| s\.role\.includes\('House'\)\)\.map\(s => s\.id \+ ' - ' \+ s\.name\)\], defaultValue: 'None' \}/g;
  
  const newAssignStr = `{ name: 'assigneeId', label: 'Assign To', type: 'select', options: ['None', ...(staff.filter(s => (s.department||'').toLowerCase().includes('housekeeping') || (s.role||'').toLowerCase().includes('house')).length > 0 ? staff.filter(s => (s.department||'').toLowerCase().includes('housekeeping') || (s.role||'').toLowerCase().includes('house')) : staff).map(s => s.id + ' - ' + s.name + ' (' + s.role + ')')], defaultValue: 'None' }`;
  code = code.replace(assignRegex, newAssignStr);

  fs.writeFileSync(filename, code);
  console.log('Fixed dropdowns in ' + filename);
}

fixHousekeepingDropdowns('src/hms/ManagerView.tsx');
fixHousekeepingDropdowns('src/hms/ReceptionistView.tsx');
