/**
 * Utility functions for generating AI activity recommendations based on weather
 */

export const generateActivityRecommendations = (weatherData) => {
  if (!weatherData) return { recommended: [], avoid: [] };

  const {
    temperature,
    humidity,
    description = "",
    windSpeed = 0,
  } = weatherData;

  const desc = description.toLowerCase();
  const recommended = [];
  const avoid = [];

  // Temperature-based recommendations
  if (temperature >= 30) {
    // Hot weather - indoor/water activities recommended
    recommended.push({
      id: "shopping",
      name: "Shopping",
      icon: "🛍️",
      category: "indoor",
      reason: "Air-conditioned comfort",
    });

    recommended.push({
      id: "museum",
      name: "Museum Visits",
      icon: "🏛️",
      category: "indoor",
      reason: "Cool indoor environment",
    });

    recommended.push({
      id: "swimming",
      name: "Swimming",
      icon: "🏊",
      category: "water",
      reason: "Beat the heat",
    });

    recommended.push({
      id: "water-sports",
      name: "Water Sports",
      icon: "🏄",
      category: "water",
      reason: "Stay cool while active",
    });

    // Avoid strenuous outdoor activities in heat
    avoid.push({
      id: "hiking",
      name: "Hiking",
      icon: "🥾",
      category: "outdoor",
      reason: "Risk of heat exhaustion",
    });

    avoid.push({
      id: "cycling",
      name: "Cycling",
      icon: "🚴",
      category: "outdoor",
      reason: "Too hot for extended outdoor exercise",
    });
  } else if (temperature >= 20) {
    // Pleasant weather - outdoor activities great
    recommended.push({
      id: "walking-tours",
      name: "Walking Tours",
      icon: "🚶",
      category: "outdoor",
      reason: "Perfect walking weather",
    });

    recommended.push({
      id: "photography",
      name: "Photography",
      icon: "📸",
      category: "outdoor",
      reason: "Great lighting conditions",
    });

    recommended.push({
      id: "cycling",
      name: "Cycling",
      icon: "🚴",
      category: "outdoor",
      reason: "Ideal temperature for biking",
    });

    recommended.push({
      id: "picnic",
      name: "Outdoor Dining",
      icon: "🍽️",
      category: "outdoor",
      reason: "Comfortable outdoor conditions",
    });
  } else if (temperature >= 10) {
    // Cool weather - moderate activities
    recommended.push({
      id: "walking",
      name: "Casual Walking",
      icon: "🚶",
      category: "outdoor",
      reason: "Refreshing cool weather",
    });

    recommended.push({
      id: "cafe-hopping",
      name: "Café Hopping",
      icon: "☕",
      category: "indoor",
      reason: "Warm drinks on cool day",
    });

    avoid.push({
      id: "water-activities",
      name: "Water Activities",
      icon: "🏊",
      category: "water",
      reason: "Too cold for water sports",
    });
  } else {
    // Cold weather - indoor activities recommended
    recommended.push({
      id: "museums",
      name: "Indoor Museums",
      icon: "🏛️",
      category: "indoor",
      reason: "Warm indoor environment",
    });

    recommended.push({
      id: "shopping-malls",
      name: "Shopping Centers",
      icon: "🏬",
      category: "indoor",
      reason: "Heated indoor spaces",
    });

    recommended.push({
      id: "restaurants",
      name: "Restaurant Dining",
      icon: "🍽️",
      category: "indoor",
      reason: "Warm meals and atmosphere",
    });

    avoid.push({
      id: "outdoor-sports",
      name: "Outdoor Sports",
      icon: "⚽",
      category: "outdoor",
      reason: "Too cold for extended outdoor activities",
    });
  }

  // Weather condition specific recommendations
  if (
    desc.includes("rain") ||
    desc.includes("storm") ||
    desc.includes("shower")
  ) {
    recommended.push({
      id: "indoor-entertainment",
      name: "Indoor Entertainment",
      icon: "🎭",
      category: "indoor",
      reason: "Stay dry and entertained",
    });

    recommended.push({
      id: "spa-wellness",
      name: "Spa & Wellness",
      icon: "💆",
      category: "indoor",
      reason: "Perfect rainy day activity",
    });

    // Avoid most outdoor activities in rain
    avoid.push({
      id: "outdoor-sightseeing",
      name: "Outdoor Sightseeing",
      icon: "🏞️",
      category: "outdoor",
      reason: "Rain will affect visibility and comfort",
    });

    avoid.push({
      id: "beach-activities",
      name: "Beach Activities",
      icon: "🏖️",
      category: "outdoor",
      reason: "Unpleasant in rainy conditions",
    });
  } else if (desc.includes("snow")) {
    recommended.push({
      id: "winter-sports",
      name: "Winter Sports",
      icon: "⛷️",
      category: "outdoor",
      reason: "Perfect snow conditions",
    });

    recommended.push({
      id: "hot-drinks",
      name: "Warm Cafés",
      icon: "🍵",
      category: "indoor",
      reason: "Cozy atmosphere in snowy weather",
    });
  } else if (desc.includes("clear") || desc.includes("sunny")) {
    recommended.push({
      id: "sightseeing",
      name: "Sightseeing",
      icon: "🏛️",
      category: "outdoor",
      reason: "Excellent visibility and lighting",
    });

    recommended.push({
      id: "outdoor-photography",
      name: "Outdoor Photography",
      icon: "📷",
      category: "outdoor",
      reason: "Perfect natural lighting",
    });
  }

  // High humidity considerations
  if (humidity >= 80) {
    recommended.push({
      id: "air-conditioned-venues",
      name: "Air-Conditioned Venues",
      icon: "❄️",
      category: "indoor",
      reason: "Escape high humidity",
    });

    avoid.push({
      id: "strenuous-activities",
      name: "Strenuous Physical Activities",
      icon: "🏃",
      category: "outdoor",
      reason: "High humidity makes exercise difficult",
    });
  }

  // High wind considerations
  if (windSpeed >= 15) {
    avoid.push({
      id: "umbrella-tours",
      name: "Umbrella Tours",
      icon: "☂️",
      category: "outdoor",
      reason: "Strong winds make umbrellas ineffective",
    });

    avoid.push({
      id: "boat-trips",
      name: "Boat Trips",
      icon: "⛵",
      category: "water",
      reason: "Rough conditions due to strong winds",
    });
  }

  // Remove duplicates and ensure variety
  const uniqueRecommended = removeDuplicates(recommended);
  const uniqueAvoid = removeDuplicates(avoid);

  return {
    recommended: uniqueRecommended.slice(0, 6), // Limit to 6 recommendations
    avoid: uniqueAvoid.slice(0, 4), // Limit to 4 avoid items
  };
};

const removeDuplicates = (activities) => {
  const seen = new Set();
  return activities.filter((activity) => {
    if (seen.has(activity.id)) {
      return false;
    }
    seen.add(activity.id);
    return true;
  });
};

export const getActivityCategories = () => {
  return {
    indoor: { name: "Indoor", color: "#4299e1", icon: "🏠" },
    outdoor: { name: "Outdoor", color: "#48bb78", icon: "🌳" },
    water: { name: "Water Activities", color: "#38b2ac", icon: "💧" },
    cultural: { name: "Cultural", color: "#9f7aea", icon: "🎭" },
    adventure: { name: "Adventure", color: "#ed8936", icon: "⚡" },
    relaxation: { name: "Relaxation", color: "#f56565", icon: "😌" },
  };
};
