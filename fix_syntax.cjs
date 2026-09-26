const fs = require('fs');
function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(')}\n                    </div>\n                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">', ')}\n                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">');
  fs.writeFileSync(file, code);
}
fix('src/hms/ReceptionistView.tsx');
fix('src/hms/ManagerView.tsx');
