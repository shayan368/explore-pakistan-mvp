<section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-20 mb-10">
        <div
          className="rounded-2xl p-4 shadow-2xl w-full mx-auto"
          style={{
            backgroundColor: "rgba(255,255,255,0.97)",
          }}
        >
          <div className="flex flex-col xl:flex-row items-center gap-3 w-full relative">
            {/* From Input */}
            <div
              className="flex-1 w-full p-2 rounded-xl"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                From
              </label>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  list="cities-list"
                  placeholder="e.g. Peshawar"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
            </div>

            {/* To Input */}
            <div
              className="flex-1 w-full p-2 rounded-xl"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <label
                className="block text-xs font-semibold mb-1"
                style={{ color: "var(--color-muted-text)" }}
              >
                To
              </label>
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <input
                  type="text"
                  list="cities-list"
                  placeholder="e.g. Kalam"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
            </div>

            <datalist id="cities-list">
              <option value="Peshawar" />
              <option value="Kalam" />
              <option value="Swat" />
              <option value="Chitral" />
              <option value="Malam Jabba" />
              <option value="Nathiagali" />
            </datalist>

            {/* Dates Input */}
            <div
              className="flex-[1.5] w-full p-2 rounded-xl flex gap-2 items-center"
              style={{ border: "1px solid var(--color-border)" }}
            >
              <div className="flex-1">
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  From Date
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
              <div className="w-px h-8 bg-gray-300 mx-1"></div>
              <div className="flex-1">
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-sm outline-none bg-transparent"
                  style={{ color: "var(--color-ink)" }}
                />
              </div>
            </div>

            {/* People Input Dropdown */}
            <div className="flex-1 w-full relative">
              <div
                className="p-2 rounded-xl cursor-pointer h-full"
                style={{
                  border: "1px solid var(--color-border)",
                  minHeight: "58px",
                }}
                onClick={() => setShowPeopleDropdown(!showPeopleDropdown)}
              >
                <label
                  className="block text-xs font-semibold mb-1"
                  style={{ color: "var(--color-muted-text)" }}
                >
                  Travelers
                </label>
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: "var(--color-ink)" }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{ color: "var(--color-muted-text)" }}
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {adults + children} People
                </div>
              </div>

              {showPeopleDropdown && (
                <div className="absolute top-full mt-2 left-0 w-full sm:w-64 bg-white rounded-xl shadow-xl p-4 z-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Adults
                      </p>
                      <p className="text-xs text-gray-500">Ages 13 or above</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {adults}
                      </span>
                      <button
                        onClick={() => setAdults(adults + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Children
                      </p>
                      <p className="text-xs text-gray-500">Ages 0-12</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-sm font-medium">
                        {children}
                      </span>
                      <button
                        onClick={() => setChildren(children + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="w-full xl:w-auto h-[58px] px-8 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2 flex-shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Search
            </button>
          </div>
          {error && (
            <div className="mt-3 text-sm text-red-600 px-2 font-medium">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      