import React, { useState, useEffect } from "react";
import {
  getRecentlyViewed,
  clearRecentlyViewed,
} from "../utils/recentlyViewed";

const RecentlyViewed = ({ onSelectDestination }) => {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    setDestinations(getRecentlyViewed());
  }, []);

  const handleClear = () => {
    clearRecentlyViewed();
    setDestinations([]);
  };

  if (destinations.length === 0) return null;

  return (
    <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem" }}>🕐</span>
          <h3
            style={{
              margin: 0,
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "#1A4A6B",
            }}
          >
            Recently Viewed
          </h3>
          <span
            style={{
              background: "#1A4A6B",
              color: "white",
              borderRadius: "999px",
              padding: "2px 8px",
              fontSize: "0.75rem",
              fontWeight: 600,
            }}
          >
            {destinations.length}
          </span>
        </div>
        <button
          onClick={handleClear}
          style={{
            background: "none",
            border: "1px solid #e0e0e0",
            borderRadius: "6px",
            padding: "4px 10px",
            cursor: "pointer",
            fontSize: "0.78rem",
            color: "#888",
          }}
        >
          Clear all
        </button>
      </div>

      {/* Scrollable Cards Row */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "0.5rem",
          scrollbarWidth: "thin",
        }}
      >
        {destinations.map((dest) => (
          <div
            key={dest._id}
            onClick={() => onSelectDestination && onSelectDestination(dest)}
            style={{
              minWidth: "160px",
              maxWidth: "160px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              cursor: "pointer",
              flexShrink: 0,
              background: "white",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
            }}
          >
            {/* Image */}
            <div
              style={{
                height: "100px",
                background: "linear-gradient(135deg, #1A4A6B, #2D7D9A)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {dest.images?.[0] && (
                <img
                  src={dest.images[0]}
                  alt={dest.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: "6px",
                  right: "6px",
                  background: "rgba(0,0,0,0.5)",
                  color: "white",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  fontSize: "0.7rem",
                }}
              >
                {dest.rating ? `⭐ ${dest.rating}` : "📍"}
              </div>
            </div>
            {/* Info */}
            <div style={{ padding: "0.6rem 0.75rem" }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  color: "#1A4A6B",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {dest.name}
              </div>
              <div
                style={{
                  fontSize: "0.72rem",
                  color: "#888",
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {[dest.city, dest.state].filter(Boolean).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
