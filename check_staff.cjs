const fs = require('fs');
let lines = fs.readFileSync('src/hms/useHMS.ts', 'utf8').split('\n');
const start = lines.findIndex(l => l.includes('localStorage.setItem("hms_staff"'));
if (start > -1) {
  for(let i=start; i<=start+10; i++) if(lines[i]) console.log((i+1) + ': ' + lines[i]);
}
