import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../pages/Home.css";

const Navbar = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ═══ NAVBAR ═══ */}
      <nav className={`wander-nav ${scrolled ? "wander-nav-scrolled" : ""}`}>
        <Link to="/" className="wander-logo">
          Pack<span>Go</span>
        </Link>

        <ul className="wander-nav-links">
          <li>
            <Link to="/#wander-dest-section">Destinations</Link>
          </li>
          <li>
            <Link to="/#wander-features">Experiences</Link>
          </li>
          <li>
            <Link to="/#wander-features">Features</Link>
          </li>
          {isAuthenticated && (
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>

        {isAuthenticated ? (
          <Link to="/dashboard">
            <button className="wander-nav-cta">My Dashboard</button>
          </Link>
        ) : (
          <Link to="/register">
            <button className="wander-nav-cta">Book Now</button>
          </Link>
        )}

        <button
          className="wander-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          style={{
            background: "var(--white)",
            borderBottom: "0.5px solid rgba(26,74,107,0.12)",
            padding: "1rem 1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 999,
          }}
        >
          <Link
            to="/"
            style={{
              color: "var(--ocean)",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onClick={() => setMobileOpen(false)}
          >
            Destinations
          </Link>
          <Link
            to="/"
            style={{
              color: "var(--ocean)",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onClick={() => setMobileOpen(false)}
          >
            Features
          </Link>
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              style={{
                color: "var(--coral)",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onClick={() => setMobileOpen(false)}
            >
              Dashboard →
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                style={{ color: "var(--ocean)", textDecoration: "none" }}
                onClick={() => setMobileOpen(false)}
              >
                Log In
              </Link>
              <Link
                to="/register"
                style={{
                  color: "var(--coral)",
                  fontWeight: 600,
                  textDecoration: "none",
                }}
                onClick={() => setMobileOpen(false)}
              >
                Sign Up Free →
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
