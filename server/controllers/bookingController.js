// Payment verification module for secure payment processing
const paymentVerification = require('../utils/paymentVerification');

// axios removed — not used in current mock implementation

// Mock data shared across search and booking endpoints
const mockFlights = [
  {
    id: "fl-1",
    airline: "SkyAir",
    price: 299.99,
    departureTime: "08:00",
    arrivalTime: "10:30",
    duration: "2h 30m",
  },
  {
    id: "fl-2",
    airline: "OceanAir",
    price: 349.99,
    departureTime: "12:15",
    arrivalTime: "14:45",
    duration: "2h 30m",
  },
  {
    id: "fl-3",
    airline: "MountainExpress",
    price: 279.99,
    departureTime: "16:30",
    arrivalTime: "19:00",
    duration: "2h 30m",
  },
  {
    id: "fl-4",
    airline: "BudgetWings",
    price: 149.99,
    departureTime: "05:00",
    arrivalTime: "07:30",
    duration: "2h 30m",
  },
  {
    id: "fl-5",
    airline: "LuxeAir",
    price: 499.99,
    departureTime: "20:00",
    arrivalTime: "22:30",
    duration: "2h 30m",
  },
];

const mockHotels = [
  {
    id: "ht-1",
    name: "Grand Plaza Hotel",
    rating: 4.5,
    price: 199.99,
    amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
    images: ["hotel1_img1.jpg", "hotel1_img2.jpg"],
  },
  {
    id: "ht-2",
    name: "Comfort Inn & Suites",
    rating: 4.2,
    price: 149.99,
    amenities: ["WiFi", "Breakfast", "Parking"],
    images: ["hotel2_img1.jpg", "hotel2_img2.jpg"],
  },
  {
    id: "ht-3",
    name: "Luxury Resort & Spa",
    rating: 4.8,
    price: 299.99,
    amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym"],
    images: ["hotel3_img1.jpg", "hotel3_img2.jpg"],
  },
  {
    id: "ht-4",
    name: "Budget Stay Inn",
    rating: 3.5,
    price: 79.99,
    amenities: ["WiFi", "Parking"],
    images: ["hotel4_img1.jpg"],
  },
  {
    id: "ht-5",
    name: "City Center Hotel",
    rating: 4.0,
    price: 129.99,
    amenities: ["WiFi", "Restaurant", "Gym"],
    images: ["hotel5_img1.jpg"],
  },
];

// Search for flights with filters
exports.searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults = 1,
      minBudget,
      maxBudget,
    } = req.body;

    if (!origin || !destination || !departureDate) {
      return res.status(400).json({
        msg: "Please provide origin, destination, and departure date",
      });
    }

    // Add request-specific fields to the shared flight data
    const flights = mockFlights.map((f) => ({
      ...f,
      origin,
      destination,
      departureDate,
      currency: "USD",
    }));

    // Apply budget filters
    let filteredFlights = flights;

    if (minBudget !== undefined && minBudget !== "") {
      filteredFlights = filteredFlights.filter(
        (f) => f.price >= Number(minBudget),
      );
    }
    if (maxBudget !== undefined && maxBudget !== "") {
      filteredFlights = filteredFlights.filter(
        (f) => f.price <= Number(maxBudget),
      );
    }

    res.json({ flights: filteredFlights });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Search for hotels with filters
