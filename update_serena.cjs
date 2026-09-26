const fs = require('fs');

function updateSerena(filename) {
  let code = fs.readFileSync(filename, 'utf8');

  const oldState = `  const [hotelProfile, setHotelProfile] = useState({
    name: 'Aurelia Grand Hotel & Spa',
    tagline: 'Where every stay becomes a story',
    address: '12 Marina Promenade, Singapore 018956',
    phone: '+65 6789 1234',
    email: 'stay@aurelia.com',
    website: 'www.aureliagrand.com',
    currency: '$',
    checkIn: '3:00 PM',
    checkOut: '12:00 PM',
    tax: '10'
  });`;

  const newState = `  const [hotelProfile, setHotelProfile] = useState({
    name: 'Serena Hotel Peshawar',
    tagline: 'Experience luxury in the historic heart of Peshawar',
    address: 'Khyber Road, Peshawar, Khyber Pakhtunkhwa, Pakistan',
    phone: '+92 91 111 133 133',
    email: 'reservations.psh@serenahotels.com',
    website: 'www.serenahotels.com',
    currency: 'PKR',
    checkIn: '2:00 PM',
    checkOut: '12:00 PM',
    tax: '15'
  });`;

  code = code.replace(oldState, newState);

  fs.writeFileSync(filename, code);
  console.log('Updated Hotel Profile defaults to Serena Hotel Peshawar in ' + filename);
}

updateSerena('src/hms/ManagerView.tsx');
