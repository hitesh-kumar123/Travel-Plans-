/**
 * Recursively strips keys that could be interpreted as MongoDB query
 * operators ($gt, $ne, $where, etc.) or dot-notation paths from any
 * object/array passed to it. Mutates in place.
 */
function stripMongoOperators(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(stripMongoOperators);
    return;
  }
  if (obj && typeof obj === "object") {
    for (const key of Object.keys(obj)) {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
        continue;
      }
      stripMongoOperators(obj[key]);
    }
  }
}

module.exports = function sanitizeMiddleware(req, res, next) {
  if (req.body) stripMongoOperators(req.body);
  if (req.params) stripMongoOperators(req.params);
  next();
};
