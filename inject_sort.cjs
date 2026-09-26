const fs = require('fs');

let code = fs.readFileSync('src/pages/SearchResults.tsx', 'utf8');

// 1. Add state
if (!code.includes('showSortDropdown')) {
  code = code.replace(
    'const [searchQuery, setSearchQuery] = useState("")',
    'const [searchQuery, setSearchQuery] = useState("")\n  const [showSortDropdown, setShowSortDropdown] = useState(false)'
  );
}

// 2. Replace the select dropdown
const selectRegex = /<select[\s\S]*?<\/select>/;
const customSort = `
                    <div className="relative">
                      <div
                        onClick={() => setShowSortDropdown(!showSortDropdown)}
                        className="flex items-center justify-between gap-2 text-sm font-semibold rounded-lg px-4 py-2 cursor-pointer transition-colors hover:bg-gray-50 min-w-[200px]"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          border: "1px solid var(--color-border)",
                          color: "var(--color-ink)",
                        }}
                      >
                        <span>{sortBy === 'rating' ? 'Highest Rated' : sortBy === 'price-low' ? 'Price: Low to High' : sortBy === 'price-high' ? 'Price: High to Low' : 'Newest'}</span>
                        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </div>

                      {showSortDropdown && (
                        <div className="absolute top-full mt-2 right-0 w-64 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                            <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">Sort Options</p>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {[
                              { id: 'rating', label: 'Highest Rated', desc: 'Top reviewed hotels' },
                              { id: 'price-low', label: 'Price: Low to High', desc: 'Most affordable first' },
                              { id: 'price-high', label: 'Price: High to Low', desc: 'Luxury and premium first' },
                              { id: 'newest', label: 'Newest', desc: 'Recently added properties' }
                            ].map((opt, idx) => (
                              <div
                                key={opt.id}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setSortBy(opt.id);
                                  setShowSortDropdown(false);
                                }}
                                className={\`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors \${idx !== 3 ? 'border-b border-gray-50' : ''}\`}
                              >
                                <div className={sortBy === opt.id ? "text-emerald-500" : "text-gray-400"}>
                                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m21 16-4 4-4-4"/>
                                    <path d="M17 20V4"/>
                                    <path d="m3 8 4-4 4 4"/>
                                    <path d="M7 4v16"/>
                                  </svg>
                                </div>
                                <div className="flex flex-col">
                                  <span className={\`text-sm font-bold \${sortBy === opt.id ? 'text-emerald-700' : 'text-gray-900'}\`}>{opt.label}</span>
                                  <span className="text-xs text-gray-500">{opt.desc}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
`.trim();

code = code.replace(selectRegex, customSort);

// Let's add onBlur to the div to close it if you click outside. 
// We can use a trick: give the container tabIndex={0} and onBlur.
code = code.replace(
  '<div className="relative">',
  '<div className="relative" tabIndex={0} onBlur={() => setShowSortDropdown(false)}>'
);

fs.writeFileSync('src/pages/SearchResults.tsx', code);
console.log('Sort dropdown injected');
