const fs = require('fs');

function buildSettingsTab(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add Building to imports
  if (!code.includes('Building')) {
    code = code.replace(/\} from "lucide-react";/, ', Building } from "lucide-react";');
  }

  // Add state for hotelProfile
  const stateCode = `
  const [hotelProfile, setHotelProfile] = useState({
    name: 'Aurelia Grand Hotel & Spa',
    tagline: 'Where every stay becomes a story',
    address: '12 Marina Promenade, Singapore 018956',
    phone: '+65 6789 1234',
    email: 'stay@aurelia.com',
    website: 'www.aureliagrand.com',
    currency: '$',
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    tax: '10'
  });
  `;
  
  if (!code.includes('setHotelProfile')) {
    code = code.replace(/const \[activeTab, setActiveTab\] = useState\("dashboard"\);/, 'const [activeTab, setActiveTab] = useState("dashboard");' + stateCode);
  }

  // Replace Settings tab content
  const startTag = `{/* SETTINGS */}`;
  const endTag = `</div>\n        )}\n`;
  const startIndex = code.indexOf(startTag);
  
  if (startIndex > -1) {
    const endIndex = code.indexOf(endTag, startIndex) + endTag.length;
    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex);

    const newTabContent = `
        {/* SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl pb-12">
            
            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-border mb-8 relative">
              <div className="flex items-center gap-2 mb-1">
                 <div className="p-1.5 bg-[#f3efe8] rounded-md"><Building className="w-5 h-5 text-accent" /></div>
                 <h2 className="text-xl font-display font-bold text-ink">Hotel Profile</h2>
              </div>
              <p className="text-xs text-muted-text mb-6">Used on invoices and guest communications.</p>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Hotel Name</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.name} onChange={e => setHotelProfile({...hotelProfile, name: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Tagline</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.tagline} onChange={e => setHotelProfile({...hotelProfile, tagline: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Address</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.address} onChange={e => setHotelProfile({...hotelProfile, address: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Phone</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.phone} onChange={e => setHotelProfile({...hotelProfile, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Email</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.email} onChange={e => setHotelProfile({...hotelProfile, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Website</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.website} onChange={e => setHotelProfile({...hotelProfile, website: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Currency Symbol</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.currency} onChange={e => setHotelProfile({...hotelProfile, currency: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Check-in Time</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.checkIn} onChange={e => setHotelProfile({...hotelProfile, checkIn: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Check-out Time</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.checkOut} onChange={e => setHotelProfile({...hotelProfile, checkOut: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone mb-1.5 uppercase tracking-wider">Tax Rate (%)</label>
                  <input className="w-full border border-border rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-primary focus:border-primary" value={hotelProfile.tax} onChange={e => setHotelProfile({...hotelProfile, tax: e.target.value})} />
                </div>
                <div className="col-span-2 mt-4">
                   <button onClick={() => {
                     logAction(auth?.email || '', 'Manager', 'Updated Hotel Profile', 'Settings', 'hotel_profile', 'Updated hotel settings');
                     showAlert('Success', 'Hotel Profile has been saved.', 'success');
                   }} className="px-6 py-2.5 bg-accent hover:bg-[#b59863] text-white rounded-lg font-bold text-sm flex items-center gap-2 shadow-md transition-colors w-fit"><Building className="w-4 h-4" /> Save Profile</button>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-md hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-lg font-bold text-red-600 mb-2">Reset Demo Data</h2>
              <p className="text-sm text-muted-text mb-4">This will clear all localStorage records and recreate the original seed data. This action cannot be undone.</p>
              <button onClick={() => { showConfirm('Reset System Data', 'Are you absolutely sure you want to wipe all local data and restore the original seed values? This action cannot be undone.', resetDemoData); }} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm shadow">
                Reset All Data
              </button>
            </div>
          </div>
        )}
`;

    code = before + newTabContent + after;
    fs.writeFileSync(filename, code);
    console.log('Built advanced Settings tab in ' + filename);
  }
}

buildSettingsTab('src/hms/ManagerView.tsx');
