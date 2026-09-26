const fs = require('fs');

['src/hms/ManagerView.tsx', 'src/hms/ReceptionistView.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  if (!code.includes('Edit2')) {
    code = code.replace(/\} from "lucide-react";/, ', Edit2, Trash2 } from "lucide-react";');
    fs.writeFileSync(file, code);
    console.log('Fixed imports in ' + file);
  }
});
