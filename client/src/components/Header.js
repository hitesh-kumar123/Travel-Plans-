import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../pages/Home.css";

import AuthModal from "./AuthModal";

const SearchIcon = ({ className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HeartIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SUGGESTED_DESTS = [
  { name: "Nearby", desc: "Find what's around you", icon: "📍" },
  {
    name: "Varanasi, Uttar Pradesh",
    desc: "Popular with travellers near you",
    icon: "🏙️",
  },
  { name: "Ranchi, Jharkhand", desc: "A hidden gem", icon: "🏡" },
  { name: "Puri, Odisha", desc: "For its seaside allure", icon: "🌊" },
];

const Header = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [guestCount, setGuestCount] = useState({
    adults: 0,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const searchBarRef = useRef(null);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  // Mobile Drawer & Coming Soon State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const handleDateClick = (day) => {
    const d = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setCheckIn(
      d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    );
    setActiveField(null);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if ((isExpanded || mobileMenuOpen) && isMobile) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.classList.add("body-lock");
      document.documentElement.classList.add("body-lock");
    } else {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.classList.remove("body-lock");
      document.documentElement.classList.remove("body-lock");
    }
    return () => {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";
      document.body.classList.remove("body-lock");
      document.documentElement.classList.remove("body-lock");
    };
  }, [isExpanded, mobileMenuOpen, isMobile]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 150);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setActiveField(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target)
      ) {
        setActiveField(null);
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsExpanded(false);
    if (where.trim()) {
      navigate(`/search?q=${encodeURIComponent(where.trim())}`);
    } else {
      navigate(`/search`);
    }
  };

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header
        className={`wander-header ${scrolled ? "scrolled" : ""} ${isExpanded ? "expanded" : ""}`}
      >
        <div className="wander-nav-top">
          <Link to="/" className="wander-logo">
            <img src="/logo_chat.png" alt="PackGo" />
          </Link>

          {mobileMenuOpen && (
            <div
              className="mobile-menu-backdrop show-mobile-only"
              onClick={() => setMobileMenuOpen(false)}
              onTouchMove={(e) => e.preventDefault()}
            />
          )}
          <ul
            className={`wander-nav-center ${mobileMenuOpen ? "mobile-open" : ""}`}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="mobile-menu-header show-mobile-only">
              <span className="mobile-menu-brand">PackGo</span>
              <button
                className="mobile-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <li onClick={() => setMobileMenuOpen(false)}>
              <Link to="/">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span>Home</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/");
              }}
            >
              <Link to="/">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>India</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                setIsComingSoonModalOpen(true);
              }}
            >
              <Link to="/group-tours">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>Group Tour</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                setIsComingSoonModalOpen(true);
              }}
            >
              <Link to="/packages">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <span>Packages</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                setIsComingSoonModalOpen(true);
              }}
            >
              <Link to="/honeymoon">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                <span>Honeymoon</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                setIsComingSoonModalOpen(true);
              }}
            >
              <Link to="/wedding">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <polygon points="12 2 15 8 21 9 16.5 14 18 20 12 17 6 20 7.5 14 3 9 9 8 12 2"></polygon>
                </svg>
                <span>Wedding</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/");
              }}
            >
              <Link to="/">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>About</span>
              </Link>
            </li>
            <li
              onClick={() => {
                setMobileMenuOpen(false);
                setIsComingSoonModalOpen(true);
              }}
            >
              <Link to="/contact">
                <svg
                  className="nav-icon show-mobile-only"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Contact</span>
              </Link>
            </li>
          </ul>

          <div className="wander-nav-right">
            <span className="become-host" onClick={() => openAuth("register")}>
              Book Now
            </span>
            <button
              className="hamburger-btn show-mobile-only"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Search Bar */}
        <div className="wander-nav-bottom">
          {/* 📱 MOBILE SEARCH PILL (Airbnb Style) */}
          <div
            className="mobile-search-pill show-mobile-only"
            onClick={() => {
              setIsExpanded(true);
              setActiveField("where");
            }}
          >
            <div className="pill-content">
              <SearchIcon className="pill-search-icon" />
              <div className="pill-text">
                <span className="pill-main">
                  {where ? where : "Start your search"}
                </span>
                <span className="pill-sub">
                  {checkIn ? checkIn : "Any week"} •{" "}
                  {(() => {
                    const total = Object.values(guestCount).reduce(
                      (a, b) => a + b,
                      0,
                    );
                    return total > 0
                      ? `${total} guest${total > 1 ? "s" : ""}`
                      : "Add guests";
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* 💻 DESKTOP COMPACT PILL */}
          {scrolled && !isExpanded && !isMobile ? (
            <div className="wander-compact-pill hide-mobile">
              <div
                className="compact-item"
                onClick={() => {
                  setIsExpanded(true);
                  setActiveField("where");
                }}
              >
                {where || "Anywhere"}
              </div>
              <div className="compact-sep"></div>
              <div
                className="compact-item"
                onClick={() => {
                  setIsExpanded(true);
                  setActiveField("when");
                }}
              >
                {checkIn || "Anytime"}
              </div>
              <div className="compact-sep"></div>
              <div
                className="compact-item"
                onClick={() => {
                  setIsExpanded(true);
                  setActiveField("who");
                }}
              >
                {(() => {
                  const total = Object.values(guestCount).reduce(
                    (a, b) => a + b,
                    0,
                  );
                  return total > 0
                    ? `${total} guest${total > 1 ? "s" : ""}`
                    : "Add Guests";
                })()}
              </div>
              <button
                className="compact-search-btn"
                onClick={() => {
                  setIsExpanded(true);
                  setActiveField("where");
                }}
              >
                <SearchIcon />
              </button>
            </div>
          ) : (
            (isExpanded || (!scrolled && !isMobile)) && (
              <>
                {/* 💻 STANDARD DESKTOP SEARCH BAR */}
                {!(isExpanded && isMobile) && (
                  <form
                    ref={searchBarRef}
                    className={`wander-search-bar ${activeField ? "field-active" : ""} ${scrolled ? "compact" : ""}`}
                    onSubmit={handleSearch}
                  >
                    <div
                      className={`wander-sf ${activeField === "where" ? "active" : ""}`}
                      onClick={() =>
                        setActiveField(activeField === "where" ? null : "where")
                      }
                    >
                      <div className="wander-sf-main">
                        <div className="wander-sf-label">Where</div>
                        <input
                          className="wander-sf-val"
                          placeholder="Search destinations"
                          value={where}
                          onChange={(e) => setWhere(e.target.value)}
                        />
                      </div>
                      {where && (
                        <button
                          type="button"
                          className="sf-clear-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setWhere("");
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 32 32">
                            <path
                              d="m6 6 20 20M26 6 6 26"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                        </button>
                      )}
                      {activeField === "where" && (
                        <div className="search-dropdown dest-dropdown">
                          <div className="dropdown-title">
                            Suggested destinations
                          </div>
                          {SUGGESTED_DESTS.map((d, i) => (
                            <div
                              key={i}
                              className="dest-item"
                              onClick={() => {
                                setWhere(d.name);
                                setActiveField(null);
                                setIsExpanded(false);
                                navigate(
                                  `/search?q=${encodeURIComponent(d.name)}`,
                                );
                              }}
                            >
                              <div className="dest-icon">{d.icon}</div>
                              <div className="dest-text">
                                <div className="dest-name">{d.name}</div>
                                <div className="dest-desc">{d.desc}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div
                      className={`wander-sf ${activeField === "when" ? "active" : ""}`}
                      onClick={() =>
                        setActiveField(activeField === "when" ? null : "when")
                      }
                    >
                      <div className="wander-sf-main">
                        <div className="wander-sf-label">When</div>
                        <div className="wander-sf-val">
                          {checkIn || "Add dates"}
                        </div>
                      </div>
                      {checkIn && (
                        <button
                          type="button"
                          className="sf-clear-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCheckIn("");
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 32 32">
                            <path
                              d="m6 6 20 20M26 6 6 26"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                        </button>
                      )}
                      {activeField === "when" && (
                        <div className="search-dropdown date-dropdown">
                          <div className="calendar-header">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMonth(
                                  new Date(
                                    currentMonth.setMonth(
                                      currentMonth.getMonth() - 1,
                                    ),
                                  ),
                                );
                              }}
                            >
                              &lt;
                            </button>
                            <div className="calendar-month-year">
                              {currentMonth.toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                              })}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentMonth(
                                  new Date(
                                    currentMonth.setMonth(
                                      currentMonth.getMonth() + 1,
                                    ),
                                  ),
                                );
                              }}
                            >
                              &gt;
                            </button>
                          </div>
                          <div className="calendar-grid">
                            {[...Array(daysInMonth(currentMonth))].map(
                              (_, i) => (
                                <div
                                  key={i + 1}
                                  className={`calendar-day ${checkIn === `${i + 1} ${currentMonth.toLocaleString("default", { month: "short" })}` ? "selected" : ""}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDateClick(i + 1);
                                    setActiveField("who");
                                  }}
                                >
                                  {i + 1}
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className={`wander-sf ${activeField === "who" ? "active" : ""}`}
                      onClick={() =>
                        setActiveField(activeField === "who" ? null : "who")
                      }
                    >
                      <div className="wander-sf-main">
                        <div className="wander-sf-label">Who</div>
                        <div className="wander-sf-val">
                          {(() => {
                            const total = Object.values(guestCount).reduce(
                              (a, b) => a + b,
                              0,
                            );
                            return total > 0
                              ? `${total} guest${total > 1 ? "s" : ""}`
                              : "Add guests";
                          })()}
                        </div>
                      </div>
                      {Object.values(guestCount).some((v) => v > 0) && (
                        <button
                          type="button"
                          className="sf-clear-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGuestCount({
                              adults: 0,
                              children: 0,
                              infants: 0,
                              pets: 0,
                            });
                          }}
                        >
                          <svg width="12" height="12" viewBox="0 0 32 32">
                            <path
                              d="m6 6 20 20M26 6 6 26"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                        </button>
                      )}
                      {activeField === "who" && (
                        <div
                          className="search-dropdown guest-dropdown"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {["adults", "children", "infants", "pets"].map(
                            (k) => (
                              <div key={k} className="guest-row">
                                <div className="guest-info">
                                  <div className="guest-type">
                                    {k.charAt(0).toUpperCase() + k.slice(1)}
                                  </div>
                                  <div className="guest-age">
                                    {k === "adults"
                                      ? "Ages 13+"
                                      : k === "children"
                                        ? "Ages 2–12"
                                        : k === "infants"
                                          ? "Under 2"
                                          : "Service animals"}
                                  </div>
                                </div>
                                <div className="guest-controls">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setGuestCount((p) => ({
                                        ...p,
                                        [k]: Math.max(0, p[k] - 1),
                                      }))
                                    }
                                  >
                                    -
                                  </button>
                                  <span>{guestCount[k]}</span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setGuestCount((p) => ({
                                        ...p,
                                        [k]: p[k] + 1,
                                      }))
                                    }
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>

                    <button className="wander-search-btn" type="submit">
                      <SearchIcon />
                      <span>Search</span>
                    </button>
                  </form>
                )}
              </>
            )
          )}
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* 📱 MOBILE BOTTOM NAVIGATION (Airbnb Style) */}
      {!isExpanded && !mobileMenuOpen && (
        <div className="mobile-bottom-nav show-mobile-only">
          <div className="mobile-nav-item active">
            <SearchIcon />
            <span>Explore</span>
          </div>
          <div className="mobile-nav-item">
            <HeartIcon />
            <span>Wishlists</span>
          </div>
          <div className="mobile-nav-item" onClick={() => openAuth("login")}>
            <UserIcon />
            <span>Log in</span>
          </div>
        </div>
      )}

      {/* 📱 FULL-SCREEN MOBILE SEARCH OVERLAY (Root Level) */}
      {isExpanded && isMobile && (
        <div className="mobile-search-overlay">
          <div className="overlay-header">
            <button
              className="close-overlay"
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>

          <div className="overlay-content">
            {/* Where Card */}
            {activeField === "where" || !activeField ? (
              <div className="overlay-card active-card">
                <h3>Where?</h3>
                <div className="overlay-input-wrapper">
                  <SearchIcon />
                  <input
                    placeholder="Search destinations"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="suggested-section">
                  <div className="suggested-label">Suggested destinations</div>
                  <div className="suggested-list">
                    {[
                      {
                        name: "Nearby",
                        desc: "Find what's around you",
                        icon: "📍",
                      },
                      {
                        name: "Varanasi, Uttar Pradesh",
                        desc: "Popular with travellers near you",
                        icon: "🏛️",
                      },
                      {
                        name: "Ranchi, Jharkhand",
                        desc: "A hidden gem",
                        icon: "🏞️",
                      },
                      {
                        name: "Puri, Odisha",
                        desc: "For its seaside allure",
                        icon: "🏖️",
                      },
                      {
                        name: "Kolkata, West Bengal",
                        desc: "For sights like Victoria Memorial",
                        icon: "🎨",
                      },
                    ].map((d, i) => (
                      <div
                        key={i}
                        className="suggested-item"
                        onClick={() => {
                          setWhere(d.name);
                          setActiveField("when");
                        }}
                      >
                        <div className="suggested-icon">{d.icon}</div>
                        <div className="suggested-text">
                          <div className="suggested-name">{d.name}</div>
                          <div className="suggested-desc">{d.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="overlay-card collapsed"
                onClick={() => setActiveField("where")}
              >
                <span className="collapsed-label">Where</span>
                <span className="collapsed-val">
                  {where || "Search destinations"}
                </span>
              </div>
            )}

            {/* When Card */}
            {activeField === "when" ? (
              <div className="overlay-card active-card">
                <h3>When?</h3>
                <div className="calendar-header">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(
                        new Date(
                          currentMonth.setMonth(currentMonth.getMonth() - 1),
                        ),
                      );
                    }}
                  >
                    &lt;
                  </button>
                  <div className="calendar-month-year">
                    {currentMonth.toLocaleDateString("en-IN", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentMonth(
                        new Date(
                          currentMonth.setMonth(currentMonth.getMonth() + 1),
                        ),
                      );
                    }}
                  >
                    &gt;
                  </button>
                </div>
                <div className="calendar-grid">
                  {[...Array(daysInMonth(currentMonth))].map((_, i) => (
                    <div
                      key={i + 1}
                      className={`calendar-day ${checkIn === `${i + 1} ${currentMonth.toLocaleString("default", { month: "short" })}` ? "selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDateClick(i + 1);
                        setActiveField("who");
                      }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="overlay-card collapsed"
                onClick={() => setActiveField("when")}
              >
                <span className="collapsed-label">When</span>
                <span className="collapsed-val">{checkIn || "Add dates"}</span>
              </div>
            )}

            {/* Who Card */}
            {activeField === "who" ? (
              <div className="overlay-card active-card">
                <h3>Who?</h3>
                <div className="guests-list">
                  {["adults", "children", "infants", "pets"].map((k) => (
                    <div key={k} className="guest-row">
                      <div className="guest-info">
                        <div className="guest-type">
                          {k.charAt(0).toUpperCase() + k.slice(1)}
                        </div>
                        <div className="guest-age">
                          {k === "adults"
                            ? "Ages 13+"
                            : k === "children"
                              ? "Ages 2–12"
                              : k === "infants"
                                ? "Under 2"
                                : "Service animals"}
                        </div>
                      </div>
                      <div className="guest-controls">
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount((p) => ({
                              ...p,
                              [k]: Math.max(0, p[k] - 1),
                            }))
                          }
                        >
                          -
                        </button>
                        <span>{guestCount[k]}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setGuestCount((p) => ({ ...p, [k]: p[k] + 1 }))
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="overlay-card collapsed"
                onClick={() => setActiveField("who")}
              >
                <span className="collapsed-label">Who</span>
                <span className="collapsed-val">
                  {(() => {
                    const total = Object.values(guestCount).reduce(
                      (a, b) => a + b,
                      0,
                    );
                    return total > 0
                      ? `${total} guest${total > 1 ? "s" : ""}`
                      : "Add guests";
                  })()}
                </span>
              </div>
            )}
          </div>

          <div className="overlay-footer">
            <button
              className="clear-all"
              onClick={() => {
                setWhere("");
                setCheckIn("");
                setGuestCount({ adults: 0, children: 0, infants: 0, pets: 0 });
              }}
            >
              Clear all
            </button>
            <button className="pink-search-btn" onClick={handleSearch}>
              <SearchIcon />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
      {/* 🛠️ COMING SOON MODAL 🛠️ */}
      {isComingSoonModalOpen && (
        <div
          className="coming-soon-overlay"
          onClick={() => setIsComingSoonModalOpen(false)}
        >
          <div
            className="coming-soon-card"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="cs-close-btn"
              onClick={() => setIsComingSoonModalOpen(false)}
            >
              ×
            </button>
            <div className="cs-icon">✨</div>
            <h2>Coming Soon!</h2>
            <p>
              We're currently handcrafting this experience to make it absolutely
              perfect for you. Stay tuned for something extraordinary.
            </p>
            <div className="cs-badge">Coming Very Soon</div>
            <button
              className="cs-btn-primary"
              onClick={() => setIsComingSoonModalOpen(false)}
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
