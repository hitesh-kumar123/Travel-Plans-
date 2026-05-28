const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables from repo root .env (so server can be started from /server)
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "./.env") });

// Initialize express app
const app = express();

// Security Middleware
app.use(helmet());

// Rate limiter - 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests from this IP, please try again later." },
});
app.use("/api/auth", limiter);

// Core Middleware
const allowedOrigins = ["http://localhost:3000"];

const frontendUrls = [];
if (process.env.FRONTEND_URL) {
  frontendUrls.push(
    ...process.env.FRONTEND_URL.split(",")
      .map((url) => url.trim())
      .filter(Boolean),
  );
}
if (process.env.FRONTEND_URLS) {
  frontendUrls.push(
    ...process.env.FRONTEND_URLS.split(",")
      .map((url) => url.trim())
      .filter(Boolean),
  );
}
allowedOrigins.push(...frontendUrls);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const weatherRoutes = require("./routes/weather");
const expenseRoutes = require("./routes/expenses");
const translatorRoutes = require("./routes/translator");
const bookingRoutes = require("./routes/booking");
const destinationRoutes = require("./routes/destinations");
const packingRoutes = require("./routes/packing");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/translator", translatorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/packing", packingRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Travel Planner API is running!");
});

// Global error handler (must be last)
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
