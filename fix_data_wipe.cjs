const fs = require('fs');
let code = fs.readFileSync('src/hms/useHMS.ts', 'utf8');

// 1. Add isLoaded state
if (!code.includes('const [isLoaded, setIsLoaded] = useState(false);')) {
  code = code.replace(/const \[auth, setAuth\] = useState<AuthData \| null>\(null\);/, 'const [auth, setAuth] = useState<AuthData | null>(null);\n  const [isLoaded, setIsLoaded] = useState(false);');
}

// 2. Set isLoaded to true in loadData
if (!code.includes('setIsLoaded(true);')) {
  code = code.replace(/setAuditLog\(JSON\.parse\(localStorage\.getItem\("hms_audit_log"\) \|\| "\[\]"\)\);\s*\};/, 'setAuditLog(JSON.parse(localStorage.getItem("hms_audit_log") || "[]"));\n      setIsLoaded(true);\n    };');
}

// 3. Fix all the save useEffects
const saveEffectRegex = /useEffect\(\(\) => \{ localStorage\.setItem\("([a-zA-Z_]+)", JSON\.stringify\(([a-zA-Z]+)\)\); \}, \[\2\]\);/g;
code = code.replace(saveEffectRegex, 'useEffect(() => { if (isLoaded) localStorage.setItem("$1", JSON.stringify($2)); }, [$2, isLoaded]);');

fs.writeFileSync('src/hms/useHMS.ts', code);
console.log('Fixed data wiping bug in useHMS.ts');
