export function HeroSearch({ search, onSearchChange, onSearchSubmit }) {
  function updateField(field, value) {
    onSearchChange({
      ...search,
      [field]: field === "passengers" ? Number(value) : value
    });
  }

  function submit(event) {
    event.preventDefault();
    onSearchSubmit(search);
  }

  return (
    <>
      <nav className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark-main">C</span>
            <span className="brand-mark-sub">T</span>
          </span>
          <div>
            <p className="brand-name">Collins Travel</p>
            <p className="brand-tag">Confident booking for rail and road journeys</p>
          </div>
        </div>
        <div className="top-links">
          <a href="#search">Search Trips</a>
          <a href="#booking">Complete Booking</a>
        </div>
      </nav>

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Smart intercity booking</p>
          <h1>Buy a bus ticket or train ticket in minutes.</h1>
          <p className="hero-text">
            Collins Travel helps riders compare routes, choose seats, and complete payment in one warm, reliable booking flow.
          </p>
          <div className="hero-stats">
            <div>
              <strong>120+</strong>
              <span>Daily routes</span>
            </div>
            <div>
              <strong>28</strong>
              <span>Connected cities</span>
            </div>
            <div>
              <strong>4.8/5</strong>
              <span>Traveler rating</span>
            </div>
          </div>
          <div className="brand-ribbon">
            <span className="brand-ribbon-label">Collins Select</span>
            Signature rail and coach options curated for smoother intercity travel.
          </div>
        </div>

        <aside className="hero-card" id="search">
          <p className="card-label">Trip Finder</p>
          <h2>Plan your next ride</h2>
          <form className="search-form" onSubmit={submit}>
            <div className="mode-switch" aria-label="Ticket type">
              {["all", "train", "bus"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`mode-btn ${search.mode === mode ? "active" : ""}`}
                  onClick={() => updateField("mode", mode)}
                >
                  {mode === "all" ? "All" : `${mode[0].toUpperCase()}${mode.slice(1)}`}
                </button>
              ))}
            </div>

            <label>
              From
              <input
                type="text"
                value={search.fromCity}
                onChange={(event) => updateField("fromCity", event.target.value)}
                placeholder="New York"
                required
              />
            </label>

            <label>
              To
              <input
                type="text"
                value={search.toCity}
                onChange={(event) => updateField("toCity", event.target.value)}
                placeholder="Boston"
                required
              />
            </label>

            <div className="input-row">
              <label>
                Departure
                <input
                  type="date"
                  value={search.travelDate}
                  onChange={(event) => updateField("travelDate", event.target.value)}
                  required
                />
              </label>
              <label>
                Passengers
                <select
                  value={search.passengers}
                  onChange={(event) => updateField("passengers", event.target.value)}
                >
                  <option value="1">1 passenger</option>
                  <option value="2">2 passengers</option>
                  <option value="3">3 passengers</option>
                  <option value="4">4 passengers</option>
                </select>
              </label>
            </div>

            <button className="primary-btn" type="submit">
              Search available tickets
            </button>
          </form>
        </aside>
      </section>
    </>
  );
}
