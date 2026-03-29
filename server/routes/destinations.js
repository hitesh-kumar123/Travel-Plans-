// routes/destinations.js
const router = require('express').Router();
const Destination = require('../models/Destination');

// Sab destinations
router.get('/', async (req, res) => {
  const { city, state, type } = req.query;
  let filter = {};
  if (city) filter.city = city;
  if (state) filter.state = state;
  if (type) filter.type = type;
  const data = await Destination.find(filter);
  res.json(data);
});

// Single destination by ID
router.get('/:id', async (req, res) => {
  const data = await Destination.findById(req.params.id);
  res.json(data);
});

module.exports = router;