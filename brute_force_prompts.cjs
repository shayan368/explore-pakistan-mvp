const fs = require('fs');

function bruteForceFix(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix Collect Payment in Active Stays
  const collectTarget = `onClick={() => {
                        const amount = parseFloat(window.prompt(\`Collect Payment. Balance is PKR \${balance}\`, balance.toString()) || "0");
                        if (amount > 0) {
                          setPayments([...payments, { id: "pay_" + Date.now(), stayId: stay.id, amount, method: "Cash", date: today }]);
                        }
                      }}`;
  
  const collectReplacement = `onClick={() => showPrompt('Collect Payment', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: balance.toString() },
      { name: 'method', label: 'Payment Method', type: 'text', defaultValue: 'Cash' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0) {
        setPayments([...payments, { id: 'pay_' + Date.now(), stayId: stay.id, amount, method: data.method || 'Cash', date: today }]);
        showAlert('Payment Collected', 'The payment has been successfully recorded.', 'success');
      }
    })}`;
    
  code = code.replace(collectTarget, collectReplacement);

  // Fix Report Maintenance
  const maintTarget = `onClick={() => {
                const roomNum = window.prompt("Enter Room Number:");
                const desc = window.prompt("Describe the issue:");
                const room = rooms.find(r => r.number === roomNum);
                if (room && desc) {
                  setMaintenance([...maintenance, { id: "maint_" + Date.now(), roomId: room.id, description: desc, status: "Pending", date: today }]);
                  alert("Maintenance reported.");
                } else {
                  alert("Invalid room number.");
                }
              }}`;
              
  const maintReplacement = `onClick={() => showPrompt('Report Maintenance', [
      { name: 'roomNum', label: 'Room Number', type: 'text', defaultValue: '' },
      { name: 'desc', label: 'Describe the issue', type: 'textarea', defaultValue: '' }
    ], (data) => {
      const room = rooms.find(r => r.number === data.roomNum);
      if (room && data.desc) {
        setMaintenance([...maintenance, { id: 'maint_' + Date.now(), roomId: room.id, description: data.desc, status: 'Pending', date: today }]);
        showAlert('Maintenance Reported', 'Task successfully logged.', 'success');
      } else {
        showAlert('Error', 'Invalid room number.', 'error');
      }
    })}`;

  code = code.replace(maintTarget, maintReplacement);

  fs.writeFileSync(filename, code);
  console.log('Brute force fixed in ' + filename);
}

bruteForceFix('src/hms/ReceptionistView.tsx');
bruteForceFix('src/hms/ManagerView.tsx');
