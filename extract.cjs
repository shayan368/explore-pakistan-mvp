const fs = require('fs');
const home = fs.readFileSync('src/pages/HomePage.tsx', 'utf8');

const startStr = '<section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 mb-10">';
const startIndex = home.indexOf(startStr);
if (startIndex !== -1) {
  const nextSection = home.indexOf('<section', startIndex + 10);
  let searchCard = home.substring(startIndex, nextSection);
  fs.writeFileSync('search_card.jsx', searchCard);
  console.log('Saved');
} else {
  console.log('Not found');
}
