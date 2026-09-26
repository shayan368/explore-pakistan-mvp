const fs = require('fs');

function fixSaveEffects(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  code = code.replace(
    /useEffect\(\(\) => \{ localStorage\.setItem\("hms_staff", JSON\.stringify\(staff\)\); \}, \[staff\]\);/g,
    'useEffect(() => { if (staff.length) localStorage.setItem("hms_staff", JSON.stringify(staff)); }, [staff]);'
  );
  code = code.replace(
    /useEffect\(\(\) => \{ localStorage\.setItem\("hms_attendance", JSON\.stringify\(attendance\)\); \}, \[attendance\]\);/g,
    'useEffect(() => { if (attendance.length) localStorage.setItem("hms_attendance", JSON.stringify(attendance)); }, [attendance]);'
  );
  code = code.replace(
    /useEffect\(\(\) => \{ localStorage\.setItem\("hms_payroll", JSON\.stringify\(payroll\)\); \}, \[payroll\]\);/g,
    'useEffect(() => { if (payroll.length) localStorage.setItem("hms_payroll", JSON.stringify(payroll)); }, [payroll]);'
  );
  code = code.replace(
    /useEffect\(\(\) => \{ localStorage\.setItem\("hms_audit_log", JSON\.stringify\(auditLog\)\); \}, \[auditLog\]\);/g,
    'useEffect(() => { if (auditLog.length) localStorage.setItem("hms_audit_log", JSON.stringify(auditLog)); }, [auditLog]);'
  );

  fs.writeFileSync(filename, code);
  console.log('Fixed useEffects to prevent clearing on refresh in ' + filename);
}

fixSaveEffects('src/hms/useHMS.ts');
