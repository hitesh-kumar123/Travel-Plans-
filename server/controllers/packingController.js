const PackingList = require("../models/PackingList");

// Preset templates
const TEMPLATES = {
  beach: [
    { name: "Sunscreen", category: "Toiletries" },
    { name: "Swimsuit", category: "Clothing" },
    { name: "Sunglasses", category: "Other" },
    { name: "Beach towel", category: "Other" },
    { name: "Flip flops", category: "Clothing" },
    { name: "Hat / cap", category: "Clothing" },
    { name: "Waterproof phone case", category: "Electronics" },
    { name: "Insect repellent", category: "Toiletries" },
  ],
  business: [
    { name: "Formal shirts", category: "Clothing" },
    { name: "Dress pants / skirts", category: "Clothing" },
    { name: "Laptop & charger", category: "Electronics" },
    { name: "Business cards", category: "Documents" },
    { name: "Passport / ID", category: "Documents" },
    { name: "Power bank", category: "Electronics" },
    { name: "Notebook & pen", category: "Other" },
    { name: "Toiletry bag", category: "Toiletries" },
  ],
  camping: [
    { name: "Tent", category: "Other" },
    { name: "Sleeping bag", category: "Other" },
    { name: "Flashlight / headlamp", category: "Electronics" },
    { name: "First aid kit", category: "Medicine" },
    { name: "Water bottle", category: "Other" },
    { name: "Trail shoes", category: "Clothing" },
    { name: "Insect repellent", category: "Toiletries" },
    { name: "Rain jacket", category: "Clothing" },
  ],
};

// GET /api/packing/:tripId
exports.getPackingList = async (req, res) => {
  try {
    let list = await PackingList.findOne({
      trip: req.params.tripId,
      user: req.user.id,
    });
    if (!list) {
      // Auto-create empty list on first access
      list = await PackingList.create({
        trip: req.params.tripId,
        user: req.user.id,
        items: [],
      });
    }
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/packing/:tripId/items  — add a single item
exports.addItem = async (req, res) => {
  try {
    const { name, category } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const list = await PackingList.findOne({
      trip: req.params.tripId,
      user: req.user.id,
    });

    if (list) {
      const duplicate = list.items.find(
        (item) => item.name.trim().toLowerCase() === name.trim().toLowerCase(),
      );

      if (duplicate) {
        return res.status(400).json({
          message: "Item already exists in the packing list",
        });
      }
    }

    const updatedList = await PackingList.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user.id },
      {
        $push: {
          items: {
            name: name.trim(),
            category: category || "Other",
            packed: false,
          },
        },
      },
      { new: true, upsert: true },
    );

    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PATCH /api/packing/:tripId/items/:itemId — toggle packed
exports.toggleItem = async (req, res) => {
  try {
    const list = await PackingList.findOne({
      trip: req.params.tripId,
      user: req.user.id,
    });
    if (!list)
      return res.status(404).json({ message: "Packing list not found" });

    const item = list.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.packed = !item.packed;
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/packing/:tripId/items/:itemId
exports.deleteItem = async (req, res) => {
  try {
    const list = await PackingList.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user.id },
      { $pull: { items: { _id: req.params.itemId } } },
      { new: true },
    );
    if (!list)
      return res.status(404).json({ message: "Packing list not found" });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /api/packing/:tripId/template — apply a preset template
exports.applyTemplate = async (req, res) => {
  try {
    const { template } = req.body; // "beach" | "business" | "camping"
    const items = TEMPLATES[template];
    if (!items)
      return res.status(400).json({ message: "Invalid template name" });

    let list = await PackingList.findOne({
      trip: req.params.tripId,
      user: req.user.id,
    });

    if (!list) {
      list = await PackingList.create({
        trip: req.params.tripId,
        user: req.user.id,
        items: [],
      });
    }

    const existingNames = new Set(
      list.items.map((item) => item.name.trim().toLowerCase()),
    );

    const templateItems = items
      .filter((item) => !existingNames.has(item.name.trim().toLowerCase()))
      .map((item) => ({
        ...item,
        packed: false,
      }));

    list.items.push(...templateItems);
    await list.save();

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// DELETE /api/packing/:tripId/items — clear all items
exports.clearAll = async (req, res) => {
  try {
    const list = await PackingList.findOneAndUpdate(
      { trip: req.params.tripId, user: req.user.id },
      { $set: { items: [] } },
      { new: true },
    );
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