exports.searchHotels = async (req, res) => {
  try {
    const {
      location,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      minBudget,
      maxBudget,
      minRating,
      amenities,
    } = req.body;

    if (!location || !checkIn || !checkOut) {
      return res.status(400).json({
        msg: "Please provide location, check-in, and check-out dates",
      });
    }

    // Add request-specific fields to the shared hotel data
    const addresses = {
      "ht-1": "123 Main Street",
      "ht-2": "456 Park Avenue",
      "ht-3": "789 Beach Boulevard",
      "ht-4": "321 Economy Road",
      "ht-5": "555 Downtown Ave",
    };
    const hotels = mockHotels.map((h) => ({
      ...h,
      location,
      address: addresses[h.id],
      currency: "USD",
    }));

    let filteredHotels = hotels;

    // Budget filter
    if (minBudget !== undefined && minBudget !== "") {
      filteredHotels = filteredHotels.filter(
        (h) => h.price >= Number(minBudget),
      );
    }
    if (maxBudget !== undefined && maxBudget !== "") {
      filteredHotels = filteredHotels.filter(
        (h) => h.price <= Number(maxBudget),
      );
    }

    // Rating filter
    if (minRating !== undefined && minRating !== "" && Number(minRating) > 0) {
      filteredHotels = filteredHotels.filter(
        (h) => h.rating >= Number(minRating),
      );
    }

    // Amenities filter — hotel must have ALL selected amenities
    if (amenities && amenities.length > 0) {
      filteredHotels = filteredHotels.filter((h) =>
        amenities.every((a) => h.amenities.includes(a)),
      );
    }

    res.json({ hotels: filteredHotels });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Book a flight
exports.bookFlight = async (req, res) => {
  try {
    const { flightId, passengers, tripId, customerEmail } = req.body;

    if (!flightId || !passengers || !tripId) {
      return res.status(400).json({
        msg: "Please provide flight ID, passenger details, and trip ID",
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        msg: "Customer email is required for payment verification",
      });
    }

    // Look up the selected flight to get its actual price
    const selectedFlight = mockFlights.find((f) => f.id === flightId);
    if (!selectedFlight) {
      return res.status(404).json({ msg: "Flight not found" });
    }

    const bookingId = "BK" + Math.floor(Math.random() * 10000000);
    const totalPrice = selectedFlight.price * passengers.length;

    // Step 1: Initiate payment verification before booking confirmation
    const paymentInitiation = paymentVerification.initiatePaymentVerification(
      bookingId,
      totalPrice,
      "USD",
      { email: customerEmail }
    );

    // Step 2: Return payment verification details along with booking
    // Booking is in PENDING_PAYMENT status until payment is verified
    const bookingResponse = {
      bookingId,
      flightId,
      status: paymentVerification.BOOKING_STATUS.PENDING_PAYMENT,
      passengers,
      totalPrice,
      currency: "USD",
      paymentRequired: true,
      transactionId: paymentInitiation.transactionId,
      paymentUrl: paymentInitiation.paymentUrl,
      message: "Please complete payment verification to confirm booking",
    };

    res.json(bookingResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// Book a hotel
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, roomType, guests, checkIn, checkOut, tripId, customerEmail } = req.body;

    // Validate that all required fields are present
    if (!hotelId || !roomType || !guests || !checkIn || !checkOut || !tripId) {
      return res.status(400).json({
        msg: "Please provide all required booking details",
      });
    }

    if (!customerEmail) {
      return res.status(400).json({
        msg: "Customer email is required for payment verification",
      });
    }

    // 1. Validate Date Formatting Semantics (Fixes corrupted-date-string vulnerability)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({
        msg: "Please provide valid check-in and check-out dates",
      });
    }

    // 2. Validate Stay Duration Chronology (Fixes negative-date and same-day checkout vulnerabilities)
    const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
    const totalNights = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));

    if (totalNights < 1) {
      return res.status(400).json({
        msg: "Booking duration must be at least 1 night",
      });
    }

    // 3. Complete Safe Price Calculation
    const PRICE_PER_NIGHT = 199.99;
    const calculatedPrice = parseFloat(
      (PRICE_PER_NIGHT * totalNights).toFixed(2),
    );

    const bookingId = "HB" + Math.floor(Math.random() * 10000000);

    // Step 1: Initiate payment verification before booking confirmation
    const paymentInitiation = paymentVerification.initiatePaymentVerification(
      bookingId,
      calculatedPrice,
      "USD",
      { email: customerEmail }
    );

    // Step 2: Return payment verification details along with booking
    // Booking is in PENDING_PAYMENT status until payment is verified
    const bookingResponse = {
      bookingId,
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      status: paymentVerification.BOOKING_STATUS.PENDING_PAYMENT,
      totalPrice: calculatedPrice,
      currency: "USD",
      paymentRequired: true,
      transactionId: paymentInitiation.transactionId,
      paymentUrl: paymentInitiation.paymentUrl,
      message: "Please complete payment verification to confirm booking",
    };

    res.json(bookingResponse);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Server error",
      error: err.message,
    });
  }
};

// Handle payment webhook callback from payment processor
exports.handlePaymentWebhook = async (req, res) => {
  try {
    const webhookData = req.body;

    if (!webhookData || !webhookData.transactionId) {
      return res.status(400).json({
        msg: "Invalid webhook data: missing transactionId",
      });
    }

    // Process webhook and verify payment
    const webhookResult = paymentVerification.handlePaymentWebhook(webhookData);

    if (webhookResult.success) {
      res.json({
        success: true,
        transactionId: webhookResult.transactionId,
        status: webhookResult.status,
        message: "Payment verified successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        transactionId: webhookResult.transactionId,
        message: webhookResult.message,
      });
    }
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(500).json({
      msg: "Webhook processing error",
      error: err.message,
    });
  }
};

// Confirm booking after payment verification
exports.confirmBookingAfterPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        msg: "Please provide booking ID",
      });
    }

    // Check if payment is verified for this booking
    const paymentStatus = paymentVerification.getPaymentStatus(bookingId);

    if (!paymentStatus.verified) {
      return res.status(400).json({
        success: false,
        bookingId,
        paymentStatus: paymentStatus.status,
        message: "Payment not verified. Booking cannot be confirmed.",
      });
    }

    // Payment is verified, finalize booking
    const bookingData = {
      totalPrice: paymentStatus.amount,
      currency: paymentStatus.currency,
      status: paymentVerification.BOOKING_STATUS.PAYMENT_VERIFIED,
    };

    const finalizedBooking = paymentVerification.finalizeBookingAfterPayment(
      bookingId,
      bookingData
    );

    res.json(finalizedBooking);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Error confirming booking",
      error: err.message,
    });
  }
};

// Get payment status for a booking
exports.getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        msg: "Please provide booking ID",
      });
    }

    const paymentStatus = paymentVerification.getPaymentStatus(bookingId);

    res.json({
      bookingId,
      ...paymentStatus,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: "Error retrieving payment status",
      error: err.message,
    });
  }
};
