const fs = require('fs');

function wipePrompts(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Find all window.prompt instances and manually wipe them
  code = code.replace(
    /onClick=\{\(\) => \{\s*const amount = parseFloat\(window\.prompt\(`Collect Payment\. Balance is PKR \$\{balance\}`,\s*balance\.toString\(\)\)\s*\|\|\s*"0"\);\s*if\s*\(amount > 0\)\s*\{\s*setPayments\(\[\.\.\.payments,\s*\{\s*id:\s*"pay_"\s*\+\s*Date\.now\(\),\s*stayId:\s*stay\.id,\s*amount,\s*method:\s*"Cash",\s*date:\s*today\s*\}\]\);\s*\}\s*\}\}/g,
    `onClick={() => showPrompt('Collect Payment', [{name:'amount',label:'Amount (PKR)',type:'number',defaultValue:balance.toString()},{name:'method',label:'Payment Method',type:'text',defaultValue:'Cash'}], (data) => {
       const amount = parseFloat(data.amount||'0');
       if(amount>0) {
         setPayments([...payments, {id:'pay_'+Date.now(), stayId: stay.id, amount, method: data.method||'Cash', date: today}]);
         showAlert('Payment Collected', 'The payment has been recorded successfully.', 'success');
       }
    })}`
  );

  code = code.replace(
    /onClick=\{\(\) => \{\s*const roomNum = window\.prompt\("Enter Room Number:"\);\s*const desc = window\.prompt\("Describe the issue:"\);[\s\S]*?\}\s*\}\}/g,
    `onClick={() => showPrompt('Report Maintenance', [
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
    })}`
  );

  fs.writeFileSync(filename, code);
  console.log('Wiped in ' + filename);
}

wipePrompts('src/hms/ReceptionistView.tsx');
wipePrompts('src/hms/ManagerView.tsx');
