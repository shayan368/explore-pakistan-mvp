const fs = require('fs');

function useIcons(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Add the imports
  if (!code.includes('Eye, Edit2, Trash2')) {
    code = code.replace(/import \{\s*/, `import { Eye, Edit2, Trash2, `);
  }

  // Replace text buttons with icons in Guest Directory
  // 1. View Profile
  code = code.replace(
    />View Profile<\/button>/g,
    ` title="View Profile"><Eye className="w-4 h-4" /></button>`
  );
  
  // 2. Edit (The specific edit button for the Guest Directory)
  // Look for the specific edit button code
  code = code.replace(
    /className="text-sm font-bold text-stone hover:text-primary hover:underline">Edit<\/button>/g,
    `className="p-1.5 bg-muted text-stone hover:bg-primary-pale hover:text-primary rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>`
  );

  // 3. Delete
  code = code.replace(
    /className="text-sm font-bold text-error hover:underline">Delete<\/button>/g,
    `className="p-1.5 bg-red-50 text-error hover:bg-red-100 hover:text-red-700 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>`
  );

  fs.writeFileSync(filename, code);
  console.log('Added Lucide icons to ' + filename);
}

useIcons('src/hms/ReceptionistView.tsx');
useIcons('src/hms/ManagerView.tsx');
