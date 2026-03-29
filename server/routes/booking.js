const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");

// @route   POST api/booking/flights/search
// @desc    Search for flights
// @access  Private
router.post("/flights/search", auth, bookingController.searchFlights);

// @route   POST api/booking/hotels/search
// @desc    Search for hotels
// @access  Private
router.post("/hotels/search", auth, bookingController.searchHotels);

// @route   POST api/booking/flights/book
// @desc    Book a flight
// @access  Private
router.post("/flights/book", auth, bookingController.bookFlight);

// @route   POST api/booking/hotels/book
// @desc    Book a hotel
// @access  Private
router.post("/hotels/book", auth, bookingController.bookHotel);

module.exports = router;
