const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const auth = require("../middleware/auth");

// @route   POST api/trips
// @desc    Create a new trip
// @access  Private
router.post("/", auth, tripController.createTrip);

// @route   GET api/trips
// @desc    Get all user trips
// @access  Private
router.get("/", auth, tripController.getUserTrips);

// @route   GET api/trips/:id
// @desc    Get trip by ID
// @access  Private
router.get("/:id", auth, tripController.getTrip);

// @route   PUT api/trips/:id
// @desc    Update a trip
// @access  Private
router.put("/:id", auth, tripController.updateTrip);

// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete("/:id", auth, tripController.deleteTrip);

module.exports = router;
