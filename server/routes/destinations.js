// routes/destinations.js
const router = require("express").Router();
const Destination = require("../models/Destination");
const { sendError, sendServerError } = require("../utils/apiResponse");

// Sab destinations
router.get("/", async (req, res) => {
  try {
    const { city, state, type } = req.query;
    const filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (type) filter.type = type;
    const data = await Destination.find(filter);
    res.json(data);
  } catch (err) {
    return sendServerError(res, err);
  }
});

// Search destinations for autocomplete
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    // Case-insensitive regex search by name or city
    const data = await Destination.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { city: { $regex: q, $options: "i" } },
      ],
    }).limit(10);
    res.json(data);
  } catch (err) {
    return sendServerError(res, err);
  }
});

// Single destination by ID
router.get("/:id", async (req, res) => {
  try {
    const data = await Destination.findById(req.params.id);
    res.json(data);
  } catch (err) {
    return sendServerError(res, err);
  }
});

module.exports = router;
