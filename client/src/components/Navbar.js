import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const getHref = (hash) => {
    return isHomePage ? hash : `/${hash}`;
  };

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
            <a href={getHref("#wander-dest-section")}>Destinations</a>
          </li>
          <li>
            <a href={getHref("#wander-features")}>Experiences</a>
          </li>
          <li>
            <a href={getHref("#wander-features")}>Features</a>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
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
            top: scrolled ? "75px" : "80px",
            left: 0,
            width: "100%",
            zIndex: 999,
          }}
        >
          <a
            href={getHref("#wander-dest-section")}
            style={{
              color: "var(--ocean)",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onClick={() => setMobileOpen(false)}
          >
            Destinations
          </a>
          <a
            href={getHref("#wander-features")}
            style={{
              color: "var(--ocean)",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onClick={() => setMobileOpen(false)}
          >
            Features
          </a>
          <Link
            to="/about"
            style={{
              color: "var(--ocean)",
              textDecoration: "none",
              fontWeight: 500,
            }}
            onClick={() => setMobileOpen(false)}
          >
            About Us
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
