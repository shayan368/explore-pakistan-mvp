const fs = require('fs');

function fixFolio(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const printInvoiceBtn = `<button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200">Print Invoice</button>`;
  
  const newButtons = `<div className="flex gap-2">
                        <button onClick={() => {
                          const amount = parseFloat(window.prompt("Enter charge amount (PKR):", "0") || "0");
                          if (amount > 0) {
                            const desc = window.prompt("Enter charge description:", "Restaurant/Service");
                            setCharges([...charges, { id: "chg_" + Date.now(), stayId: stay.id, category: "Service", description: desc || 'Service', total: amount, date: today }]);
                          }
                        }} className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200">Add Charge</button>
                        <button onClick={() => {
                          const amount = parseFloat(window.prompt(\`Collect Payment. Balance is PKR \${balance}\`, balance.toString()) || "0");
                          if (amount > 0) {
                            setPayments([...payments, { id: "pay_" + Date.now(), stayId: stay.id, amount, method: "Cash", date: today }]);
                          }
                        }} className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700">Collect Payment</button>
                        <button onClick={() => window.print()} className="px-4 py-2 bg-gray-100 text-gray-800 text-sm font-bold rounded-lg hover:bg-gray-200">Print</button>
                      </div>`;

  code = code.replace(printInvoiceBtn, newButtons);
  fs.writeFileSync(filename, code);
  console.log('Fixed Folio in ' + filename);
}

fixFolio('src/hms/ReceptionistView.tsx');
fixFolio('src/hms/ManagerView.tsx');
