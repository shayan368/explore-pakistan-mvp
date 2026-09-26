const fs = require('fs');

const code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');
const lines = code.split('\n');
const start = lines.findIndex(l => l.includes('activeTab === "settings"'));
if (start > -1) {
  for(let i=start-2; i<=start+30; i++) if(lines[i]) console.log((i+1) + ': ' + lines[i]);
}
