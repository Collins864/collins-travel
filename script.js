const routes = [
  {
    id: "tr-nyc-bos-express",
    type: "train",
    operator: "Northeast Arrow",
    from: "New York",
    to: "Boston",
    departure: "07:20",
    arrival: "11:05",
    duration: "3h 45m",
    price: 86,
    className: "Business",
    seats: createSeats(["A2", "B3", "C4", "D1"])
  },
  {
    id: "bus-nyc-bos-night",
    type: "bus",
    operator: "RoadLine",
    from: "New York",
    to: "Boston",
    departure: "08:10",
    arrival: "12:55",
    duration: "4h 45m",
    price: 49,
    className: "Premium Coach",
    seats: createSeats(["A1", "A4", "C2", "D4"])
  },
  {
    id: "tr-nyc-bos-late",
    type: "train",
    operator: "MetroVista Rail",
    from: "New York",
    to: "Boston",
    departure: "13:35",
    arrival: "17:30",
    duration: "3h 55m",
    price: 72,
    className: "Standard Plus",
    seats: createSeats(["B1", "B2", "C3", "D2"])
  },
  {
    id: "bus-nyc-bos-saver",
    type: "bus",
    operator: "CityHop",
    from: "New York",
    to: "Boston",
    departure: "16:20",
    arrival: "21:25",
    duration: "5h 05m",
    price: 39,
    className: "Saver",
    seats: createSeats(["A3", "B4", "C1", "D3"])
  },
  {
    id: "tr-bos-was-direct",
    type: "train",
    operator: "Atlantic Rail",
    from: "Boston",
    to: "Washington",
    departure: "09:00",
    arrival: "15:40",
    duration: "6h 40m",
    price: 118,
    className: "Business",
    seats: createSeats(["A1", "C2", "D4"])
  },
  {
    id: "bus-phi-nyc-rapid",
    type: "bus",
    operator: "RapidGo",
    from: "Philadelphia",
    to: "New York",
    departure: "10:15",
    arrival: "12:25",
    duration: "2h 10m",
    price: 27,
    className: "Express",
    seats: createSeats(["A2", "C3"])
  }
];

const state = {
  mode: "all",
  passengers: 1,
  filteredRoutes: [],
  selectedRouteId: null,
  selectedSeat: null
};

const routeResults = document.getElementById("routeResults");
const resultCount = document.getElementById("resultCount");
const seatGrid = document.getElementById("seatGrid");
const selectedRouteName = document.getElementById("selectedRouteName");
const selectedType = document.getElementById("selectedType");
const selectedRouteMeta = document.getElementById("selectedRouteMeta");
const selectedSeatLabel = document.getElementById("selectedSeatLabel");
const summaryContent = document.getElementById("summaryContent");
const toast = document.getElementById("toast");
const searchForm = document.getElementById("searchForm");
const bookingForm = document.getElementById("bookingForm");
const modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

initialize();

function initialize() {
  setDefaultDate();
  attachEvents();
  runSearch();
}

function attachEvents() {
  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      modeButtons.forEach((item) => item.classList.toggle("active", item === button));
      runSearch();
    });
  });

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.passengers = Number(document.getElementById("passengers").value);
    runSearch();
    showToast("Trip options refreshed.");
  });

  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const route = getSelectedRoute();
    if (!route) {
      showToast("Select a route before completing your booking.");
      return;
    }

    if (!state.selectedSeat) {
      showToast("Choose a seat to continue.");
      return;
    }

    const name = document.getElementById("fullName").value.trim();
    showToast(`Ticket confirmed for ${name || "your trip"} on seat ${state.selectedSeat}.`);
  });
}

function runSearch() {
  const fromCity = normalizeCity(document.getElementById("fromCity").value);
  const toCity = normalizeCity(document.getElementById("toCity").value);

  state.filteredRoutes = routes.filter((route) => {
    const routeMatchesMode = state.mode === "all" || route.type === state.mode;
    const routeMatchesFrom = !fromCity || route.from.toLowerCase().includes(fromCity);
    const routeMatchesTo = !toCity || route.to.toLowerCase().includes(toCity);
    return routeMatchesMode && routeMatchesFrom && routeMatchesTo;
  });

  const currentSelectionVisible = state.filteredRoutes.some((route) => route.id === state.selectedRouteId);
  if (!currentSelectionVisible) {
    state.selectedRouteId = state.filteredRoutes[0]?.id ?? null;
    state.selectedSeat = null;
  }

  renderRoutes();
  renderSelection();
  renderSeats();
  renderSummary();
}

