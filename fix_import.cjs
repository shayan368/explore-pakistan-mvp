const fs = require('fs');
let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');
code = code.replace('Plus, } from "lucide-react";', 'Plus } from "lucide-react";');
fs.writeFileSync('src/hms/ManagerView.tsx', code);
