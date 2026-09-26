const fs = require('fs');
let code = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8');

// Add modal states
code = code.replace(
  'const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);',
  `const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [newGuestForm, setNewGuestForm] = useState({ name: '', phone: '', cnic: '', notes: '' });`
);

// Replace fallback with real Guests tab
const guestsTab = `
        {/* GUESTS */}
        {activeTab === 'guests' && (
          <div className="max-w-6xl">
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
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {guests.map(g => (
                    <tr key={g.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">{g.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{g.phone}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{g.cnic}</td>
                      <td className="px-4 py-3 text-xs text-gray-500 max-w-[200px] truncate">{g.notes || '-'}</td>
                    </tr>
                  ))}
                  {guests.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-gray-500">No guests found.</td></tr>}
                </tbody>
              </table>
            </div>

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
                      setGuests([...guests, { id: 'g_' + Date.now(), name: newGuestForm.name, phone: newGuestForm.phone, cnic: newGuestForm.cnic, notes: newGuestForm.notes }]);
                      setIsAddGuestModalOpen(false);
                      setNewGuestForm({ name: '', phone: '', cnic: '', notes: '' });
                    }} className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">Save Guest</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
`;

const reportsTab = `
        {/* REPORTS */}
        {activeTab === 'reports' && (
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Daily Reports</h1>
            <p className="text-gray-500">Refer to the Manager Portal for full financial reports.</p>
          </div>
        )}
`;

const fallbackSearch = `{/* FALLBACK FOR OTHERS */}
        {["guests", "reports"].includes(activeTab) && (
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-gray-500">This view provides extended records and historical tracking.</p>
          </div>
        )}`;

code = code.replace(fallbackSearch, guestsTab + '\n' + reportsTab);

fs.writeFileSync('src/hms/ReceptionistView.tsx', code);
console.log('Done replacing guests tab in ReceptionistView');
