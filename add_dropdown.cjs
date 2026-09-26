const fs = require('fs');

function addSelectToPrompt(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Update prompt modal to support type 'select'
  const oldPrompt = `                  {f.type === 'textarea' ? (
                    <textarea className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  ) : (
                    <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  )}`;
                  
  const newPrompt = `                  {f.type === 'textarea' ? (
                    <textarea className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  ) : f.type === 'select' ? (
                    <select className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})}>
                      {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  )}`;

  code = code.replace(oldPrompt, newPrompt);

  // Update the showPrompt call for Record Attendance in ReceptionistView
  if (filename.includes('ReceptionistView')) {
    code = code.replace(
      /\{\s*name: 'status',\s*label: 'Status \(Present\/Absent\/Late\)',\s*type: 'text',\s*defaultValue: 'Present'\s*\}/g,
      "{ name: 'status', label: 'Status', type: 'select', defaultValue: 'Present', options: ['Present', 'Absent', 'Late', 'Leave', 'Half Day'] }"
    );
  }

  // Update Add Staff Role in ManagerView
  if (filename.includes('ManagerView')) {
    code = code.replace(
      /\{\s*name: 'role',\s*label: 'Role',\s*type: 'text',\s*defaultValue: ''\s*\}/g,
      "{ name: 'role', label: 'Role', type: 'select', defaultValue: 'Receptionist', options: ['Manager', 'Receptionist', 'Housekeeper', 'Maintenance Worker', 'Restaurant Staff', 'Security', 'HR', 'Other'] }"
    );
  }

  fs.writeFileSync(filename, code);
  console.log('Added select support to prompt in ' + filename);
}

addSelectToPrompt('src/hms/ReceptionistView.tsx');
addSelectToPrompt('src/hms/ManagerView.tsx');
