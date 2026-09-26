const fs = require('fs');

function enhanceStaffTable(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add Action header
  code = code.replace(
    /<th className="px-4 py-3 text-xs font-semibold text-muted-text">Status<\/th>/,
    `<th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>\n                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>`
  );

  // Replace Status cell and add Action cell
  const oldRowEnd = /<td className="px-4 py-3 text-sm text-stone">\{s\.status\}<\/td>\s*<\/tr>/g;
  
  const newRowEnd = `<td className="px-4 py-3 text-sm">
                        <span className={\`px-2 py-1 text-xs font-bold rounded \${s.status === 'Active' ? 'bg-success text-white' : 'bg-muted text-stone'}\`}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-3">
                         <button onClick={() => {
                           showPrompt('Edit Staff', [
                             { name: 'name', label: 'Name', type: 'text', defaultValue: s.name },
                             { name: 'role', label: 'Role', type: 'select', defaultValue: s.role, options: ['Manager', 'Receptionist', 'Housekeeper', 'Maintenance Worker', 'Restaurant Staff', 'Security', 'HR', 'Other'] },
                             { name: 'phone', label: 'Phone', type: 'text', defaultValue: s.phone },
                             { name: 'basicSalary', label: 'Basic Salary', type: 'number', defaultValue: s.basicSalary },
                             { name: 'status', label: 'Status', type: 'select', defaultValue: s.status, options: ['Active', 'Inactive'] }
                           ], (data) => {
                             setStaff(staff.map(st => st.id === s.id ? { ...st, name: data.name, role: data.role, phone: data.phone, basicSalary: parseFloat(data.basicSalary || '0'), status: data.status as any } : st));
                             logAction(auth?.email || '', 'Manager', 'Edited Staff', 'Staff', s.id, \`Updated details for \${data.name}\`);
                             showAlert('Success', 'Staff details updated.', 'success');
                           });
                         }} className="text-sm font-bold text-stone hover:text-primary hover:underline">Edit</button>
                         <button onClick={() => {
                           setConfirmConfig({
                             isOpen: true,
                             title: 'Delete Staff',
                             message: \`Are you sure you want to delete \${s.name}?\`,
                             onConfirm: () => {
                               setStaff(staff.filter(st => st.id !== s.id));
                               logAction(auth?.email || '', 'Manager', 'Deleted Staff', 'Staff', s.id, \`Deleted \${s.name}\`);
                             }
                           });
                         }} className="text-sm font-bold text-error hover:underline">Delete</button>
                      </td>
                    </tr>`;
                    
  code = code.replace(oldRowEnd, newRowEnd);

  fs.writeFileSync(filename, code);
  console.log('Enhanced Manager Staff table in ' + filename);
}

enhanceStaffTable('src/hms/ManagerView.tsx');
