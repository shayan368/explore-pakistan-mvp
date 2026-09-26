const fs = require('fs');

function addFileSupport(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // 1. Add file input handling in showPrompt modal
  const textInputBlock = `                    <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name]} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />`;
  
  const fileInputBlock = `                  ) : f.type === 'file' ? (
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
                      <input type={f.type} className="w-full border border-border rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none" value={promptData[f.name] || ''} onChange={e => setPromptData({...promptData, [f.name]: e.target.value})} />`;

  // We need to inject this into the modal render block
  if (!code.includes("f.type === 'file'")) {
    code = code.replace(textInputBlock, fileInputBlock);
  }

  // 2. Change 'imageUrl' fields in 'Add Room' and 'Edit Room' prompts
  const imgUrlFieldAdd = `{ name: 'imageUrl', label: 'Image URL (optional)', type: 'text', defaultValue: '' }`;
  const imgUrlFieldAddRep = `{ name: 'imageUrl', label: 'Room Image (Upload)', type: 'file', defaultValue: '' }`;
  code = code.replace(imgUrlFieldAdd, imgUrlFieldAddRep);

  const imgUrlFieldEdit = `{ name: 'imageUrl', label: 'Image URL', type: 'text', defaultValue: room.imageUrl || '' }`;
  const imgUrlFieldEditRep = `{ name: 'imageUrl', label: 'Room Image (Upload)', type: 'file', defaultValue: room.imageUrl || '' }`;
  // There are grid and list versions of this button, so replace globally
  code = code.replace(new RegExp(imgUrlFieldEdit.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), imgUrlFieldEditRep);

  fs.writeFileSync(filename, code);
  console.log('Updated ' + filename);
}

addFileSupport('src/hms/ManagerView.tsx');
addFileSupport('src/hms/ReceptionistView.tsx');
