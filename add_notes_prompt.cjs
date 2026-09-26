const fs = require('fs');

function addNotesToPrompt(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  code = code.replace(
    /\{ name: 'address', label: 'Address', type: 'text', defaultValue: g\.address \}/g,
    "{ name: 'address', label: 'Address', type: 'text', defaultValue: g.address },\n                                { name: 'notes', label: 'Notes', type: 'textarea', defaultValue: g.notes || '' }"
  );

  fs.writeFileSync(filename, code);
  console.log('Added Notes to Edit Guest prompt in ' + filename);
}

addNotesToPrompt('src/hms/ReceptionistView.tsx');
addNotesToPrompt('src/hms/ManagerView.tsx');
