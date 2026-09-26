const fs = require('fs');
const https = require('https');

const file = 'src/pages/SearchResults.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /"(https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+)[^"]*"/g;
let match;
const urls = new Set();
while ((match = regex.exec(content)) !== null) {
  urls.add(match[1]); // Just the base URL
}

const defaultImage = "1517248135467-4c7edcad34c4";

async function run() {
  for (const baseUrl of urls) {
    const is404 = await new Promise(r => {
      https.get(baseUrl, (res) => {
        r(res.statusCode >= 400);
      });
    });

    if (is404) {
      console.log(`Fixing 404: ${baseUrl}`);
      const idToReplace = baseUrl.split('photo-')[1];
      // Replace all instances of this bad ID with the default one
      const replaceRegex = new RegExp(idToReplace, 'g');
      content = content.replace(replaceRegex, defaultImage);
    }
  }
  
  fs.writeFileSync(file, content);
  console.log("Done fixing images");
}
run();
