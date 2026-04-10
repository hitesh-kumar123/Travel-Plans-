// server/data/cleanAndSeed.js
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const rawData = require('./india_destinations.json');
const Destination = require('../models/Destination');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/traveldb';

// Unsplash images for Indian destinations (working, high quality)
const unsplashImages = {
  default: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
  jaipur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  palace: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  fort: 'https://images.unsplash.com/photo-1599661046227-4d1c87a5b9e1?auto=format&fit=crop&w=800&q=80',
  temple: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  museum: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80',
  garden: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80',
  lake: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=800&q=80',
  gate: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
  tomb: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
  market: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
};

// Destination-specific data fill-ins based on name matching
const knownDestinations = {
  'pink city': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'City', significance: 'Historical' },
  'albert hall': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Museum', significance: 'Archaeological' },
  'iswari minar': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Monument', significance: 'Historical' },
  'nahargarh': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Fort', significance: 'Historical' },
  'maharaniyon': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Monument', significance: 'Historical' },
  'maharaja sawai': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Heritage', significance: 'Historical' },
  'sawai mansingh': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Heritage', significance: 'Cultural' },
  'jaipur wax': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Museum', significance: 'Cultural' },
  'paanch batti': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Landmark', significance: 'Cultural' },
  'sunset point': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'ViewPoint', significance: 'Scenic' },
  'src museum': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Museum', significance: 'Cultural' },
  'wind palace': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Palace', significance: 'Historical' },
  'amrapali museum': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Museum', significance: 'Cultural' },
  'chhoti roundabout': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Landmark', significance: 'Cultural' },
  'turban museum': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Museum', significance: 'Cultural' },
  'rooftop view': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'ViewPoint', significance: 'Scenic' },
  'jewels gallery': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Gallery', significance: 'Cultural' },
  'sunrise point': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'ViewPoint', significance: 'Scenic' },
  'dune': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Nature', significance: 'Scenic' },
  'lake palace': { city: 'Udaipur', state: 'Rajasthan', zone: 'Northern', type: 'Palace', significance: 'Historical' },
  'sanganeri gate': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Gateway', significance: 'Historical' },
  'mubarak mahal': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Palace', significance: 'Historical' },
  'albert hall museum': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Museum', significance: 'Archaeological' },
  'moti doongri': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Fort', significance: 'Historical' },
  'royal gaitor': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Monument', significance: 'Historical' },
  'haveli': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Heritage', significance: 'Architectural' },
  'man gate': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Gateway', significance: 'Historical' },
  'diwan-i-khas': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Palace', significance: 'Historical' },
  'ajmeri gate': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Gateway', significance: 'Historical' },
  'chulgiri': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Temple', significance: 'Religious' },
  'sawai bhawani': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Tomb', significance: 'Historical' },
  'sawai man singh': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Tomb', significance: 'Historical' },
  'sawai madho': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Tomb', significance: 'Historical' },
  'sawai jai singh': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Tomb', significance: 'Historical' },
  'sawai pratap': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Tomb', significance: 'Historical' },
  'police shahid': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Memorial', significance: 'Historical' },
  'shaheed smarak': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Memorial', significance: 'Historical' },
  'suraj pol': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Gateway', significance: 'Historical' },
  'ram singh': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Tomb', significance: 'Historical' },
  'vidyadhar garden': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Garden', significance: 'Historical' },
  'sisodiya rani': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Garden', significance: 'Historical' },
  'nahargah fort': { city: 'Jaipur', state: 'Rajasthan', zone: 'Northern', type: 'Fort', significance: 'Historical' },
};

