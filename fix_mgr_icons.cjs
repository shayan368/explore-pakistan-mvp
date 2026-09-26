const fs = require('fs');
let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');

const toAdd = ['ArrowRight', 'Wrench', 'Eye'];
let modified = false;

toAdd.forEach(icon => {
  if (!code.includes(icon + ',')) {
    code = code.replace(/\} from "lucide-react";/, `, ${icon} } from "lucide-react";`);
    modified = true;
  }
});

if (modified) {
  fs.writeFileSync('src/hms/ManagerView.tsx', code);
  console.log('Fixed missing imports in ManagerView.tsx');
} else {
  console.log('No missing imports found.');
}
