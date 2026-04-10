const Trip = require("../models/Trip");
const Destination = require("../models/Destination");

// Create new trip
exports.createTrip = async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      description,
      activities,
      accommodation,
      transportation,
    } = req.body;

    // Default images
    let images = [];
    if (destination) {
      // Find destination in DB by name case-insensitively
      const dest = await Destination.findOne({ name: { $regex: new RegExp(`^${destination}$`, "i") } });
      if (dest && dest.images && dest.images.length > 0) {
        images = dest.images;
      }
    }

    const newTrip = new Trip({
      user: req.user.id,
      destination,
      images,
      startDate,
      endDate,
      description,
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
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(500).send("Server error");
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    const updateData = { ...req.body, updatedAt: Date.now() };

    // Update images if destination changed
    if (updateData.destination && updateData.destination !== trip.destination) {
      const dest = await Destination.findOne({ name: { $regex: new RegExp(`^${updateData.destination}$`, "i") } });
      if (dest && dest.images && dest.images.length > 0) {
        updateData.images = dest.images;
      }
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.json(trip);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(500).send("Server error");
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await trip.remove();
    res.json({ msg: "Trip removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Trip not found" });
    }
    res.status(500).send("Server error");
  }
};