// Pick best Unsplash image based on type/name
function pickImage(name = '', type = '') {
  const nameLower = name.toLowerCase();
  const typeLower = type.toLowerCase();
  if (typeLower.includes('fort') || nameLower.includes('fort')) return unsplashImages.fort;
  if (typeLower.includes('palace') || nameLower.includes('palace') || nameLower.includes('mahal')) return unsplashImages.palace;
  if (typeLower.includes('temple') || nameLower.includes('temple') || nameLower.includes('jain')) return unsplashImages.temple;
  if (typeLower.includes('museum') || nameLower.includes('museum')) return unsplashImages.museum;
  if (typeLower.includes('garden') || nameLower.includes('garden') || nameLower.includes('bagh')) return unsplashImages.garden;
  if (typeLower.includes('lake') || nameLower.includes('lake')) return unsplashImages.lake;
  if (typeLower.includes('gate') || nameLower.includes('gate')) return unsplashImages.gate;
  if (typeLower.includes('tomb') || nameLower.includes('tomb')) return unsplashImages.tomb;
  if (typeLower.includes('market') || nameLower.includes('market') || nameLower.includes('bazaar')) return unsplashImages.market;
  return unsplashImages.jaipur;
}

// Find known data for a destination name
function findKnownData(name = '') {
  if (!name || name.toLowerCase() === 'nan') return null;
  const nameLower = name.toLowerCase();
  for (const [key, val] of Object.entries(knownDestinations)) {
    if (nameLower.includes(key)) return val;
  }
  return null;
}

// Clean a string value
function clean(val) {
  if (val === undefined || val === null) return undefined;
  const s = String(val).trim();
  if (s === '' || s.toLowerCase() === 'nan' || s.toLowerCase() === 'none') return undefined;
  return s;
}

// Process all records
const cleanedData = rawData.map((d, i) => {
  const name = clean(d.name);
  if (!name) return null; // Skip completely unnamed records

  const known = findKnownData(name);
  const type = clean(d.type) || known?.type;

  const cleaned = {
    name,
    city: clean(d.city) || known?.city || 'Jaipur',
    state: clean(d.state) || known?.state || 'Rajasthan',
    zone: clean(d.zone) || known?.zone || 'Northern',
    type: type,
    significance: clean(d.significance) || known?.significance,
    best_time_to_visit: clean(d.best_time_to_visit),
    dslr_allowed: clean(d.dslr_allowed),
    weekly_off: clean(d.weekly_off),
    establishment_year: clean(d.establishment_year),
    wikidata: clean(d.wikidata),
    wikipedia: clean(d.wikipedia),
  };

  // Rating
  const rating = parseFloat(d.rating);
  if (!isNaN(rating)) cleaned.rating = rating;

  // Entrance fee
  const fee = parseFloat(d.entrance_fee_inr);
  if (!isNaN(fee)) cleaned.entrance_fee_inr = fee;

  // Time needed
  const hrs = parseFloat(d.time_needed_hrs);
  if (!isNaN(hrs)) cleaned.time_needed_hrs = hrs;

  // Coordinates
  if (d.coordinates?.lat && d.coordinates?.lon) {
    const lat = parseFloat(d.coordinates.lat);
    const lon = parseFloat(d.coordinates.lon);
    if (!isNaN(lat) && !isNaN(lon)) cleaned.coordinates = { lat, lon };
  }

  // Images — use valid URLs or pick a good Unsplash fallback
  const validImgs = Array.isArray(d.images)
    ? d.images.filter(img => img && img.trim() !== '' && img.trim().toLowerCase() !== 'nan')
    : [];
  cleaned.images = validImgs.length > 0 ? validImgs : [pickImage(name, type || '')];

  // Remove undefined keys
  Object.keys(cleaned).forEach(k => cleaned[k] === undefined && delete cleaned[k]);

  return cleaned;
}).filter(Boolean);

console.log(`Original: ${rawData.length} | After clean: ${cleanedData.length}`);
const stillNan = cleanedData.filter(d => d.city === 'nan' || d.state === 'nan');
console.log(`Still with nan city/state: ${stillNan.length}`);
const noImages = cleanedData.filter(d => !d.images || d.images.length === 0);
console.log(`With no images: ${noImages.length}`);

mongoose.connect(URI)
  .then(async () => {
    await Destination.deleteMany();
    await Destination.insertMany(cleanedData);
    console.log(`✅ Done! ${cleanedData.length} clean destinations seeded!`);
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
