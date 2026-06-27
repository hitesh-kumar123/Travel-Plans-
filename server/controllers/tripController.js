const crypto = require("crypto");
const axios = require("axios");
const Trip = require("../models/Trip");
const Destination = require("../models/Destination");
const Expense = require("../models/Expense");

/**
 * Escape special regex metacharacters in a string so it can be safely
 * interpolated into a RegExp without altering the intended pattern.
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Free geocoding fallback using OpenStreetMap's Nominatim API.
 * No API key required. Returns null on any failure so callers can
 * gracefully proceed without coordinates rather than failing the request.
 */
async function geocodeDestination(destination) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: {
        q: destination,
        format: "json",
        limit: 1,
      },
      headers: {
        // Nominatim's usage policy requires a descriptive User-Agent
        "User-Agent": "PackGo-TravelPlanner/1.0",
      },
      timeout: 5000,
    });

    const result = res.data && res.data[0];
    if (!result) return null;

    return { lat: parseFloat(result.lat), lon: parseFloat(result.lon) };
  } catch (err) {
    console.error("Geocoding failed:", err.message);
    return null;
  }
}

/**
 * Resolve coordinates for a destination string:
 * 1. Try matching the Destination catalog by name (case-insensitive).
 * 2. Fall back to free geocoding via Nominatim if no catalog match.
 * Returns { lat, lon } or null if neither source produced a result.
 */
async function resolveCoordinates(destination) {
  if (!destination) return null;

  const dest = await Destination.findOne({
    name: { $regex: new RegExp(`^${escapeRegExp(destination)}$`, "i") },
  });

  if (
    dest &&
    dest.coordinates &&
    dest.coordinates.lat != null &&
    dest.coordinates.lon != null
  ) {
    return { lat: dest.coordinates.lat, lon: dest.coordinates.lon };
  }

  return geocodeDestination(destination);
}

// Create new trip
exports.createTrip = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      description,
      budget,
      status,
      activities,
      accommodation,
      transportation,
    } = req.body;

    if (startDate && new Date(startDate) < new Date().setHours(0, 0, 0, 0)) {
      return res
        .status(400)
        .json({ msg: "Trip start date cannot be in the past" });
    }

    if (budget !== undefined && budget < 0) {
      return res.status(400).json({ msg: "Budget cannot be negative" });
    }

    // Default images
    let images = [];
    let coordinates = null;
    if (destination) {
      // Find destination in DB by name case-insensitively
      const dest = await Destination.findOne({
        name: { $regex: new RegExp(`^${escapeRegExp(destination)}$`, "i") },
      });
      if (dest && dest.images && dest.images.length > 0) {
        images = dest.images;
      }
      coordinates = await resolveCoordinates(destination);
    }

    const newTrip = new Trip({
      user: req.user.id,
      destination,
      images,
      coordinates: coordinates || undefined,
      startDate,
      endDate,
      description,
      budget: budget || 0,
      status: status || "planned",
      activities,
      accommodation,
      transportation,
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all trips for a user
exports.getUserTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({
      startDate: -1,
    });
    res.json(trips);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get a specific trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });

    if (!trip) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });

    if (!trip) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.body.budget !== undefined && req.body.budget < 0) {
      return res.status(400).json({ msg: "Budget cannot be negative" });
    }

    const allowedFields = [
      "destination",
      "startDate",
      "endDate",
      "description",
      "budget",
      "status",
      "activities",
      "accommodation",
      "transportation",
    ];

    const updateData = { updatedAt: Date.now() };
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // Update images and coordinates if destination changed
    if (updateData.destination && updateData.destination !== trip.destination) {
      const dest = await Destination.findOne({
        name: {
          $regex: new RegExp(`^${escapeRegExp(updateData.destination)}$`, "i"),
        },
      });
      if (dest && dest.images && dest.images.length > 0) {
        updateData.images = dest.images;
      }
      const coordinates = await resolveCoordinates(updateData.destination);
      if (coordinates) {
        updateData.coordinates = coordinates;
      }
    }

    trip.set(updateData);
    await trip.save();

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });

    if (!trip) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Also delete all expenses for this trip
    await Expense.deleteMany({ trip: req.params.id });
    await trip.deleteOne();
    res.json({ msg: "Trip removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};
// Generate shareable link for a trip
exports.shareTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });
    if (!trip) return res.status(403).json({ message: "Access denied" });

    const token = crypto.randomBytes(20).toString("hex");
    trip.shareToken = token;
    trip.shareEnabled = true;
    await trip.save();

    res.json({ shareToken: token });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};

// View shared trip (public, no auth needed)
exports.getSharedTrip = async (req, res) => {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token });
    if (!trip || !trip.shareEnabled)
      return res.status(404).json({ msg: "Shared trip not found or disabled" });

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Enable/Disable trip sharing
exports.toggleTripSharing = async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });

    if (!trip) {
      return res.status(403).json({ message: "Access denied" });
    }

    trip.shareEnabled = !trip.shareEnabled;

    await trip.save();

    res.json({
      shareEnabled: trip.shareEnabled,
    });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.status(500).send("Server error");
  }
};
