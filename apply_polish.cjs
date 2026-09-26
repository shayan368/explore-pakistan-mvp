const fs = require('fs');

function applyPolish(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // 1. Color Replacements
  // Backgrounds
  code = code.replace(/bg-gray-50\/50/g, 'bg-canvas');
  code = code.replace(/bg-blue-50\/50/g, 'bg-primary-pale');
  code = code.replace(/bg-blue-50/g, 'bg-primary-pale');
  code = code.replace(/bg-indigo-50/g, 'bg-primary-pale');
  code = code.replace(/bg-gray-50/g, 'bg-muted');
  
  // Emerald / Blue to Primary
  code = code.replace(/bg-emerald-600/g, 'bg-primary');
  code = code.replace(/hover:bg-emerald-700/g, 'hover:bg-primary-light');
  code = code.replace(/text-emerald-600/g, 'text-primary');
  code = code.replace(/text-emerald-700/g, 'text-primary');
  code = code.replace(/text-emerald-800/g, 'text-primary');
  code = code.replace(/bg-emerald-100/g, 'bg-primary-pale');
  code = code.replace(/border-emerald-300/g, 'border-primary/20');
  code = code.replace(/border-emerald-500/g, 'border-primary');
  
  code = code.replace(/bg-blue-600/g, 'bg-primary');
  code = code.replace(/hover:bg-blue-700/g, 'hover:bg-primary-light');
  code = code.replace(/text-blue-600/g, 'text-primary');
  code = code.replace(/text-blue-700/g, 'text-primary');
  code = code.replace(/text-blue-800/g, 'text-primary');
  code = code.replace(/text-blue-900/g, 'text-primary');
  code = code.replace(/bg-blue-100/g, 'bg-primary-pale');
  code = code.replace(/border-blue-300/g, 'border-primary/20');

  // Text colors
  code = code.replace(/text-gray-900/g, 'text-ink');
  code = code.replace(/text-gray-800/g, 'text-stone');
  code = code.replace(/text-gray-700/g, 'text-muted-text');
  code = code.replace(/text-gray-600/g, 'text-muted-text');
  code = code.replace(/text-gray-500/g, 'text-muted-text');
  code = code.replace(/border-gray-200/g, 'border-border');
  code = code.replace(/border-gray-300/g, 'border-border');
  code = code.replace(/bg-gray-100/g, 'bg-muted');

  // Card Polish (shadows and hover effects)
  code = code.replace(/shadow-sm/g, 'shadow-md hover:shadow-lg transition-shadow duration-300');
  
  // Typography Polish (font-display for headers and big numbers)
  code = code.replace(/text-2xl font-bold/g, 'text-3xl font-display font-bold');
  code = code.replace(/text-3xl font-bold/g, 'text-4xl font-display font-bold');
  code = code.replace(/text-xl font-bold/g, 'text-xl font-display font-bold');
  code = code.replace(/text-xl font-black/g, 'text-2xl font-display font-bold');
  
  // 2. Inject Modal State & Helpers
  const modalStates = `
  const [alertConfig, setAlertConfig] = useState<any>({isOpen: false, title: '', message: '', type: 'info'});
  const [confirmConfig, setConfirmConfig] = useState<any>({isOpen: false, title: '', message: '', onConfirm: () => {}});
  const [promptConfig, setPromptConfig] = useState<any>({isOpen: false, title: '', fields: [], onSubmit: () => {}});
  const [promptData, setPromptData] = useState<any>({});

  const showAlert = (title: string, message: string, type: 'info'|'error'|'success'|'warning' = 'info') => setAlertConfig({isOpen: true, title, message, type});
  const showConfirm = (title: string, message: string, onConfirm: () => void) => setConfirmConfig({isOpen: true, title, message, onConfirm});
  const showPrompt = (title: string, fields: any[], onSubmit: (data: any) => void) => {
    const initialData: any = {};
    fields.forEach(f => initialData[f.name] = f.defaultValue || '');
    setPromptData(initialData);
    setPromptConfig({isOpen: true, title, fields, onSubmit});
  };
  `;

  if (!code.includes('setAlertConfig')) {
    code = code.replace(
      'const [activeTab, setActiveTab] = useState("dashboard");',
      `const [activeTab, setActiveTab] = useState("dashboard");${modalStates}`
    );
  }

  // 3. Inject Modal UI at the end of the main wrapper (before the final </div></div>)
  const modalsUI = `
      {/* GLOBAL MODALS */}
      {alertConfig.isOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className={"text-xl font-display font-bold mb-2 " + (alertConfig.type === 'error' ? 'text-error' : alertConfig.type === 'success' ? 'text-success' : 'text-ink')}>{alertConfig.title}</h3>
            <p className="text-stone mb-6">{alertConfig.message}</p>
            <div className="flex justify-end">
              <button onClick={() => setAlertConfig({...alertConfig, isOpen: false})} className="px-5 py-2 bg-primary text-surface font-bold rounded-lg hover:bg-primary-light">OK</button>
            </div>
          </div>
        </div>
      )}

      {confirmConfig.isOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-display font-bold mb-2 text-ink">{confirmConfig.title}</h3>
            <p className="text-stone mb-6">{confirmConfig.message}</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmConfig({...confirmConfig, isOpen: false})} className="px-4 py-2 bg-muted text-stone font-bold rounded-lg hover:bg-border">Cancel</button>
              <button onClick={() => { confirmConfig.onConfirm(); setConfirmConfig({...confirmConfig, isOpen: false}); }} className="px-4 py-2 bg-primary text-surface font-bold rounded-lg hover:bg-primary-light">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {promptConfig.isOpen && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50 p-4">
          <div className="bg-surface p-6 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-display font-bold mb-4 text-ink">{promptConfig.title}</h3>
            <div className="space-y-4 mb-6">
              {promptConfig.fields.map((f: any) => (
                <div key={f.name}>
                  <label className="block text-sm font-semibold text-stone mb-1">{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  ) : (
                    <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setPromptConfig({...promptConfig, isOpen: false})} className="px-4 py-2 bg-muted text-stone font-bold rounded-lg hover:bg-border">Cancel</button>
              <button onClick={() => { promptConfig.onSubmit(promptData); setPromptConfig({...promptConfig, isOpen: false}); }} className="px-4 py-2 bg-primary text-surface font-bold rounded-lg hover:bg-primary-light">Submit</button>
            </div>
          </div>
        </div>
      )}
  `;
  if (!code.includes('GLOBAL MODALS')) {
    code = code.replace(/    <\/div>\s*<\/div>\s*\);\s*\}\s*$/m, modalsUI + '\n    </div>\n    </div>\n  );\n}\n');
  }

  // 4. Replace specific alert/prompt/confirm logic
  
  // Add Guest Alert
  code = code.replace(
    /if\(!newGuestForm\.name\) \{ alert\('Name is required'\); return; \}/g,
    `if(!newGuestForm.name) { showAlert('Missing Field', 'Guest Name is required.', 'error'); return; }`
  );

  // Add Res Alerts
  code = code.replace(
    /alert\('Please fill out guest, room, check-in, and check-out dates\.'\);/g,
    `showAlert('Missing Fields', 'Please fill out guest, room, check-in, and check-out dates.', 'error');`
  );
  code = code.replace(
    /alert\('. Reservation rejected\.\\nRoom is unavailable for the selected dates \(Double Booking\)\.'\);/g,
    `showAlert('Double Booking', 'Reservation rejected. Room is unavailable for the selected dates.', 'error');`
  );
  code = code.replace(
    /alert\('Reservation updated successfully!'\);/g,
    `showAlert('Success', 'Reservation updated successfully!', 'success');`
  );
  code = code.replace(
    /alert\('Reservation created successfully!'\);/g,
    `showAlert('Success', 'Reservation created successfully!', 'success');`
  );

  // Add Charge in Folio
  code = code.replace(
    /const amount = parseFloat\(window\.prompt\("Enter charge amount \(PKR\):", "0"\) \|\| "0"\);\s*if \(amount > 0\) \{\s*const desc = window\.prompt\("Enter charge description:", "Restaurant\/Service"\);\s*setCharges\(\[\.\.\.charges, \{ id: "chg_" \+ Date\.now\(\), stayId: stay\.id, category: "Service", description: desc \|\| 'Service', total: amount, date: today \}\]\);\s*\}/g,
    `showPrompt('Add Charge', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: '0' },
      { name: 'desc', label: 'Description', type: 'text', defaultValue: 'Restaurant/Service' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0) {
        setCharges([...charges, { id: 'chg_' + Date.now(), stayId: stay.id, category: 'Service', description: data.desc || 'Service', total: amount, date: today }]);
        showAlert('Charge Added', 'The charge was successfully posted to the folio.', 'success');
      }
    });`
  );

  // Collect Payment in Folio
  code = code.replace(
    /const amount = parseFloat\(window\.prompt\(`Collect Payment\. Balance is PKR \$\{balance\}`\, balance\.toString\(\)\) \|\| "0"\);\s*if \(amount > 0\) \{\s*setPayments\(\[\.\.\.payments, \{ id: "pay_" \+ Date\.now\(\), stayId: stay\.id, amount, method: "Cash", date: today \}\]\);\s*\}/g,
    `showPrompt('Collect Payment', [
      { name: 'amount', label: 'Amount (PKR)', type: 'number', defaultValue: balance.toString() },
      { name: 'method', label: 'Payment Method', type: 'text', defaultValue: 'Cash' }
    ], (data) => {
      const amount = parseFloat(data.amount || '0');
      if (amount > 0) {
        setPayments([...payments, { id: 'pay_' + Date.now(), stayId: stay.id, amount, method: data.method || 'Cash', date: today }]);
        showAlert('Payment Collected', 'The payment has been successfully recorded.', 'success');
      }
    });`
  );

  // Report Damage (ReceptionistView)
  if (filename.includes('ReceptionistView')) {
    code = code.replace(
      /const desc = window\.prompt\("Report Damage \/ Incident Description:"\);\s*if \(desc\) \{\s*const cost = parseFloat\(window\.prompt\("Estimated Cost to charge \(Requires Manager Approval\):", "0"\) \|\| "0"\);\s*setIncidents\(\[\.\.\.incidents, \{ id: "inc_" \+ Date\.now\(\), stayId: stay\.id, roomId: stay\.roomId, date: today, description: desc, estimatedCost: cost, status: "Pending Review" \}\]\);\s*\}/g,
      `showPrompt('Report Damage', [
        { name: 'desc', label: 'Incident Description', type: 'textarea', defaultValue: '' },
        { name: 'cost', label: 'Estimated Cost (PKR)', type: 'number', defaultValue: '0' }
      ], (data) => {
        if (data.desc) {
          const cost = parseFloat(data.cost || '0');
          setIncidents([...incidents, { id: 'inc_' + Date.now(), stayId: stay.id, roomId: stay.roomId, date: today, description: data.desc, estimatedCost: cost, status: 'Pending Review' }]);
          showAlert('Damage Reported', 'Incident submitted for Manager approval.', 'success');
        }
      });`
    );

    code = code.replace(
      /if \(balance > 0 && !window\.confirm\(`Guest has an outstanding balance of PKR \$\{balance\}\. Checkout anyway\?`\)\) return;\s*handleCheckout\(stay\.id\);/g,
      `if (balance > 0) {
         showConfirm('Outstanding Balance', \`This guest has an unpaid balance of PKR \${balance}. Are you sure you want to proceed with checkout?\`, () => handleCheckout(stay.id));
       } else {
         handleCheckout(stay.id);
       }`
    );

    code = code.replace(
      /const issue = window\.prompt\("Describe the maintenance issue:"\);\s*if \(issue\) \{\s*setMaintenance\(\[\.\.\.maintenance, \{\s*id: "maint_" \+ Date\.now\(\), roomId: room\.id, date: today, problem: issue, status: "Open"\s*\}\]\);\s*setRooms\(rooms\.map\(r => r\.id === room\.id \? \{ \.\.\.r, status: "Out of Order" \} : r\)\);\s*\}/g,
      `showPrompt('Report Maintenance', [
        { name: 'issue', label: 'Describe the issue', type: 'textarea', defaultValue: '' }
      ], (data) => {
        if (data.issue) {
          setMaintenance([...maintenance, { id: 'maint_' + Date.now(), roomId: room.id, date: today, problem: data.issue, status: 'Open' }]);
          setRooms(rooms.map(r => r.id === room.id ? { ...r, status: 'Out of Order' } : r));
          showAlert('Maintenance Reported', 'Room has been flagged Out of Order.', 'success');
        }
      });`
    );
  }

  if (filename.includes('ManagerView')) {
    code = code.replace(
      /if\(window\.confirm\('Are you sure you want to reset all data\?'\)\) resetDemoData\(\);/g,
      `showConfirm('Reset System Data', 'Are you absolutely sure you want to wipe all local data and restore the original seed values? This action cannot be undone.', resetDemoData);`
    );
  }

  fs.writeFileSync(filename, code);
  console.log('Applied polish and modals to ' + filename);
}

applyPolish('src/hms/ReceptionistView.tsx');
applyPolish('src/hms/ManagerView.tsx');
