const fs = require('fs');

function fixPrompts(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Replace Add Charge in Active Stays
  code = code.replace(
    /onClick=\{\(\) => \{\s*const amount = parseFloat\(window\.prompt\("Enter charge amount \(PKR\):", "0"\) \|\| "0"\);\s*const desc = window\.prompt\("Enter charge description:", "Restaurant\/Service"\);\s*if \(amount > 0 && desc\) \{\s*setCharges\(\[\.\.\.charges, \{ id: "chg_" \+ Date\.now\(\), stayId: stay\.id, category: "Service", description: desc, total: amount, date: today \}\]\);\s*\}\s*\}\}/g,
    `onClick={() => showPrompt('Add Charge', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: '0' },
      { name: 'desc', label: 'Description', type: 'text', defaultValue: 'Restaurant/Service' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0 && data.desc) {
        setCharges([...charges, { id: 'chg_' + Date.now(), stayId: stay.id, category: 'Service', description: data.desc, total: amount, date: today }]);
        showAlert('Charge Added', 'The charge was successfully posted to the folio.', 'success');
      }
    })}`
  );

  // Replace Collect Payment in Active Stays
  code = code.replace(
    /onClick=\{\(\) => \{\s*const amount = parseFloat\(window\.prompt\(`Collect Payment\. Balance is PKR \$\{balance\}`\, balance\.toString\(\)\) \|\| "0"\);\s*if \(amount > 0\) \{\s*setPayments\(\[\.\.\.payments, \{ id: "pay_" \+ Date\.now\(\), stayId: stay\.id, amount, method: "Cash", date: today \}\]\);\s*\}\s*\}\}/g,
    `onClick={() => showPrompt('Collect Payment', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: balance.toString() },
      { name: 'method', label: 'Payment Method', type: 'text', defaultValue: 'Cash' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0) {
        setPayments([...payments, { id: 'pay_' + Date.now(), stayId: stay.id, amount, method: data.method || 'Cash', date: today }]);
        showAlert('Payment Collected', 'The payment has been successfully recorded.', 'success');
      }
    })}`
  );

  // Replace Report Damage in Active Stays
  code = code.replace(
    /onClick=\{\(\) => \{\s*const desc = window\.prompt\("Report Damage \/ Incident Description:"\);\s*const cost = parseFloat\(window\.prompt\("Estimated Cost to charge \(Requires Manager Approval\):", "0"\) \|\| "0"\);\s*if \(desc && cost > 0\) \{\s*setIncidents\(\[\.\.\.incidents, \{ id: "inc_" \+ Date\.now\(\), stayId: stay\.id, roomId: stay\.roomId, description: desc, estimatedCost: cost, status: "Pending Review", date: today \}\]\);\s*alert\("Incident reported and sent to Manager for approval\."\);\s*\}\s*\}\}/g,
    `onClick={() => showPrompt('Report Damage', [
      { name: 'desc', label: 'Incident Description', type: 'textarea', defaultValue: '' },
      { name: 'cost', label: 'Estimated Cost (PKR)', type: 'number', defaultValue: '0' }
    ], (data) => {
      if (data.desc) {
        const cost = parseFloat(data.cost || '0');
        setIncidents([...incidents, { id: 'inc_' + Date.now(), stayId: stay.id, roomId: stay.roomId, description: data.desc, estimatedCost: cost, status: 'Pending Review', date: today }]);
        showAlert('Damage Reported', 'Incident submitted for Manager approval.', 'success');
      }
    })}`
  );

  // Replace Report Maintenance
  code = code.replace(
    /onClick=\{\(\) => \{\s*const roomNum = window\.prompt\("Enter Room Number:"\);\s*const desc = window\.prompt\("Describe the issue:"\);\s*const room = rooms\.find\(r => r\.number === roomNum\);\s*if \(room && desc\) \{\s*setMaintenance\(\[\.\.\.maintenance, \{ id: "maint_" \+ Date\.now\(\), roomId: room\.id, description: desc, status: "Pending", date: today \}\]\);\s*alert\("Maintenance reported\."\);\s*\} else \{\s*alert\("Invalid room number\."\);\s*\}\s*\}\}/g,
    `onClick={() => showPrompt('Report Maintenance', [
      { name: 'roomNum', label: 'Room Number', type: 'text', defaultValue: '' },
      { name: 'desc', label: 'Describe the issue', type: 'textarea', defaultValue: '' }
    ], (data) => {
      const room = rooms.find(r => r.number === data.roomNum);
      if (room && data.desc) {
        setMaintenance([...maintenance, { id: 'maint_' + Date.now(), roomId: room.id, description: data.desc, status: 'Pending', date: today }]);
        showAlert('Maintenance Reported', 'Task successfully logged for the maintenance team.', 'success');
      } else {
        showAlert('Error', 'Invalid room number.', 'error');
      }
    })}`
  );

  fs.writeFileSync(filename, code);
  console.log('Fixed prompts in ' + filename);
}

fixPrompts('src/hms/ReceptionistView.tsx');
fixPrompts('src/hms/ManagerView.tsx');
