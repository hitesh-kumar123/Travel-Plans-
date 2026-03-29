// models/Destination.js
const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: String,
  city: String,
  state: String,
  zone: String,
  coordinates: {
    lat: Number,
    lon: Number
  },
  type: String,
  significance: String,
  rating: Number,
  entrance_fee_inr: Number,
  best_time_to_visit: String,
  time_needed_hrs: Number,
  dslr_allowed: String,
  weekly_off: String,
  establishment_year: String,
  wikidata: String,
  wikipedia: String,
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);