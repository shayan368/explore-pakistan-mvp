const fs = require('fs');

let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');

// Find the line where 'maintenance' is destructured but 'setMaintenance' is missing
const regex = /maintenance,\s*setIncidents/;
if (regex.test(code)) {
  code = code.replace(regex, 'maintenance, setMaintenance, setIncidents');
  fs.writeFileSync('src/hms/ManagerView.tsx', code);
  console.log('Fixed destructuring in ManagerView.tsx');
} else {
  console.log('Could not find maintenance in ManagerView.tsx');
}
