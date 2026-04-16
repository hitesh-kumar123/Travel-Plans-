// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({ msg: messages.join(", ") });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ msg: `${field} already exists` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token has expired" });
  }

  res.status(err.statusCode || 500).json({
    msg: err.message || "Server Error",
  });
};

module.exports = errorHandler;
