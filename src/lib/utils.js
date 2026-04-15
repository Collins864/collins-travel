export function normalizeCity(value) {
  return value.trim().toLowerCase();
}

export function countAvailableSeats(seats) {
  return seats.filter((seat) => !seat.occupied).length;
}

export function getDefaultDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}
