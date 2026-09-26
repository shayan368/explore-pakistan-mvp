const fs = require('fs');
['src/hms/ManagerView.tsx', 'src/hms/ReceptionistView.tsx'].forEach(file => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/\\`/g, '`');
  fs.writeFileSync(file, code);
  console.log('Fixed backticks in', file);
});
