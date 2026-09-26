const fs = require('fs');

function addScroll(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Find promptConfig.isOpen
  const modalDiv = /<div className="bg-surface p-8 rounded-2xl max-w-md w-full shadow-2xl border-t-4 border-accent animate-in fade-in zoom-in-95 duration-200">/;
  const newModalDiv = `<div className="bg-surface p-8 rounded-2xl max-w-md w-full shadow-2xl border-t-4 border-accent animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">`;
  
  const fieldsDiv = /<div className="space-y-4 mb-6">/;
  const newFieldsDiv = `<div className="space-y-4 mb-6 overflow-y-auto pr-2">`;
  
  // also let's make sure the action buttons div doesn't get squeezed
  const btnDiv = /<div className="flex justify-end gap-3">/;
  const newBtnDiv = `<div className="flex justify-end gap-3 mt-auto shrink-0 pt-2">`;

  let updated = false;
  if (modalDiv.test(code)) {
    code = code.replace(modalDiv, newModalDiv);
    updated = true;
  }
  if (fieldsDiv.test(code)) {
    // Only replace the FIRST occurrence AFTER promptConfig.isOpen? Actually, promptConfig fieldsDiv is the only one in showPrompt, but there might be others.
    // Let's do it safely by just finding the index of promptConfig.isOpen
    const promptIdx = code.indexOf('promptConfig.isOpen && (');
    if (promptIdx > -1) {
      const targetStr = '<div className="space-y-4 mb-6">';
      const fieldIdx = code.indexOf(targetStr, promptIdx);
      if (fieldIdx > -1 && fieldIdx < promptIdx + 500) {
        code = code.substring(0, fieldIdx) + newFieldsDiv + code.substring(fieldIdx + targetStr.length);
      }
      
      const btnTarget = '<div className="flex justify-end gap-3">';
      const btnIdx = code.indexOf(btnTarget, promptIdx);
      if (btnIdx > -1) {
        code = code.substring(0, btnIdx) + newBtnDiv + code.substring(btnIdx + btnTarget.length);
      }
    }
  }

  if (updated) {
    fs.writeFileSync(filename, code);
    console.log('Fixed scroll in ' + filename);
  } else {
    console.log('Could not find modal in ' + filename);
  }
}

addScroll('src/hms/ManagerView.tsx');
addScroll('src/hms/ReceptionistView.tsx');
