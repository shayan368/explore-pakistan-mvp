const fs = require('fs');

function makeSidebarTextWhite(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Change unselected tab text from text-primary-pale to text-white
  code = code.replace(
    /text-primary-pale hover:bg-primary-light\/50 hover:text-white/g,
    'text-white hover:bg-primary-light/50 hover:text-white'
  );

  // Make the email text white (with slight opacity for hierarchy)
  code = code.replace(
    /text-accent-light mt-1/g,
    'text-white/80 mt-1'
  );

  fs.writeFileSync(filename, code);
  console.log('Sidebar text made white in ' + filename);
}

makeSidebarTextWhite('src/hms/ReceptionistView.tsx');
makeSidebarTextWhite('src/hms/ManagerView.tsx');
