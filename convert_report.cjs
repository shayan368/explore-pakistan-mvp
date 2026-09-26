const fs = require('fs');

function convertToStaffReport(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Replace tab definition
  code = code.replace(
    /\{ id: "audit-log", label: "Audit Log", icon: FileText \},/,
    `{ id: "staff-report", label: "Staff Report", icon: FileText },`
  );

  // Define the Download CSV function (inject near top of component)
  const downloadCSVFn = `
  const downloadCSV = (filename: string, headers: string[], rows: any[][]) => {
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const [selectedReportStaffId, setSelectedReportStaffId] = useState('');
  `;
  
  code = code.replace(/const \[activeTab, setActiveTab\] = useState\("dashboard"\);/, `$&${downloadCSVFn}`);

  // Find the Audit Log block
  const startTag = `{/* AUDIT LOG */}`;
  const startIndex = code.indexOf(startTag);

  if (startIndex > -1) {
    // Find the end of the Audit Log block
    const endStr = `</div>\n        )}\n`;
    const endIndex = code.indexOf(endStr, startIndex) + endStr.length;

    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex);

    // Create the Staff Report block
    const staffReportUI = `
        {/* STAFF REPORT */}
        {activeTab === "staff-report" && (
          <div className="max-w-6xl">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Staff Reports & History</h1>
            
            <div className="bg-surface p-6 rounded-2xl border border-border shadow-md mb-8 flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold text-stone mb-2">Select Staff Member</label>
                <select 
                  className="w-full border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  value={selectedReportStaffId}
                  onChange={(e) => setSelectedReportStaffId(e.target.value)}
                >
                  <option value="">-- Select a Staff Member --</option>
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedReportStaffId && (
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
            )}
          </div>
        )}
`;

    code = before + staffReportUI + after;
    fs.writeFileSync(filename, code);
    console.log('Converted Audit Log to Staff Report in ' + filename);
  } else {
    console.log('Could not find Audit Log block.');
  }
}

convertToStaffReport('src/hms/ManagerView.tsx');
