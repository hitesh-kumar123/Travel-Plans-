// routes/destinations.js
const router = require("express").Router();
const Destination = require("../models/Destination");
const { destinationValidation } = require("../middleware/validators");

// Sab destinations
router.get("/", destinationValidation.sanitizeQueryParams, async (req, res) => {
  try {
    const { city, state, type } = req.query;
    let filter = {};
    if (city) filter.city = String(city);
    if (state) filter.state = String(state);
    if (type) filter.type = String(type);
    const data = await Destination.find(filter);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Search destinations for autocomplete
router.get(
  "/search",
  destinationValidation.sanitizeSearchQuery,
  async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.json([]);
      }
      // Case-insensitive regex search by name or city
      // q is already escaped by sanitizeSearchQuery middleware
      const data = await Destination.find({
        $or: [
          { name: { $regex: q, $options: "i" } },
          { city: { $regex: q, $options: "i" } },
        ],
      }).limit(10);
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

// Single destination by ID
router.get("/:id", destinationValidation.idParam, async (req, res) => {
  try {
    const data = await Destination.findById(req.params.id);
    if (!data) return res.status(404).json({ error: "Destination not found" });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
