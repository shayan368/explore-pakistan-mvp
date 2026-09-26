const fs = require('fs');

function removePending(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Remove the approval status tag
  code = code.replace(/\{\` \[\$\{\s*todayAtt\.approvalStatus\s*\}\]\`\}/g, '');
  
  // Clean up any empty space that might be left by it
  code = code.replace(/\{\`\s*\[\$\{\s*todayAtt\.approvalStatus\s*\}\]\s*\`\}/g, '');

  fs.writeFileSync(filename, code);
  console.log('Removed pending status from ' + filename);
}

removePending('src/hms/ReceptionistView.tsx');
