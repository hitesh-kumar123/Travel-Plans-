const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const session = require("express-session");
const passport = require("passport");

const errorHandler = require("./middleware/errorHandler");

// Load environment variables from repo root .env (so server can be started from /server)
dotenv.config({ path: require("path").resolve(__dirname, "../.env") });
dotenv.config({ path: require("path").resolve(__dirname, "./.env") });

// Passport config
require("./config/passport");

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
  message: {
    msg: "Too many requests from this IP, please try again later.",
  },
});

app.use("/api/auth", limiter);

// Core Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5000",
];

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

function isOriginAllowed(origin) {
  if (!origin) return true;
  return allowedOrigins.includes(origin);
}

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

// Body parser
app.use(express.json());

// Session Middleware (IMPORTANT for Google Auth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "travelplannersecret",
    resave: false,
    saveUninitialized: false,
    // If you're behind a proxy (e.g., Vercel), `secure` cookies require `trust proxy`.
    // SameSite=Lax is the safest default for OAuth redirects.
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

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

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

// Global error handler
app.use(errorHandler);

// Validate required env vars early
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing — set it in server/.env before using auth.");
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing — login and register will fail.");
}

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server only after DB connection
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });

