const fs = require('fs');

let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');

const toAdd = `
  // Stats specifically for the Rooms Tab
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningMaintRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length;
`;

if (!code.includes('availableRooms = rooms.filter')) {
  // Inject it right before {/* ROOMS */}
  code = code.replace(/\{\/\* ROOMS\*\/\}/, toAdd + '\n        {/* ROOMS */}');
  // Just in case it was replaced in the previous step to the one with space
  code = code.replace(/\{\/\* ROOMS \*\/\}/, toAdd + '\n        {/* ROOMS */}');
  
  fs.writeFileSync('src/hms/ManagerView.tsx', code);
  console.log('Injected missing stats variables');
} else {
  console.log('Already exists');
}
