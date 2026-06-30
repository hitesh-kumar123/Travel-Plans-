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
} = require("../controllers/packingController");
const { packingValidation } = require("../middleware/validators");

router.get("/:tripId", auth, packingValidation.tripIdParam, getPackingList);
router.post("/:tripId/items", auth, packingValidation.addItem, addItem);
router.patch(
  "/:tripId/items/:itemId",
  auth,
  packingValidation.toggleOrDeleteItem,
  toggleItem,
);
router.delete(
  "/:tripId/items/:itemId",
  auth,
  packingValidation.toggleOrDeleteItem,
  deleteItem,
);
router.post(
  "/:tripId/template",
  auth,
  packingValidation.applyTemplate,
  applyTemplate,
);
router.delete("/:tripId/items", auth, packingValidation.tripIdParam, clearAll);

module.exports = router;
