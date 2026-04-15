import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { routeCatalog } from "../shared/routes.js";
import { createBookingRecord, validateBookingPayload } from "./services/bookingService.js";
import { createPaymentIntent } from "./services/paymentService.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../dist");

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, date: new Date().toISOString() });
});

app.get("/api/routes", (_request, response) => {
  response.json(routeCatalog);
});

app.post("/api/payments/create-intent", async (request, response) => {
  try {
    const paymentResult = await createPaymentIntent(request.body);
    response.json(paymentResult);
  } catch (error) {
    response.status(400).json({
      error: error.message || "Could not create payment intent."
    });
  }
});

app.post("/api/bookings", (request, response) => {
  try {
    validateBookingPayload(request.body, routeCatalog);
    const booking = createBookingRecord(request.body);
    response.status(201).json(booking);
  } catch (error) {
    response.status(400).json({
      error: error.message || "Could not create booking."
    });
  }
});

app.use(express.static(distPath));

app.get("*", (_request, response) => {
  response.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Collins Travel API listening on http://localhost:${port}`);
});
