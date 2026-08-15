// routes/destinations.js
const router = require("express").Router();
const Destination = require("../models/Destination");

// Get all destinations with optional search, zone, city, state and pagination
router.get("/", async (req, res) => {
  try {
    const { city, state, type, zone, search, page, limit } = req.query;
    let filter = {};

    if (city) filter.city = new RegExp(city, "i");
    if (state) filter.state = new RegExp(state, "i");
    if (type) filter.type = type;
    if (zone && zone !== "all" && zone !== "popular") {
      filter.zone = new RegExp(zone, "i");
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i");
      filter.$or = [
        { name: searchRegex },
        { city: searchRegex },
        { state: searchRegex },
        { zone: searchRegex },
      ];
    }

    // Pagination
    if (page || limit) {
      const currentPage = Math.max(1, parseInt(page, 10) || 1);
      const itemsPerPage = Math.max(1, parseInt(limit, 10) || 8);
      const skip = (currentPage - 1) * itemsPerPage;

      const [total, data] = await Promise.all([
        Destination.countDocuments(filter),
        Destination.find(filter).skip(skip).limit(itemsPerPage),
      ]);

      return res.json({
        destinations: data,
        total,
        page: currentPage,
        totalPages: Math.ceil(total / itemsPerPage) || 1,
        limit: itemsPerPage,
      });
    }

    const data = await Destination.find(filter);
    res.json(data);
  } catch (err) {
    console.error("Destinations fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Search destinations for autocomplete
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const trimmedQ = (q || "").trim();
    if (!trimmedQ) {
      return res.json([]);
    }

    // Case-insensitive regex search by name or city
    const regex = new RegExp(trimmedQ, "i");
    const data = await Destination.find({
      $or: [{ name: regex }, { city: regex }, { state: regex }],
    }).limit(10);
    res.json(data);
  } catch (err) {
    console.error("Autocomplete search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Single destination by ID or Name/Slug
router.get("/:id", async (req, res) => {
  try {
    const idOrSlug = req.params.id;
    let data = null;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      data = await Destination.findById(idOrSlug);
    } else {
      // Find by case-insensitive name
      data = await Destination.findOne({
        name: new RegExp(`^${idOrSlug}$`, "i"),
      });
    }

    if (!data) return res.status(404).json({ error: "Destination not found" });
    res.json(data);
  } catch (err) {
    console.error("Destination by ID error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
