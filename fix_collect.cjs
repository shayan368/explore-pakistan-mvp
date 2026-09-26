const fs = require('fs');

function fix(file) {
  let code = fs.readFileSync(file, 'utf8');
  const idx = code.indexOf('Collect Payment. Balance is PKR');
  if (idx > -1) {
    const start = code.lastIndexOf('onClick={() => {', idx);
    const end = code.indexOf('className="px-4 py-2 bg-primary-pale', start);
    
    if (start > -1 && end > -1) {
      const replaceStr = `onClick={() => showPrompt('Collect Payment', [{name:'amount',label:'Amount (PKR)',type:'number',defaultValue:balance.toString()},{name:'method',label:'Payment Method',type:'text',defaultValue:'Cash'}], (data) => {
         const amount = parseFloat(data.amount||'0');
         if(amount>0) {
           setPayments([...payments, {id:'pay_'+Date.now(), stayId: stay.id, amount, method: data.method||'Cash', date: today}]);
           showAlert('Payment Collected', 'The payment has been recorded successfully.', 'success');
         }
      })} `;
      code = code.substring(0, start) + replaceStr + code.substring(end);
      fs.writeFileSync(file, code);
      console.log('Fixed ' + file);
    }
  }
}
fix('src/hms/ReceptionistView.tsx');
fix('src/hms/ManagerView.tsx');
