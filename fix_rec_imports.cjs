const fs = require('fs');
let code = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8');
code = code.replace(/\}\s*,\s*Building\s*\}\s*,\s*List\s*\}\s*,\s*Grid\s*\}\s*,\s*RefreshCw\s*\}\s*from\s*"lucide-react";/, ', Building, List, Grid, RefreshCw } from "lucide-react";');
fs.writeFileSync('src/hms/ReceptionistView.tsx', code);
console.log('Fixed imports in Rec View');
