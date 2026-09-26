const fs = require('fs');

function fixDestructuring(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Replace `maintenance, setMaintenance` with `maintenance, setMaintenance, housekeeping, setHousekeeping`
  const regex = /maintenance,\s*setMaintenance,/;
  if (regex.test(code)) {
    code = code.replace(regex, 'maintenance, setMaintenance, housekeeping, setHousekeeping,');
    fs.writeFileSync(filename, code);
    console.log('Fixed destructuring in ' + filename);
  } else {
    console.log('Could not find maintenance in ' + filename);
  }
}

fixDestructuring('src/hms/ManagerView.tsx');
fixDestructuring('src/hms/ReceptionistView.tsx');
