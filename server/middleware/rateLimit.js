const rateLimit = require("express-rate-limit");

// Rate limiter - 100 requests per 15 min per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { msg: "Too many requests from this IP, please try again later." },
});

// Stricter rate limiter for login and registration attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

const otpLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 3,
  message: {
    message: "Please wait before requesting another OTP.",
  },
});

const externalApiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 20, // per user/IP
  message: {
    message: "Too many requests, slow down.",
  },
});

const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  //no need to send message
});

module.exports = {
  limiter,
  authLimiter,
  otpLimiter,
  externalApiLimiter,
  bookingLimiter,
};
