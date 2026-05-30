const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPackingList,
  addItem,
  toggleItem,
  deleteItem,
  applyTemplate,
  clearAll,
  updateItemWeight,
} = require("../controllers/packingController");

router.get("/:tripId", auth, getPackingList);
router.post("/:tripId/items", auth, addItem);
router.patch("/:tripId/items/:itemId", auth, toggleItem);
router.delete("/:tripId/items/:itemId", auth, deleteItem);
router.post("/:tripId/template", auth, applyTemplate);
router.delete("/:tripId/items", auth, clearAll);
router.patch("/:tripId/items/:itemId/weight", auth, updateItemWeight);

module.exports = router;
