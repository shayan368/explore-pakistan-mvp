const fs = require('fs');
const lines = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8').split('\n');
for(let i=0; i<15; i++) if(lines[i]) console.log((i+1) + ': ' + lines[i]);
