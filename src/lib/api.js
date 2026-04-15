const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:4000");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

export function getRoutes() {
  return request("/api/routes");
}

export function createPaymentIntent(payload) {
  return request("/api/payments/create-intent", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createBooking(payload) {
  return request("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
