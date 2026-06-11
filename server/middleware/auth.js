const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = bearerToken || req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ msg: "Authentication service unavailable" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("meddleware");
    console.log("decoded: ", decoded);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    console.error("Auth middleware token verify error:", err);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
