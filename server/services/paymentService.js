import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

export async function createPaymentIntent(payload) {
  const amount = Number(payload.amount || 0);

  if (!payload.routeId) {
    throw new Error("A route is required for payment.");
  }

  if (amount <= 0) {
    throw new Error("Payment amount must be greater than zero.");
  }

  if (!stripe) {
    return {
      mode: "mock",
      clientSecret: "",
      paymentIntentId: `mock_pi_${Date.now()}`,
      amount
    };
  }

  const intent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    receipt_email: payload.email,
    metadata: {
      routeId: payload.routeId,
      passengers: String(payload.passengers || 1),
      seatLabel: payload.seatLabel || ""
    },
    automatic_payment_methods: {
      enabled: true
    }
  });

  return {
    mode: "live",
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id,
    amount
  };
}
