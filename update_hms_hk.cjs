const fs = require('fs');

function updateHMS() {
  let code = fs.readFileSync('src/hms/useHMS.ts', 'utf8');

  // 1. Add HousekeepingTask interface
  const hkInterface = `
export interface HousekeepingTask {
  id: string;
  roomId: string;
  task: string;
  priority: 'Normal' | 'High' | 'Urgent';
  assigneeId: string;
  dueDate: string;
  status: 'Dirty' | 'In Progress' | 'Clean';
}`;

  if (!code.includes('export interface HousekeepingTask')) {
    code = code.replace(/export interface Maintenance \{/, hkInterface + '\n\nexport interface Maintenance {');
  }

  // 2. Add State hooks
  if (!code.includes('const [housekeeping, setHousekeeping]')) {
    code = code.replace(
      /const \[maintenance, setMaintenance\] = useState<Maintenance\[\]>\(\[\]\);/,
      `const [maintenance, setMaintenance] = useState<Maintenance[]>([]);\n  const [housekeeping, setHousekeeping] = useState<HousekeepingTask[]>([]);`
    );
  }

  // 3. Seed data
  if (!code.includes('localStorage.setItem("hms_housekeeping"')) {
    const seed = `
        localStorage.setItem("hms_housekeeping", JSON.stringify([
          { id: "hk_1", roomId: "r2", task: "Full turnover clean", priority: "High", assigneeId: "stf_3", dueDate: new Date().toLocaleDateString(), status: "Dirty" },
          { id: "hk_2", roomId: "r4", task: "Evening turndown service", priority: "Normal", assigneeId: "stf_3", dueDate: new Date().toLocaleDateString(), status: "Dirty" }
        ]));`;
    code = code.replace(
      /localStorage\.setItem\("hms_maintenance".*?\);/g,
      match => match + seed
    );
  }

  // 4. Load from localStorage
  if (!code.includes('setHousekeeping(JSON.parse(localStorage.getItem("hms_housekeeping"')) {
    code = code.replace(
      /setMaintenance\(JSON\.parse\(localStorage\.getItem\("hms_maintenance"\) \|\| "\[\]"\)\);/,
      `setMaintenance(JSON.parse(localStorage.getItem("hms_maintenance") || "[]"));\n      setHousekeeping(JSON.parse(localStorage.getItem("hms_housekeeping") || "[]"));`
    );
  }

  // 5. Save to localStorage
  if (!code.includes('localStorage.setItem("hms_housekeeping", JSON.stringify(housekeeping))')) {
    code = code.replace(
      /useEffect\(\(\) => \{ if \(maintenance\.length\) localStorage\.setItem\("hms_maintenance", JSON\.stringify\(maintenance\)\); \}, \[maintenance\]\);/,
      `useEffect(() => { if (maintenance.length) localStorage.setItem("hms_maintenance", JSON.stringify(maintenance)); }, [maintenance]);\n  useEffect(() => { if (housekeeping.length) localStorage.setItem("hms_housekeeping", JSON.stringify(housekeeping)); }, [housekeeping]);`
    );
  }

  // 6. Export from hook
  if (!code.includes('housekeeping, setHousekeeping')) {
    code = code.replace(
      /maintenance, setMaintenance,/,
      `maintenance, setMaintenance, housekeeping, setHousekeeping,`
    );
  }

  fs.writeFileSync('src/hms/useHMS.ts', code);
  console.log('Updated useHMS.ts for Housekeeping');
}

updateHMS();
