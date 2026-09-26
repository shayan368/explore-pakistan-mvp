const fs = require('fs');
let code = fs.readFileSync('src/hms/useHMS.ts', 'utf8');

const regex = /const \[auth, setAuth\] = useState<\{ role: Role; email: string \} \| null>\(null\);/;
if (regex.test(code)) {
  code = code.replace(regex, 'const [auth, setAuth] = useState<{ role: Role; email: string } | null>(null);\n  const [isLoaded, setIsLoaded] = useState(false);');
  fs.writeFileSync('src/hms/useHMS.ts', code);
  console.log('Fixed isLoaded definition');
} else {
  console.log('Failed to find auth state');
}
