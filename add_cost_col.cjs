const fs = require('fs');

function addCostColumn() {
  const views = ['src/hms/ManagerView.tsx', 'src/hms/ReceptionistView.tsx'];
  
  views.forEach(filename => {
    let code = fs.readFileSync(filename, 'utf8');
    let updated = false;

    // 1. Update the table header
    const thTarget = `<th className="px-5 py-3 text-xs font-semibold text-muted-text">Assigned To</th>`;
    const newTh = `<th className="px-5 py-3 text-xs font-semibold text-muted-text">Assigned To</th>
                      <th className="px-5 py-3 text-xs font-semibold text-muted-text">Cost</th>`;
                      
    if (code.includes(thTarget) && !code.includes('<th>Cost</th>') && !code.includes('>Cost</th>')) {
      code = code.replace(thTarget, newTh);
      updated = true;
    }

    // 2. Update the table row (td)
    const tdTarget = `<td className="px-5 py-4 text-sm font-medium text-stone">
                            {assignedUser ? assignedUser.name : <span className="text-gray-400 italic">Unassigned</span>}
                          </td>`;
    const newTd = `<td className="px-5 py-4 text-sm font-medium text-stone">
                            {assignedUser ? assignedUser.name : <span className="text-gray-400 italic">Unassigned</span>}
                          </td>
                          <td className="px-5 py-4 text-sm font-bold text-ink">
                            {m.cost ? \`Rs \${m.cost.toLocaleString()}\` : <span className="text-stone font-medium">-</span>}
                          </td>`;
                          
    if (code.includes(tdTarget)) {
      code = code.replace(tdTarget, newTd);
      updated = true;
    }

    // 3. Update the 'colSpan' for the "No maintenance issues" message
    const colSpanTarget = `<td colSpan={6} className="px-5 py-8 text-center text-stone font-medium">No maintenance issues recorded.</td>`;
    const newColSpan = `<td colSpan={7} className="px-5 py-8 text-center text-stone font-medium">No maintenance issues recorded.</td>`;
    
    if (code.includes(colSpanTarget)) {
      code = code.replace(colSpanTarget, newColSpan);
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(filename, code);
      console.log('Added Cost column to ' + filename);
    }
  });
}

addCostColumn();
