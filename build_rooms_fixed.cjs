const fs = require('fs');

function buildRoomsTab(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // 1. Add imports if missing
  if (!code.includes('List, Grid')) {
    code = code.replace(/from "lucide-react";/, ', List, Grid } from "lucide-react";');
  }

  // 2. Add state variables for room tab
  const stateVars = `
  const [roomFilter, setRoomFilter] = useState('All');
  const [roomViewMode, setRoomViewMode] = useState<'grid'|'list'>('grid');
  `;
  if (!code.includes('roomFilter')) {
    code = code.replace(/const \[activeTab, setActiveTab\] = useState\("dashboard"\);/, 'const [activeTab, setActiveTab] = useState("dashboard");' + stateVars);
  }

  // 3. Add derived stats before the tab content
  const statsCode = `
  // Room Stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningMaintRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length;
  `;
  
  if (!code.includes('const totalRooms = rooms.length;')) {
    code = code.replace(/\{(\/\* ROOMS\b\*\/|\/\* ROOMS\*\/)/, statsCode + '\n        {/* ROOMS */}');
  }

  // 4. Replace the old ROOMS block
  const startTag = `{/* ROOMS */}`;
  // Find where GUESTS block starts to know where ROOMS ends
  const endTag = `{/* GUESTS */}`;
  
  const startIndex = code.indexOf(startTag);
  const endIndex = code.indexOf(endTag);
  
  if (startIndex > -1 && endIndex > -1) {
    const before = code.substring(0, startIndex);
    const after = code.substring(endIndex);

    const newTabContent = `
        {/* ROOMS */}
        {activeTab === "rooms" && (
          <div className="max-w-6xl pb-12">
            
            {/* Top Stats */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-accent/20 rounded-xl"><Building className="w-6 h-6 text-accent" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{totalRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Total Rooms</p></div>
              </div>
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-success/20 rounded-xl"><CheckCircle2 className="w-6 h-6 text-success" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{availableRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Available</p></div>
              </div>
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-orange-100 rounded-xl"><Users className="w-6 h-6 text-orange-600" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{occupiedRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Occupied</p></div>
              </div>
              <div className="bg-surface rounded-2xl border border-border shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-red-100 rounded-xl"><Sparkles className="w-6 h-6 text-red-600" /></div>
                <div><p className="text-2xl font-bold text-ink leading-tight">{cleaningMaintRooms}</p><p className="text-[10px] font-bold text-muted-text uppercase tracking-widest">Cleaning / Maint.</p></div>
              </div>
            </div>

            {/* Toolbar */}
            <div className="bg-surface rounded-full border border-border shadow-sm p-2 mb-6 flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-ink pl-4">Room Inventory</h2>
              <div className="flex items-center gap-4">
                {/* Filters */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-full">
                  {['All', 'Available', 'Occupied', 'Cleaning', 'Maintenance'].map(f => (
                    <button key={f} onClick={() => setRoomFilter(f)} className={\`px-4 py-1.5 rounded-full text-[11px] font-bold transition-all \${roomFilter === f ? 'bg-white text-ink shadow-sm' : 'text-stone hover:text-ink'}\`}>{f}</button>
                  ))}
                </div>
                {/* View Toggles */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-full border border-border/50">
                  <button onClick={() => setRoomViewMode('list')} className={\`p-1.5 rounded-full transition-all \${roomViewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-stone hover:text-ink'}\`}><List className="w-4 h-4" /></button>
                  <button onClick={() => setRoomViewMode('grid')} className={\`p-1.5 rounded-full transition-all \${roomViewMode === 'grid' ? 'bg-white shadow-sm text-accent' : 'text-stone hover:text-ink'}\`}><Grid className="w-4 h-4" /></button>
                </div>
                {/* Add Button */}
                <button className="px-5 py-2 bg-accent text-white rounded-full font-bold text-[13px] hover:bg-[#b59863] flex items-center gap-2 shadow-md transition-all"><Plus className="w-4 h-4" /> Add Room</button>
              </div>
            </div>

            {/* Grid View */}
            {roomViewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.filter(r => roomFilter === 'All' || r.status === roomFilter).map(room => (
                  <div key={room.id} className="bg-surface rounded-2xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-shadow flex flex-col group">
                    {/* Image Section */}
                    <div className="relative h-[200px] bg-gray-200 overflow-hidden">
                      {room.imageUrl ? (
                        <img src={room.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" alt={room.number} />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center"><BedDouble className="w-12 h-12 text-stone opacity-30" /></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent pointer-events-none" />
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                        <span className={\`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase text-white backdrop-blur-md \${
                          room.status === 'Available' ? 'bg-teal-500/80 shadow-[0_0_10px_rgba(20,184,166,0.3)]' : 
                          room.status === 'Occupied' ? 'bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 
                          'bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        }\`}>{room.status}</span>
                      </div>

                      {/* Room Name & Floor */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-display font-bold leading-tight drop-shadow-md">Room {room.number}</h3>
                        <p className="text-[11px] font-medium opacity-90 tracking-wide mt-1 drop-shadow-md">{room.type} • {room.floor || 'Floor 1'}</p>
                      </div>
                    </div>

                    {/* Details Section */}
                    <div className="p-4 bg-white flex flex-col flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-1.5 text-stone text-xs font-bold tracking-wide">
                          <Users className="w-3.5 h-3.5" /> Sleeps {room.capacity || 2}
                        </div>
                        <div className="text-accent font-bold text-sm tracking-wide">
                          PKR {room.rate.toLocaleString()}<span className="text-stone font-medium text-[10px]">/night</span>
                        </div>
                      </div>
                      
                      <div className="h-px w-full bg-border mb-3" />
                      
                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button className="flex-1 flex justify-center items-center gap-1.5 text-[11px] font-bold text-stone hover:text-primary transition-colors py-1">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <div className="w-px h-5 bg-border" />
                        <button className="flex-1 flex justify-center items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-700 transition-colors py-1">
                          <RefreshCw className="w-3.5 h-3.5" /> Status
                        </button>
                        <div className="w-px h-5 bg-border" />
                        <button className="pl-3 py-1 flex items-center justify-center group/btn">
                          <div className="p-1.5 bg-red-50 text-error rounded-md group-hover/btn:bg-red-100 group-hover/btn:text-red-700 transition-colors"><Trash2 className="w-3.5 h-3.5" /></div>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* List View */}
            {roomViewMode === 'list' && (
              <div className="bg-surface rounded-2xl border border-border shadow-md overflow-hidden overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Room</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Type</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Floor</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Capacity</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Rate</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Status</th>
                      <th className="px-4 py-3 text-xs font-semibold text-muted-text">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rooms.filter(r => roomFilter === 'All' || r.status === roomFilter).map(room => (
                      <tr key={room.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 text-sm font-bold text-ink">{room.number}</td>
                        <td className="px-4 py-3 text-sm text-stone">{room.type}</td>
                        <td className="px-4 py-3 text-sm text-stone">{room.floor || 'Floor 1'}</td>
                        <td className="px-4 py-3 text-sm text-stone">{room.capacity || 2} Persons</td>
                        <td className="px-4 py-3 text-sm text-accent font-bold">PKR {room.rate.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={\`px-2 py-1 text-xs font-bold rounded \${
                            room.status === 'Available' ? 'bg-success text-white' : 
                            room.status === 'Occupied' ? 'bg-orange-500 text-white' : 
                            'bg-error text-white'
                          }\`}>{room.status}</span>
                        </td>
                        <td className="px-4 py-3 flex gap-3">
                           <button className="text-stone hover:text-primary" title="Edit"><Edit2 className="w-4 h-4" /></button>
                           <button className="text-blue-500 hover:text-blue-700" title="Cycle Status"><RefreshCw className="w-4 h-4" /></button>
                           <button className="text-error hover:text-red-700" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}
\n        `;
    
    code = before + newTabContent + endTag + after;
    fs.writeFileSync(filename, code);
    console.log('Built advanced Rooms tab in ' + filename);
  } else {
    console.log('Could not find tags! start: ' + startIndex + ' end: ' + endIndex);
  }
}

buildRoomsTab('src/hms/ManagerView.tsx');
