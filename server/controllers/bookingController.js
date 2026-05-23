const axios = require("axios");
const { sendError, sendServerError } = require("../utils/apiResponse");

// Search for flights
exports.searchFlights = async (req, res) => {
  try {
    const {
      origin,
      destination,
      departureDate,
      returnDate,
      adults = 1,
    } = req.body;

    if (!origin || !destination || !departureDate) {
      return sendError(
        res,
        400,
        "Please provide origin, destination, and departure date",
      );
    }

    // Normally you would use a real flight API here
    // This is just a placeholder response for demonstration
    const mockFlights = [
      {
        id: "fl-1",
        airline: "SkyAir",
        origin,
        destination,
        departureDate,
        departureTime: "08:00",
        arrivalTime: "10:30",
        duration: "2h 30m",
        price: 299.99,
        currency: "USD",
      },
      {
        id: "fl-2",
        airline: "OceanAir",
        origin,
        destination,
        departureDate,
        departureTime: "12:15",
        arrivalTime: "14:45",
        duration: "2h 30m",
        price: 349.99,
        currency: "USD",
      },
      {
        id: "fl-3",
        airline: "MountainExpress",
        origin,
        destination,
        departureDate,
        departureTime: "16:30",
        arrivalTime: "19:00",
        duration: "2h 30m",
        price: 279.99,
        currency: "USD",
      },
    ];

    res.json({ flights: mockFlights });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Search for hotels
exports.searchHotels = async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests = 2, rooms = 1 } = req.body;

    if (!location || !checkIn || !checkOut) {
      return sendError(
        res,
        400,
        "Please provide location, check-in, and check-out dates",
      );
    }

    // Normally you would use a real hotel API here
    // This is just a placeholder response for demonstration
    const mockHotels = [
      {
        id: "ht-1",
        name: "Grand Plaza Hotel",
        location,
        address: "123 Main Street",
        rating: 4.5,
        price: 199.99,
        currency: "USD",
        amenities: ["WiFi", "Pool", "Gym", "Restaurant"],
        images: ["hotel1_img1.jpg", "hotel1_img2.jpg"],
      },
      {
        id: "ht-2",
        name: "Comfort Inn & Suites",
        location,
        address: "456 Park Avenue",
        rating: 4.2,
        price: 149.99,
        currency: "USD",
        amenities: ["WiFi", "Breakfast", "Parking"],
        images: ["hotel2_img1.jpg", "hotel2_img2.jpg"],
      },
      {
        id: "ht-3",
        name: "Luxury Resort & Spa",
        location,
        address: "789 Beach Boulevard",
        rating: 4.8,
        price: 299.99,
        currency: "USD",
        amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym"],
        images: ["hotel3_img1.jpg", "hotel3_img2.jpg"],
      },
    ];

    res.json({ hotels: mockHotels });
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Book a flight
exports.bookFlight = async (req, res) => {
  try {
    const { flightId, passengers, tripId } = req.body;

    if (!flightId || !passengers || !tripId) {
      return sendError(
        res,
        400,
        "Please provide flight ID, passenger details, and trip ID",
      );
    }

    // Mock booking confirmation
    const bookingConfirmation = {
      bookingId: "BK" + Math.floor(Math.random() * 10000000),
      flightId,
      status: "confirmed",
      passengers,
      totalPrice: 299.99 * passengers.length,
      currency: "USD",
    };

    res.json(bookingConfirmation);
  } catch (err) {
    return sendServerError(res, err);
  }
};

// Book a hotel
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, roomType, guests, checkIn, checkOut, tripId } = req.body;

    if (!hotelId || !roomType || !guests || !checkIn || !checkOut || !tripId) {
      return sendError(
        res,
        400,
        "Please provide all required booking details",
      );
    }

    // Mock booking confirmation
    const bookingConfirmation = {
      bookingId: "HB" + Math.floor(Math.random() * 10000000),
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      status: "confirmed",
      totalPrice:
        (199.99 * (new Date(checkOut) - new Date(checkIn))) /
        (1000 * 60 * 60 * 24),
      currency: "USD",
    };

    res.json(bookingConfirmation);
  } catch (err) {
    return sendServerError(res, err);
  }
};
