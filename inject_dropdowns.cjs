const fs = require('fs');

function injectDropdown(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  if (!code.includes('showFromDropdown')) {
    code = code.replace(
      'const [showPeopleDropdown, setShowPeopleDropdown] = useState(false)',
      'const [showPeopleDropdown, setShowPeopleDropdown] = useState(false)\n  const [showFromDropdown, setShowFromDropdown] = useState(false)\n  const [showToDropdown, setShowToDropdown] = useState(false)'
    );
  }

  code = code.replace(/<datalist id="cities-list">[\s\S]*?<\/datalist>/g, '');

  const getDropdownJSX = (field, setter) => `
              {${field} && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-72 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Trending destinations</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { city: "Islamabad", country: "Pakistan" },
                      { city: "Lahore", country: "Pakistan" },
                      { city: "Peshawar", country: "Pakistan" },
                      { city: "Swat", country: "Pakistan" },
                      { city: "Kalam", country: "Pakistan" },
                      { city: "Nathiagali", country: "Pakistan" }
                    ].map((dest, idx) => (
                      <div
                        key={dest.city}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          ${setter}(dest.city);
                          if ('${field}' === 'showFromDropdown') setShowFromDropdown(false);
                          else setShowToDropdown(false);
                        }}
                        className={\`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors \${idx !== 5 ? 'border-b border-gray-50' : ''}\`}
                      >
                        <div className="text-gray-400">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">{dest.city}</span>
                          <span className="text-xs text-gray-500">{dest.country}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}`;

  // Modify From Input
  // We need to add onFocus, onBlur and the dropdownJSX inside the wrapper.
  // The wrapper is <div className="flex-1 w-full p-2 rounded-xl" ... >
  // Let's replace the <input ... /> for From
  
  const fromInputMatch = /<input\s+type="text"\s+list="cities-list"\s+placeholder="e\.g\. Peshawar"\s+value=\{fromLocation\}\s+onChange=\{\(e\) => setFromLocation\(e\.target\.value\)\}\s+className="w-full text-sm outline-none bg-transparent"\s+style=\{\{ color: "var\(--color-ink\)" \}\}\s*\/>/;
  
  if (fromInputMatch.test(code)) {
    code = code.replace(fromInputMatch, `<input
                  type="text"
                  placeholder="e.g. Peshawar"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  onFocus={() => setShowFromDropdown(true)}
                  onBlur={() => setShowFromDropdown(false)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />` + getDropdownJSX('showFromDropdown', 'setFromLocation'));
  }

  const toInputMatch = /<input\s+type="text"\s+list="cities-list"\s+placeholder="e\.g\. Kalam"\s+value=\{toLocation\}\s+onChange=\{\(e\) => setToLocation\(e\.target\.value\)\}\s+className="w-full text-sm outline-none bg-transparent"\s+style=\{\{ color: "var\(--color-ink\)" \}\}\s*\/>/;
  
  if (toInputMatch.test(code)) {
    code = code.replace(toInputMatch, `<input
                  type="text"
                  placeholder="e.g. Kalam"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  onFocus={() => setShowToDropdown(true)}
                  onBlur={() => setShowToDropdown(false)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />` + getDropdownJSX('showToDropdown', 'setToLocation'));
  }

  // Also make sure the wrappers have 'relative' so the absolute dropdown positions correctly.
  // We will add 'relative' to the From and To wrappers.
  // In the HTML: <div className="flex-1 w-full p-2 rounded-xl"
  code = code.replace(/className="flex-1 w-full p-2 rounded-xl"/g, 'className="flex-1 w-full p-2 rounded-xl relative"');

  fs.writeFileSync(filePath, code);
  console.log('Injected dropdowns in ' + filePath);
}

injectDropdown('src/pages/HomePage.tsx');
injectDropdown('src/pages/CustomSearchFlowResults.tsx');
