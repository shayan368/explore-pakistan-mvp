const fs = require('fs');

function fixPayrollActions(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // We are targeting the Payroll Processing action cell
  const startTarget = `<td className="px-4 py-3 flex gap-2">
                          {p.status === 'Pending' && (`;
                          
  // Since it ends with a closing </td>, let's find the boundaries
  const searchStart = code.indexOf(startTarget);
  
  if (searchStart > -1) {
    const searchEnd = code.indexOf('</td>', searchStart) + '</td>'.length;
    
    const before = code.substring(0, searchStart);
    const after = code.substring(searchEnd);
    
    const newCell = `<td className="px-4 py-3 flex gap-3">
                          <button onClick={() => {
                            showPrompt('Edit Payroll', [
                              { name: 'period', label: 'Period', type: 'text', defaultValue: p.period },
                              { name: 'basicSalary', label: 'Basic Salary', type: 'number', defaultValue: p.basicSalary },
                              { name: 'allowances', label: 'Allowances', type: 'number', defaultValue: p.allowances },
                              { name: 'deductions', label: 'Deductions', type: 'number', defaultValue: p.deductions },
                              { name: 'status', label: 'Status', type: 'select', defaultValue: p.status, options: ['Pending', 'Approved', 'Paid'] }
                            ], (data) => {
                              const basic = parseFloat(data.basicSalary || '0');
                              const alw = parseFloat(data.allowances || '0');
                              const ded = parseFloat(data.deductions || '0');
                              const gross = basic + alw;
                              const net = gross - ded;
                              
                              setPayroll(payroll.map(pr => pr.id === p.id ? { 
                                ...pr, 
                                period: data.period, 
                                basicSalary: basic, 
                                allowances: alw, 
                                deductions: ded, 
                                grossSalary: gross, 
                                netSalary: net, 
                                status: data.status as any,
                                paidDate: data.status === 'Paid' && p.status !== 'Paid' ? today : pr.paidDate
                              } : pr));
                              
                              logAction(auth?.email || '', 'Manager', 'Edited Payroll', 'Payroll', p.id, \`Updated payroll for \${s?.name}\`);
                              showAlert('Success', 'Payroll record updated.', 'success');
                            });
                          }} className="text-sm font-bold text-stone hover:text-primary hover:underline">Edit</button>
                          
                          <button onClick={() => {
                            setConfirmConfig({
                              isOpen: true,
                              title: 'Delete Payroll',
                              message: \`Are you sure you want to delete this payroll record for \${s?.name}?\`,
                              onConfirm: () => {
                                setPayroll(payroll.filter(pr => pr.id !== p.id));
                                logAction(auth?.email || '', 'Manager', 'Deleted Payroll', 'Payroll', p.id, \`Deleted payroll for \${s?.name}\`);
                              }
                            });
                          }} className="text-sm font-bold text-error hover:underline">Delete</button>
                        </td>`;
                        
    code = before + newCell + after;
    fs.writeFileSync(filename, code);
    console.log('Replaced Payroll actions with Edit/Delete in ' + filename);
  } else {
    console.log('Could not find Payroll action cell.');
  }
}

fixPayrollActions('src/hms/ManagerView.tsx');
