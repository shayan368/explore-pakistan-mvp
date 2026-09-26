const fs = require('fs');
let lines = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8').split('\n');
lines.splice(20, 0, 
  '  const occupied = rooms.filter(r => r.status === "Occupied").length;',
  '  const available = rooms.filter(r => r.status === "Available").length;',
  '  const reserved = rooms.filter(r => r.status === "Reserved").length;',
  '  const dirty = rooms.filter(r => r.status === "Dirty" || r.status === "Cleaning").length;',
  '  const maintCount = rooms.filter(r => r.status === "Maintenance" || r.status === "Out of Order").length;'
);
fs.writeFileSync('src/hms/ReceptionistView.tsx', lines.join('\n'));
