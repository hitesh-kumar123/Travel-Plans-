const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const { bookingLimiter } = require("../middleware/rateLimit");

// @route   POST api/booking/flights/search
// @desc    Search for flights
// @access  Private
router.post(
  "/flights/search",
  auth,
  bookingLimiter,
  bookingController.searchFlights,
);

// @route   POST api/booking/hotels/search
// @desc    Search for hotels
// @access  Private
router.post(
  "/hotels/search",
  auth,
  bookingLimiter,
  bookingController.searchHotels,
);

// @route   POST api/booking/places/search
// @desc    Search for places to visit (OpenTripMap Places API)
// @access  Private
router.post(
  "/places/search",
  auth,
  bookingLimiter,
  bookingController.searchPlaces,
);

// @route   POST api/booking/flights/book
// @desc    Book a flight
// @access  Private
router.post(
  "/flights/book",
  auth,
  bookingLimiter,
  bookingController.bookFlight,
);

// @route   POST api/booking/hotels/book
// @desc    Book a hotel
// @access  Private
router.post("/hotels/book", auth, bookingLimiter, bookingController.bookHotel);

module.exports = router;
