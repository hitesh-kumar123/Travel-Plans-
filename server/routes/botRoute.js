const express = require('express');
const router = express.Router();
const { getRecommendations, saveAiTrip } = require('../controllers/botController');

router.post('/recommend', getRecommendations);
router.post('/save-trip', saveAiTrip); 

module.exports = router;