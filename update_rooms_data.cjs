const fs = require('fs');

function updateRoomsData(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  // Update Room interface
  const oldInterface = `export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  rate: number;
}`;
  
  const newInterface = `export interface Room {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  rate: number;
  floor: string;
  capacity: number;
  imageUrl?: string;
}`;

  code = code.replace(oldInterface, newInterface);

  // Update SEED_ROOMS
  const oldSeed = `const SEED_ROOMS: Room[] = [
  { id: "r1", number: "101", type: "Standard Room", status: "Available", rate: 12000 },
  { id: "r2", number: "102", type: "Standard Room", status: "Occupied", rate: 12000 },
  { id: "r3", number: "103", type: "Deluxe Mountain View", status: "Reserved", rate: 25000 },
  { id: "r4", number: "104", type: "Deluxe Mountain View", status: "Dirty", rate: 25000 },
  { id: "r5", number: "105", type: "Family Suite", status: "Cleaning", rate: 35000 },
  { id: "r6", number: "106", type: "Presidential Suite", status: "Maintenance", rate: 80000 },
];`;

  const newSeed = `const SEED_ROOMS: Room[] = [
  { id: "r1", number: "101", type: "Standard Queen", status: "Available", rate: 12000, floor: "Floor 1", capacity: 2, imageUrl: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=600&auto=format&fit=crop" },
  { id: "r2", number: "102", type: "Deluxe King", status: "Available", rate: 18500, floor: "Floor 1", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop" },
  { id: "r3", number: "103", type: "Superior Twin", status: "Occupied", rate: 14500, floor: "Floor 1", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop" },
  { id: "r4", number: "104", type: "Junior Suite", status: "Available", rate: 26500, floor: "Floor 1", capacity: 5, imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=600&auto=format&fit=crop" },
  { id: "r5", number: "201", type: "Executive Suite", status: "Maintenance", rate: 39000, floor: "Floor 2", capacity: 4, imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=600&auto=format&fit=crop" },
  { id: "r6", number: "202", type: "Standard Queen", status: "Available", rate: 12000, floor: "Floor 2", capacity: 2, imageUrl: "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=600&auto=format&fit=crop" },
  { id: "r7", number: "203", type: "Deluxe King", status: "Available", rate: 18500, floor: "Floor 2", capacity: 2, imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=600&auto=format&fit=crop" },
  { id: "r8", number: "204", type: "Superior Twin", status: "Cleaning", rate: 14500, floor: "Floor 2", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1592229505726-ca121723b8ef?q=80&w=600&auto=format&fit=crop" },
  { id: "r9", number: "205", type: "Junior Suite", status: "Occupied", rate: 26500, floor: "Floor 2", capacity: 3, imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=600&auto=format&fit=crop" },
];`;

  code = code.replace(oldSeed, newSeed);

  fs.writeFileSync(filename, code);
  console.log('Updated Rooms data in ' + filename);
}

updateRoomsData('src/hms/useHMS.ts');
