import TravelQuiz from "../components/TravelQuiz";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ScrollLink from "../components/ScrollLink";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import api from "../services/api";
import { addTrip } from "../redux/actions/tripActions";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import FAQSection from "../components/FAQSection";
import RecentlyViewed from "../components/RecentlyViewed";
import { addRecentlyViewed } from "../utils/recentlyViewed";
import TravellerSelector from "../components/TravellerSelector";

/* ── REVIEWS DATA FOR CAROUSEL ────────────────────────────── */
const REVIEWS = [
  {
    stars: "★★★★★",
    quote: `"PackGo turned our anniversary trip into something we'll tell grandkids about. Every single detail was perfect — from the sunrise hike in Santorini to the candlelit dinner by the Aegean."`,
    avatar: "PS",
    name: "Priya Sharma",
    loc: "Mumbai, India",
  },
  {
    stars: "★★★★★",
    quote: `"I was hesitant to plan solo travel but PackGo made it seamless. Kyoto in cherry blossom season was a dream — every ryokan, every temple, perfectly curated."`,
    avatar: "AR",
    name: "Arjun Rao",
    loc: "Bengaluru, India",
  },
  {
    stars: "★★★★★",
    quote: `"The itinerary balance was spot on. Plenty of structured, unique experiences mixed with enough free time to explore hidden backalleys on our own."`,
    avatar: "MK",
    name: "Meera Kapoor",
    loc: "Delhi, India",
  },
  {
    stars: "★★★★★",
    quote: `"24/7 support came through when our domestic flight got delayed. They rebooked our connections before we even landed. Absolute lifesavers!"`,
    avatar: "JM",
    name: "John Martin",
    loc: "London, UK",
  },
];

const FEATURES = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1A4A6B"
        strokeWidth="2"
      >
        <path d="M3 11l19-9-9 19-2-8-8-2z" />
      </svg>
    ),
    title: "Curated Itineraries",
    desc: "Every route handcrafted by travel experts with on-ground knowledge of each destination.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1A4A6B"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Safe & Insured Travel",
    desc: "Full trip protection, 24/7 emergency support, and medical coverage included in every package.",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#1A4A6B"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: "Instant Booking",
    desc: "Confirm your dream holiday in minutes. No waiting, no back-and-forth — just seamless booking.",
  },
];

const STATS = [
  { big: "2.4K+", desc: "Destinations available" },
  { big: "98%", desc: "Customer satisfaction" },
  { big: "14yr", desc: "Of travel expertise" },
  { big: "180+", desc: "Countries covered" },
];

/* ── SVG Search Icon ── */
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const SEARCH_HISTORY_KEY = "recentDestinationSearches";

