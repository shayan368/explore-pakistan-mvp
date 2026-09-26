const fs = require('fs');
let code = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');

// Add modal states
code = code.replace(
  'const [activeTab, setActiveTab] = useState("dashboard");',
  `const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddGuestModalOpen, setIsAddGuestModalOpen] = useState(false);
  const [newGuestForm, setNewGuestForm] = useState({ name: '', phone: '', cnic: '', notes: '' });`
);

// Replace existing guests tab
const existingGuestsTabStart = `{/* GUESTS */}
        {activeTab === "guests" && (
          <div className="max-w-6xl">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Guest Directory</h1>`;

const newGuestsTabStart = `{/* GUESTS */}
        {activeTab === "guests" && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Guest Directory</h1>
              <button onClick={() => setIsAddGuestModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> Add Guest</button>
            </div>`;

const endOfGuestsTab = `                </tbody>
              </table>
            </div>
          </div>
        )}`;

const modalHtml = `
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
                    }} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg">Save Guest</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}`;

code = code.replace(existingGuestsTabStart, newGuestsTabStart);
code = code.replace(endOfGuestsTab, endOfGuestsTab.replace('</div>\n          </div>\n        )}', '</div>' + modalHtml));

// ensure we import Plus if it's missing in ManagerView.tsx
if (!code.includes('Plus,')) {
    code = code.replace('} from "lucide-react";', 'Plus, } from "lucide-react";');
}

fs.writeFileSync('src/hms/ManagerView.tsx', code);
console.log('Done replacing guests tab in ManagerView');
