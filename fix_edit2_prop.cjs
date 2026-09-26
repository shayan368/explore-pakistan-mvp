const fs = require('fs');

['src/hms/ManagerView.tsx', 'src/hms/ReceptionistView.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  const importBlock = code.substring(0, 500);
  if (!importBlock.includes('Edit2')) {
    code = code.replace(/\} from "lucide-react";/, ', Edit2, Trash2 } from "lucide-react";');
    fs.writeFileSync(file, code);
    console.log('Fixed imports in ' + file);
  }
});