/* ══════════════════════════════════════════════════════════════ */
/*  COMPONENT                                                      */
/* ══════════════════════════════════════════════════════════════ */
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [travellers, setTravellers] = useState({
    adults: 1,
    children: 0,
    infants: 0,
  });
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("wander-dest-section");
  const checkInRef = useRef(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(SEARCH_HISTORY_KEY) ?? "[]",
      );
      if (Array.isArray(saved)) {
        setRecentSearches(saved.filter((item) => typeof item === "string"));
      }
    } catch (error) {
      console.error("Failed to load search history:", error);
    }
  }, []);

  const updateSearchHistory = (query) => {
    const normalized = query.trim();
    if (!normalized) return;

    const nextSearches = [
      normalized,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== normalized.toLowerCase(),
      ),
    ].slice(0, 5);

    setRecentSearches(nextSearches);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(nextSearches));
  };

  useEffect(() => {
    api
      .get("/destinations")
      .then((r) => {
        setDestinations(
          Array.isArray(r.data)
            ? r.data
            : Array.isArray(r.data?.destinations)
              ? r.data.destinations
              : [],
        );
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const sections = [
      "wander-dest-section",
      "wander-features",
      "wander-testimonials",
    ];

    const handleActiveSection = () => {
      const scrollPosition = window.scrollY + 150;

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);

        if (
          section &&
          scrollPosition >= section.offsetTop &&
          scrollPosition < section.offsetTop + section.offsetHeight
        ) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener("scroll", handleActiveSection);

    return () => {
      window.removeEventListener("scroll", handleActiveSection);
    };
  }, []);

  const handleAddTrip = (dest) => {
    // Save to recently viewed regardless of auth status
    addRecentlyViewed(dest); // ← MOVE THIS to the top, before the auth check

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const today = new Date(),
      next = new Date();
    next.setDate(today.getDate() + 7);
    dispatch(
      addTrip({
        destination: dest.name,
        startDate: checkIn || today.toISOString().split("T")[0],
        endDate: next.toISOString().split("T")[0],
        description: `Trip to ${dest.city || dest.name}`,
      }),
    );
    navigate("/dashboard/trips");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = where.trim();
    if (query) {
      updateSearchHistory(query);
    }
    setShowRecentSearches(false);
    document
      .getElementById("wander-dest-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  /* Filter destinations based on "Where to" search input */
  const filteredDestinations = where.trim()
    ? (Array.isArray(destinations) ? destinations : []).filter(
        (d) =>
          (d.name || "").toLowerCase().includes(where.trim().toLowerCase()) ||
          (d.city || "").toLowerCase().includes(where.trim().toLowerCase()) ||
          (d.state || "").toLowerCase().includes(where.trim().toLowerCase()) ||
          (d.category || "").toLowerCase().includes(where.trim().toLowerCase()),
      )
    : Array.isArray(destinations)
      ? destinations
      : [];

  const groupedDestinations = Object.values(
    filteredDestinations.reduce((groups, destination) => {
      const city = destination.city || "Unknown";

      if (!groups[city]) {
        groups[city] = {
          city,
          attractions: [],
        };
      }

      groups[city].attractions.push(destination);

      return groups;
    }, {}),
  );

  /* First 4 destinations for the editorial grid; fallback if DB has fewer */

  return (
    <div className="wander-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`wander-nav ${scrolled ? "wander-nav-scrolled" : ""}`}>
        <Link to="/" className="wander-logo">
          Pack<span>Go</span>
        </Link>

        <ul className="wander-nav-links">
          <li>
            <a
              href="#wander-dest-section"
              className={
                activeSection === "wander-dest-section"
                  ? "wander-nav-active"
                  : ""
              }
            >
              <TravelQuiz />
              Destinations
            </a>
          </li>
          <li>
            <a
              href="#wander-features"
              className={
                activeSection === "wander-features" ? "wander-nav-active" : ""
              }
            >
              Features
            </a>
          </li>
          <li>
            <a
              href="#wander-testimonials"
              className={
                activeSection === "wander-testimonials"
                  ? "wander-nav-active"
                  : ""
              }
            >
              Experiences
            </a>
          </li>
          <li>
            <Link to="/travel-checklist">Checklist</Link>
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
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            <Link to="/login">
              <button className="wander-nav-log-in">Log In</button>
            </Link>

            <Link to="/register">
              <button className="wander-nav-create-account">
                Create Free Account
              </button>
            </Link>

            <Link to="/register">
              <button className="wander-nav-cta">Book Now</button>
            </Link>
          </div>
        )}

        <button
          className="wander-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <svg
              key="close-icon"
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
              key="menu-icon"
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
        {mobileOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "var(--white)",
              borderBottom: "0.5px solid rgba(26,74,107,0.12)",
              boxShadow: "0 16px 32px rgba(15, 45, 64, 0.14)",
              padding: "1rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              zIndex: 1001,
            }}
          >
            <a
              href="#wander-dest-section"
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
              href="#wander-testimonials"
              style={{
                color: "var(--ocean)",
                textDecoration: "none",
                fontWeight: 500,
              }}
              onClick={() => setMobileOpen(false)}
            >
              Experiences
            </a>
            <a
              href="#wander-features"
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
              to="/travel-checklist"
              style={{
                color: "var(--ocean)",
                textDecoration: "none",
                fontWeight: 500,
              }}
              onClick={() => setMobileOpen(false)}
            >
              Checklist
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
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="wander-hero">
        <div className="wander-hero-content">
          <div className="wander-hero-badge">
            <div className="wander-dot" />
            &nbsp;2,400+ destinations worldwide
          </div>
          <h1>
            Travel is the only thing you buy that makes you <em>richer</em>
          </h1>
          <p>
            Curated journeys to the world's most extraordinary places.
            Handpicked experiences, flawless planning, memories that last
            forever.
          </p>
          <div className="wander-hero-actions">
            <a href="#wander-dest-section">
              <button className="wander-btn-primary">
                Explore Destinations
              </button>
            </a>

            <Link to="/budget-estimator">
              <button className="wander-btn-ghost">Budget Estimator</button>
            </Link>

            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <button className="wander-btn-ghost">
                {isAuthenticated ? "Dashboard →" : "Start Free"}
              </button>
            </Link>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="wander-hero-visual">
          <div className="wander-hero-card-main">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
              alt="Travel"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "inherit",
              }}
            />
          </div>
          <div className="wander-price-tag">
            <div className="wander-price-label">FROM / PERSON</div>
            <div className="wander-price-val">
              ₹89,000 <span>/ 7 nights</span>
            </div>
          </div>
          <div className="wander-stat-tag">
            <div className="wander-stat-num">4.9★</div>
            <div className="wander-stat-txt">1,240 reviews</div>
          </div>
        </div>
      </section>

      {/* ═══ SEARCH BAR ═══ */}
      <div className="wander-search-section">
        <form className="wander-search-bar" onSubmit={handleSearch}>
          <div className="wander-sf" style={{ position: "relative" }}>
            <div className="wander-sf-label">Where to</div>
            <input
              className="wander-sf-val"
              placeholder="Bali, Indonesia"
              value={where}
              onChange={(e) => {
                setWhere(e.target.value);
                if (recentSearches.length > 0) {
                  setShowRecentSearches(true);
                }
              }}
              onFocus={() => {
                if (recentSearches.length > 0) {
                  setShowRecentSearches(true);
                }
              }}
            />
            {showRecentSearches && recentSearches.length > 0 && (
              <div className="wander-recent-searches">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    type="button"
                    className="wander-recent-search-item"
                    onMouseDown={() => {
                      setWhere(search);
                      setShowRecentSearches(false);
                    }}
                  >
                    {search}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="wander-sf">
            <div className="wander-sf-label">Check In</div>

            <div style={{ position: "relative" }}>
              <input
                ref={checkInRef}
                className="wander-sf-val"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                onClick={() => checkInRef.current?.showPicker()}
                style={{ paddingRight: "35px" }}
              />

              <span
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              >
                📅
              </span>
            </div>
          </div>
          <div className="wander-sf">
            <div className="wander-sf-label">Travellers</div>
            <TravellerSelector
              travellers={travellers}
              onChange={setTravellers}
            />
          </div>
          <button type="submit" className="wander-search-btn">
            <SearchIcon /> Search
          </button>
        </form>
      </div>

      {/* ═══ DESTINATIONS ═══ */}

      {/* ═══ RECENTLY VIEWED ═══ */}
      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <RecentlyViewed
          onSelectDestination={(dest) => {
            document
              .getElementById("wander-dest-section")
              ?.scrollIntoView({ behavior: "smooth" });
            setWhere(dest.name);
          }}
        />
      </div>

      <section className="wander-section" id="wander-dest-section">
        <div className="wander-section-header">
          <div>
            <div className="wander-section-label">Top Picks</div>
            <div className="wander-section-title">
              {loading
                ? "Loading destinations…"
                : where.trim()
                  ? `${filteredDestinations.length} destination${
                      filteredDestinations.length !== 1 ? "s" : ""
                    } found`
                  : "Destinations that steal hearts"}
            </div>
          </div>
          <Link to={isAuthenticated ? "/dashboard/trips" : "/register"}>
            <button className="wander-see-all">View all destinations →</button>
          </Link>
        </div>

        {/* Editorial 4-card grid */}
        <CityCarousel cities={groupedDestinations} onSelect={handleAddTrip} />
      </section>

      {/* ═══ FEATURES ═══ */}
      <section className="wander-features-section" id="wander-features">
        <div
          style={{ textAlign: "center", maxWidth: 500, margin: "0 auto 1rem" }}
        >
          <div className="wander-section-label" style={{ textAlign: "center" }}>
            Why PackGo
          </div>
          <div className="wander-section-title" style={{ textAlign: "center" }}>
            Travel smarter,
            <br />
            not harder
          </div>
        </div>
        <div className="wander-feat-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="wander-feat-card">
              <div className="wander-feat-icon">{f.icon}</div>
              <div className="wander-feat-title">{f.title}</div>
              <div className="wander-feat-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <FAQSection />

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="wander-testi-section" id="wander-testimonials">
        <div>
          <div className="wander-testi-label">Traveller Stories</div>
          <div className="wander-testi-heading">
            Journeys that changed everything
          </div>

          <div className="wander-testi-quote-container">
            <div className="wander-testi-quote-track">
              {REVIEWS.map((review, index) => (
                <div className="wander-testi-card-slide" key={index}>
                  <div className="wander-stars">{review.stars}</div>
                  <p className="wander-testi-quote">{review.quote}</p>
                  <div className="wander-testi-author">
                    <div className="wander-author-avatar">{review.avatar}</div>
                    <div>
                      <div className="wander-author-name">{review.name}</div>
                      <div className="wander-author-loc">{review.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Metrics Box Grid (Remains unshifted) */}
        <div className="wander-stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="wander-stat-box">
              <div className="wander-stat-big">{s.big}</div>
              <div className="wander-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <div className="wander-cta-section">
        <div className="wander-cta-text">
          <h2>
            Your next adventure
            <br />
            is one click away
          </h2>
          <p>Join 40,000+ travellers who explored the world with PackGo</p>
        </div>
        <div className="wander-cta-actions">
          <Link to={isAuthenticated ? "/dashboard/trips" : "/register"}>
            <button className="wander-btn-primary">
              {isAuthenticated ? "Plan My Trip" : "Create Free Account"}
            </button>
          </Link>
          {!isAuthenticated && (
            <Link to="/login">
              <button className="wander-btn-ghost">Log In</button>
            </Link>
          )}
        </div>
      </div>

      {/* ═══ FOOTER (UPDATED with <Link> for routing) ═══ */}
      <footer className="wander-footer">
        <div className="wander-footer-top">
          <div className="wander-footer-brand">
            <ScrollLink to="/" className="wander-footer-logo">
              Pack<span>Go</span>
            </ScrollLink>
            <p>
              Discover breathtaking destinations, curated travel experiences,
              and unforgettable journeys with PackGo Travel.
            </p>
          </div>

          <div className="wander-footer-links-wrapper">
            <div className="wander-footer-col">
              <h4>Explore</h4>
              <a href="#wander-dest-section">Destinations</a>
              <a href="#wander-testimonials">Experiences</a>
              <a href="#wander-features">Features</a>
              <a href="#wander-testimonials">Testimonials</a>
            </div>

            <div className="wander-footer-col">
              <h4>Company</h4>
              <ScrollLink to="/about">About</ScrollLink>
              <ScrollLink to="/careers">Careers</ScrollLink>
              <ScrollLink to="/contact">Contact</ScrollLink>
              <ScrollLink to="/travel-checklist">Travel Checklist</ScrollLink>
            </div>

            <div className="wander-footer-col">
              <h4>Support</h4>
              <ScrollLink to="/help">Help Center</ScrollLink>
              <ScrollLink to="/privacy">Privacy Policy</ScrollLink>
              <ScrollLink to="/terms">Terms & Conditions</ScrollLink>
            </div>
          </div>
        </div>

        <div className="wander-footer-bottom">
          <div className="wander-footer-copy">
            © {new Date().getFullYear()} PackGo Travel Co. All rights reserved.
          </div>
          <div className="wander-footer-socials">
            <a href="/" aria-label="Facebook">
              <FaFacebook />
            </a>

            <a href="/" aria-label="Instagram">
              <FaInstagram />
            </a>

            <a href="/" aria-label="Twitter">
              <FaXTwitter />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
