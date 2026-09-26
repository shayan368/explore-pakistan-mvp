const fs = require('fs');
let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');
code = code.replace(/\} , List, Grid \} from "lucide-react";/, ', List, Grid } from "lucide-react";');
fs.writeFileSync('src/hms/ManagerView.tsx', code);
console.log('Fixed imports');
