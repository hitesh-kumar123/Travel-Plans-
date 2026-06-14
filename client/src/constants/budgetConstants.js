// ─── Budget Calculator Constants ───────────────────────────────────────────
// Base daily rates in INR per person. These are reasonable mid-range defaults.
// In v2, replace with API call to GET /api/budget/estimate which reads
// cost_index from the Destination model.

export const DESTINATION_BASE_RATES = {
  // Tier 1 – Budget destinations (smaller cities, rural, domestic)
  budget: {
    accommodation: 600, // per room per night
    food: 350, // per person per day
    activities: 250, // per person per day
  },
  // Tier 2 – Standard destinations (popular domestic metros)
  standard: {
    accommodation: 1800,
    food: 700,
    activities: 600,
  },
  // Tier 3 – Premium destinations (international / luxury domestic)
  premium: {
    accommodation: 5000,
    food: 1800,
    activities: 1500,
  },
};

// Multipliers applied on top of the base accommodation rate
export const ACCOMMODATION_MULTIPLIERS = {
  hostel: { label: "Budget hostel", multiplier: 0.4 },
  standard: { label: "Standard hotel", multiplier: 1.0 },
  luxury: { label: "Luxury resort", multiplier: 3.5 },
};

// Flat transport costs per person (one-way, doubled for return)
export const TRANSPORT_OPTIONS = [
  { key: "bus", label: "Bus / Train", icon: "ti-bus", costPerPerson: 800 },
  { key: "flight", label: "Flights", icon: "ti-plane", costPerPerson: 4500 },
  { key: "car", label: "Self Drive", icon: "ti-car", costPerPerson: 2000 },
  { key: "cruise", label: "Cruise", icon: "ti-ship", costPerPerson: 12000 },
];

// Activity cost per person per day
export const ACTIVITY_OPTIONS = [
  {
    key: "sightseeing",
    label: "Sightseeing",
    icon: "ti-binoculars",
    costPerPersonPerDay: 300,
  },
  {
    key: "adventure",
    label: "Adventure",
    icon: "ti-kayak",
    costPerPersonPerDay: 1200,
  },
  {
    key: "cultural",
    label: "Cultural",
    icon: "ti-building-arch",
    costPerPersonPerDay: 500,
  },
  {
    key: "relaxation",
    label: "Relaxation",
    icon: "ti-beach",
    costPerPersonPerDay: 200,
  },
];

export const FOOD_RANGE = { min: 200, max: 4000, step: 50, default: 600 };
export const DAYS_RANGE = { min: 1, max: 60, step: 1, default: 5 };
export const PAX_RANGE = { min: 1, max: 20, step: 1, default: 2 };

// Contingency buffer percentage added to total
export const BUFFER_PERCENT = 0.1;

// Tier name shown in the quick-range summary
export const TIER_MULTIPLIERS = { budget: 0.55, standard: 1.0, luxury: 3.2 };
