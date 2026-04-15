export function validateBookingPayload(payload, routeCatalog) {
  const route = routeCatalog.find((item) => item.id === payload.routeId);

  if (!route) {
    throw new Error("Selected route was not found.");
  }

  if (!payload.seatLabel) {
    throw new Error("Seat selection is required.");
  }

  if (!payload.passenger?.fullName || !payload.passenger?.email) {
    throw new Error("Passenger name and email are required.");
  }
}

export function createBookingRecord(payload) {
  const bookingReference = `TR-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  return {
    bookingReference,
    status: "confirmed",
    issuedAt: new Date().toISOString(),
    ...payload
  };
}
