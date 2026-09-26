const fs = require('fs');

function injectBookingHistory(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // 1. Add History, Printer to lucide-react imports
  if (!code.includes('History,')) {
    code = code.replace(/\} from "lucide-react";/, `, History, Printer } from "lucide-react";`);
  }

  // 2. Add booking-history to sidebar links
  // Look for { id: "reservations", label: "Reservations", icon: CalendarDays },
  const resLink = '{ id: "reservations", label: "Reservations", icon: CalendarDays },';
  if (code.includes(resLink) && !code.includes('booking-history')) {
    code = code.replace(resLink, resLink + '\n    { id: "booking-history", label: "Booking History", icon: History },');
  }

  // 3. Inject the tab content
  // We can inject it right before: {/* ROOMS */} or {/* GUESTS */}
  const guestTabStr = "{/* GUESTS */}";
  const bookingHistoryTab = `
        {/* BOOKING HISTORY */}
        {activeTab === 'booking-history' && (
          <div className="max-w-7xl pb-12">
            <h1 className="text-3xl font-display font-bold text-ink mb-6">Booking History</h1>
            
            <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Booking ID</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Customer Name</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Room Number</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Room Type</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Booking Date</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Check In</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Check Out</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Total Price</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Remaining Price</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Payment Status</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Occupants</th>
                      <th className="px-4 py-4 text-xs font-bold text-stone uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {reservations.map(res => {
                      const guest = guests.find(g => g.id === res.guestId);
                      const room = rooms.find(r => r.id === res.roomId);
                      const stay = stays.find(s => s.reservationId === res.id);
                      
                      const nights = Math.max(1, Math.floor((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000*60*60*24)));
                      
                      let total = 0;
                      let paid = 0;
                      
                      if (stay) {
                        total = charges.filter(c => c.stayId === stay.id).reduce((sum, c) => sum + c.total, 0);
                        paid = payments.filter(p => p.stayId === stay.id).reduce((sum, p) => sum + p.amount, 0);
                      } else {
                        total = res.rate * nights;
                      }
                      
                      const remaining = Math.max(0, total - paid);
                      
                      let pmtStatus = 'Unpaid';
                      let pmtColor = 'text-red-700 bg-red-50';
                      if (remaining <= 0 && total > 0) {
                        pmtStatus = 'Paid';
                        pmtColor = 'text-green-700 bg-green-50';
                      } else if (paid > 0) {
                        pmtStatus = 'Partial';
                        pmtColor = 'text-orange-700 bg-orange-50';
                      }

                      return (
                        <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 text-sm font-medium text-ink">{res.id}</td>
                          <td className="px-4 py-4 text-sm font-medium text-ink">{guest?.name || 'Unknown'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{room?.number || 'N/A'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{room?.type || 'N/A'}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.checkIn}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.checkIn}</td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.checkOut}</td>
                          <td className="px-4 py-4 text-sm font-bold text-ink">{total.toLocaleString()}</td>
                          <td className="px-4 py-4 text-sm font-bold text-ink">{remaining.toLocaleString()}</td>
                          <td className="px-4 py-4">
                            <span className={\`px-2.5 py-1 text-xs font-bold rounded-md \${pmtColor}\`}>{pmtStatus}</span>
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-stone">{res.guests}</td>
                          <td className="px-4 py-4">
                            <button onClick={() => showAlert('Print Receipt', \`Printing receipt for booking \${res.id}...\`, 'success')} className="flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                              <Printer className="w-3.5 h-3.5" />
                              Print Receipt
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {reservations.length === 0 && (
                      <tr><td colSpan={12} className="px-4 py-8 text-center text-stone">No bookings found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
`;

  if (code.includes(guestTabStr) && !code.includes('activeTab === \'booking-history\'')) {
    code = code.replace(guestTabStr, bookingHistoryTab + '\n' + guestTabStr);
  }

  fs.writeFileSync(filename, code);
  console.log('Injected booking history into ' + filename);
}

injectBookingHistory('src/hms/ManagerView.tsx');
injectBookingHistory('src/hms/ReceptionistView.tsx');
