import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudSun,
  FaClipboardList,
  FaCheck,
  FaMapMarkerAlt,
  FaThermometerHalf,
  FaPassport,
  FaTshirt,
  FaMobileAlt,
  FaMedkit,
  FaEllipsisH,
} from "react-icons/fa";
import {
  generateChecklist,
  DESTINATIONS_DB,
} from "../utils/checkListGenerator";

const categoryIcons = {
  Documents: <FaPassport />,
  Clothing: <FaTshirt />,
  Electronics: <FaMobileAlt />,
  "Health & Safety": <FaMedkit />,
  Miscellaneous: <FaEllipsisH />,
};

export default function TravelChecklist() {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [insights, setInsights] = useState(null);
  const [categories, setCategories] = useState(null);

  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setDestination(val);
    if (val.trim()) {
      const filtered = DESTINATIONS_DB.filter((d) =>
        d.name.toLowerCase().includes(val.toLowerCase()),
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (name) => {
    setDestination(name);
    setShowSuggestions(false);
  };

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!destination.trim()) return;

    setShowSuggestions(false);

    const result = generateChecklist(destination);
    setCategories(result.categories);
    setInsights(result.insights);
  };

  const toggleItem = (categoryName, itemIndex) => {
    setCategories((prev) => {
      const newCats = { ...prev };
      newCats[categoryName] = newCats[categoryName].map((item, idx) =>
        idx === itemIndex ? { ...item, checked: !item.checked } : item,
      );
      return newCats;
    });
  };

  // Calculate progress
  let completedCount = 0;
  let totalCount = 0;

  if (categories) {
    Object.values(categories).forEach((catItems) => {
      totalCount += catItems.length;
      completedCount += catItems.filter((item) => item.checked).length;
    });
  }

  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      className="travel-checklist-page"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>
        {`
          .tcl-main-container {
            max-width: 1000px;
            margin: -32px auto 48px;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            gap: 24px;
            position: relative;
            z-index: 10;
          }
          .tcl-content-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 24px;
            align-items: start;
          }
          .tcl-form-container {
            display: flex;
            gap: 16px;
            align-items: stretch;
          }
          .tcl-progress-sticky {
            position: sticky;
            top: 20px;
            z-index: 5;
          }
          @media (max-width: 768px) {
            .tcl-content-grid {
              grid-template-columns: 1fr;
            }
            .tcl-form-container {
              flex-direction: column;
            }
            .tcl-progress-sticky {
              position: static;
            }
            .tcl-header {
              padding: 24px 20px 48px !important;
            }
          }
          .tcl-header {
            background: linear-gradient(135deg, #1a4a6b, #0f2f47);
            color: #fff;
            padding: clamp(24px, 4vw, 32px) 20px clamp(48px, 6vw, 64px);
            text-align: center;
            position: relative;
          }
          .autocomplete-dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #fff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            margin-top: 8px;
            z-index: 100;
            max-height: 200px;
            overflow-y: auto;
          }
          .autocomplete-item {
            padding: 12px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.2s;
            color: #334155;
            font-size: 0.95rem;
          }
          .autocomplete-item:hover {
            background: #f1f5f9;
          }
          .autocomplete-item:not(:last-child) {
            border-bottom: 1px solid #f1f5f9;
          }
        `}
      </style>

      {/* Header */}
      <div className="tcl-header">
        <Link
          to="/"
          style={{
            position: "absolute",
            left: "clamp(16px, 4vw, 32px)",
            top: "24px",
            color: "#fff",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.95rem",
            fontWeight: 500,
            opacity: 0.9,
            transition: "opacity 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "0.9")}
        >
          <FaArrowLeft /> Back to Home
        </Link>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            margin: "0 0 8px",
            fontWeight: 700,
            marginTop: "24px",
          }}
        >
          Travel Checklist Generator
        </h1>
        <p
          style={{
            margin: 0,
            opacity: 0.9,
            fontSize: "clamp(0.9rem, 2vw, 1rem)",
            maxWidth: "600px",
            marginInline: "auto",
          }}
        >
          Enter your destination to automatically generate a smart packing and
          preparation checklist based on location and weather.
        </p>
      </div>

      {/* Main Container */}
      <div className="tcl-main-container">
        {/* Input Form Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid #e2e8f0",
          }}
        >
          <form onSubmit={handleGenerate} className="tcl-form-container">
            <div
              style={{
                flex: 1,
                minWidth: "250px",
                display: "flex",
                flexDirection: "column",
                position: "relative",
              }}
              ref={dropdownRef}
            >
              <input
                value={destination}
                placeholder="Where are you going? (e.g., London, Dubai, Paris)"
                onChange={handleInputChange}
                onFocus={() => destination.trim() && setShowSuggestions(true)}
                style={{
                  width: "100%",
                  height: "52px",
                  padding: "0 16px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
              />
              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="autocomplete-dropdown">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="autocomplete-item"
                      onClick={() => handleSelectSuggestion(item.name)}
                    >
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              style={{
                height: "52px",
                padding: "0 28px",
                border: "none",
                borderRadius: "10px",
                background: "#ff6b57",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s, transform 0.1s",
                flexShrink: 0,
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#fa5a44")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#ff6b57")
              }
            >
              Generate Checklist
            </button>
          </form>
        </div>

        {/* Results Section */}
        {categories ? (
          <div className="tcl-content-grid">
            {/* Left Column: Checklist */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {Object.entries(categories).map(([categoryName, items]) => {
                if (items.length === 0) return null;
                return (
                  <div
                    key={categoryName}
                    style={{
                      background: "#fff",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h3
                      style={{
                        margin: "0 0 16px",
                        color: "#1a4a6b",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "12px",
                      }}
                    >
                      {categoryIcons[categoryName]} {categoryName}
                    </h3>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {items.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => toggleItem(categoryName, i)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            padding: "16px",
                            background: item.checked ? "#f8fafc" : "#fff",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: item.checked
                              ? "none"
                              : "0 2px 6px rgba(0,0,0,0.02)",
                            userSelect: "none",
                          }}
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "6px",
                              border: `2px solid ${item.checked ? "#22c55e" : "#94a3b8"}`,
                              background: item.checked
                                ? "#22c55e"
                                : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#fff",
                              fontSize: "12px",
                              transition: "all 0.15s",
                            }}
                          >
                            {item.checked && <FaCheck />}
                          </div>
                          <span
                            style={{
                              fontSize: "1rem",
                              fontWeight: 500,
                              color: item.checked ? "#94a3b8" : "#334155",
                              textDecoration: item.checked
                                ? "line-through"
                                : "none",
                              transition: "color 0.15s",
                            }}
                          >
                            {item.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Insights & Progress */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
              className="tcl-progress-sticky"
            >
              {/* Progress Card */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                    color: "#1a4a6b",
                    marginBottom: "16px",
                    fontSize: "1.1rem",
                  }}
                >
                  🎒 Packing Progress
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "10px",
                    background: "#f1f5f9",
                    borderRadius: "5px",
                    overflow: "hidden",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: `${percentage}%`,
                      height: "100%",
                      background: percentage === 100 ? "#22c55e" : "#ff6b57",
                      borderRadius: "5px",
                      transition:
                        "width 0.4s ease-in-out, background-color 0.4s",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#64748b",
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  <span>
                    {completedCount} of {totalCount} items packed
                  </span>
                  <span
                    style={{
                      color: percentage === 100 ? "#22c55e" : "#ff6b57",
                      fontWeight: 700,
                    }}
                  >
                    {percentage}%
                  </span>
                </div>
              </div>

              {/* Insights Card */}
              {insights && (
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom right, #ffffff, #f8fafc)",
                    borderRadius: "16px",
                    padding: "24px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <h3
                    style={{
                      margin: "0 0 16px",
                      color: "#1a4a6b",
                      fontSize: "1.1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FaCloudSun /> Travel Insights
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaMapMarkerAlt style={{ color: "#ff6b57" }} />
                      <span style={{ fontWeight: 600, color: "#334155" }}>
                        {insights.name} {insights.flag}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaThermometerHalf style={{ color: "#ff6b57" }} />
                      <span style={{ fontWeight: 600, color: "#334155" }}>
                        {insights.temp}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <FaCloudSun style={{ color: "#ff6b57" }} />
                      <span style={{ fontWeight: 600, color: "#334155" }}>
                        {insights.condition}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: "20px",
                      paddingTop: "16px",
                      borderTop: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "12px",
                      }}
                    >
                      Recommended
                    </div>
                    <ul
                      style={{
                        margin: 0,
                        padding: 0,
                        listStyle: "none",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {insights.recommended.map((req, i) => (
                        <li
                          key={i}
                          style={{
                            fontSize: "0.9rem",
                            color: "#334155",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span style={{ color: "#22c55e" }}>✓</span> {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "64px 24px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px dashed #cbd5e1",
              color: "#64748b",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "250px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "rgba(255, 107, 87, 0.1)",
                color: "#ff6b57",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontSize: "1.5rem",
              }}
            >
              <FaClipboardList />
            </div>
            <h3
              style={{
                color: "#1a4a6b",
                margin: "0 0 8px",
                fontSize: "1.15rem",
                fontWeight: 700,
              }}
            >
              No Checklist Generated Yet
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                maxWidth: "400px",
                marginInline: "auto",
                lineHeight: 1.5,
              }}
            >
              Enter a destination above and click Generate to see a custom
              travel list tailored to weather conditions.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
