import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TravelQuiz({ open, onClose }) {
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

  const handleClose = () => {
    setPreference("");
    setBudget("");
    setTravelStyle("");
    setResult("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="tq-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
        >
          <motion.div
            className="tq-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="tq-close" onClick={handleClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="tq-header">
              <div className="tq-badge">Quick Quiz</div>
              <h2>Find Your Dream Destination</h2>
              <p>Answer 3 quick questions and we'll match you with the perfect trip.</p>
            </div>

            {/* Preference */}
            <div className="tq-group">
              <h4>Mountains or Beaches?</h4>
              <div className="tq-options">
                <button
                  className={preference === "Mountain" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setPreference("Mountain")}
                >
                  🏔 Mountains
                </button>
                <button
                  className={preference === "Beach" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setPreference("Beach")}
                >
                  🏖 Beaches
                </button>
                <button
                  className={preference === "City" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setPreference("City")}
                >
                  🌆 Cities
                </button>
              </div>
            </div>

            {/* Budget */}
            <div className="tq-group">
              <h4>Budget or Luxury?</h4>
              <div className="tq-options">
                <button
                  className={budget === "Budget" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setBudget("Budget")}
                >
                  💰 Budget
                </button>
                <button
                  className={budget === "Luxury" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setBudget("Luxury")}
                >
                  💎 Luxury
                </button>
              </div>
            </div>

            {/* Travel Style */}
            <div className="tq-group">
              <h4>Solo or Group?</h4>
              <div className="tq-options">
                <button
                  className={travelStyle === "Solo" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setTravelStyle("Solo")}
                >
                  🧍 Solo
                </button>
                <button
                  className={travelStyle === "Group" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setTravelStyle("Group")}
                >
                  👨‍👩‍👧 Group
                </button>
                <button
                  className={travelStyle === "Couple" ? "tq-opt tq-opt--active" : "tq-opt"}
                  onClick={() => setTravelStyle("Couple")}
                >
                  ❤️ Couple
                </button>
              </div>
            </div>

            <button className="tq-submit" onClick={getRecommendation}>
              Get Recommendation
            </button>

            {result && (
              <motion.div
                className="tq-result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3>🎯 Recommended Destination</h3>
                <p>{result}</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
