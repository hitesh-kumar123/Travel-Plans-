const rateLimit = require("express-rate-limit");

// Global fallback limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    message: "Too many requests, please try again later.",
  },
});

// Auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many authentication attempts. Please try again later.",
  },
});

// OTP routes
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many OTP requests. Please try again later.",
  },
});

// Weather & Translator APIs
const externalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    message: "API request limit exceeded. Please try again later.",
  },
});

// Booking APIs
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Too many booking requests. Please try again later.",
  },
});

module.exports = {
  globalLimiter,
  authLimiter,
  otpLimiter,
  externalApiLimiter,
  bookingLimiter,
};
