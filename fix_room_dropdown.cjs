const fs = require('fs');

function fixSelect(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix Room Dropdown to include a placeholder
  const roomRegex = /\{ name: 'roomId', label: 'Room', type: 'select', options: rooms\.map\(r => r\.id \+ ' - Room ' \+ r\.number\), defaultValue: rooms\.length > 0 \? \(rooms\[0\]\.id \+ ' - Room ' \+ rooms\[0\]\.number\) : '' \}/g;
  const newRoomStr = `{ name: 'roomId', label: 'Room', type: 'select', options: ['Select a Room', ...rooms.map(r => r.id + ' - Room ' + r.number)], defaultValue: 'Select a Room' }`;
  code = code.replace(roomRegex, newRoomStr);
  
  // Update the onSubmit handler to validate if 'Select a Room' is chosen
  const callbackRegex = /const rId = data\.roomId\.split\(' - '\)\[0\];/g;
  const newCallbackStr = `if (data.roomId === 'Select a Room') { showAlert('Error', 'Please select a valid room', 'error'); return; }\n                    const rId = data.roomId.split(' - ')[0];`;
  code = code.replace(callbackRegex, newCallbackStr);

  fs.writeFileSync(filename, code);
  console.log('Fixed Room dropdown in ' + filename);
}

fixSelect('src/hms/ManagerView.tsx');
fixSelect('src/hms/ReceptionistView.tsx');
