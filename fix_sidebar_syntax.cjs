const fs = require('fs');

function fixSyntax(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Fix the backslash before the $ in template literals
  code = code.replace(/\\\$\{activeTab/g, '${activeTab');

  // Fix the logout button text color
  code = code.replace(
    /className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-text hover:bg-red-50 hover:text-red-600 transition-colors"/g,
    'className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white bg-primary-light/40 hover:bg-error hover:text-white transition-colors"'
  );

  fs.writeFileSync(filename, code);
  console.log('Fixed syntax and logout in ' + filename);
}

fixSyntax('src/hms/ReceptionistView.tsx');
fixSyntax('src/hms/ManagerView.tsx');
