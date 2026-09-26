const fs = require('fs');

function updatePrintReceipt(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const oldButtonRegex = /<button onClick=\{\(\) => showAlert\('Print Receipt', \`Printing receipt for booking \$\{res\.id\}\.\.\.\`, 'success'\)\} className="flex items-center gap-2 px-3 py-1\.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-md transition-colors shadow-sm">/g;

  const newButton = `<button onClick={() => {
                              const receiptWindow = window.open('', '_blank', 'width=800,height=600');
                              if (receiptWindow) {
                                receiptWindow.document.write(\`
                                  <html>
                                    <head>
                                      <title>Receipt - Booking \${res.id}</title>
                                      <style>
                                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; max-width: 600px; margin: 0 auto; }
                                        .header { text-align: center; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
                                        .header h2 { margin: 0; color: #1a1a1a; }
                                        .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                                        .bold { font-weight: bold; }
                                        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
                                        th, td { padding: 12px 10px; border-bottom: 1px solid #eee; text-align: left; }
                                        th { background-color: #f9fafb; color: #6b7280; font-size: 12px; text-transform: uppercase; }
                                        .totals { margin-top: 20px; border-top: 2px solid #333; padding-top: 20px; }
                                        .totals .row { margin-bottom: 5px; }
                                        .totals .bold-row { font-size: 1.2em; font-weight: bold; margin-top: 10px; }
                                      </style>
                                    </head>
                                    <body>
                                      <div class="header">
                                        <h2>Hotel Booking Receipt</h2>
                                        <p style="color: #666; margin-top: 5px;">Booking ID: \${res.id}</p>
                                      </div>
                                      <div class="row"><span>Guest Name:</span> <span class="bold">\${guest?.name || 'N/A'}</span></div>
                                      <div class="row"><span>Room:</span> <span class="bold">Room \${room?.number || 'N/A'} (\${room?.type || 'N/A'})</span></div>
                                      <div class="row"><span>Check In:</span> <span class="bold">\${res.checkIn}</span></div>
                                      <div class="row"><span>Check Out:</span> <span class="bold">\${res.checkOut}</span></div>
                                      
                                      <table>
                                        <tr><th>Description</th><th style="text-align: right;">Amount (PKR)</th></tr>
                                        <tr><td>Total Charges</td><td style="text-align: right;">\${total.toLocaleString()}</td></tr>
                                        <tr><td>Total Payments Made</td><td style="text-align: right;">-\${paid.toLocaleString()}</td></tr>
                                      </table>
                                      
                                      <div class="totals">
                                        <div class="row bold-row"><span>Remaining Balance:</span> <span>PKR \${remaining.toLocaleString()}</span></div>
                                      </div>
                                      
                                      <script>
                                        window.onload = function() { 
                                          setTimeout(() => {
                                            window.print();
                                            window.close();
                                          }, 500);
                                        }
                                      </script>
                                    </body>
                                  </html>
                                \`);
                                receiptWindow.document.close();
                                logAction(auth?.email || '', 'User', 'Printed Receipt', 'Reservation', res.id, 'Printed Booking Receipt');
                              } else {
                                showAlert('Popup Blocked', 'Please allow popups to print the receipt.', 'error');
                              }
                            }} className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-md transition-colors shadow-sm">`;

  if (code.match(oldButtonRegex)) {
    code = code.replace(oldButtonRegex, newButton);
    fs.writeFileSync(filename, code);
    console.log('Fixed Print Receipt in ' + filename);
  } else {
    console.log('Could not find old button in ' + filename);
  }
}

updatePrintReceipt('src/hms/ManagerView.tsx');
updatePrintReceipt('src/hms/ReceptionistView.tsx');
