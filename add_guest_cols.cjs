const fs = require('fs');

function addGuestColumns(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add the headings
  code = code.replace(
    /<th className="px-4 py-3 text-xs font-semibold text-muted-text">ID \/ CNIC<\/th>\n\s*<th className="px-4 py-3 text-xs font-semibold text-muted-text">Action<\/th>/g,
    `<th className="px-4 py-3 text-xs font-semibold text-muted-text">ID / CNIC</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Address</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Notes</th>
                    <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>`
  );

  // Add the table cells
  code = code.replace(
    /<td className="px-4 py-3 text-xs text-muted-text">\{g\.cnic\}<\/td>\n\s*<td className="px-4 py-3 flex gap-3">/g,
    `<td className="px-4 py-3 text-xs text-muted-text">{g.cnic}</td>
                          <td className="px-4 py-3 text-sm text-stone">{g.address || '-'}</td>
                          <td className="px-4 py-3 text-sm text-stone max-w-[150px] truncate" title={g.notes || ''}>{g.notes || '-'}</td>
                          <td className="px-4 py-3 flex gap-3">`
  );

  fs.writeFileSync(filename, code);
  console.log('Added Address and Notes columns to Guest Directory in ' + filename);
}

addGuestColumns('src/hms/ReceptionistView.tsx');
addGuestColumns('src/hms/ManagerView.tsx');
