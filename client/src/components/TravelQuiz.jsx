import React, { useState } from "react";

export default function TravelQuiz() {
  const [preference, setPreference] = useState("");
  const [budget, setBudget] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [result, setResult] = useState("");

  const getRecommendation = () => {
    if (preference === "Beach" && budget === "Luxury") {
      setResult("🏝 Bali");
    } else if (preference === "Mountain" && budget === "Budget") {
      setResult("🏔 Manali");
    } else if (preference === "City") {
      setResult("🌆 Dubai");
    } else if (travelStyle === "Couple") {
      setResult("❤️ Maldives");
    } else {
      setResult("✈ Goa");
    }
  };

  return (
    <div className="travel-quiz">
      <h2>✨ Find Your Dream Destination</h2>

      {/* Preference */}
      <div className="quiz-group">
        <h4>Mountains or Beaches?</h4>

        <button
          className={
            preference === "Mountain"
              ? "quiz-option active"
              : "quiz-option"
          }
          onClick={() => setPreference("Mountain")}
        >
          🏔 Mountains
        </button>

        <button
          className={
            preference === "Beach"
              ? "quiz-option active"
              : "quiz-option"
          }
          onClick={() => setPreference("Beach")}
        >
          🏖 Beaches
        </button>

        <button
          className={
            preference === "City"
              ? "quiz-option active"
              : "quiz-option"
          }
          onClick={() => setPreference("City")}
        >
          🌆 Cities
        </button>
      </div>

      {/* Budget */}
      <div className="quiz-group">
        <h4>Budget or Luxury?</h4>

        <button
          className={
            budget === "Budget" ? "quiz-option active" : "quiz-option"
          }
          onClick={() => setBudget("Budget")}
        >
          💰 Budget
        </button>

        <button
          className={
            budget === "Luxury" ? "quiz-option active" : "quiz-option"
          }
          onClick={() => setBudget("Luxury")}
        >
          💎 Luxury
        </button>
      </div>

      {/* Travel Style */}
      <div className="quiz-group">
        <h4>Solo or Group?</h4>

        <button
          className={
            travelStyle === "Solo"
              ? "quiz-option active"
              : "quiz-option"
          }
          onClick={() => setTravelStyle("Solo")}
        >
          🧍 Solo
        </button>

        <button
          className={
            travelStyle === "Group"
              ? "quiz-option active"
              : "quiz-option"
          }
          onClick={() => setTravelStyle("Group")}
        >
          👨‍👩‍👧 Group
        </button>

        <button
          className={
            travelStyle === "Couple"
              ? "quiz-option active"
              : "quiz-option"
          }
          onClick={() => setTravelStyle("Couple")}
        >
          ❤️ Couple
        </button>
      </div>

      <button className="quiz-btn" onClick={getRecommendation}>
        Get Recommendation
      </button>

      {result && (
        <div className="quiz-result">
          <h3>🎯 Recommended Destination</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}