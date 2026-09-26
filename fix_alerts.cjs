const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/alert\("Guest successfully checked in!"\);/g, "showAlert('Check-in Successful', 'Guest successfully checked in!', 'success');");
  code = code.replace(/alert\("Check-out complete. Room is now marked as Dirty."\);/g, "showAlert('Check-out Complete', 'Room is now marked as Dirty.', 'success');");
  fs.writeFileSync(file, code);
  console.log('Fixed ' + file);
}
fix('src/hms/ReceptionistView.tsx');
fix('src/hms/ManagerView.tsx');
