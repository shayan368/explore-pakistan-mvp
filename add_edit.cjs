const fs = require('fs');

function injectEditAttendance(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Look for the end of the Check Out button and inject Edit button right after it.
  const actionTargetEnd = `</td>`;
  const searchFor = `className="text-sm font-bold text-error hover:underline">Check Out</button>
                          )}`;
                          
  const insertIndex = code.indexOf(searchFor);
  if (insertIndex > -1) {
    const editBtn = `
                          {todayAtt && (
                             <button onClick={() => {
                               showPrompt('Edit Attendance', [
                                 { name: 'status', label: 'Status', type: 'select', defaultValue: todayAtt.status, options: ['Present', 'Absent', 'Late', 'Leave', 'Half Day', 'Overtime'] },
                                 { name: 'checkIn', label: 'Check-in Time (Optional)', type: 'time', defaultValue: todayAtt.checkIn || '' },
                                 { name: 'checkOut', label: 'Check-out Time (Optional)', type: 'time', defaultValue: todayAtt.checkOut || '' }
                               ], (data) => {
                                 setAttendance(attendance.map(a => a.id === todayAtt.id ? { ...a, status: data.status, checkIn: data.checkIn, checkOut: data.checkOut } : a));
                                 logAction(auth?.email || '', 'Receptionist', 'Edited Attendance', 'Attendance', todayAtt.id, \`Updated \${s.name} to \${data.status}\`);
                                 showAlert('Success', 'Attendance updated.', 'success');
                               });
                             }} className="text-sm font-bold text-stone hover:text-primary hover:underline">Edit</button>
                          )}`;
    
    const before = code.substring(0, insertIndex + searchFor.length);
    const after = code.substring(insertIndex + searchFor.length);
    
    // Make sure we haven't already added it
    if (!code.includes("Edit Attendance")) {
      fs.writeFileSync(filename, before + editBtn + after);
      console.log('Injected Edit button into ' + filename);
    } else {
      console.log('Edit button already exists in ' + filename);
    }
  } else {
    console.log('Could not find injection point in ' + filename);
  }
}

injectEditAttendance('src/hms/ReceptionistView.tsx');
