const fs = require('fs');

function fixPrompt(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Let's replace the entire f.type condition block inside showPrompt
  const regex = /\{f\.type === 'textarea' \? \([\s\S]*?onChange=\{e => setPromptData\(\{\.\.\.promptData, \[f\.name\]: e\.target\.value\}\)\} \/>\s*\)\s*\}/m;
  
  const correctBlock = `{f.type === 'textarea' ? (
                    <textarea className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  ) : f.type === 'select' ? (
                    <select className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})}>
                      {f.options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : f.type === 'file' ? (
                    <div className="border border-border rounded-lg p-2 focus-within:ring-2 focus-within:ring-primary flex flex-col gap-2">
                      {promptData[f.name] && <img src={promptData[f.name]} alt="Preview" className="h-24 w-auto object-cover rounded-md border border-border" />}
                      <input type="file" accept="image/*" className="w-full text-sm text-stone file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 cursor-pointer" onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const MAX_WIDTH = 600;
                              let width = img.width;
                              let height = img.height;
                              if (width > MAX_WIDTH) {
                                height = Math.round((height * MAX_WIDTH) / width);
                                width = MAX_WIDTH;
                              }
                              canvas.width = width;
                              canvas.height = height;
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, width, height);
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                              setPromptData(prev => ({...prev, [f.name]: dataUrl}));
                            };
                            img.src = event.target?.result as string;
                          };
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  ) : (
                    <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name] || ''} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />
                  )}`;

  // Find the exact block. In ManagerView, we just replaced a part of it so we might have some corrupted `) : () : f.type` stuff.
  // Actually, I'll just look for `{f.type === 'textarea'` until `onChange=... />\n                  )}`
  
  const blockStart = code.indexOf("{f.type === 'textarea'");
  const searchStr = '                  )}';
  const blockEnd = code.indexOf(searchStr, blockStart) + searchStr.length;
  
  if (blockStart > -1 && blockEnd > -1) {
    code = code.substring(0, blockStart) + correctBlock + code.substring(blockEnd);
    fs.writeFileSync(filename, code);
    console.log('Fixed ' + filename);
  } else {
    console.log('Could not find block in ' + filename);
  }
}

fixPrompt('src/hms/ManagerView.tsx');
fixPrompt('src/hms/ReceptionistView.tsx');
