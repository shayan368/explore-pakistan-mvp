const fs = require('fs');

function migrateRooms() {
  let mgr = fs.readFileSync('src/hms/ManagerView.tsx', 'utf8');
  let rec = fs.readFileSync('src/hms/ReceptionistView.tsx', 'utf8');

  // Add missing imports to Rec View
  const missingImports = ['Building', 'List', 'Grid', 'RefreshCw'];
  missingImports.forEach(imp => {
    if (!rec.includes(imp + ',')) {
      rec = rec.replace(/from "lucide-react";/, `, ${imp} } from "lucide-react";`);
    }
  });

  // Add missing state variables to Rec View
  const stateVars = `
  const [roomFilter, setRoomFilter] = useState('All');
  const [roomViewMode, setRoomViewMode] = useState<'grid'|'list'>('grid');
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'Available').length;
  const occupiedRooms = rooms.filter(r => r.status === 'Occupied').length;
  const cleaningMaintRooms = rooms.filter(r => r.status === 'Cleaning' || r.status === 'Maintenance').length;
  `;
  if (!rec.includes('roomFilter')) {
    rec = rec.replace(/const \[activeTab, setActiveTab\] = useState\("dashboard"\);/, 'const [activeTab, setActiveTab] = useState("dashboard");' + stateVars);
  }

  // Find the exact block in ManagerView
  const startTag = '{/* ROOMS */}';
  const endTag = '{/* GUESTS */}';
  const startIdx = mgr.indexOf(startTag);
  const endIdx = mgr.indexOf(endTag);

  if (startIdx > -1 && endIdx > -1) {
    let roomsBlock = mgr.substring(startIdx, endIdx);
    
    // Rename tab checker for Rec View
    roomsBlock = roomsBlock.replace('activeTab === "rooms"', 'activeTab === "room-board"');
    
    // In Rec View, what is before and after?
    // start is {/* ROOM BOARDBOARD */}
    const recStartTag = '{/* ROOM BOARDBOARD */}';
    // Let's find the next block by finding the next {/*
    const recStartIdx = rec.indexOf(recStartTag);
    if (recStartIdx > -1) {
      // Find the next '{/*' AFTER the start tag
      const recNextTagIdx = rec.indexOf('{/*', recStartIdx + recStartTag.length);
      
      if (recNextTagIdx > -1) {
        const before = rec.substring(0, recStartIdx);
        const after = rec.substring(recNextTagIdx);
        
        // Construct the new file
        rec = before + roomsBlock + after;
        
        fs.writeFileSync('src/hms/ReceptionistView.tsx', rec);
        console.log('Migrated Room Board to Receptionist View successfully!');
      } else {
        console.log('Could not find next block in Rec View');
      }
    } else {
      console.log('Could not find room board in Rec View');
    }
  } else {
    console.log('Could not extract from Mgr View');
  }
}

migrateRooms();
