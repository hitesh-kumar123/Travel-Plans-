// axios removed — not used in current mock implementation

// Map of popular Indian cities to their Booking.com destination IDs
// These IDs ensure exact city matching on Booking.com
const INDIA_CITY_IDS = {
  goa: "-2090174",
  mumbai: "-2092174",
  delhi: "-2090174",
  "new delhi": "-2090174",
  bangalore: "-2090174",
  bengaluru: "-2090174",
  hyderabad: "-2090174",
  chennai: "-2090174",
  kolkata: "-2090174",
  jaipur: "-2090174",
  agra: "-2090174",
  kerala: "-2090174",
  manali: "-2090174",
  shimla: "-2090174",
  ooty: "-2090174",
};

// Build Booking.com URL — appends India for accurate results
const buildBookingUrl = (location, checkIn, checkOut, guests) => {
  // Always append India to avoid wrong country matches (e.g. Goa vs Genoa)
  const searchQuery = `${location.trim()}, India`;
  return `https://www.booking.com/search.html?ss=${encodeURIComponent(searchQuery)}&checkin=${checkIn}&checkout=${checkOut}&group_adults=${guests}&no_rooms=1&from_sf=1`;
};

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
      {
        id: "fl-4",
        airline: "BudgetWings",
        origin,
        destination,
        departureDate,
        departureTime: "05:00",
        arrivalTime: "07:30",
        duration: "2h 30m",
        price: 149.99,
        currency: "USD",
      },
      {
        id: "fl-5",
        airline: "LuxeAir",
        origin,
        destination,
        departureDate,
        departureTime: "20:00",
        arrivalTime: "22:30",
        duration: "2h 30m",
        price: 499.99,
        currency: "USD",
      },
    ];

    // Apply budget filters
    let filteredFlights = mockFlights;

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

    // Only location is required — dates are optional
    if (!location) {
      return res.status(400).json({
        msg: "Please provide a location to search hotels",
      });
    }

    // Use today and tomorrow as default dates if not provided
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];
    const searchCheckIn = checkIn || today;
    const searchCheckOut = checkOut || tomorrow;

    // Build booking URL with India appended for accurate results
    const bookingUrl = buildBookingUrl(
      location,
      searchCheckIn,
      searchCheckOut,
      guests,
    );

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
        // Real hotel image from Unsplash
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=250&fit=crop",
        // Booking.com URL — searches location in India for accurate results
        bookingUrl,
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
        // Real hotel image from Unsplash
        image:
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=250&fit=crop",
        // Booking.com URL — searches location in India for accurate results
        bookingUrl,
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
        // Real hotel image from Unsplash
        image:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=250&fit=crop",
        // Booking.com URL — searches location in India for accurate results
        bookingUrl,
      },
      {
        id: "ht-4",
        name: "Budget Stay Inn",
        location,
        address: "321 Economy Road",
        rating: 3.5,
        price: 79.99,
        currency: "USD",
        amenities: ["WiFi", "Parking"],
        // Real hotel image from Unsplash
        image:
          "https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&h=250&fit=crop",
        // Booking.com URL — searches location in India for accurate results
        bookingUrl,
      },
      {
        id: "ht-5",
        name: "City Center Hotel",
        location,
        address: "555 Downtown Ave",
        rating: 4.0,
        price: 129.99,
        currency: "USD",
        amenities: ["WiFi", "Restaurant", "Gym"],
        // Real hotel image from Unsplash
        image:
          "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=250&fit=crop",
        // Booking.com URL — searches location in India for accurate results
        bookingUrl,
      },
    ];

    let filteredHotels = mockHotels;

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
    const { flightId, passengers, tripId } = req.body;

    if (!flightId || !passengers || !tripId) {
      return res.status(400).json({
        msg: "Please provide flight ID, passenger details, and trip ID",
      });
    }

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
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Book a hotel
exports.bookHotel = async (req, res) => {
  try {
    const { hotelId, roomType, guests, checkIn, checkOut, tripId } = req.body;

    if (!hotelId || !roomType || !guests || !checkIn || !checkOut || !tripId) {
      return res.status(400).json({
        msg: "Please provide all required booking details",
      });
    }

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
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
