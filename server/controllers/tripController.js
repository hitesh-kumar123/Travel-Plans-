const Trip = require("../models/Trip");
const Destination = require("../models/Destination");
const Expense = require("../models/Expense");
const { sendError, sendServerError } = require("../utils/apiResponse");

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

    // Default images
    let images = [];
    if (destination) {
      // Find destination in DB by name case-insensitively
      const dest = await Destination.findOne({
        name: { $regex: new RegExp(`^${destination}$`, "i") },
      });
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
      budget: budget || 0,
      status: status || "planned",
      activities,
      accommodation,
      transportation,
    });

    const trip = await newTrip.save();
    res.json(trip);
  } catch (err) {
    return sendServerError(res, err);
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
    return sendServerError(res, err);
  }
};

// Get a specific trip
exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return sendError(res, 404, "Trip not found");
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return sendError(res, 401, "User not authorized");
    }

    res.json(trip);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 404, "Trip not found");
    }
    return sendServerError(res, err);
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    let trip = await Trip.findById(req.params.id);

    if (!trip) {
      return sendError(res, 404, "Trip not found");
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return sendError(res, 401, "User not authorized");
    }

    const updateData = { ...req.body, updatedAt: Date.now() };

    // Update images if destination changed
    if (updateData.destination && updateData.destination !== trip.destination) {
      const dest = await Destination.findOne({
        name: { $regex: new RegExp(`^${updateData.destination}$`, "i") },
      });
      if (dest && dest.images && dest.images.length > 0) {
        updateData.images = dest.images;
      }
    }

    trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
    );

    res.json(trip);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 404, "Trip not found");
    }
    return sendServerError(res, err);
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return sendError(res, 404, "Trip not found");
    }

    // Make sure user owns the trip
    if (trip.user.toString() !== req.user.id) {
      return sendError(res, 401, "User not authorized");
    }

    // Also delete all expenses for this trip
    await Expense.deleteMany({ trip: req.params.id });
    await trip.deleteOne();
      res.json({ success: true, message: "Trip removed" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return sendError(res, 404, "Trip not found");
    }
    return sendServerError(res, err);
  }
};
