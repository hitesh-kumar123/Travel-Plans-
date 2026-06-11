// routes/destinations.js
const router = require("express").Router();
const Destination = require("../models/Destination");

// Sab destinations
router.get("/", async (req, res) => {
  try {
    const { city, state, type, page, limit = 8, search } = req.query;
    let filter = {};
    if (city) filter.city = city;
    if (state) filter.state = state;
    if (type) filter.type = type;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Paginated response
    if (page) {
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      const total = await Destination.countDocuments(filter);
      const data = await Destination.find(filter).skip(skip).limit(limitNum);

      return res.json({
        destinations: data,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

    // Unpaginated fallback
    const data = await Destination.find(filter);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Single destination by ID
router.get("/:id", async (req, res) => {
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
