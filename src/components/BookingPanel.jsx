import { useState } from "react";
import { formatCurrency } from "../lib/utils";

const initialPassenger = {
  fullName: "",
  email: "",
  phone: "",
  paymentMethod: "Card checkout"
};

export function BookingPanel({
  selectedRoute,
  selectedSeat,
  onSeatSelect,
  passengers,
  fareSummary,
  onConfirmBooking,
  checkoutState
}) {
  const [passenger, setPassenger] = useState(initialPassenger);

  function updatePassenger(field, value) {
    setPassenger((current) => ({
      ...current,
      [field]: value
    }));
  }

  async function submit(event) {
    event.preventDefault();
    await onConfirmBooking(passenger);
  }

  return (
    <aside className="booking-panel" id="booking">
      <div className="section-heading">
        <div>
          <p className="card-label">Booking</p>
          <h2>Complete your ticket</h2>
        </div>
      </div>

      <section className="selection-box">
        <div className="selection-header">
          <div>
            <p className="mini-label">Selected route</p>
            <h3>{selectedRoute ? `${selectedRoute.from} to ${selectedRoute.to}` : "Choose a route"}</h3>
          </div>
          <span className={`type-badge ${selectedRoute ? selectedRoute.type : "muted"}`}>
            {selectedRoute ? selectedRoute.type : "No selection"}
          </span>
        </div>
        <div className="selected-meta">
          {selectedRoute ? (
            <>
              <strong>{selectedRoute.operator}</strong> leaves at {selectedRoute.departure} and arrives at{" "}
              {selectedRoute.arrival}. Travel class: {selectedRoute.className}. Duration: {selectedRoute.duration}. Ticket
              count: {passengers}.
            </>
          ) : (
            "Pick a trip card to see schedule, class, and fare details here."
          )}
        </div>
      </section>

      <section className="seat-box">
        <div className="section-heading compact">
          <div>
            <p className="mini-label">Seat map</p>
            <h3>Choose your seat</h3>
          </div>
          <span className="pill">{selectedSeat || "No seat"}</span>
        </div>
        <div className="seat-legend">
          <span>
            <i className="seat-demo available"></i>Available
          </span>
          <span>
            <i className="seat-demo selected"></i>Selected
          </span>
          <span>
            <i className="seat-demo occupied"></i>Occupied
          </span>
        </div>
        <div className="seat-grid">
          {selectedRoute ? (
            selectedRoute.seats.map((seat) => (
              <button
                key={seat.label}
                type="button"
                disabled={seat.occupied}
                className={`seat-btn ${seat.occupied ? "occupied" : ""} ${selectedSeat === seat.label ? "selected" : ""}`}
                onClick={() => onSeatSelect(seat.label)}
              >
                {seat.label}
              </button>
            ))
          ) : (
            <div className="empty-state">Choose a route to unlock seat selection.</div>
          )}
        </div>
      </section>

      <section className="passenger-box">
        <div className="section-heading compact">
          <div>
            <p className="mini-label">Passenger details</p>
            <h3>Traveler information</h3>
          </div>
        </div>
        <form className="booking-form" onSubmit={submit}>
          <label>
            Full name
            <input
              type="text"
              value={passenger.fullName}
              onChange={(event) => updatePassenger("fullName", event.target.value)}
              placeholder="Jordan Lee"
              required
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={passenger.email}
              onChange={(event) => updatePassenger("email", event.target.value)}
              placeholder="jordan@example.com"
              required
            />
          </label>
          <div className="input-row">
            <label>
              Phone
              <input
                type="tel"
                value={passenger.phone}
                onChange={(event) => updatePassenger("phone", event.target.value)}
                placeholder="+1 555 123 4567"
                required
              />
            </label>
            <label>
              Payment
              <select
                value={passenger.paymentMethod}
                onChange={(event) => updatePassenger("paymentMethod", event.target.value)}
              >
                <option value="Card checkout">Card checkout</option>
                <option value="Apple Pay">Apple Pay</option>
                <option value="Google Pay">Google Pay</option>
              </select>
            </label>
          </div>
          <button className="primary-btn" type="submit">
            {checkoutState.status === "processing" ? "Preparing checkout..." : "Confirm purchase"}
          </button>
        </form>
      </section>

      <section className="summary-box">
        <div className="section-heading compact">
          <div>
            <p className="mini-label">Fare summary</p>
            <h3>Checkout total</h3>
          </div>
        </div>
        <div className="summary-content">
          <div className="summary-row">
            <span>Base fare</span>
            <strong>{formatCurrency(fareSummary.baseFare)}</strong>
          </div>
          <div className="summary-row">
            <span>Seat selection</span>
            <strong>{formatCurrency(fareSummary.seatFee)}</strong>
          </div>
          <div className="summary-row">
            <span>Service fee</span>
            <strong>{formatCurrency(fareSummary.serviceFee)}</strong>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <strong>{formatCurrency(fareSummary.total)}</strong>
          </div>
        </div>
        <div className="payment-status">
          <strong>Status:</strong> {checkoutState.message || "Ready for checkout"}
        </div>
        <div className="payment-status">
          <strong>Mode:</strong> {checkoutState.paymentMode === "live" ? "Stripe live/test intent" : "Static demo checkout"}
        </div>
      </section>
    </aside>
  );
}
