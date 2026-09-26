const fs = require('fs');

let code = fs.readFileSync('src/hms/useHMS.ts', 'utf8');

const badBlockRegex = /useEffect\(\(\) => \{ if \(maintenance\.length\) localStorage\.setItem\("hms_maintenance", JSON\.stringify\(maintenance\)\);\s*localStorage\.setItem\("hms_housekeeping", JSON\.stringify\(\[\s*\{ id: "hk_1".*?\}\s*\]\)\); \}, \[maintenance\]\);/s;

// We will just replace it with proper useEffects.
const correctBlock = `useEffect(() => { localStorage.setItem("hms_maintenance", JSON.stringify(maintenance)); }, [maintenance]);
  useEffect(() => { localStorage.setItem("hms_housekeeping", JSON.stringify(housekeeping)); }, [housekeeping]);`;

code = code.replace(badBlockRegex, correctBlock);

fs.writeFileSync('src/hms/useHMS.ts', code);
console.log('Fixed rogue seed injection in useEffect');
