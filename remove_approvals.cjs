const fs = require('fs');

function removeApprovals(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const startStr = `<h1 className="text-3xl font-display font-bold text-ink mb-6">Attendance Approvals</h1>`;
  const startIndex = code.indexOf(startStr);

  if (startIndex > -1) {
    // Find the end of the table
    const endStr = `</table>\n            </div>`;
    const endIndex = code.indexOf(endStr, startIndex) + endStr.length;

    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex);

    code = before + after;
    fs.writeFileSync(filename, code);
    console.log('Removed Attendance Approvals from ' + filename);
  }
}

removeApprovals('src/hms/ManagerView.tsx');
