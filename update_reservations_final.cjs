const fs = require('fs');

function injectReservations(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Inject states
  if (!code.includes('isResModalOpen')) {
    code = code.replace(
      'const [activeTab, setActiveTab] = useState("dashboard");',
      `const [activeTab, setActiveTab] = useState("dashboard");
  const [isResModalOpen, setIsResModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [resForm, setResForm] = useState({ guestId: '', roomId: '', checkIn: '', checkOut: '', guests: 1, rate: 0, deposit: 0, paymentMethod: 'Card', source: 'Walk-in', specialRequest: '' });`
    );
  }

  // Double booking check function
  const checkFunc = `
  const checkAvailability = (roomId: string, checkIn: string, checkOut: string, excludeResId?: string) => {
    // Basic date parsing
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    if (inDate >= outDate) return false;

    // Check existing reservations
    const overlappingRes = reservations.find(r => {
      if (r.id === excludeResId) return false;
      if (r.roomId !== roomId) return false;
      if (r.status === 'Cancelled' || r.status === 'Completed' || r.status === 'Checked Out') return false;
      const existingIn = new Date(r.checkIn);
      const existingOut = new Date(r.checkOut);
      // Overlap condition: in1 < out2 && in2 < out1
      return inDate < existingOut && existingIn < outDate;
    });

    if (overlappingRes) return false;

    // Check room status if today (simplification)
    if (checkIn === today) {
       const room = rooms.find(r => r.id === roomId);
       if (room && (room.status === 'Maintenance' || room.status === 'Out of Order')) return false;
    }

    return true;
  };
  `;
  if (!code.includes('checkAvailability')) {
    code = code.replace('const today = new Date().toISOString().split("T")[0];', checkFunc + '\n  const today = new Date().toISOString().split("T")[0];');
  }


  // Replace Reservations Tab Content
  const oldResTabRegex = /\{\/\* RESERVATIONS \*\/\}\s*\{activeTab === ["']reservations["'] && \([\s\S]*?\{\/\* ROOMS? /g;

  const color = filename.includes('ManagerView') ? 'blue' : 'emerald';

  const newResTab = `{/* RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
              <button onClick={() => {
                setSelectedReservation(null);
                setResForm({ guestId: '', roomId: '', checkIn: '', checkOut: '', guests: 1, rate: 0, deposit: 0, paymentMethod: 'Card', source: 'Walk-in', specialRequest: '' });
                setIsResModalOpen(true);
              }} className="px-4 py-2 bg-${color}-600 text-white rounded-lg font-bold text-sm flex items-center gap-2"><Plus className="w-4 h-4"/> New Reservation</button>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">ID</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Guest</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Room</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Dates</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Status</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.map(res => {
                    const g = guests.find(g => g.id === res.guestId);
                    const r = rooms.find(r => r.id === res.roomId);
                    return (
                      <tr key={res.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs font-mono text-blue-600">{res.id}</td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{g?.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r?.number}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{res.checkIn} to {res.checkOut}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded bg-gray-100">{res.status}</span>
                        </td>
                        <td className="px-4 py-3">
                           <button onClick={() => {
                             setSelectedReservation(res);
                             setResForm({
                               guestId: res.guestId, roomId: res.roomId, checkIn: res.checkIn, checkOut: res.checkOut,
                               guests: res.guests, rate: res.rate, deposit: res.deposit || 0,
                               paymentMethod: res.paymentMethod || 'Card', source: res.source, specialRequest: res.specialRequest || ''
                             });
                             setIsResModalOpen(true);
                           }} className="text-sm font-bold text-${color}-600 hover:underline">Edit</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {isResModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10">
                <div className="bg-white p-6 rounded-2xl max-w-2xl w-full shadow-2xl my-auto">
                  <h2 className="text-xl font-bold mb-4">{selectedReservation ? 'Edit Reservation' : 'New Reservation'}</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Guest</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2" value={resForm.guestId} onChange={e => setResForm({...resForm, guestId: e.target.value})}>
                        <option value="">Select a guest...</option>
                        {guests.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Room</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2" value={resForm.roomId} onChange={e => {
                         const rId = e.target.value;
                         const rm = rooms.find(r => r.id === rId);
                         setResForm({...resForm, roomId: rId, rate: rm ? rm.rate : resForm.rate});
                      }}>
                        <option value="">Select a room...</option>
                        {rooms.filter(r => r.status !== 'Maintenance' && r.status !== 'Out of Order').map(r => <option key={r.id} value={r.id}>Room {r.number} ({r.type})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Check-in</label>
                      <input type="date" className="w-full border border-gray-300 rounded-lg p-2" value={resForm.checkIn} onChange={e => setResForm({...resForm, checkIn: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Check-out</label>
                      <input type="date" className="w-full border border-gray-300 rounded-lg p-2" value={resForm.checkOut} onChange={e => setResForm({...resForm, checkOut: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Guests</label>
                      <input type="number" min="1" className="w-full border border-gray-300 rounded-lg p-2" value={resForm.guests} onChange={e => setResForm({...resForm, guests: parseInt(e.target.value) || 1})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Rate (PKR)</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg p-2" value={resForm.rate} onChange={e => setResForm({...resForm, rate: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Deposit</label>
                      <input type="number" className="w-full border border-gray-300 rounded-lg p-2" value={resForm.deposit} onChange={e => setResForm({...resForm, deposit: parseInt(e.target.value) || 0})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Payment Method</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2" value={resForm.paymentMethod} onChange={e => setResForm({...resForm, paymentMethod: e.target.value})}>
                        <option>Card</option><option>Cash</option><option>Bank Transfer</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Booking Source</label>
                      <select className="w-full border border-gray-300 rounded-lg p-2" value={resForm.source} onChange={e => setResForm({...resForm, source: e.target.value})}>
                        <option>Walk-in</option><option>Phone</option><option>Website</option><option>Explore Pakistan</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Special Requests / Notes</label>
                      <textarea className="w-full border border-gray-300 rounded-lg p-2" value={resForm.specialRequest} onChange={e => setResForm({...resForm, specialRequest: e.target.value})} />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end gap-3">
                    <button onClick={() => setIsResModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg">Cancel</button>
                    <button onClick={() => {
                      if (!resForm.guestId || !resForm.roomId || !resForm.checkIn || !resForm.checkOut) {
                        alert('Please fill out guest, room, check-in, and check-out dates.');
                        return;
                      }
                      
                      const isAvailable = checkAvailability(resForm.roomId, resForm.checkIn, resForm.checkOut, selectedReservation?.id);
                      if (!isAvailable) {
                        alert('❌ Reservation rejected.\\nRoom is unavailable for the selected dates (Double Booking).');
                        return;
                      }

                      if (selectedReservation) {
                         // Edit
                         setReservations(reservations.map(r => r.id === selectedReservation.id ? {
                           ...r,
                           ...resForm
                         } : r));
                         alert('Reservation updated successfully!');
                      } else {
                         // New
                         const newRes = {
                           id: 'res_' + Date.now(),
                           status: 'Confirmed',
                           ...resForm
                         };
                         setReservations([...reservations, newRes]);
                         
                         // Mark room as reserved if check-in is today
                         if (resForm.checkIn === today) {
                           setRooms(rooms.map(rm => rm.id === resForm.roomId ? { ...rm, status: 'Reserved' } : rm));
                         }
                         alert('Reservation created successfully!');
                      }
                      
                      setIsResModalOpen(false);
                    }} className="px-4 py-2 bg-${color}-600 text-white font-bold rounded-lg">Save Reservation</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ROOM`;

  if (filename.includes('ManagerView')) {
    code = code.replace(oldResTabRegex, newResTab.replace('{/* ROOM', '{/* ROOMS'));
  } else {
    code = code.replace(oldResTabRegex, newResTab.replace('{/* ROOM', '{/* ROOM BOARD'));
  }

  // Also fix "New Reservation" quick action in dashboard to open the modal
  code = code.replace(
    /<button onClick=\{\(\) => setActiveTab\("reservations"\)\} className="p-3 bg-gray-50 border border-gray-200 hover:border-emerald-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"\/> New Reservation<\/button>/g,
    `<button onClick={() => { setActiveTab("reservations"); setSelectedReservation(null); setResForm({ guestId: '', roomId: '', checkIn: '', checkOut: '', guests: 1, rate: 0, deposit: 0, paymentMethod: 'Card', source: 'Walk-in', specialRequest: '' }); setIsResModalOpen(true); }} className="p-3 bg-gray-50 border border-gray-200 hover:border-emerald-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> New Reservation</button>`
  );

  fs.writeFileSync(filename, code);
  console.log('Updated reservations in ' + filename);
}

injectReservations('src/hms/ReceptionistView.tsx');
injectReservations('src/hms/ManagerView.tsx');
