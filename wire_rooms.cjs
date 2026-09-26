const fs = require('fs');

function wireRooms(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add Room Button
  const addRoomRegex = /<button className="px-5 py-2 bg-accent text-white rounded-full font-bold text-\[13px\] hover:bg-\[\#b59863\] flex items-center gap-2 shadow-md transition-all"><Plus className="w-4 h-4" \/> Add Room<\/button>/;
  const newAddRoom = `<button onClick={() => {
                  showPrompt('Add Room', [
                    { name: 'number', label: 'Room Number', type: 'text', defaultValue: '' },
                    { name: 'type', label: 'Room Type', type: 'text', defaultValue: 'Standard Queen' },
                    { name: 'floor', label: 'Floor', type: 'text', defaultValue: 'Floor 1' },
                    { name: 'capacity', label: 'Capacity (Sleeps)', type: 'number', defaultValue: 2 },
                    { name: 'rate', label: 'Rate (PKR)', type: 'number', defaultValue: 15000 },
                    { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Cleaning', 'Maintenance'], defaultValue: 'Available' },
                    { name: 'imageUrl', label: 'Image URL (optional)', type: 'text', defaultValue: '' }
                  ], (data) => {
                    const newRoom = { id: 'r' + Date.now(), ...data, capacity: Number(data.capacity), rate: Number(data.rate) };
                    setRooms([...rooms, newRoom]);
                    logAction(auth?.email || '', 'Manager', 'Added Room', 'Rooms', newRoom.id, \`Added Room \${data.number}\`);
                  });
                }} className="px-5 py-2 bg-accent text-white rounded-full font-bold text-[13px] hover:bg-[#b59863] flex items-center gap-2 shadow-md transition-all"><Plus className="w-4 h-4" /> Add Room</button>`;
  
  code = code.replace(addRoomRegex, newAddRoom);

  // Edit Room Button (Grid View)
  const gridEdit = /<button className="flex-1 flex justify-center items-center gap-1.5 text-\[11px\] font-bold text-stone hover:text-primary transition-colors py-1">\s*<Edit2 className="w-3.5 h-3.5" \/> Edit\s*<\/button>/g;
  const newGridEdit = `<button onClick={() => {
                          showPrompt('Edit Room', [
                            { name: 'number', label: 'Room Number', type: 'text', defaultValue: room.number },
                            { name: 'type', label: 'Room Type', type: 'text', defaultValue: room.type },
                            { name: 'floor', label: 'Floor', type: 'text', defaultValue: room.floor || 'Floor 1' },
                            { name: 'capacity', label: 'Capacity (Sleeps)', type: 'number', defaultValue: room.capacity || 2 },
                            { name: 'rate', label: 'Rate (PKR)', type: 'number', defaultValue: room.rate },
                            { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Cleaning', 'Maintenance'], defaultValue: room.status },
                            { name: 'imageUrl', label: 'Image URL', type: 'text', defaultValue: room.imageUrl || '' }
                          ], (data) => {
                            setRooms(rooms.map(r => r.id === room.id ? { ...r, ...data, capacity: Number(data.capacity), rate: Number(data.rate) } : r));
                            logAction(auth?.email || '', 'Manager', 'Edited Room', 'Rooms', room.id, \`Updated Room \${data.number}\`);
                          });
                        }} className="flex-1 flex justify-center items-center gap-1.5 text-[11px] font-bold text-stone hover:text-primary transition-colors py-1">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>`;
  code = code.replace(gridEdit, newGridEdit);

  // Status Cycle Button (Grid View)
  const gridStatus = /<button className="flex-1 flex justify-center items-center gap-1.5 text-\[11px\] font-bold text-blue-500 hover:text-blue-700 transition-colors py-1">\s*<RefreshCw className="w-3.5 h-3.5" \/> Status\s*<\/button>/g;
  const newGridStatus = `<button onClick={() => {
                          const nextStatus: Record<string, any> = { 'Available': 'Occupied', 'Occupied': 'Cleaning', 'Cleaning': 'Maintenance', 'Maintenance': 'Available' };
                          const newStatus = nextStatus[room.status] || 'Available';
                          setRooms(rooms.map(r => r.id === room.id ? { ...r, status: newStatus } : r));
                          logAction(auth?.email || '', 'Manager', 'Changed Room Status', 'Rooms', room.id, \`Room \${room.number} changed to \${newStatus}\`);
                        }} className="flex-1 flex justify-center items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-700 transition-colors py-1">
                          <RefreshCw className="w-3.5 h-3.5" /> Status
                        </button>`;
  code = code.replace(gridStatus, newGridStatus);

  // Delete Room Button (Grid View)
  const gridDelete = /<button className="pl-3 py-1 flex items-center justify-center group\/btn">\s*<div className="p-1.5 bg-red-50 text-error rounded-md group-hover\/btn:bg-red-100 group-hover\/btn:text-red-700 transition-colors"><Trash2 className="w-3.5 h-3.5" \/><\/div>\s*<\/button>/g;
  const newGridDelete = `<button onClick={() => {
                          setConfirmConfig({
                            isOpen: true,
                            title: 'Delete Room',
                            message: \`Are you sure you want to delete Room \${room.number}?\`,
                            onConfirm: () => {
                              setRooms(rooms.filter(r => r.id !== room.id));
                              logAction(auth?.email || '', 'Manager', 'Deleted Room', 'Rooms', room.id, \`Deleted Room \${room.number}\`);
                            }
                          });
                        }} className="pl-3 py-1 flex items-center justify-center group/btn">
                          <div className="p-1.5 bg-red-50 text-error rounded-md group-hover/btn:bg-red-100 group-hover/btn:text-red-700 transition-colors"><Trash2 className="w-3.5 h-3.5" /></div>
                        </button>`;
  code = code.replace(gridDelete, newGridDelete);

  // --- LIST VIEW ---

  // Edit Room Button (List View)
  const listEdit = /<button className="text-stone hover:text-primary" title="Edit"><Edit2 className="w-4 h-4" \/><\/button>/g;
  const newListEdit = `<button onClick={() => {
                           showPrompt('Edit Room', [
                             { name: 'number', label: 'Room Number', type: 'text', defaultValue: room.number },
                             { name: 'type', label: 'Room Type', type: 'text', defaultValue: room.type },
                             { name: 'floor', label: 'Floor', type: 'text', defaultValue: room.floor || 'Floor 1' },
                             { name: 'capacity', label: 'Capacity (Sleeps)', type: 'number', defaultValue: room.capacity || 2 },
                             { name: 'rate', label: 'Rate (PKR)', type: 'number', defaultValue: room.rate },
                             { name: 'status', label: 'Status', type: 'select', options: ['Available', 'Occupied', 'Cleaning', 'Maintenance'], defaultValue: room.status },
                             { name: 'imageUrl', label: 'Image URL', type: 'text', defaultValue: room.imageUrl || '' }
                           ], (data) => {
                             setRooms(rooms.map(r => r.id === room.id ? { ...r, ...data, capacity: Number(data.capacity), rate: Number(data.rate) } : r));
                             logAction(auth?.email || '', 'Manager', 'Edited Room', 'Rooms', room.id, \`Updated Room \${data.number}\`);
                           });
                         }} className="text-stone hover:text-primary" title="Edit"><Edit2 className="w-4 h-4" /></button>`;
  code = code.replace(listEdit, newListEdit);

  // Status Cycle Button (List View)
  const listStatus = /<button className="text-blue-500 hover:text-blue-700" title="Cycle Status"><RefreshCw className="w-4 h-4" \/><\/button>/g;
  const newListStatus = `<button onClick={() => {
                           const nextStatus: Record<string, any> = { 'Available': 'Occupied', 'Occupied': 'Cleaning', 'Cleaning': 'Maintenance', 'Maintenance': 'Available' };
                           const newStatus = nextStatus[room.status] || 'Available';
                           setRooms(rooms.map(r => r.id === room.id ? { ...r, status: newStatus } : r));
                           logAction(auth?.email || '', 'Manager', 'Changed Room Status', 'Rooms', room.id, \`Room \${room.number} changed to \${newStatus}\`);
                         }} className="text-blue-500 hover:text-blue-700" title="Cycle Status"><RefreshCw className="w-4 h-4" /></button>`;
  code = code.replace(listStatus, newListStatus);

  // Delete Room Button (List View)
  const listDelete = /<button className="text-error hover:text-red-700" title="Delete"><Trash2 className="w-4 h-4" \/><\/button>/g;
  const newListDelete = `<button onClick={() => {
                           setConfirmConfig({
                             isOpen: true,
                             title: 'Delete Room',
                             message: \`Are you sure you want to delete Room \${room.number}?\`,
                             onConfirm: () => {
                               setRooms(rooms.filter(r => r.id !== room.id));
                               logAction(auth?.email || '', 'Manager', 'Deleted Room', 'Rooms', room.id, \`Deleted Room \${room.number}\`);
                             }
                           });
                         }} className="text-error hover:text-red-700" title="Delete"><Trash2 className="w-4 h-4" /></button>`;
  code = code.replace(listDelete, newListDelete);

  fs.writeFileSync(filename, code);
  console.log('Wired room buttons in ' + filename);
}

wireRooms('src/hms/ManagerView.tsx');
