import { countAvailableSeats } from "../lib/utils";

export function ResultList({ isLoading, routes, selectedRouteId, onSelectRoute }) {
  if (isLoading) {
    return <div className="empty-state">Loading route options...</div>;
  }

  if (!routes.length) {
    return (
      <div className="empty-state">
        <h3>No trips match this search.</h3>
        <p>Try another city pair or switch between bus and train filters.</p>
      </div>
    );
  }

  return (
    <div className="route-results">
      {routes.map((route) => {
        const isSelected = route.id === selectedRouteId;

        return (
          <article className={`route-card ${isSelected ? "selected" : ""}`} key={route.id}>
            <div className="route-head">
              <div>
                <span className={`type-badge ${route.type}`}>{route.type}</span>
                <p className="route-route">
                  {route.from} to {route.to}
                </p>
              </div>
              <div>
                <div className="fare">${route.price}</div>
                <div className="route-time">
                  {route.departure} - {route.arrival}
                </div>
              </div>
            </div>
            <div className="route-mid">
              <span>{route.operator}</span>
              <span>{route.duration}</span>
              <span>{route.className}</span>
              <span>{countAvailableSeats(route.seats)} seats left</span>
            </div>
            <button type="button" onClick={() => onSelectRoute(route.id)}>
              {isSelected ? "Selected" : "Choose this trip"}
            </button>
          </article>
        );
      })}
    </div>
  );
}
