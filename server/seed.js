const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Destination = require('./models/Destination');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB...");

    try {
      // Read destinations data
      const dataPath = path.join(__dirname, 'data', 'india_destinations.json');
      const rawData = fs.readFileSync(dataPath, 'utf-8');
      const destinations = JSON.parse(rawData);

      // Clear existing records
      await Destination.deleteMany({});
      console.log("Cleared existing destinations from the database.");

      // Insert new records
      await Destination.insertMany(destinations);
      console.log(`Successfully inserted ${destinations.length} destinations into the database!`);
    } catch (error) {
      console.error("Error seeding the database:", error);
    } finally {
      process.exit(0);
    }
  })
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err);
    process.exit(1);
  });
