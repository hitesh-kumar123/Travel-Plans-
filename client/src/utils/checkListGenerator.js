// Mock destination database for Travel Insights
export const DESTINATIONS_DB = [
  {
    name: "Dubai, UAE",
    flag: "🇦🇪",
    temp: "38°C",
    condition: "Hot & Sunny",
    weatherKey: "hot",
    recommended: [
      "Light cotton clothes",
      "Sunglasses",
      "Sunscreen",
      "Water bottle",
    ],
  },
  {
    name: "London, UK",
    flag: "🇬🇧",
    temp: "12°C",
    condition: "Cold & Rainy",
    weatherKey: "rain cold",
    recommended: [
      "Umbrella",
      "Waterproof jacket",
      "Scarf",
      "Comfortable walking shoes",
    ],
  },
  {
    name: "Paris, France",
    flag: "🇫🇷",
    temp: "20°C",
    condition: "Mild & Clear",
    weatherKey: "mild",
    recommended: ["Light jacket", "Comfortable shoes", "Camera", "Day bag"],
  },
  {
    name: "Tokyo, Japan",
    flag: "🇯🇵",
    temp: "25°C",
    condition: "Humid & Sunny",
    weatherKey: "warm humid",
    recommended: [
      "Breathable clothing",
      "Portable fan",
      "Comfortable sneakers",
      "Coin purse",
    ],
  },
  {
    name: "New York, USA",
    flag: "🇺🇸",
    temp: "22°C",
    condition: "Breezy",
    weatherKey: "mild",
    recommended: [
      "Walking shoes",
      "Layered clothing",
      "Reusable water bottle",
      "Backpack",
    ],
  },
];

export const generateChecklist = (destinationStr) => {
  if (!destinationStr) return { categories: null, insights: null };

  const destLower = destinationStr.toLowerCase();

  // Find mock insights if it matches our DB, else use a generic fallback
  const insights = DESTINATIONS_DB.find((d) =>
    destLower.includes(d.name.toLowerCase().split(",")[0]),
  ) || {
    name: destinationStr,
    flag: "🌍",
    temp: "24°C",
    condition: "Pleasant",
    weatherKey: "mild",
    recommended: [
      "Comfortable clothes",
      "Phone charger",
      "Travel adapter",
      "Water bottle",
    ],
  };

  const w = insights.weatherKey;

  // Base structured checklist
  const categories = {
    Documents: [
      { text: "Passport", checked: false },
      { text: "Tickets & Boarding Pass", checked: false },
      { text: "ID Card / Driver's License", checked: false },
    ],
    Clothing: [
      { text: "T-Shirts / Tops", checked: false },
      { text: "Pants / Shorts", checked: false },
      { text: "Underwear & Socks", checked: false },
      { text: "Comfortable Shoes", checked: false },
    ],
    Electronics: [
      { text: "Smartphone", checked: false },
      { text: "Phone Charger", checked: false },
      { text: "Power Bank", checked: false },
      { text: "Travel Adapter", checked: false },
    ],
    "Health & Safety": [
      { text: "Personal Medications", checked: false },
      { text: "First Aid Kit", checked: false },
      { text: "Hand Sanitizer", checked: false },
    ],
    Miscellaneous: [
      { text: "Toothbrush & Paste", checked: false },
      { text: "Deodorant", checked: false },
      { text: "Travel Pillow", checked: false },
    ],
  };

  // Logic based on destination
  if (!destLower.includes("india")) {
    categories["Documents"].push({ text: "Visa", checked: false });
    categories["Documents"].push({ text: "Travel Insurance", checked: false });
    categories["Documents"].push({
      text: "Forex Card / Local Currency",
      checked: false,
    });
  }

  // Logic based on weather
  if (w.includes("rain")) {
    categories["Miscellaneous"].push({ text: "Umbrella", checked: false });
    categories["Clothing"].push({
      text: "Raincoat / Waterproof Jacket",
      checked: false,
    });
  }

  if (w.includes("cold")) {
    categories["Clothing"].push({ text: "Winter Jacket", checked: false });
    categories["Clothing"].push({ text: "Thermal Wear", checked: false });
    categories["Clothing"].push({ text: "Gloves & Beanie", checked: false });
  }

  if (w.includes("hot") || w.includes("warm")) {
    categories["Clothing"].push({ text: "Sunglasses", checked: false });
    categories["Clothing"].push({ text: "Swimwear", checked: false });
    categories["Clothing"].push({ text: "Hat / Cap", checked: false });
    categories["Health & Safety"].push({ text: "Sunscreen", checked: false });
  }

  return { categories, insights };
};
