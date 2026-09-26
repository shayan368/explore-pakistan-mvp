const fs = require('fs');
const lines = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8').split('\n');
const match = lines.findIndex(l => l.includes('activeTab === "rooms"'));
if(match > -1) {
  for(let i=match-2; i<=match+20; i++) if(lines[i]) console.log((i+1) + ': ' + lines[i]);
}
