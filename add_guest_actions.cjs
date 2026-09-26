const fs = require('fs');

function addGuestActions(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const oldCell = `<td className="px-4 py-3 text-sm text-primary font-bold"><button onClick={() => setSelectedGuest(g)} className="hover:underline">View Profile</button></td>`;
  
  const newCell = `<td className="px-4 py-3 flex gap-3">
                            <button onClick={() => setSelectedGuest(g)} className="text-sm font-bold text-primary hover:underline">View Profile</button>
                            <button onClick={() => {
                              showPrompt('Edit Guest', [
                                { name: 'name', label: 'Name', type: 'text', defaultValue: g.name },
                                { name: 'phone', label: 'Phone', type: 'text', defaultValue: g.phone },
                                { name: 'email', label: 'Email', type: 'text', defaultValue: g.email },
                                { name: 'cnic', label: 'CNIC / ID', type: 'text', defaultValue: g.cnic },
                                { name: 'address', label: 'Address', type: 'text', defaultValue: g.address }
                              ], (data) => {
                                setGuests(guests.map(guest => guest.id === g.id ? { ...guest, ...data } : guest));
                                logAction(auth?.email || '', auth?.role || 'User', 'Edited Guest', 'Guest', g.id, \`Updated details for \${data.name}\`);
                                showAlert('Success', 'Guest details updated successfully.', 'success');
                              });
                            }} className="text-sm font-bold text-stone hover:text-primary hover:underline">Edit</button>
                            <button onClick={() => {
                              setConfirmConfig({
                                isOpen: true,
                                title: 'Delete Guest',
                                message: \`Are you sure you want to delete \${g.name}? This action cannot be undone.\`,
                                onConfirm: () => {
                                  setGuests(guests.filter(guest => guest.id !== g.id));
                                  logAction(auth?.email || '', auth?.role || 'User', 'Deleted Guest', 'Guest', g.id, \`Deleted \${g.name}\`);
                                }
                              });
                            }} className="text-sm font-bold text-error hover:underline">Delete</button>
                          </td>`;

  code = code.replace(oldCell, newCell);
  fs.writeFileSync(filename, code);
  console.log('Fixed guest actions in ' + filename);
}

addGuestActions('src/hms/ReceptionistView.tsx');
addGuestActions('src/hms/ManagerView.tsx');
