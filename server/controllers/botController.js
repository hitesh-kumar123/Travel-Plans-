const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Trip = require("../models/Trip");
const Expense = require("../models/Expense");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//load the uploaded JSON data
const destinationsData = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "../data/india_destinations.json"),
    "utf-8",
  ),
);

const MOCK_FLIGHTS = [
  { id: "f1", carrier: "IndiGo", price_inr: 5500, type: "Non-stop" },
  { id: "f2", carrier: "Air India", price_inr: 6200, type: "Non-stop" },
  { id: "f3", carrier: "Vistara", price_inr: 8500, type: "1 Stop" },
];

const MOCK_HOTELS = [
  {
    id: "h1",
    name: "Taj City Centre",
    rating: 4.8,
    price_per_night_inr: 12000,
  },
  {
    id: "h2",
    name: "Lemon Tree Premier",
    rating: 4.2,
    price_per_night_inr: 4500,
  },
  {
    id: "h3",
    name: "Zostel Backpackers",
    rating: 4.5,
    price_per_night_inr: 800,
  },
];

const mapCategory = (item) => {
  const lowerItem = item.toLowerCase();
  if (
    lowerItem.includes("flight") ||
    lowerItem.includes("auto") ||
    lowerItem.includes("cab") ||
    lowerItem.includes("train")
  )
    return "transport";
  if (lowerItem.includes("hotel") || lowerItem.includes("stay"))
    return "accommodation";
  if (lowerItem.includes("food") || lowerItem.includes("meal")) return "food";
  if (
    lowerItem.includes("ticket") ||
    lowerItem.includes("entry") ||
    lowerItem.includes("pass")
  )
    return "activities";
  return "other";
};

exports.getRecommendations = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const formattedHistory = history
      ? history.map((h) => `${h.role.toUpperCase()}: ${h.text}`).join("\n")
      : "";

    const prompt = `
      You are PackGo's travel bot. 
      Database: ${JSON.stringify(destinationsData.slice(0, 50))} 
      Flights: ${JSON.stringify(MOCK_FLIGHTS)}
      Hotels: ${JSON.stringify(MOCK_HOTELS)}
      
      Conversation History:
      ${formattedHistory}
      
      USER: "${message}"
      
      Instructions:
      1. If the user asks for a recommendation, pick from the Database, Flights, and Hotels.
      2. If the user asks about expenses or planning, explain the process. Ask them specifically where they want to roam locally (e.g., "If you are in Delhi, are you planning to visit Connaught Place or Hauz Khas?").
      3. If they provide local spots, estimate local travel, food, and ticket expenses realistically in INR.
      
      Return strictly a raw JSON object matching this structure (omit keys if not applicable):
      {
        "reply": "Conversational text addressing the user's prompt.",
        "destination": { "name": "Name", "city": "City", "rating": 4.5 },
        "flight": { "carrier": "Carrier", "price": 0000, "type": "Type" },
        "hotel": { "name": "Hotel", "pricePerNight": 0000, "rating": 4.0 },
        "expenses": [
           { "item": "Flight", "cost": 5500 },
           { "item": "Local Auto/Cab", "cost": 500 }
        ],
        "total_estimated_cost": 6000
      }
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const cleanJson = result.response
      .text()
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    res.status(200).json(JSON.parse(cleanJson));
  } catch (error) {
    console.error("BOT API ERROR:", error);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
};

exports.saveAiTrip = async (req, res) => {
  try {
    const { destination, flight, hotel, expenses, total_estimated_cost } =
      req.body;

    //Automate Trip Creation
    const newTrip = new Trip({
      user: req.user.id, // Provided by auth middleware
      destination: destination.city,
      description: `AI Planned trip to ${destination.name}`,
      budget: total_estimated_cost,
      status: "planned",
      accommodation: { name: hotel?.name || "Pending" },
      transportation: { type: "Flight", details: flight?.carrier || "Pending" },
    });
    const savedTrip = await newTrip.save();

    //Automate Expense Logging
    if (expenses && expenses.length > 0) {
      const expenseDocs = expenses.map((exp) => ({
        user: req.user.id,
        trip: savedTrip._id,
        amount: exp.cost,
        currency: "INR",
        category: mapCategory(exp.item),
        description: exp.item,
        date: new Date(), // Sets to today, user can edit later
      }));
      await Expense.insertMany(expenseDocs);
    }

    res.status(201).json({
      message: "Trip & Expenses automated successfully!",
      tripId: savedTrip._id,
    });
  } catch (error) {
    console.error("Save Error:", error);
    res.status(500).json({ error: "Failed to automate trip saving." });
  }
};
