const fs = require('fs');

const oldArray = `[
                      { city: "Islamabad", country: "Pakistan" },
                      { city: "Lahore", country: "Pakistan" },
                      { city: "Peshawar", country: "Pakistan" },
                      { city: "Swat", country: "Pakistan" },
                      { city: "Kalam", country: "Pakistan" },
                      { city: "Nathiagali", country: "Pakistan" }
                    ]`;

const newArray = `[
                      { city: "Swat", country: "Pakistan" },
                      { city: "Kalam", country: "Pakistan" },
                      { city: "Chitral", country: "Pakistan" },
                      { city: "Peshawar", country: "Pakistan" },
                      { city: "Nathiagali", country: "Pakistan" }
                    ]`;

function updateDropdownOptions(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  // Replace the array
  code = code.split(oldArray).join(newArray);
  
  // Replace the hardcoded idx !== 5 with idx !== 4
  code = code.split("idx !== 5 ? 'border-b border-gray-50'").join("idx !== 4 ? 'border-b border-gray-50'");
  
  fs.writeFileSync(filePath, code);
  console.log('Updated ' + filePath);
}

updateDropdownOptions('src/pages/HomePage.tsx');
updateDropdownOptions('src/pages/CustomSearchFlowResults.tsx');
