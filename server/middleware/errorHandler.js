const { sendError } = require("../utils/apiResponse");

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return sendError(res, 400, messages.join(", "));
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, 400, `${field} already exists`);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return sendError(res, 401, "Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    return sendError(res, 401, "Token has expired");
  }

  return sendError(res, err.statusCode || 500, err.message || "Internal Server Error");
};

module.exports = errorHandler;
