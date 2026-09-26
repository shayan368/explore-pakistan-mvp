const fs = require('fs');
let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');

const toAdd = ['CheckCircle2', 'BedDouble'];
let added = false;

toAdd.forEach(icon => {
  if (!code.includes(icon + ',')) { // Simple check, might be at the end, but safe enough
    code = code.replace(/\} from "lucide-react";/, `, ${icon} } from "lucide-react";`);
    added = true;
  }
});

if (added) {
  fs.writeFileSync('src/hms/ManagerView.tsx', code);
  console.log('Fixed missing icons in ManagerView.tsx');
}
