const fs = require('fs');

function makeVIPModals(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Enhance the overlay to be glassmorphic VIP
  code = code.replace(
    /bg-ink\/50 flex items-center justify-center/g,
    'bg-ink/70 backdrop-blur-md flex items-center justify-center'
  );

  // Enhance the modal box
  code = code.replace(
    /bg-surface p-6 rounded-2xl max-w-sm w-full shadow-2xl/g,
    'bg-surface p-8 rounded-2xl max-w-sm w-full shadow-2xl border-t-4 border-accent'
  );
  code = code.replace(
    /bg-surface p-6 rounded-2xl max-w-md w-full shadow-2xl/g,
    'bg-surface p-8 rounded-2xl max-w-md w-full shadow-2xl border-t-4 border-accent'
  );

  // Add VIP styling to the titles
  code = code.replace(
    /text-xl font-display font-bold mb-2/g,
    'text-2xl font-display font-bold mb-3'
  );
  code = code.replace(
    /text-xl font-display font-bold mb-4/g,
    'text-2xl font-display font-bold mb-5'
  );

  // Button enhancements
  code = code.replace(
    /px-5 py-2 bg-primary text-surface font-bold rounded-lg hover:bg-primary-light/g,
    'w-full py-3 bg-primary text-accent-light font-bold tracking-wide rounded-xl hover:bg-primary-light shadow-md'
  );
  
  code = code.replace(
    /px-4 py-2 bg-muted text-stone font-bold rounded-lg hover:bg-border/g,
    'px-5 py-2.5 bg-canvas border border-border text-stone font-bold rounded-xl hover:bg-muted'
  );
  
  code = code.replace(
    /px-4 py-2 bg-primary text-surface font-bold rounded-lg hover:bg-primary-light/g,
    'px-5 py-2.5 bg-primary text-accent-light font-bold rounded-xl hover:bg-primary-light shadow-md'
  );

  fs.writeFileSync(filename, code);
  console.log('Upgraded modals to VIP in ' + filename);
}

makeVIPModals('src/hms/ReceptionistView.tsx');
makeVIPModals('src/hms/ManagerView.tsx');
