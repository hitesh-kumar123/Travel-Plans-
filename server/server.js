const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const weatherRoutes = require("./routes/weather");
const expenseRoutes = require("./routes/expenses");
const translatorRoutes = require("./routes/translator");
const bookingRoutes = require("./routes/booking");
const destinationRoutes = require("./routes/destinations");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/translator", translatorRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/destinations", destinationRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("Travel Planner API is running!");
});

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
