const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/apiResponse");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return sendError(res, 401, "No token, authorization denied");
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    return sendError(res, 401, "Token is not valid");
  }
};
