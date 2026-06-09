import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaCloudSun,
  FaClipboardList,
  FaCheck,
} from "react-icons/fa";
import { generateChecklist } from "../utils/checkListGenerator";

export default function TravelChecklist() {
  const [destination, setDestination] = useState("");
  const [weather, setWeather] = useState("");
  const [list, setList] = useState([]);

  const handleGenerate = (e) => {
    if (e) e.preventDefault();
    if (!destination.trim()) return;

    let mockWeather = "sunny";
    const dest = destination.toLowerCase();

    if (dest.includes("london")) {
      mockWeather = "cold rain";
    } else if (dest.includes("dubai")) {
      mockWeather = "hot";
    }

    setWeather(mockWeather);

    const result = generateChecklist(destination, mockWeather);
    setList(result.map((item) => ({ text: item, checked: false })));
  };

  const toggleItem = (index) => {
    setList((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, checked: !item.checked } : item,
      ),
    );
  };

  const completedCount = list.filter((item) => item.checked).length;
  const totalCount = list.length;
  const percentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a4a6b, #0f2f47)",
          color: "#fff",
          padding: "clamp(32px, 5vw, 48px) 20px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <Link
          to="/"
          style={{
            position: "absolute",
            left: "clamp(16px, 4vw, 32px)",
            top: "50%",
            transform: "translateY(-50%)",
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
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            margin: "0 0 8px",
            fontWeight: 700,
          }}
        >
          Travel Checklist Generator
        </h1>
        <p
          style={{
            margin: 0,
            opacity: 0.9,
            fontSize: "clamp(0.9rem, 2.5vw, 1.05rem)",
            maxWidth: "600px",
            marginInline: "auto",
          }}
        >
          Enter your destination to automatically generate a smart packing and
          preparation checklist based on location and weather.
        </p>
      </div>

      {/* Main Container */}
      <div
        style={{
          maxWidth: "800px",
          margin: "-24px auto 48px",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
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
          <form
            onSubmit={handleGenerate}
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: "250px" }}>
              <input
                value={destination}
                placeholder="Where are you going? (e.g., London, Dubai, Paris)"
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#1a4a6b";
                  e.target.style.boxShadow = "0 0 0 3px rgba(26,74,107,0.15)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#cbd5e1";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "14px 28px",
                border: "none",
                borderRadius: "10px",
                background: "#ff6b57",
                color: "#fff",
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.2s, transform 0.1s",
                flexShrink: 0,
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
        {list.length > 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
            }}
          >
            {/* Destination Info and Weather */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
                paddingBottom: "20px",
                borderBottom: "1px solid #f1f5f9",
                marginBottom: "20px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: "0 0 4px",
                    color: "#1a4a6b",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                  }}
                >
                  Trip Checklist for {destination}
                </h2>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.9rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <FaClipboardList /> Keep track of your packing status
                </div>
              </div>

              {weather && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background: "#f0fdf4",
                    color: "#166534",
                    borderRadius: "20px",
                    border: "1px solid #bbf7d0",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  <FaCloudSun
                    style={{ fontSize: "1.1rem", color: "#15803d" }}
                  />
                  <span>Weather: {weather}</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#475569",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                <span>Packing Progress</span>
                <span>
                  {percentage}% ({completedCount}/{totalCount} items)
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "8px",
                  background: "#f1f5f9",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percentage}%`,
                    height: "100%",
                    background: percentage === 100 ? "#22c55e" : "#ff6b57",
                    borderRadius: "4px",
                    transition: "width 0.3s ease-in-out, background-color 0.3s",
                  }}
                />
              </div>
            </div>

            {/* Checklist Items */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {list.map((item, i) => (
                <div
                  key={i}
                  onClick={() => toggleItem(i)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "14px 16px",
                    background: item.checked ? "#f8fafc" : "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e2e8f0",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: item.checked
                      ? "none"
                      : "0 2px 4px rgba(0,0,0,0.02)",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "6px",
                      border: `2px solid ${item.checked ? "#22c55e" : "#94a3b8"}`,
                      background: item.checked ? "#22c55e" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "10px",
                      transition: "all 0.15s",
                    }}
                  >
                    {item.checked && <FaCheck />}
                  </div>
                  <span
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: item.checked ? "#94a3b8" : "#334155",
                      textDecoration: item.checked ? "line-through" : "none",
                      transition: "color 0.15s",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "48px 24px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              border: "1px solid #e2e8f0",
              color: "#64748b",
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
