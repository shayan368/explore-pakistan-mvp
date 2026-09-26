const fs = require('fs');

function makeSidebarGreen(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Change sidebar container background
  code = code.replace(
    /<div className=\{"w-64 bg-white border-r border-border flex flex-col z-10 h-screen sticky top-0 print:hidden " \+ \(printingStayId \? 'hidden' : ''\)\}>/g,
    '<div className={"w-64 bg-primary text-white border-r border-primary-light flex flex-col z-10 h-screen sticky top-0 print:hidden " + (printingStayId ? \'hidden\' : \'\')}>'
  );

  if (filename.includes('ReceptionistView')) {
    // Header
    code = code.replace(
      /<div className="p-6 border-b border-border bg-emerald-50\/50">/g,
      '<div className="p-6 border-b border-primary-light bg-primary-light/30">'
    );
    code = code.replace(
      /<h2 className="text-xl font-display font-bold text-emerald-900 flex items-center gap-2">/g,
      '<h2 className="text-xl font-display font-bold text-white flex items-center gap-2">'
    );
    code = code.replace(
      /<p className="text-xs text-primary mt-1">\{auth\?\.email\}<\/p>/g,
      '<p className="text-xs text-accent-light mt-1">{auth?.email}</p>'
    );
    
    // Links
    code = code.replace(
      /bg-emerald-50 text-primary/g,
      'bg-accent text-primary shadow-md'
    );
    code = code.replace(
      /text-muted-text hover:bg-muted/g,
      'text-primary-pale hover:bg-primary-light/50 hover:text-white'
    );
    
    // Logout button
    code = code.replace(
      /<button onClick=\{handleLogout\} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted text-stone hover:bg-border rounded-xl text-sm font-bold">/g,
      '<button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-light text-primary-pale hover:bg-accent hover:text-primary rounded-xl text-sm font-bold shadow-md">'
    );
    code = code.replace(
      /<div className="p-4 border-t border-border">/g,
      '<div className="p-4 border-t border-primary-light">'
    );
  }

  if (filename.includes('ManagerView')) {
    // Header
    code = code.replace(
      /<div className="p-6 border-b border-border bg-primary-pale">/g,
      '<div className="p-6 border-b border-primary-light bg-primary-light/30">'
    );
    code = code.replace(
      /<h2 className="text-xl font-display font-bold text-primary flex items-center gap-2">/g,
      '<h2 className="text-xl font-display font-bold text-white flex items-center gap-2">'
    );
    code = code.replace(
      /<p className="text-xs text-primary mt-1">\{auth\?\.email\}<\/p>/g,
      '<p className="text-xs text-accent-light mt-1">{auth?.email}</p>'
    );
    
    // Links
    code = code.replace(
      /bg-primary-pale text-primary/g,
      'bg-accent text-primary shadow-md'
    );
    code = code.replace(
      /text-muted-text hover:bg-muted/g,
      'text-primary-pale hover:bg-primary-light/50 hover:text-white'
    );
    
    // Alerts badge
    code = code.replace(
      /<span className="px-2 py-0\.5 bg-red-100 text-red-600 rounded-full text-xs font-bold">/g,
      '<span className="px-2 py-0.5 bg-error text-white rounded-full text-xs font-bold shadow-sm">'
    );
    
    // Logout button
    code = code.replace(
      /<button onClick=\{handleLogout\} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted text-stone hover:bg-border rounded-xl text-sm font-bold">/g,
      '<button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-light text-primary-pale hover:bg-accent hover:text-primary rounded-xl text-sm font-bold shadow-md">'
    );
    code = code.replace(
      /<div className="p-4 border-t border-border">/g,
      '<div className="p-4 border-t border-primary-light">'
    );
  }

  fs.writeFileSync(filename, code);
  console.log('Sidebar made green in ' + filename);
}

makeSidebarGreen('src/hms/ReceptionistView.tsx');
makeSidebarGreen('src/hms/ManagerView.tsx');
