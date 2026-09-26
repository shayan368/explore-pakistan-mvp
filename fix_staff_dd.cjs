const fs = require('fs');

function fixStaffDropdown(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Replace the strict filter with a fallback to all staff if none match, OR just show all staff.
  // The simplest is to just show all staff, but format it as "id - name (role)".
  // Or filter it: 
  const regex = /staff\.filter\(s => s\.role\.toLowerCase\(\)\.includes\('main'\) \|\| s\.role\.toLowerCase\(\)\.includes\('eng'\)\)/g;
  
  const replacer = `(staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')).length > 0 ? staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')) : staff)`;

  let updated = false;
  if (regex.test(code)) {
    code = code.replace(regex, replacer);
    updated = true;
  }

  // Also in Edit
  const editRegex = /staff\.map\(s => s\.id \+ ' - ' \+ s\.name\)/g;
  // wait, in Edit I just did staff.map
  const editReplacer = `(staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')).length > 0 ? staff.filter(s => (s.role||'').toLowerCase().includes('main') || (s.department||'').toLowerCase().includes('main') || (s.role||'').toLowerCase().includes('eng')) : staff).map(s => s.id + ' - ' + s.name)`;
  
  if (editRegex.test(code)) {
    code = code.replace(editRegex, editReplacer);
    updated = true;
  }

  if (updated) {
    fs.writeFileSync(filename, code);
    console.log('Fixed staff dropdown in ' + filename);
  }
}

fixStaffDropdown('src/hms/ManagerView.tsx');
fixStaffDropdown('src/hms/ReceptionistView.tsx');
