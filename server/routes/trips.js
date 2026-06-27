const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const auth = require("../middleware/auth");
const { tripValidation } = require("../middleware/validators");

// @route   POST api/trips
// @desc    Create a new trip
// @access  Private
router.post("/", auth, tripValidation.createTrip, tripController.createTrip);

// @route   GET api/trips
// @desc    Get all user trips
// @access  Private
router.get("/", auth, tripController.getUserTrips);

// @route   GET api/trips/share/:token
// @desc    View shared trip (public)
// @access  Public
router.get(
  "/share/:token",
  tripValidation.shareTokenParam,
  tripController.getSharedTrip,
);

// @route   GET api/trips/:id
// @desc    Get trip by ID
// @access  Private
router.get("/:id", auth, tripValidation.tripIdParam, tripController.getTrip);

// @route   PUT api/trips/:id
// @desc    Update a trip
// @access  Private
router.put(
  "/:id",
  auth,
  tripValidation.updateTrip,
  tripController.updateTrip,
);

// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete(
  "/:id",
  auth,
  tripValidation.tripIdParam,
  tripController.deleteTrip,
);

// @route   POST api/trips/:id/share
// @desc    Generate shareable link
// @access  Private

router.post(
  "/:id/share",
  auth,
  tripValidation.tripIdParam,
  tripController.shareTrip,
);
router.put(
  "/:id/share-toggle",
  auth,
  tripValidation.tripIdParam,
  tripController.toggleTripSharing,
);
module.exports = router;
