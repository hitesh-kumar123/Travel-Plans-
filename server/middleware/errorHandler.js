// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  const requestId = req?.requestId || req?.headers?.["x-request-id"] || null;
  const statusCode = err.statusCode || 500;
  console.error("[request-error]", {
    requestId,
    method: req?.method,
    path: req?.originalUrl || req?.url,
    statusCode,
    message: err.message,
    code: err.code,
  });
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }
  void next; // keep `next` parameter for Express but mark as used for linters

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      msg: messages.join(", "),
      requestId,
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      msg: `${field} already exists`,
      requestId,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      msg: "Invalid token",
      requestId,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      msg: "Token has expired",
      requestId,
    });
  }

  res.status(statusCode).json({
    msg: err.message || "Server Error",
    requestId,
  });
};

module.exports = errorHandler;
