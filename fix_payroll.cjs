const fs = require('fs');

function fixPayrollDropdown(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const oldCode = `                showPrompt('Generate Payroll', [
                  { name: 'staffId', label: 'Staff ID (e.g. stf_1)', type: 'text', defaultValue: '' },
                  { name: 'period', label: 'Period (e.g. Sep 2026)', type: 'text', defaultValue: 'Sep 2026' }
                ], (data) => {
                  const s = staff.find(st => st.id === data.staffId);`;

  const newCode = `                showPrompt('Generate Payroll', [
                  { name: 'staffId', label: 'Select Staff Member', type: 'select', defaultValue: staff[0] ? staff[0].id + ' - ' + staff[0].name : '', options: staff.map(st => st.id + ' - ' + st.name) },
                  { name: 'period', label: 'Period (e.g. Sep 2026)', type: 'text', defaultValue: 'Sep 2026' }
                ], (data) => {
                  const s = staff.find(st => st.id === data.staffId.split(' - ')[0]);`;

  code = code.replace(oldCode, newCode);

  fs.writeFileSync(filename, code);
  console.log('Fixed Generate Payroll dropdown in ' + filename);
}

fixPayrollDropdown('src/hms/ManagerView.tsx');
