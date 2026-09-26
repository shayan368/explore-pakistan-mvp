const fs = require('fs');

function defaultShowAll(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const oldBlock = `            {selectedReportStaffId && (
              <>
                <div className="flex justify-between items-center mb-4 mt-8">
                  <h2 className="text-2xl font-display font-bold text-ink">Attendance History</h2>
                  <button onClick={() => {
                    const atts = attendance.filter(a => a.staffId === selectedReportStaffId);
                    const s = staff.find(st => st.id === selectedReportStaffId);
                    downloadCSV(
                      \`\${s?.name}_Attendance.csv\`,
                      ['Date', 'Status', 'Check In', 'Check Out', 'Recorded By', 'Approval Status'],
                      atts.map(a => [a.date, a.status, a.checkIn || '-', a.checkOut || '-', a.recordedBy, a.approvalStatus])
                    );
                  }} className="px-4 py-2 bg-stone text-white font-bold rounded-lg shadow hover:bg-ink">Download CSV</button>
                </div>
                <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto mb-8">
                  <table className="w-full text-left">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Check In</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Check Out</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Recorded By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attendance.filter(a => a.staffId === selectedReportStaffId).length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-stone">No attendance records found.</td></tr>
                      ) : attendance.filter(a => a.staffId === selectedReportStaffId).map(a => (
                        <tr key={a.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm font-bold text-ink">{a.date}</td>
                          <td className="px-4 py-3 text-sm font-bold text-primary">{a.status}</td>
                          <td className="px-4 py-3 text-sm text-stone">{a.checkIn || '-'}</td>
                          <td className="px-4 py-3 text-sm text-stone">{a.checkOut || '-'}</td>
                          <td className="px-4 py-3 text-sm text-stone">{a.recordedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mb-4 mt-8">
                  <h2 className="text-2xl font-display font-bold text-ink">Payroll History</h2>
                  <button onClick={() => {
                    const prls = payroll.filter(p => p.staffId === selectedReportStaffId);
                    const s = staff.find(st => st.id === selectedReportStaffId);
                    downloadCSV(
                      \`\${s?.name}_Payroll.csv\`,
                      ['Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Paid Date'],
                      prls.map(p => [p.period, p.basicSalary, p.allowances, p.deductions, p.netSalary, p.status, p.paidDate || '-'])
                    );
                  }} className="px-4 py-2 bg-stone text-white font-bold rounded-lg shadow hover:bg-ink">Download CSV</button>
                </div>
                <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Period</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Gross (Basic + Alw)</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Deductions</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Net Salary</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {payroll.filter(p => p.staffId === selectedReportStaffId).length === 0 ? (
                        <tr><td colSpan={5} className="px-4 py-8 text-center text-stone">No payroll records found.</td></tr>
                      ) : payroll.filter(p => p.staffId === selectedReportStaffId).map(p => (
                        <tr key={p.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm font-bold text-ink">{p.period}</td>
                          <td className="px-4 py-3 text-sm text-stone">PKR {p.basicSalary + p.allowances}</td>
                          <td className="px-4 py-3 text-sm text-error">PKR {p.deductions}</td>
                          <td className="px-4 py-3 text-sm font-bold text-success">PKR {p.netSalary}</td>
                          <td className="px-4 py-3 text-sm text-stone">{p.status} {p.paidDate ? \`(\${p.paidDate})\` : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}`;

  const newBlock = `
              <>
                <div className="flex justify-between items-center mb-4 mt-8">
                  <h2 className="text-2xl font-display font-bold text-ink">Attendance History</h2>
                  <button onClick={() => {
                    const atts = selectedReportStaffId ? attendance.filter(a => a.staffId === selectedReportStaffId) : attendance;
                    const s = selectedReportStaffId ? staff.find(st => st.id === selectedReportStaffId) : null;
                    const fileName = s ? \`\${s.name}_Attendance.csv\` : 'All_Staff_Attendance.csv';
                    downloadCSV(
                      fileName,
                      ['Staff Name', 'Date', 'Status', 'Check In', 'Check Out', 'Recorded By'],
                      atts.map(a => [staff.find(st => st.id === a.staffId)?.name || a.staffId, a.date, a.status, a.checkIn || '-', a.checkOut || '-', a.recordedBy])
                    );
                  }} className="px-4 py-2 bg-stone text-white font-bold rounded-lg shadow hover:bg-ink">Download CSV</button>
                </div>
                <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto mb-8">
                  <table className="w-full text-left">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Staff Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Date</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Check In</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Check Out</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Recorded By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(selectedReportStaffId ? attendance.filter(a => a.staffId === selectedReportStaffId) : attendance).length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-stone">No attendance records found.</td></tr>
                      ) : (selectedReportStaffId ? attendance.filter(a => a.staffId === selectedReportStaffId) : attendance).map(a => (
                        <tr key={a.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm font-bold text-ink">{staff.find(st => st.id === a.staffId)?.name || a.staffId}</td>
                          <td className="px-4 py-3 text-sm font-bold text-ink">{a.date}</td>
                          <td className="px-4 py-3 text-sm font-bold text-primary">{a.status}</td>
                          <td className="px-4 py-3 text-sm text-stone">{a.checkIn || '-'}</td>
                          <td className="px-4 py-3 text-sm text-stone">{a.checkOut || '-'}</td>
                          <td className="px-4 py-3 text-sm text-stone">{a.recordedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mb-4 mt-8">
                  <h2 className="text-2xl font-display font-bold text-ink">Payroll History</h2>
                  <button onClick={() => {
                    const prls = selectedReportStaffId ? payroll.filter(p => p.staffId === selectedReportStaffId) : payroll;
                    const s = selectedReportStaffId ? staff.find(st => st.id === selectedReportStaffId) : null;
                    const fileName = s ? \`\${s.name}_Payroll.csv\` : 'All_Staff_Payroll.csv';
                    downloadCSV(
                      fileName,
                      ['Staff Name', 'Period', 'Basic Salary', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Paid Date'],
                      prls.map(p => [staff.find(st => st.id === p.staffId)?.name || p.staffId, p.period, p.basicSalary, p.allowances, p.deductions, p.netSalary, p.status, p.paidDate || '-'])
                    );
                  }} className="px-4 py-2 bg-stone text-white font-bold rounded-lg shadow hover:bg-ink">Download CSV</button>
                </div>
                <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Staff Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Period</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Gross (Basic + Alw)</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Deductions</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Net Salary</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {(selectedReportStaffId ? payroll.filter(p => p.staffId === selectedReportStaffId) : payroll).length === 0 ? (
                        <tr><td colSpan={6} className="px-4 py-8 text-center text-stone">No payroll records found.</td></tr>
                      ) : (selectedReportStaffId ? payroll.filter(p => p.staffId === selectedReportStaffId) : payroll).map(p => (
                        <tr key={p.id} className="hover:bg-muted/50">
                          <td className="px-4 py-3 text-sm font-bold text-ink">{staff.find(st => st.id === p.staffId)?.name || p.staffId}</td>
                          <td className="px-4 py-3 text-sm font-bold text-ink">{p.period}</td>
                          <td className="px-4 py-3 text-sm text-stone">PKR {p.basicSalary + p.allowances}</td>
                          <td className="px-4 py-3 text-sm text-error">PKR {p.deductions}</td>
                          <td className="px-4 py-3 text-sm font-bold text-success">PKR {p.netSalary}</td>
                          <td className="px-4 py-3 text-sm text-stone">{p.status} {p.paidDate ? \`(\${p.paidDate})\` : ''}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>`;

  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync(filename, code);
  console.log('Fixed default show all in ' + filename);
}

defaultShowAll('src/hms/ManagerView.tsx');
