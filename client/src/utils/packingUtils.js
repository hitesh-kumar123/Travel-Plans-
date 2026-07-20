/**
 * Utility functions for generating dynamic packing checklists based on weather conditions
 */

export const generatePackingChecklist = (weatherData) => {
  if (!weatherData) return [];

  const {
    temperature,
    humidity,
    description = "",
    windSpeed = 0,
  } = weatherData;

  const checklist = [];
  const desc = description.toLowerCase();

  // Essential items for any trip
  checklist.push({
    id: "passport",
    item: "Passport/ID",
    category: "documents",
    icon: "📄",
    essential: true,
  });

  checklist.push({
    id: "phone-charger",
    item: "Portable Charger",
    category: "electronics",
    icon: "🔋",
    essential: true,
  });

  // Temperature-based recommendations
  if (temperature > 30) {
    // Hot weather
    checklist.push({
      id: "cotton-tshirts",
      item: "Cotton T-Shirts",
      category: "clothing",
      icon: "👕",
      reason: "Breathable fabric for hot weather",
    });

    checklist.push({
      id: "sunglasses",
      item: "Sunglasses",
      category: "accessories",
      icon: "🕶️",
      reason: "UV protection",
    });

    checklist.push({
      id: "sunscreen",
      item: "Sunscreen SPF 50+",
      category: "health",
      icon: "🧴",
      reason: "High UV protection needed",
    });

    checklist.push({
      id: "water-bottle",
      item: "Water Bottle",
      category: "essentials",
      icon: "💧",
      reason: "Stay hydrated in heat",
    });

    checklist.push({
      id: "cap",
      item: "Sun Hat/Cap",
      category: "accessories",
      icon: "🧢",
      reason: "Head protection from sun",
    });
  } else if (temperature > 20) {
    // Comfortable weather
    checklist.push({
      id: "casual-wear",
      item: "Casual Comfortable Clothes",
      category: "clothing",
      icon: "👚",
      reason: "Perfect weather for comfort",
    });

    checklist.push({
      id: "light-jacket",
      item: "Light Jacket",
      category: "clothing",
      icon: "🧥",
      reason: "For evening temperature drops",
    });
  } else if (temperature > 10) {
    // Cool weather
    checklist.push({
      id: "warm-layers",
      item: "Warm Layers",
      category: "clothing",
      icon: "🧥",
      reason: "Layering for changing temperatures",
    });

    checklist.push({
      id: "scarf",
      item: "Scarf",
      category: "accessories",
      icon: "🧣",
      reason: "Extra warmth for neck",
    });
  } else {
    // Cold weather
    checklist.push({
      id: "winter-coat",
      item: "Heavy Winter Coat",
      category: "clothing",
      icon: "🧥",
      reason: "Essential for cold weather",
    });

    checklist.push({
      id: "warm-clothes",
      item: "Thermal Wear",
      category: "clothing",
      icon: "🧣",
      reason: "Base layer for warmth",
    });

    checklist.push({
      id: "gloves",
      item: "Gloves",
      category: "accessories",
      icon: "🧤",
      reason: "Hand protection from cold",
    });
  }

  // Weather condition specific items
  if (
    desc.includes("rain") ||
    desc.includes("shower") ||
    desc.includes("drizzle")
  ) {
    checklist.push({
      id: "umbrella",
      item: "Umbrella",
      category: "weather-protection",
      icon: "☂️",
      reason: "Rain protection",
    });

    checklist.push({
      id: "raincoat",
      item: "Raincoat/Waterproof Jacket",
      category: "weather-protection",
      icon: "🧥",
      reason: "Stay dry during rainfall",
    });

    checklist.push({
      id: "waterproof-bag",
      item: "Waterproof Bag",
      category: "accessories",
      icon: "🎒",
      reason: "Protect electronics from water",
    });
  }

  if (desc.includes("snow")) {
    checklist.push({
      id: "snow-boots",
      item: "Waterproof Snow Boots",
      category: "footwear",
      icon: "👢",
      reason: "Traction and warmth in snow",
    });

    checklist.push({
      id: "warm-socks",
      item: "Wool Socks",
      category: "clothing",
      icon: "🧦",
      reason: "Keep feet warm and dry",
    });
  }

  // Humidity-based recommendations
  if (humidity > 80) {
    checklist.push({
      id: "moisture-wicking",
      item: "Moisture-Wicking Clothes",
      category: "clothing",
      icon: "👕",
      reason: "Handle high humidity",
    });

    checklist.push({
      id: "antifungal-powder",
      item: "Antifungal Powder",
      category: "health",
      icon: "🧴",
      reason: "Prevent skin issues in humidity",
    });
  }

  // Wind-based recommendations
  if (windSpeed > 10) {
    checklist.push({
      id: "windproof-jacket",
      item: "Windproof Jacket",
      category: "clothing",
      icon: "🧥",
      reason: "Protection from strong winds",
    });
  }

  // General travel essentials
  checklist.push({
    id: "walking-shoes",
    item: "Comfortable Walking Shoes",
    category: "footwear",
    icon: "👟",
    reason: "Essential for exploring",
  });

  if (temperature > 25 || humidity > 70) {
    checklist.push({
      id: "moisturizer",
      item: "Moisturizer",
      category: "health",
      icon: "🧴",
      reason: "Skin protection in dry/hot conditions",
    });
  }

  // Remove duplicates based on id
  const uniqueChecklist = checklist.filter(
    (item, index, self) => index === self.findIndex((t) => t.id === item.id),
  );

  return uniqueChecklist;
};

export const getPackingCategories = () => {
  return {
    documents: { name: "Documents", color: "#f56565" },
    clothing: { name: "Clothing", color: "#4299e1" },
    accessories: { name: "Accessories", color: "#48bb78" },
    health: { name: "Health & Care", color: "#ed8936" },
    electronics: { name: "Electronics", color: "#9f7aea" },
    essentials: { name: "Essentials", color: "#38b2ac" },
    "weather-protection": { name: "Weather Protection", color: "#3182ce" },
    footwear: { name: "Footwear", color: "#319795" },
  };
};