function renderRoutes() {
  resultCount.textContent = `${state.filteredRoutes.length} route${state.filteredRoutes.length === 1 ? "" : "s"}`;

  if (!state.filteredRoutes.length) {
    routeResults.innerHTML = `
      <div class="empty-state">
        <h3>No trips match this search.</h3>
        <p>Try another city pair or switch between bus and train filters.</p>
      </div>
    `;
    return;
  }

  routeResults.innerHTML = state.filteredRoutes.map((route) => {
    const isSelected = route.id === state.selectedRouteId;
    return `
      <article class="route-card ${isSelected ? "selected" : ""}">
        <div class="route-head">
          <div>
            <span class="type-badge ${route.type}">${route.type}</span>
            <p class="route-route">${route.from} to ${route.to}</p>
          </div>
          <div>
            <div class="fare">$${route.price}</div>
            <div class="route-time">${route.departure} - ${route.arrival}</div>
          </div>
        </div>
        <div class="route-mid">
          <span>${route.operator}</span>
          <span>${route.duration}</span>
          <span>${route.className}</span>
          <span>${countAvailableSeats(route.seats)} seats left</span>
        </div>
        <button type="button" data-route-id="${route.id}">${isSelected ? "Selected" : "Choose this trip"}</button>
      </article>
    `;
  }).join("");

  routeResults.querySelectorAll("button[data-route-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedRouteId = button.dataset.routeId;
      state.selectedSeat = null;
      renderRoutes();
      renderSelection();
      renderSeats();
      renderSummary();
    });
  });
}

function renderSelection() {
  const route = getSelectedRoute();

  if (!route) {
    selectedRouteName.textContent = "Choose a route";
    selectedType.textContent = "No selection";
    selectedType.className = "type-badge muted";
    selectedRouteMeta.textContent = "Pick a trip card to see schedule, class, and fare details here.";
    selectedSeatLabel.textContent = "No seat";
    return;
  }

  selectedRouteName.textContent = `${route.from} to ${route.to}`;
  selectedType.textContent = route.type;
  selectedType.className = `type-badge ${route.type}`;
  selectedRouteMeta.innerHTML = `
    <strong>${route.operator}</strong> leaves at ${route.departure} and arrives at ${route.arrival}.
    Travel class: ${route.className}. Duration: ${route.duration}. Ticket count: ${state.passengers}.
  `;
  selectedSeatLabel.textContent = state.selectedSeat || "No seat";
}

function renderSeats() {
  const route = getSelectedRoute();

  if (!route) {
    seatGrid.innerHTML = `<div class="empty-state">Choose a route to unlock seat selection.</div>`;
    return;
  }

  seatGrid.innerHTML = route.seats.map((seat) => {
    const isSelected = seat.label === state.selectedSeat;
    return `
      <button
        type="button"
        class="seat-btn ${seat.occupied ? "occupied" : ""} ${isSelected ? "selected" : ""}"
        data-seat-label="${seat.label}"
        ${seat.occupied ? "disabled" : ""}
      >
        ${seat.label}
      </button>
    `;
  }).join("");

  seatGrid.querySelectorAll(".seat-btn:not(.occupied)").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedSeat = button.dataset.seatLabel;
      renderSeats();
      renderSelection();
      renderSummary();
    });
  });
}

function renderSummary() {
  const route = getSelectedRoute();
  const baseFare = route ? route.price * state.passengers : 0;
  const seatFee = route && state.selectedSeat ? 7 * state.passengers : 0;
  const serviceFee = route ? 4 * state.passengers : 0;
  const total = baseFare + seatFee + serviceFee;

  summaryContent.innerHTML = `
    <div class="summary-row">
      <span>Base fare</span>
      <strong>$${baseFare}</strong>
    </div>
    <div class="summary-row">
      <span>Seat selection</span>
      <strong>$${seatFee}</strong>
    </div>
    <div class="summary-row">
      <span>Service fee</span>
      <strong>$${serviceFee}</strong>
    </div>
    <div class="summary-row total">
      <span>Total</span>
      <strong>$${total}</strong>
    </div>
  `;
}

function getSelectedRoute() {
  return routes.find((route) => route.id === state.selectedRouteId) || null;
}

function normalizeCity(value) {
  return value.trim().toLowerCase();
}

function countAvailableSeats(seats) {
  return seats.filter((seat) => !seat.occupied).length;
}

function createSeats(occupiedLabels) {
  return ["A1", "A2", "A3", "A4", "B1", "B2", "B3", "B4", "C1", "C2", "C3", "C4", "D1", "D2", "D3", "D4"]
    .map((label) => ({
      label,
      occupied: occupiedLabels.includes(label)
    }));
}

function setDefaultDate() {
  const travelDateInput = document.getElementById("travelDate");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  travelDateInput.value = tomorrow.toISOString().split("T")[0];
}

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}
