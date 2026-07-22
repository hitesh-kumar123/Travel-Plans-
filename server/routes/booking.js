const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middleware/auth");
const { bookingLimiter } = require("../middleware/rateLimit");

router.post(
  "/flights/search",
  auth,
  bookingLimiter,
  bookingController.searchFlights,
);

router.post(
  "/hotels/search",
  auth,
  bookingLimiter,
  bookingController.searchHotels,
);

router.post(
  "/flights/book",
  auth,
  bookingLimiter,
  bookingController.bookFlight,
);

router.post("/hotels/book", auth, bookingLimiter, bookingController.bookHotel);

module.exports = router;
