const fs = require('fs');

function removeApprovedFromPayroll(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Change the dropdown options in Edit Payroll
  code = code.replace(
    /options: \['Pending', 'Approved', 'Paid'\]/,
    "options: ['Pending', 'Paid']"
  );
  
  // Replace the interface in useHMS.ts if we pass it
  if (filename.includes('useHMS')) {
    code = code.replace(
      /status: 'Pending' \| 'Approved' \| 'Paid';/,
      "status: 'Pending' | 'Paid';"
    );
  }

  fs.writeFileSync(filename, code);
  console.log('Removed Approved status from Payroll in ' + filename);
}

removeApprovedFromPayroll('src/hms/ManagerView.tsx');
removeApprovedFromPayroll('src/hms/useHMS.ts');
