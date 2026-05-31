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
// When running behind a proxy (like Render), trust the proxy so express
// and express-rate-limit can use the X-Forwarded-* headers correctly.
app.set("trust proxy", 1);

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
const DEFAULT_LOCAL_ORIGINS = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const normalizeOrigin = (value) => {
  try {
    const parsed = new URL(value.trim());
    return parsed.origin;
  } catch {
    return null;
  }
};

const parseOrigins = (value) =>
  value
    .split(",")
    .map((url) => normalizeOrigin(url))
    .filter(Boolean);

const allowedOrigins = new Set();

const frontendUrls = [];
if (process.env.FRONTEND_URL) {
  frontendUrls.push(...parseOrigins(process.env.FRONTEND_URL));
}
if (process.env.FRONTEND_URLS) {
  frontendUrls.push(...parseOrigins(process.env.FRONTEND_URLS));
}

for (const origin of frontendUrls) {
  allowedOrigins.add(origin);
}

if (process.env.NODE_ENV !== "production") {
  for (const localOrigin of DEFAULT_LOCAL_ORIGINS) {
    allowedOrigins.add(localOrigin);
  }
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (normalizedOrigin && allowedOrigins.has(normalizedOrigin)) {
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
