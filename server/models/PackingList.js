const mongoose = require("mongoose");

const packingItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, "Item name cannot exceed 200 characters"],
    },
    category: {
      type: String,
      enum: [
        "Clothing",
        "Toiletries",
        "Electronics",
        "Documents",
        "Medicine",
        "Other",
      ],
      default: "Other",
    },
    packed: { type: Boolean, default: false },
  },
  { _id: true },
);

const packingListSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      unique: true, // one list per trip
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [packingItemSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("PackingList", packingListSchema);
