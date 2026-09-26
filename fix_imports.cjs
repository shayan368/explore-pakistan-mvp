const fs = require('fs');

function fixImports(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Remove the bad inject
  code = code.replace(/import \{ Eye, Edit2, Trash2, /g, 'import { ');

  // Add the icons to the lucide-react import
  if (!code.includes('Eye, Edit2, Trash2')) {
    code = code.replace(
      /from "lucide-react";/,
      `, Eye, Edit2, Trash2 } from "lucide-react";`
    );
    // Cleanup double closing brace if the regex inserted it inside the block
    code = code.replace(/\}\s*, Eye, Edit2, Trash2 \}/g, ', Eye, Edit2, Trash2 }');
  }

  fs.writeFileSync(filename, code);
  console.log('Fixed imports in ' + filename);
}

fixImports('src/hms/ReceptionistView.tsx');
fixImports('src/hms/ManagerView.tsx');
