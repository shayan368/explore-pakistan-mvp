const fs = require('fs');

let lines = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8').split('\n');
lines[23] = "    currency: '$',";
lines.splice(24, 1389 - 24);
fs.writeFileSync('src/hms/ManagerView.tsx', lines.join('\n'));
console.log('Fixed ManagerView.tsx');
