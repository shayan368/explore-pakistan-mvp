const fs = require('fs');

function updateFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const paymentFolioHtml = `
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Folio & Payments</h3>
                      <ul className="divide-y text-sm">
                        {payments.filter(p => stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id).includes(p.stayId)).map(pay => (
                             <li key={pay.id} className="py-3 flex justify-between items-center">
                               <div>
                                 <p className="font-bold">{pay.date}</p>
                                 <p className="text-xs text-gray-700 mt-1">{pay.method}</p>
                               </div>
                               <span className="text-emerald-600 font-bold">PKR {pay.amount.toLocaleString()}</span>
                             </li>
                        ))}
                        {payments.filter(p => stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id).includes(p.stayId)).length === 0 && <p className="text-gray-500 py-2 text-xs">No payments on record.</p>}
                      </ul>
                    </div>
  `;

  code = code.replace(
    /\{\/\* Right Column: History \*\/\}\s*<div className="col-span-2 space-y-6">/,
    '{/* Right Column: History */}\n                  <div className="col-span-2 space-y-6">\n' + paymentFolioHtml
  );

  fs.writeFileSync(filename, code);
}

updateFile('src/hms/ReceptionistView.tsx');
updateFile('src/hms/ManagerView.tsx');
