const fs = require('fs');
const lines = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8').split('\n');
const match = lines.findIndex(l => l.includes("activeTab === 'room-board'") || l.includes('activeTab === "room-board"'));
if(match > -1) {
  for(let i=match-1; i<=match+25; i++) if(lines[i]) console.log((i+1) + ': ' + lines[i]);
}
