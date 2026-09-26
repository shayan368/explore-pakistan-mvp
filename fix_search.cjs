const fs = require('fs');

function injectSearch(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const searchState = `
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); return; }
    const qLower = q.toLowerCase();
    const results: any[] = [];
    
    guests.forEach(g => { if (g.name.toLowerCase().includes(qLower) || g.phone.includes(qLower) || g.cnic.includes(qLower)) results.push({ type: 'Guest', label: g.name, id: g.id, data: g }); });
    rooms.forEach(r => { if (r.number.toLowerCase().includes(qLower)) results.push({ type: 'Room', label: 'Room ' + r.number, id: r.id, data: r }); });
    reservations.forEach(r => { if (r.id.toLowerCase().includes(qLower)) results.push({ type: 'Reservation', label: 'Res ' + r.id, id: r.id, data: r }); });
    activeStays.forEach(s => { if (s.id.toLowerCase().includes(qLower)) results.push({ type: 'Stay', label: 'Stay ' + s.id, id: s.id, data: s }); });
    payments.forEach(p => { if (p.id.toLowerCase().includes(qLower)) results.push({ type: 'Payment', label: 'Payment ' + p.id, id: p.id, data: p }); });
    incidents.forEach(i => { if (i.id.toLowerCase().includes(qLower)) results.push({ type: 'Incident', label: 'Incident ' + i.id, id: i.id, data: i }); });
    maintenance.forEach(m => { if (m.id.toLowerCase().includes(qLower)) results.push({ type: 'Maintenance', label: 'Maint ' + m.id, id: m.id, data: m }); });
    staff.forEach(s => { if (s.id.toLowerCase().includes(qLower) || s.name.toLowerCase().includes(qLower)) results.push({ type: 'Staff', label: s.name, id: s.id, data: s }); });
    
    setSearchResults(results.slice(0, 10)); // max 10 results
  };

  const handleSearchResultClick = (res: any) => {
    setSearchQuery('');
    setSearchResults([]);
    if (res.type === 'Guest') { setActiveTab('guests'); if(typeof setSelectedGuest === 'function') setSelectedGuest(res.data); }
    if (res.type === 'Room') { setActiveTab(filename.includes('Manager') ? 'rooms' : 'room-board'); }
    if (res.type === 'Reservation') { setActiveTab('reservations'); if(typeof setSelectedReservation === 'function') setSelectedReservation(res.data); }
    if (res.type === 'Stay') { setActiveTab('active-stays'); }
    if (res.type === 'Payment') { setActiveTab(filename.includes('Manager') ? 'payments' : 'folio-pos'); }
    if (res.type === 'Incident') { setActiveTab('incidents'); }
    if (res.type === 'Maintenance') { setActiveTab('maintenance'); }
    if (res.type === 'Staff') { setActiveTab('staff'); }
  };
  `;

  // Inject after const today
  code = code.replace(/const today = new Date\(\)\.toISOString\(\)\.split\("T"\)\[0\];/, `$&${searchState.replace(/filename\.includes\('Manager'\)/g, filename.includes('Manager') ? 'true' : 'false')}`);

  fs.writeFileSync(filename, code);
  console.log('Fixed search state in ' + filename);
}

injectSearch('src/hms/ReceptionistView.tsx');
injectSearch('src/hms/ManagerView.tsx');
