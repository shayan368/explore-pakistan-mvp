const fs = require('fs');

function addMaintenanceCost() {
  // 1. Update useHMS.ts
  let useHmsCode = fs.readFileSync('src/hms/useHMS.ts', 'utf8');
  if (!useHmsCode.includes('cost?: number;')) {
    useHmsCode = useHmsCode.replace(
      'status: "Open" | "In Progress" | "Resolved" | "Closed";',
      'status: "Open" | "In Progress" | "Resolved" | "Closed";\n  cost?: number;'
    );
    useHmsCode = useHmsCode.replace(
      'notes: "Called maintenance team" }]',
      'notes: "Called maintenance team", cost: 0 }]'
    );
    fs.writeFileSync('src/hms/useHMS.ts', useHmsCode);
    console.log('Updated useHMS.ts with cost property');
  }

  // 2. Update Views
  const views = ['src/hms/ManagerView.tsx', 'src/hms/ReceptionistView.tsx'];
  
  views.forEach(filename => {
    let code = fs.readFileSync(filename, 'utf8');
    let updated = false;

    // A. Update the 'Mark as Resolved' prompt
    const promptRegex = /showPrompt\('Mark as Resolved', \[\s*\{\s*name: 'resolution', label: 'Resolution Notes', type: 'textarea', defaultValue: ''\s*\}\s*\], \(data\) => \{/;
    const newPrompt = `showPrompt('Mark as Resolved', [
                          { name: 'cost', label: 'Repair Cost (PKR)', type: 'number', defaultValue: '0' },
                          { name: 'resolution', label: 'Resolution Notes', type: 'textarea', defaultValue: '' }
                        ], (data) => {`;
    
    if (promptRegex.test(code)) {
      code = code.replace(promptRegex, newPrompt);
      
      // Also update the setMaintenance call inside that callback to include cost
      const setMaintRegex = /status: 'Resolved', resolvedDate: new Date\(\)\.toLocaleDateString\(\), notes: x\.notes \+ \`\\n\\n\[RESOLVED \$\{new Date\(\)\.toLocaleDateString\(\)\}\] \$\{data\.resolution\}\` \}/;
      const newSetMaint = `status: 'Resolved', resolvedDate: new Date().toLocaleDateString(), cost: Number(data.cost) || 0, notes: x.notes + \`\\n\\n[RESOLVED \${new Date().toLocaleDateString()}] Cost: PKR \${data.cost || 0}. \${data.resolution}\` }`;
      code = code.replace(setMaintRegex, newSetMaint);
      updated = true;
    }

    // B. Add the Cost display to the detailed view grid
    const gridTarget = `<div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Current Room Status</p>`;
    const newGrid = `<div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Repair Cost</p>
                        <p className="font-bold text-ink">Rs {m.cost ? m.cost.toLocaleString() : '0'}</p>
                      </div>
                      <div className="bg-white border border-border p-4 rounded-xl shadow-sm">
                        <p className="text-xs font-bold text-muted-text uppercase tracking-wider mb-1">Current Room Status</p>`;
    
    if (code.includes(gridTarget) && !code.includes('Repair Cost</p>')) {
      code = code.replace(gridTarget, newGrid);
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filename, code);
      console.log('Updated ' + filename + ' with cost logic');
    }
  });
}

addMaintenanceCost();
