// server/data/seed.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const destinations = require('./india_destinations.json');
const Destination = require('../models/Destination');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/traveldb';

mongoose.connect(URI)
  .then(async () => {
    try {
      await Destination.deleteMany();
      await Destination.insertMany(destinations);
      console.log('Done! Data seeded successfully to', URI);
      process.exit(0);
    } catch (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });