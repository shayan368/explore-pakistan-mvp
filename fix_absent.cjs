const fs = require('fs');

function fixAbsentCheckout(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix Today's Attendance cell text
  const oldCell = `<td className="px-4 py-3 text-sm">
                          {todayAtt ? (
                            <span className={\`px-2 py-1 text-xs font-bold rounded \${todayAtt.status === 'Present' ? 'bg-success text-white' : 'bg-warning text-white'}\`}>{todayAtt.status} (In: {todayAtt.checkIn || '-'} | Out: {todayAtt.checkOut || '-'}) [{todayAtt.approvalStatus}]</span>
                          ) : (
                            <span className="text-muted-text text-xs italic">Not recorded</span>
                          )}
                        </td>`;
                        
  const newCell = `<td className="px-4 py-3 text-sm">
                          {todayAtt ? (
                            <span className={\`px-2 py-1 text-xs font-bold rounded \${todayAtt.status === 'Present' ? 'bg-success text-white' : todayAtt.status === 'Absent' || todayAtt.status === 'Leave' ? 'bg-error text-white' : 'bg-warning text-white'}\`}>
                              {todayAtt.status} 
                              {['Present', 'Late', 'Half Day', 'Overtime'].includes(todayAtt.status) && \` (In: \${todayAtt.checkIn || '-'} | Out: \${todayAtt.checkOut || '-'})\`}
                              {\` [\${todayAtt.approvalStatus}]\`}
                            </span>
                          ) : (
                            <span className="text-muted-text text-xs italic">Not recorded</span>
                          )}
                        </td>`;

  code = code.replace(oldCell, newCell);

  // Fix Action cell (Check Out button visibility)
  const checkOutRegex = /\{todayAtt && \!todayAtt\.checkOut && \(/;
  code = code.replace(checkOutRegex, `{todayAtt && !todayAtt.checkOut && ['Present', 'Late', 'Half Day', 'Overtime'].includes(todayAtt.status) && (`);

  // Also remove checkIn time default from the mark attendance prompt if they choose Absent?
  // It's not easy to dynamically hide fields in our current custom prompt system based on another field's value. 
  // We'll just leave checkIn there, but we won't display it if they select Absent.

  fs.writeFileSync(filename, code);
  console.log('Fixed absent/leave check-out logic in ' + filename);
}

fixAbsentCheckout('src/hms/ReceptionistView.tsx');
