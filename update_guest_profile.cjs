const fs = require('fs');

function updateFile(filename) {
  let code = fs.readFileSync(filename, 'utf8');
  
  // Add address to form state and add selectedGuest state
  code = code.replace(
    /const \[newGuestForm, setNewGuestForm\] = useState\(\{ name: '', phone: '', cnic: '', notes: '' \}\);/g,
    `const [newGuestForm, setNewGuestForm] = useState({ name: '', phone: '', address: '', cnic: '', notes: '' });
  const [selectedGuest, setSelectedGuest] = useState<any>(null);`
  );

  // Add address to form UI
  const formHtml = `                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.phone} onChange={e => setNewGuestForm({...newGuestForm, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.address} onChange={e => setNewGuestForm({...newGuestForm, address: e.target.value})} />
                    </div>`;
  
  code = code.replace(
    /<div>\s*<label className="block text-sm font-semibold text-gray-700 mb-1">Phone<\/label>\s*<input type="text" className="w-full border border-gray-300 rounded-lg p-2" value=\{newGuestForm\.phone\} onChange=\{e => setNewGuestForm\(\{\.\.\.newGuestForm, phone: e\.target\.value\}\)\} \/>\s*<\/div>/g,
    formHtml
  );

  // Add address to Save Guest
  code = code.replace(
    /setGuests\(\[\.\.\.guests, \{ id: 'g_' \+ Date.now\(\), name: newGuestForm\.name, phone: newGuestForm\.phone, cnic: newGuestForm\.cnic, notes: newGuestForm\.notes \}\]\);/g,
    `setGuests([...guests, { id: 'g_' + Date.now(), name: newGuestForm.name, phone: newGuestForm.phone, address: newGuestForm.address, cnic: newGuestForm.cnic, notes: newGuestForm.notes }]);`
  );

  code = code.replace(
    /setNewGuestForm\(\{ name: '', phone: '', cnic: '', notes: '' \}\);/g,
    `setNewGuestForm({ name: '', phone: '', address: '', cnic: '', notes: '' });`
  );

  // Replace guests tab content
  const oldGuestsTabRegex = /\{\/\* GUESTS \*\/\}\s*\{activeTab === ["']guests["'] && \([\s\S]*?\{\/\* ACTIVE STAYS \*\/\}/g;

  const newGuestsTab = `{/* GUESTS */}
        {activeTab === 'guests' && (
          <div className="max-w-6xl">
            {!selectedGuest ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Guest Directory</h1>
                  <button onClick={() => setIsAddGuestModalOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Add Guest</button>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Name</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Phone</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">ID / CNIC</th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {guests.map(g => (
                        <tr key={g.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">{g.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{g.phone}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{g.cnic}</td>
                          <td className="px-4 py-3 text-sm text-emerald-600 font-bold"><button onClick={() => setSelectedGuest(g)} className="hover:underline">View Profile</button></td>
                        </tr>
                      ))}
                      {guests.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No guests found.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Guest Profile: {selectedGuest.name}</h1>
                  <button onClick={() => setSelectedGuest(null)} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-bold text-sm">Back to Directory</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column: Details */}
                  <div className="col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Contact & Identity</h3>
                      <div className="space-y-3 text-sm">
                        <p><span className="text-gray-500 block text-xs">Name</span> <strong className="text-gray-900">{selectedGuest.name}</strong></p>
                        <p><span className="text-gray-500 block text-xs">Phone</span> <span className="text-gray-900">{selectedGuest.phone || '-'}</span></p>
                        <p><span className="text-gray-500 block text-xs">Address</span> <span className="text-gray-900">{selectedGuest.address || '-'}</span></p>
                        <p><span className="text-gray-500 block text-xs">CNIC / Passport</span> <span className="text-gray-900">{selectedGuest.cnic || '-'}</span></p>
                        <p><span className="text-gray-500 block text-xs">Notes</span> <span className="text-gray-900">{selectedGuest.notes || '-'}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column: History */}
                  <div className="col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Stays & Reservations</h3>
                      <ul className="divide-y text-sm">
                        {reservations.filter(r => r.guestId === selectedGuest.id).map(r => {
                           const st = stays.find(s => s.reservationId === r.id);
                           const rm = rooms.find(room => room.id === r.roomId);
                           return (
                             <li key={r.id} className="py-3 flex justify-between items-center">
                               <div>
                                 <p className="font-bold">Room {rm?.number} <span className="text-gray-500 font-normal ml-2">{r.checkIn} to {r.checkOut}</span></p>
                                 <p className="text-xs text-gray-500 mt-1">Status: {r.status} {st ? \`| Stay: \${st.status}\` : ''}</p>
                               </div>
                               <span className={\`px-2 py-1 text-xs font-bold rounded \${r.status === 'Checked In' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}\`}>{r.status}</span>
                             </li>
                           )
                        })}
                        {reservations.filter(r => r.guestId === selectedGuest.id).length === 0 && <p className="text-gray-500 py-2 text-xs">No reservations on record.</p>}
                      </ul>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-900 border-b pb-2 mb-4">Incidents & Damage</h3>
                      <ul className="divide-y text-sm">
                        {incidents.filter(i => {
                          // incidents are linked to stayId. We need stays for this guest.
                          const guestStays = stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id);
                          return guestStays.includes(i.stayId);
                        }).map(inc => (
                             <li key={inc.id} className="py-3 flex justify-between items-center">
                               <div>
                                 <p className="font-bold">{inc.date}</p>
                                 <p className="text-xs text-gray-700 mt-1 max-w-sm truncate">{inc.description}</p>
                               </div>
                               <span className={\`px-2 py-1 text-xs font-bold rounded \${inc.status === 'Approved' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}\`}>{inc.status}</span>
                             </li>
                        ))}
                        {incidents.filter(i => stays.filter(s => s.guestId === selectedGuest.id).map(s => s.id).includes(i.stayId)).length === 0 && <p className="text-gray-500 py-2 text-xs">No incidents on record.</p>}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isAddGuestModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-2xl">
                  <h2 className="text-xl font-bold mb-4">Add New Guest</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.name} onChange={e => setNewGuestForm({...newGuestForm, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.phone} onChange={e => setNewGuestForm({...newGuestForm, phone: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.address} onChange={e => setNewGuestForm({...newGuestForm, address: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">CNIC / Passport</label>
                      <input type="text" className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.cnic} onChange={e => setNewGuestForm({...newGuestForm, cnic: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                      <textarea className="w-full border border-gray-300 rounded-lg p-2" value={newGuestForm.notes} onChange={e => setNewGuestForm({...newGuestForm, notes: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsAddGuestModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg">Cancel</button>
                    <button onClick={() => {
                      if(!newGuestForm.name) { alert('Name is required'); return; }
                      setGuests([...guests, { id: 'g_' + Date.now(), name: newGuestForm.name, phone: newGuestForm.phone, address: newGuestForm.address, cnic: newGuestForm.cnic, notes: newGuestForm.notes }]);
                      setIsAddGuestModalOpen(false);
                      setNewGuestForm({ name: '', phone: '', address: '', cnic: '', notes: '' });
                    }} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Save Guest</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ACTIVE STAYS */}`;

  if (filename.includes('ManagerView')) {
    code = code.replace(oldGuestsTabRegex, newGuestsTab.replace(/bg-emerald-600/g, 'bg-blue-600').replace(/text-emerald-600/g, 'text-blue-600'));
  } else {
    code = code.replace(oldGuestsTabRegex, newGuestsTab);
  }

  fs.writeFileSync(filename, code);
  console.log('Updated ' + filename);
}

updateFile('src/hms/ReceptionistView.tsx');
updateFile('src/hms/ManagerView.tsx');
