const fs = require('fs');

function buildHousekeepingTab(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Find the `{/* HOUSEKEEPING */}` block
  const startTag = '{/* HOUSEKEEPING */}';
  
  const startIdx = code.indexOf(startTag);
  if (startIdx === -1) {
    console.log('Could not find housekeeping block in ' + filename);
    return;
  }
  
  let endIdx = code.indexOf('{/*', startIdx + startTag.length);
  if (endIdx === -1) {
    endIdx = code.indexOf('</div>\n    </div>\n  );');
  }

  if (startIdx > -1 && endIdx > -1) {
    const before = code.substring(0, startIdx);
    const after = code.substring(endIdx);

    const hkBlock = `
        {/* HOUSEKEEPING */}
        {activeTab === "housekeeping" && (
          <div className="max-w-7xl pb-12">
            
            {/* Header Section */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-5 mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-display font-bold text-[#2d2d2d] mb-1">Housekeeping</h1>
                <p className="text-sm text-stone font-medium">
                  {housekeeping.filter(h => h.status !== 'Clean').length} open tasks • {rooms.filter(r => r.status === 'Dirty').length} rooms awaiting clean
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* View Toggles (Visual Only) */}
                <div className="flex bg-[#f3f1ec] rounded-lg p-1 border border-[#e5e1d8]">
                  <button className="px-3 py-1.5 bg-[#fceec9] text-[#b58c3f] rounded shadow-sm"><LayoutDashboard className="w-4 h-4" /></button>
                  <button className="px-3 py-1.5 text-stone hover:text-ink"><LayoutList className="w-4 h-4" /></button>
                </div>
                
                <button onClick={() => {
                  showPrompt('New Housekeeping Task', [
                    { name: 'roomId', label: 'Room', type: 'select', options: rooms.map(r => r.id + ' - Room ' + r.number), defaultValue: rooms[0]?.id + ' - Room ' + rooms[0]?.number },
                    { name: 'task', label: 'Task Description', type: 'text', defaultValue: 'Full turnover clean' },
                    { name: 'priority', label: 'Priority', type: 'select', options: ['Normal', 'High', 'Urgent'], defaultValue: 'Normal' },
                    { name: 'assigneeId', label: 'Assign To', type: 'select', options: ['None', ...staff.filter(s => s.department === 'Housekeeping' || s.role.includes('House')).map(s => s.id + ' - ' + s.name)], defaultValue: 'None' },
                    { name: 'dueDate', label: 'Due Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] }
                  ], (data) => {
                    const rId = data.roomId.split(' - ')[0];
                    const sId = data.assigneeId === 'None' ? '' : data.assigneeId.split(' - ')[0];
                    
                    const newTask = {
                      id: 'hk_' + Date.now(),
                      roomId: rId,
                      task: data.task,
                      priority: data.priority,
                      assigneeId: sId,
                      dueDate: new Date(data.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                      status: 'Dirty'
                    };
                    
                    setHousekeeping([...housekeeping, newTask]);
                    setRooms(rooms.map(r => r.id === rId ? { ...r, status: 'Dirty' } : r));
                    showAlert('Task Created', 'Housekeeping task assigned successfully.', 'success');
                  });
                }} className="px-5 py-2.5 bg-[#b58c3f] text-white rounded-xl font-bold shadow-md hover:bg-[#a07a33] flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Task
                </button>
              </div>
            </div>

            {/* Tasks Table */}
            <div className="bg-white rounded-xl shadow-md border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-[#f8f7f5] border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Room</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Task</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Priority</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Assignee</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Due</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-stone uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {housekeeping.map(hk => {
                      const room = rooms.find(r => r.id === hk.roomId);
                      const assignee = staff.find(s => s.id === hk.assigneeId);
                      
                      // Priority Colors
                      const prioColors = {
                        'Normal': 'bg-[#e0f2fe] text-[#0284c7] border-[#bae6fd]',
                        'High': 'bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]',
                        'Urgent': 'bg-[#fce7f3] text-[#db2777] border-[#fbcfe8]'
                      };
                      
                      // Status Colors
                      const statusColors = {
                        'Dirty': 'bg-[#fce7f3] text-[#db2777] border-[#fbcfe8]',
                        'In Progress': 'bg-[#ffedd5] text-[#ea580c] border-[#fed7aa]',
                        'Clean': 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]'
                      };

                      return (
                        <tr key={hk.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold text-[#2d2d2d]">Room {room?.number}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-stone">{hk.task}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={\`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border \${prioColors[hk.priority]}\`}>
                              {hk.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-stone">{assignee?.name || 'Unassigned'}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-stone">{hk.dueDate}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={\`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border \${statusColors[hk.status]}\`}>
                              {hk.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 flex items-center justify-end gap-3">
                            {hk.status === 'Dirty' && (
                              <button onClick={() => {
                                setHousekeeping(housekeeping.map(h => h.id === hk.id ? { ...h, status: 'In Progress' } : h));
                                setRooms(rooms.map(r => r.id === hk.roomId ? { ...r, status: 'Cleaning' } : r));
                              }} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#b58c3f] hover:bg-[#a07a33] text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                                Start <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {hk.status === 'In Progress' && (
                              <button onClick={() => {
                                setHousekeeping(housekeeping.map(h => h.id === hk.id ? { ...h, status: 'Clean' } : h));
                                setRooms(rooms.map(r => r.id === hk.roomId ? { ...r, status: 'Available' } : r));
                              }} className="flex items-center gap-1.5 px-4 py-1.5 bg-[#b58c3f] hover:bg-[#a07a33] text-white text-xs font-bold rounded-lg shadow-sm transition-colors">
                                Mark Done <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button onClick={() => {
                              showConfirm('Delete Task', 'Are you sure you want to remove this housekeeping task?', () => {
                                setHousekeeping(housekeeping.filter(h => h.id !== hk.id));
                              });
                            }} className="p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors" title="Delete Task">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                    {housekeeping.length === 0 && (
                      <tr><td colSpan={7} className="px-6 py-12 text-center text-stone">No housekeeping tasks found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
`;

    code = before + hkBlock + after;
    
    // Inject LayoutList icon
    if (!code.includes('LayoutList,')) {
      code = code.replace(/\} from "lucide-react";/, `, LayoutList } from "lucide-react";`);
    }

    fs.writeFileSync(filename, code);
    console.log('Successfully injected advanced Housekeeping module into ' + filename);
  }
}

buildHousekeepingTab('src/hms/ManagerView.tsx');
buildHousekeepingTab('src/hms/ReceptionistView.tsx');
