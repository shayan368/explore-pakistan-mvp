const fs = require('fs');
let code = fs.readFileSync('src/hms/useHMS.ts', 'utf8');

// The return block is at the end
const regex = /maintenance,\s*setMaintenance,/;
if (regex.test(code)) {
  code = code.replace(regex, 'maintenance, setMaintenance, housekeeping, setHousekeeping,');
  fs.writeFileSync('src/hms/useHMS.ts', code);
  console.log('Fixed useHMS.ts exports');
}
