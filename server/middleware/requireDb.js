const mongoose = require("mongoose");

module.exports = function requireDb(req, res, next) {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    msg: "Database is not connected. Start MongoDB locally or verify MONGO_URI in server/.env.",
  });
};
