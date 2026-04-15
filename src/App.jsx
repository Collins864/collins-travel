import { useEffect, useMemo, useState } from "react";
import { formatCurrency, getDefaultDate, normalizeCity } from "./lib/utils";
import { BookingPanel } from "./components/BookingPanel";
import { HeroSearch } from "./components/HeroSearch";
import { ResultList } from "./components/ResultList";
import { routeCatalog } from "../shared/routes";

const initialSearch = {
  mode: "all",
  fromCity: "New York",
  toCity: "Boston",
  travelDate: getDefaultDate(),
  passengers: 1
};

export default function App() {
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [checkoutState, setCheckoutState] = useState({
    status: "idle",
    message: "",
    paymentMode: "mock",
    clientSecret: ""
  });

  useEffect(() => {
    setRoutes(routeCatalog);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const filteredRoutes = useMemo(
    () =>
      routes.filter((route) => {
        const matchesMode = search.mode === "all" || route.type === search.mode;
        const matchesFrom = !search.fromCity || route.from.toLowerCase().includes(normalizeCity(search.fromCity));
        const matchesTo = !search.toCity || route.to.toLowerCase().includes(normalizeCity(search.toCity));
        return matchesMode && matchesFrom && matchesTo;
      }),
    [routes, search]
  );

  useEffect(() => {
    const selectionIsVisible = filteredRoutes.some((route) => route.id === selectedRouteId);
    if (!selectionIsVisible) {
      setSelectedRouteId(filteredRoutes[0]?.id ?? null);
      setSelectedSeat("");
    }
  }, [filteredRoutes, selectedRouteId]);

  const selectedRoute = filteredRoutes.find((route) => route.id === selectedRouteId) || null;

  const fareSummary = useMemo(() => {
    const baseFare = selectedRoute ? selectedRoute.price * search.passengers : 0;
    const seatFee = selectedRoute && selectedSeat ? 7 * search.passengers : 0;
    const serviceFee = selectedRoute ? 4 * search.passengers : 0;
    return {
      baseFare,
      seatFee,
      serviceFee,
      total: baseFare + seatFee + serviceFee
    };
  }, [search.passengers, selectedRoute, selectedSeat]);

  function handleSearchSubmit(nextSearch) {
    setSearch(nextSearch);
    setToast("Trip options refreshed.");
  }

  async function handleConfirmBooking(passenger) {
    if (!selectedRoute) {
      setToast("Select a route before continuing.");
      return;
    }

    if (!selectedSeat) {
      setToast("Choose a seat to continue.");
      return;
    }

    const bookingReference = `CT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    setCheckoutState({
      status: "success",
      message: `Booking ${bookingReference} created for ${passenger.fullName}.`,
      paymentMode: "static",
      clientSecret: ""
    });
    setToast("Booking saved in the static demo flow.");
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <HeroSearch
          search={search}
          onSearchChange={setSearch}
          onSearchSubmit={handleSearchSubmit}
        />
      </header>

      <main className="main-grid">
        <section className="results-panel">
          <div className="section-heading">
            <div>
              <p className="card-label">Available Options</p>
              <h2>Recommended routes</h2>
            </div>
            <span className="pill">
              {isLoading ? "Loading..." : `${filteredRoutes.length} route${filteredRoutes.length === 1 ? "" : "s"}`}
            </span>
          </div>

          <ResultList
            isLoading={isLoading}
            routes={filteredRoutes}
            selectedRouteId={selectedRouteId}
            onSelectRoute={(routeId) => {
              setSelectedRouteId(routeId);
              setSelectedSeat("");
            }}
          />
        </section>

        <BookingPanel
          selectedRoute={selectedRoute}
          selectedSeat={selectedSeat}
          onSeatSelect={setSelectedSeat}
          passengers={search.passengers}
          fareSummary={fareSummary}
          onConfirmBooking={handleConfirmBooking}
          checkoutState={checkoutState}
        />
      </main>

      <footer className="site-footer">
        <div>
          <p className="footer-brand">Collins Travel</p>
          <p className="footer-copy">Rail and road journeys with a calmer booking experience.</p>
        </div>
        <div className="footer-note">Built for dependable trip planning, seat selection, and checkout.</div>
      </footer>

      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </div>
  );
}
