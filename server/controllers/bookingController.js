// axios removed — not used in current mock implementation
const {
  geocodeCity,
  searchPointsOfInterest,
  OpenTripMapError,
} = require("../utils/openTripMapClient");

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
    const { origin, destination, departureDate, minBudget, maxBudget } =
      req.body;

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
    const { flightId, passengers, tripId } = req.body;

    if (!flightId || !passengers || !tripId) {
      return res.status(400).json({
        msg: "Please provide flight ID, passenger details, and trip ID",
      });
    }

    // Look up the selected flight to get its actual price
    const selectedFlight = mockFlights.find((f) => f.id === flightId);
    if (!selectedFlight) {
      return res.status(404).json({ msg: "Flight not found" });
    }

    const bookingConfirmation = {
      bookingId: "BK" + Math.floor(Math.random() * 10000000),
      flightId,
      status: "confirmed",
      passengers,
      totalPrice: selectedFlight.price * passengers.length,
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

    // Validate that all required fields are present
    if (!hotelId || !roomType || !guests || !checkIn || !checkOut || !tripId) {
      return res.status(400).json({
        msg: "Please provide all required booking details",
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

    const bookingConfirmation = {
      bookingId: "HB" + Math.floor(Math.random() * 10000000),
      hotelId,
      roomType,
      checkIn,
      checkOut,
      guests,
      status: "confirmed",
      totalPrice: calculatedPrice,
      currency: "USD",
    };

    res.json(bookingConfirmation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const VALID_POI_CATEGORIES = [
  "SIGHTS",
  "HISTORICAL",
  "BEACH_PARK",
  "NIGHTLIFE",
  "RESTAURANT",
  "SHOPPING",
];

const CATEGORY_TO_KINDS = {
  SIGHTS: ["view_points", "monuments_and_memorials", "cultural"],
  HISTORICAL: ["historic"],
  BEACH_PARK: ["beaches", "natural"],
  NIGHTLIFE: ["amusements"],
  RESTAURANT: ["foods"],
  SHOPPING: ["shops"],
};

const DEFAULT_KINDS = Array.from(
  new Set(Object.values(CATEGORY_TO_KINDS).flat()),
);

function resolveCategory(kindsString) {
  const kinds = (kindsString || "").split(",");
  const matches = (list) => list.some((k) => kinds.includes(k));

  if (matches(CATEGORY_TO_KINDS.HISTORICAL)) return "HISTORICAL";
  if (matches(CATEGORY_TO_KINDS.BEACH_PARK)) return "BEACH_PARK";
  if (matches(CATEGORY_TO_KINDS.NIGHTLIFE)) return "NIGHTLIFE";
  if (matches(CATEGORY_TO_KINDS.RESTAURANT)) return "RESTAURANT";
  if (matches(CATEGORY_TO_KINDS.SHOPPING)) return "SHOPPING";
  return "SIGHTS";
}

function rateToRank(rate) {
  const HERITAGE_TIERS = { "1h": 70, "2h": 85, "3h": 95, "7d": 100 };
  if (typeof rate === "string" && HERITAGE_TIERS[rate] !== undefined) {
    return HERITAGE_TIERS[rate];
  }
  const numericRate = Number(rate) || 0; // typically 0-3
  return Math.min(100, numericRate * 25);
}

function hashToNumber(str) {
  // Some OpenTripMap entries can arrive without an xid; guard against that
  // instead of crashing the whole search on a single malformed POI.
  if (typeof str !== "string" || str.length === 0) return 0;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // keep it a 32-bit int
  }
  return Math.abs(hash);
}

const USD_TO_INR_RATE = 83;

function estimateEntryFee(poi, rank) {
  const baseUsd = hashToNumber(poi.xid) % 45; // 0-44
  const popularityBoostUsd = rank ? Math.round(rank / 20) : 0; // more popular -> pricier
  const totalUsd = baseUsd + popularityBoostUsd;
  return Math.round((totalUsd * USD_TO_INR_RATE) / 10) * 10; // round to nearest ₹10
}

function buildBookingLinks(name, city) {
  const query = encodeURIComponent(`${name} ${city}`.trim());
  return {
    getYourGuide: `https://www.getyourguide.com/s/?q=${query}`,
    viator: `https://www.viator.com/searchResults/all?text=${query}`,
    tripAdvisor: `https://www.tripadvisor.com/Search?q=${query}`,
    googleMaps: `https://www.google.com/maps/search/?api=1&query=${query}`,
  };
}

function hasPlausibleName(name) {
  if (!name || !name.trim()) return false;
  // Reject only genuinely broken data: the Unicode replacement character
  // (mojibake/encoding failures) or control characters. The previous check
  // rejected any name outside the Latin script, which silently dropped
  // legitimate results whenever OpenTripMap only had a place's name in its
  // native script (Devanagari, Tamil, etc.) — very common for destinations
  // across India, the core audience of this app.
  return !/[\uFFFD\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(name);
}

exports.searchPlaces = async (req, res) => {
  try {
    const { destination, minPrice, maxPrice, categories } = req.body;

    if (!destination) {
      return res.status(400).json({
        msg: "Please provide a destination to search for places to visit",
      });
    }

    const requestedCategories = Array.isArray(categories)
      ? categories.filter((c) => VALID_POI_CATEGORIES.includes(c))
      : [];

    const kinds =
      requestedCategories.length > 0
        ? Array.from(
            new Set(requestedCategories.flatMap((c) => CATEGORY_TO_KINDS[c])),
          )
        : DEFAULT_KINDS;

    const city = await geocodeCity(destination);
    if (!city || city.latitude === undefined) {
      return res.status(404).json({
        msg: `Could not find a location matching "${destination}"`,
      });
    }

    const rawPois = await searchPointsOfInterest({
      latitude: city.latitude,
      longitude: city.longitude,
      radius: 20,
      kinds,
    });

    let places = rawPois
      .filter((poi) => hasPlausibleName(poi.name))
      .map((poi) => {
        const rank = rateToRank(poi.rate);
        return {
          id: poi.xid,
          name: poi.name,
          city: city.name,
          category: resolveCategory(poi.kinds),
          rank,
          tags: (poi.kinds || "").split(",").filter(Boolean).slice(0, 6),
          coordinates: poi.point,
          price: estimateEntryFee(poi, rank),
          currency: "INR",
          bookingLinks: buildBookingLinks(poi.name, city.name),
        };
      });

    if (requestedCategories.length > 0) {
      // Filter by whether the POI's raw kinds overlap any requested
      // category's kind list — not by comparing against the single
      // "primary" category resolveCategory() assigns for display.
      // A POI can legitimately match a requested category (e.g. it was
      // fetched because its kinds include "view_points", part of SIGHTS)
      // while resolveCategory() labels it something else (e.g. BEACH_PARK,
      // because that category happens to take precedence). Filtering on
      // the display label was silently dropping valid results whenever a
      // POI's kinds spanned more than one category.
      const requestedKinds = new Set(
        requestedCategories.flatMap((c) => CATEGORY_TO_KINDS[c]),
      );
      places = places.filter((p) =>
        p.tags.some((tag) => requestedKinds.has(tag)),
      );
    }

    if (minPrice !== undefined && minPrice !== "") {
      places = places.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== "") {
      places = places.filter((p) => p.price <= Number(maxPrice));
    }

    places.sort((a, b) => (b.rank || 0) - (a.rank || 0));

    res.json({ places });
  } catch (err) {
    // Log the full error server-side (message + stack + cause) so the
    // real cause is diagnosable — previously only err.message was logged,
    // and non-axios errors (e.g. missing API key) fell straight through
    // to a generic message with no trace of what actually happened.
    console.error("searchPlaces failed:", err);

    if (err instanceof OpenTripMapError) {
      if (err.code === "CONFIG") {
        // Don't leak internal config details to the client, but make the
        // real cause unmistakable in the server logs (see console.error
        // above) so it isn't confused with a transient upstream failure.
        return res.status(500).json({
          msg: "Places search is temporarily unavailable. Please try again later.",
        });
      }

      if (err.code === "NETWORK") {
        return res.status(502).json({
          msg: "Could not reach the places service. Please try again in a moment.",
        });
      }

      // UPSTREAM: surface OpenTripMap's own error message when available.
      return res.status(err.status || 502).json({
        msg: err.message || "Error searching places to visit",
      });
    }

    res.status(500).json({
      msg: "Error searching places to visit",
    });
  }
};
