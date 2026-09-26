const fs = require('fs');

let results = fs.readFileSync('src/pages/CustomSearchFlowResults.tsx', 'utf8');
let searchCard = fs.readFileSync('search_card.jsx', 'utf8');

// The searchCard includes a 'Search' button with onClick={handleSearch}
// We already defined handleSearch in CustomSearchFlowResults.tsx.
// Let's insert searchCard right before <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

let injectionPoint = '<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">';
let newResults = results.replace(injectionPoint, searchCard + '\n\n      ' + injectionPoint);

fs.writeFileSync('src/pages/CustomSearchFlowResults.tsx', newResults);
console.log('Injected');
