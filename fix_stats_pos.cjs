const fs = require('fs');
let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');

const badInjection = `  // Stats specifically for the Rooms Tab
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningMaintRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length;
`;

code = code.replace(badInjection, '');
// there might be empty lines
code = code.replace(/\n\s*\n\s*\{\/\* ROOMS \*\/\}/, '\n        {/* ROOMS */}');

const goodInjection = `const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningMaintRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length;`;

code = code.replace(/const totalRooms = rooms\.length;/, goodInjection);

fs.writeFileSync('src/hms/ManagerView.tsx', code);
console.log('Moved stats to component body');
