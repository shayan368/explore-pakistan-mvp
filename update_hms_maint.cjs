const fs = require('fs');

function updateHMS() {
  let code = fs.readFileSync('src/hms/useHMS.ts', 'utf8');

  // Update interface
  const oldInterface = `export interface Maintenance {
  id: string;
  roomId: string;
  problem: string;
  status: "Open" | "In Progress" | "Resolved";
  date: string;
  assignedStaffId?: string;
}`;
  const newInterface = `export interface Maintenance {
  id: string;
  roomId: string;
  roomNumber: string;
  problem: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  reportedDate: string;
  reportedTime: string;
  reportedBy: string;
  assignedStaffId: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  notes: string;
  resolvedDate?: string;
  closedDate?: string;
}`;
  
  if (code.includes('export interface Maintenance {')) {
    code = code.replace(oldInterface, newInterface);
  }

  // Update seed
  const oldSeed = `[{ id: "m1", roomId: "r6", problem: "AC not working", status: "Open", date: "2026-09-05" }]`;
  const newSeed = `[{ id: "m1", roomId: "r5", roomNumber: "201", problem: "AC not working", description: "The AC unit in room 201 is blowing warm air. Guests complained.", priority: "High", reportedDate: "2026-09-05", reportedTime: "10:30 AM", reportedBy: "shayan@reception.com", assignedStaffId: "", status: "Open", notes: "Called maintenance team" }]`;
  code = code.replace(oldSeed, newSeed);

  fs.writeFileSync('src/hms/useHMS.ts', code);
  console.log('Updated useHMS.ts');
}

updateHMS();
