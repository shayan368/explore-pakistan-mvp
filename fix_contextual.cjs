const fs = require('fs');

function fixContextualDropdowns(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix Maintenance Prompt
  const maintOld = `{ name: 'staffId', label: 'Assign Staff ID (optional)', type: 'text', defaultValue: '' }`;
  const maintNew = `{ name: 'staffId', label: 'Assign Staff', type: 'select', defaultValue: 'None', options: ['None', ...staff.map(st => st.id + ' - ' + st.name)] }`;
  code = code.replace(new RegExp(maintOld.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), maintNew);
  
  // Fix the setMaintenance handling
  code = code.replace(
    /assignedStaffId: data\.staffId/g,
    "assignedStaffId: data.staffId === 'None' ? '' : data.staffId.split(' - ')[0]"
  );

  // Fix Housekeeping Prompt in ReceptionistView
  if (filename.includes('ReceptionistView')) {
    const hkOld = `{name:'staffId', label:'Assigned Staff ID (e.g. stf_3)', type:'text', defaultValue:''}`;
    const hkNew = `{name:'staffId', label:'Assign Staff', type:'select', defaultValue: staff[0] ? staff[0].id + ' - ' + staff[0].name : '', options: staff.map(st => st.id + ' - ' + st.name)}`;
    code = code.replace(new RegExp(hkOld.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&'), 'g'), hkNew);
    
    // Fix setHousekeeping handling
    code = code.replace(
      /assignedStaffId: data\.staffId/g,
      "assignedStaffId: data.staffId === 'None' ? '' : data.staffId.split(' - ')[0]"
    );
  }

  fs.writeFileSync(filename, code);
  console.log('Fixed contextual staff dropdowns in ' + filename);
}

fixContextualDropdowns('src/hms/ReceptionistView.tsx');
fixContextualDropdowns('src/hms/ManagerView.tsx');
