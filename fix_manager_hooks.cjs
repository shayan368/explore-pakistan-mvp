const fs = require('fs');

function fixHooks(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Insert exactly after `auth, logout, `
  const importsHook = `staff, setStaff, attendance, setAttendance, payroll, setPayroll, auditLog, logAction, `;
  
  if (!code.includes('staff, setStaff, attendance')) {
    code = code.replace(/auth,\s*logout,/, `$& ${importsHook}`);
  }

  fs.writeFileSync(filename, code);
  console.log('Fixed useHMS destructuring in ' + filename);
}

fixHooks('src/hms/ReceptionistView.tsx');
fixHooks('src/hms/ManagerView.tsx');
