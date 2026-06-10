import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const CountryDropdownList = ({
  where,
  setWhere,
  destinations,
  setShowRecentSearches,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState({});
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!where || where.trim() === "") {
      setIsOpen(false);
      setFilteredCountries([]);
      return;
    }

    const query = where.toLowerCase().trim();

    const matches = destinations.filter(
      (d) =>
        (d.name || "").toLowerCase().includes(query) ||
        (d.city || "").toLowerCase().includes(query) ||
        (d.state || "").toLowerCase().includes(query) ||
        (d.category || "").toLowerCase().includes(query),
    );

    const uniqueNames = Array.from(
      new Set(matches.map((d) => d.name).filter(Boolean)),
    );

    if (uniqueNames.length > 0) {
      setFilteredCountries(uniqueNames.slice(0, 10));
      setIsOpen(true);
      setShowRecentSearches(false);
    } else {
      setIsOpen(false);
    }
    setFocusedIndex(-1);
  }, [where, destinations, setShowRecentSearches]);

  useEffect(() => {
    const updatePosition = () => {
      if (isOpen) {
        const inputEl = document.querySelector(
          ".wander-search-bar input.wander-sf-val",
        );
        if (inputEl) {
          const containerEl = inputEl.closest(".wander-sf");
          if (containerEl) {
            const rect = containerEl.getBoundingClientRect();
            setDropdownStyle({
              position: "absolute",
              top: rect.bottom + window.scrollY + 8 + "px",
              left: rect.left + window.scrollX + "px",
              width: rect.width + "px",
            });
          }
        }
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [isOpen, filteredCountries]);

  useEffect(() => {
    window.__countryDropdownOnKeyDown = (e) => {
      if (!isOpen || filteredCountries.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % filteredCountries.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedIndex(
          (prev) =>
            (prev - 1 + filteredCountries.length) % filteredCountries.length,
        );
      } else if (e.key === "Enter") {
        if (focusedIndex >= 0 && focusedIndex < filteredCountries.length) {
          e.preventDefault();
          const selected = filteredCountries[focusedIndex];
          setWhere(selected);
          setIsOpen(false);
        }
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    return () => {
      delete window.__countryDropdownOnKeyDown;
    };
  }, [isOpen, filteredCountries, focusedIndex, setWhere]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (!e.target.classList.contains("wander-sf-val")) {
          setIsOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen || filteredCountries.length === 0) return null;

  return createPortal(
    <div
      ref={dropdownRef}
      style={{
        ...dropdownStyle,
        background: "#ffffff",
        border: "1px solid rgba(26, 74, 107, 0.12)",
        borderRadius: "14px",
        boxShadow: "0 16px 40px rgba(15, 45, 64, 0.14)",
        zIndex: 9999,
        maxHeight: "250px",
        overflowY: "auto",
        padding: "0.5rem 0",
      }}
    >
      {filteredCountries.map((country, idx) => (
        <div
          key={country}
          onMouseDown={() => {
            setWhere(country);
            setIsOpen(false);
          }}
          onMouseEnter={() => setFocusedIndex(idx)}
          style={{
            padding: "0.9rem 1rem",
            cursor: "pointer",
            background:
              focusedIndex === idx ? "rgba(26, 74, 107, 0.05)" : "transparent",
            color: "#1a4a6b",
            fontWeight: 500,
            transition: "background 0.2s",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.95rem",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {country}
        </div>
      ))}
    </div>,
    document.body,
  );
};

export default CountryDropdownList;
