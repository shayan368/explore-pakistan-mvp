const fs = require('fs');

function fixHeaders(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix the duplicate Action heading in Reservations table (or whichever it was)
  code = code.replace(
    /<th className="px-4 py-3 text-xs font-semibold text-muted-text">Action<\/th>\n                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action<\/th>/g,
    `<th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>`
  );

  // Add Action heading specifically to the Staff table
  const staffTableStart = `<th className="px-4 py-3 text-xs font-semibold text-muted-text">Basic Salary</th>`;
  const staffTableIndex = code.indexOf(staffTableStart);

  if (staffTableIndex > -1) {
    // Find the Status heading right after Basic Salary
    const statusHeadingStr = `<th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>`;
    const statusIndex = code.indexOf(statusHeadingStr, staffTableIndex);
    
    if (statusIndex > -1) {
      // Check if Action heading is already there
      const afterStatus = code.substring(statusIndex + statusHeadingStr.length, statusIndex + statusHeadingStr.length + 100);
      if (!afterStatus.includes('Action')) {
        const before = code.substring(0, statusIndex + statusHeadingStr.length);
        const after = code.substring(statusIndex + statusHeadingStr.length);
        
        const newHeading = `\n                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>`;
        
        code = before + newHeading + after;
        console.log('Successfully injected Action heading to Staff table.');
      } else {
        console.log('Action heading already exists in Staff table.');
      }
    }
  }

  fs.writeFileSync(filename, code);
}

fixHeaders('src/hms/ManagerView.tsx');
