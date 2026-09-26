const fs = require('fs');

function wipeStringMatch(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const exactString = \`onClick={() => {
                        const amount = parseFloat(window.prompt(\\\`Collect Payment. Balance is PKR \\\${balance}\\\`, balance.toString()) || "0");
                        if (amount > 0) {
                          setPayments([...payments, { id: "pay_" + Date.now(), stayId: stay.id, amount, method: "Cash", date: today }]);
                        }
                      }}\`;

  const replaceString = \`onClick={() => showPrompt('Collect Payment', [{name:'amount',label:'Amount (PKR)',type:'number',defaultValue:balance.toString()},{name:'method',label:'Payment Method',type:'text',defaultValue:'Cash'}], (data) => {
       const amount = parseFloat(data.amount||'0');
       if(amount>0) {
         setPayments([...payments, {id:'pay_'+Date.now(), stayId: stay.id, amount, method: data.method||'Cash', date: today}]);
         showAlert('Payment Collected', 'The payment has been recorded successfully.', 'success');
       }
    })}\`;

  code = code.replace(exactString, replaceString);

  fs.writeFileSync(filename, code);
  console.log('Fixed collect payment in ' + filename);
}

wipeStringMatch('src/hms/ReceptionistView.tsx');
wipeStringMatch('src/hms/ManagerView.tsx');
