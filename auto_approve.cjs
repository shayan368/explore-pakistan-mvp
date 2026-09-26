const fs = require('fs');

function autoApproveAttendance(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Change all approvalStatus: 'Pending' to 'Approved' in attendance creation
  code = code.replace(/approvalStatus:\s*'Pending'/g, "approvalStatus: 'Approved'");

  fs.writeFileSync(filename, code);
  console.log('Fixed approvalStatus in ' + filename);
}

autoApproveAttendance('src/hms/ReceptionistView.tsx');
autoApproveAttendance('src/hms/useHMS.ts');
