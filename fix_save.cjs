const fs = require('fs');

function fixSaveEffects() {
  const filename = 'src/hms/useHMS.ts';
  let code = fs.readFileSync(filename, 'utf8');

  // Fix housekeeping
  const hkRegex = /useEffect\(\(\) => \{ if \(housekeeping\.length\) localStorage\.setItem\("hms_housekeeping", JSON\.stringify\(housekeeping\)\); \}, \[housekeeping\]\);/g;
  if (hkRegex.test(code)) {
    code = code.replace(hkRegex, 'useEffect(() => { localStorage.setItem("hms_housekeeping", JSON.stringify(housekeeping)); }, [housekeeping]);');
  }

  // Fix maintenance
  const maintRegex = /useEffect\(\(\) => \{ if \(maintenance\.length\) localStorage\.setItem\("hms_maintenance", JSON\.stringify\(maintenance\)\); \}, \[maintenance\]\);/g;
  if (maintRegex.test(code)) {
    code = code.replace(maintRegex, 'useEffect(() => { localStorage.setItem("hms_maintenance", JSON.stringify(maintenance)); }, [maintenance]);');
  }

  // I will also fix others if they have the same problem
  const otherRegex = /useEffect\(\(\) => \{ if \(([a-zA-Z]+)\.length\) localStorage\.setItem\("([a-zA-Z_]+)", JSON\.stringify\(\1\)\); \}, \[\1\]\);/g;
  code = code.replace(otherRegex, 'useEffect(() => { localStorage.setItem("$2", JSON.stringify($1)); }, [$1]);');

  fs.writeFileSync(filename, code);
  console.log('Fixed localStorage saving in ' + filename);
}

fixSaveEffects();
