import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Home.css";
import api from "../services/api";
import { addTrip } from "../redux/actions/tripActions";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
/* ── SVG SCENES ─────────────────────────────────────────────── */
const SceneIceland = () => (
  <svg
    viewBox="0 0 460 360"
    xmlns="http://www.w3.org/2000/svg"
    className="wander-scene-svg"
  >
    <rect width="460" height="360" fill="#1A3A5C" />
    <circle cx="60" cy="30" r="1.2" fill="white" opacity="0.7" />
    <circle cx="120" cy="55" r="0.8" fill="white" opacity="0.5" />
    <circle cx="200" cy="20" r="1" fill="white" opacity="0.6" />
    <circle cx="300" cy="40" r="1.3" fill="white" opacity="0.8" />
    <circle cx="380" cy="25" r="0.9" fill="white" opacity="0.5" />
    <circle cx="420" cy="60" r="1.1" fill="white" opacity="0.7" />
    <circle cx="160" cy="70" r="0.7" fill="white" opacity="0.4" />
    <circle cx="390" cy="55" r="22" fill="#FFF5D6" opacity="0.9" />
    <circle cx="400" cy="48" r="17" fill="#1A3A5C" />
    <path
      d="M0,120 Q115,80 230,110 Q345,140 460,100"
      stroke="#2ECC87"
      strokeWidth="3"
      fill="none"
      opacity="0.4"
    />
    <path
      d="M0,140 Q115,100 230,130 Q345,160 460,120"
      stroke="#2ECC87"
      strokeWidth="2"
      fill="none"
      opacity="0.25"
    />
    <path
      d="M0,105 Q115,65 230,95 Q345,125 460,85"
      stroke="#7B5EA7"
      strokeWidth="2.5"
      fill="none"
      opacity="0.3"
    />
    <path
      d="M0,280 L60,190 L120,230 L180,170 L240,220 L310,155 L370,210 L420,175 L460,200 L460,360 L0,360Z"
      fill="#0D2438"
    />
    <path
      d="M0,360 L0,290 L40,250 L90,280 L150,235 L200,260 L260,220 L320,255 L380,230 L420,250 L460,235 L460,360Z"
      fill="#081828"
    />
    <path d="M150,235 L165,252 L135,252Z" fill="rgba(255,255,255,0.6)" />
    <path d="M260,220 L278,240 L242,240Z" fill="rgba(255,255,255,0.6)" />
    <path d="M380,230 L394,246 L366,246Z" fill="rgba(255,255,255,0.5)" />
    <ellipse cx="230" cy="330" rx="140" ry="22" fill="#1A3A5C" opacity="0.7" />
    <path
      d="M110,320 Q180,310 230,318 Q280,310 350,320"
      stroke="rgba(139,175,196,0.4)"
      strokeWidth="1.5"
      fill="none"
    />
    <g fill="#0A1F30">
      <polygon points="30,310 42,275 54,310" />
      <polygon points="26,310 42,268 58,310" />
      <polygon points="60,315 72,285 84,315" />
      <polygon points="390,305 402,270 414,305" />
      <polygon points="386,305 402,262 418,305" />
      <polygon points="415,312 428,280 441,312" />
    </g>
    <path
      d="M0,340 Q115,325 230,335 Q345,345 460,330 L460,360 L0,360Z"
      fill="#06121E"
    />
    <rect
      x="15"
      y="15"
      width="140"
      height="28"
      rx="14"
      fill="rgba(255,255,255,0.1)"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="0.5"
    />
    <text
      x="27"
      y="33"
      fontFamily="DM Sans,sans-serif"
      fontSize="11"
      fill="rgba(255,255,255,0.85)"
      fontWeight="500"
    >
      Iceland Northern Lights
    </text>
  </svg>
);

const SceneSantorini = () => (
  <svg
    viewBox="0 0 300 460"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <rect width="300" height="460" fill="#1A4060" />
    <rect y="280" width="300" height="180" fill="#0D2D44" />
    <ellipse cx="80" cy="90" rx="55" ry="22" fill="rgba(255,255,255,0.12)" />
    <ellipse cx="220" cy="70" rx="40" ry="16" fill="rgba(255,255,255,0.09)" />
    <circle cx="240" cy="130" r="35" fill="#F4C460" opacity="0.85" />
    <circle cx="240" cy="130" r="26" fill="#F0A830" />
    <rect y="260" width="300" height="30" fill="#E87820" opacity="0.3" />
    <path d="M0,460 L0,320 Q40,290 80,310 L80,460Z" fill="#0A1E2E" />
    <path d="M220,460 L220,300 Q260,280 300,295 L300,460Z" fill="#0A1E2E" />
    <path d="M95,460 L95,340 Q110,310 130,340 L130,460Z" fill="#081828" />
    <path d="M165,460 L165,340 Q150,310 130,340 L130,460Z" fill="#081828" />
    <ellipse cx="130" cy="340" rx="35" ry="12" fill="#081828" />
    <path
      d="M195,260 Q215,255 235,260 L230,272 L200,272Z"
      fill="#F5EFE0"
      opacity="0.9"
    />
    <line
      x1="215"
      y1="258"
      x2="215"
      y2="230"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="1"
    />
    <path
      d="M20,310 Q75,305 130,312 Q185,305 240,312"
      stroke="rgba(255,255,255,0.15)"
      strokeWidth="1"
      fill="none"
    />
  </svg>
);

const SceneAngkor = () => (
  <svg
    viewBox="0 0 240 220"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <rect width="240" height="220" fill="#3D2910" />
    <rect y="140" width="240" height="80" fill="#1E1208" />
    <circle cx="40" cy="60" r="50" fill="#1A4A1A" opacity="0.7" />
    <circle cx="120" cy="40" r="60" fill="#154015" opacity="0.6" />
    <circle cx="200" cy="55" r="45" fill="#1A4A1A" opacity="0.7" />
    <path
      d="M80,220 L80,120 L90,105 L100,100 L110,105 L120,120 L120,220Z"
      fill="#2C1A08"
    />
    <rect x="88" y="95" width="24" height="12" fill="#3D2410" />
    <rect x="92" y="83" width="16" height="14" fill="#2C1A08" />
    <rect x="96" y="72" width="8" height="13" fill="#1E0F04" />
    <path
      d="M80,150 Q65,140 60,155 Q55,170 70,165"
      stroke="#1A4A1A"
      strokeWidth="3"
      fill="none"
    />
    <path
      d="M120,160 Q135,148 140,163 Q145,178 130,173"
      stroke="#154015"
      strokeWidth="3"
      fill="none"
    />
    <rect x="0" y="100" width="240" height="40" fill="rgba(200,200,200,0.06)" />
  </svg>
);

const SceneBali = () => (
  <svg
    viewBox="0 0 240 220"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <rect width="240" height="220" fill="#1A3A28" />
    <rect width="240" height="140" fill="#0D2A1E" />
    <rect y="140" width="240" height="80" fill="#0A1E14" />
    <path
      d="M0,220 L0,170 Q60,155 120,165 Q180,175 240,160 L240,220Z"
      fill="#1A5C2A"
    />
    <path
      d="M0,200 L0,175 Q60,162 120,172 Q180,182 240,167 L240,200Z"
      fill="#145022"
    />
    <path
      d="M0,185 L0,178 Q60,165 120,175 Q180,185 240,170 L240,185Z"
      fill="#3D8A3A"
    />
    <path
      d="M20,172 Q80,167 140,170"
      stroke="rgba(100,180,130,0.4)"
      strokeWidth="1"
      fill="none"
    />
    <line
      x1="180"
      y1="220"
      x2="175"
      y2="145"
      stroke="#2C1A08"
      strokeWidth="5"
    />
    <ellipse
      cx="165"
      cy="148"
      rx="22"
      ry="10"
      fill="#1A5018"
      transform="rotate(-15 165 148)"
    />
    <ellipse
      cx="185"
      cy="143"
      rx="18"
      ry="8"
      fill="#154015"
      transform="rotate(10 185 143)"
    />
    <rect x="60" y="165" width="18" height="12" fill="#5C3A10" />
    <path d="M56,167 L69,155 L82,167Z" fill="#3D2408" />
  </svg>
);

const SceneSahara = () => (
  <svg
    viewBox="0 0 240 220"
    xmlns="http://www.w3.org/2000/svg"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <rect width="240" height="220" fill="#2A1510" />
    <rect width="240" height="130" fill="#1A3050" />
    <path
      d="M0,50 Q120,30 240,60"
      stroke="rgba(200,210,255,0.15)"
      strokeWidth="20"
      fill="none"
    />
    <circle cx="30" cy="25" r="1" fill="white" opacity="0.8" />
    <circle cx="80" cy="15" r="1.2" fill="white" opacity="0.7" />
    <circle cx="150" cy="30" r="0.8" fill="white" opacity="0.9" />
    <circle cx="200" cy="20" r="1" fill="white" opacity="0.6" />
    <circle cx="60" cy="45" r="0.7" fill="white" opacity="0.5" />
    <circle cx="170" cy="55" r="1.1" fill="white" opacity="0.8" />
    <path
      d="M0,220 L0,160 Q50,130 100,148 Q150,165 200,140 Q225,128 240,135 L240,220Z"
      fill="#5C3A1A"
    />
    <path
      d="M0,220 L0,175 Q40,155 90,167 Q140,178 190,160 L240,165 L240,220Z"
      fill="#3D2510"
    />
    <path
      d="M0,220 L0,188 Q50,172 100,182 Q150,190 200,178 L240,182 L240,220Z"
      fill="#2A1A08"
    />
    <g fill="#1A0C04">
      <ellipse cx="130" cy="168" rx="20" ry="10" />
      <ellipse cx="120" cy="162" rx="10" ry="7" />
      <rect x="112" y="168" width="5" height="16" />
      <rect x="128" y="168" width="5" height="16" />
      <rect x="138" y="168" width="5" height="16" />
      <rect x="148" y="170" width="5" height="14" />
      <rect x="117" y="155" width="4" height="12" />
      <ellipse cx="119" cy="153" rx="5" ry="4" />
    </g>
  </svg>
);
/* ─────────────────────────────────────────────────────────────── */

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
/* ── Popular destinations shown when API has no data or on focus ── */
const POPULAR_DESTINATIONS = [
  {
    _id: "pop-1",
    name: "Bali",
    city: "Ubud",
    state: "Indonesia",
    category: "Beach",
  },
  {
    _id: "pop-2",
    name: "Goa",
    city: "Panaji",
    state: "India",
    category: "Beach",
  },
  {
    _id: "pop-3",
    name: "Dubai",
    city: "Dubai",
    state: "UAE",
    category: "City",
  },
  {
    _id: "pop-4",
    name: "Paris",
    city: "Paris",
    state: "France",
    category: "City",
  },
  {
    _id: "pop-5",
    name: "Santorini",
    city: "Fira",
    state: "Greece",
    category: "Island",
  },
  {
    _id: "pop-6",
    name: "Maldives",
    city: "Malé",
    state: "Maldives",
    category: "Beach",
  },
  {
    _id: "pop-7",
    name: "Tokyo",
    city: "Tokyo",
    state: "Japan",
    category: "City",
  },
  {
    _id: "pop-8",
    name: "Rajasthan",
    city: "Jaipur",
    state: "India",
    category: "Heritage",
  },
  {
    _id: "pop-9",
    name: "Angkor Wat",
    city: "Siem Reap",
    state: "Cambodia",
    category: "Heritage",
  },
  {
    _id: "pop-10",
    name: "Sahara",
    city: "Merzouga",
    state: "Morocco",
    category: "Adventure",
  },
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
  const [travellers, setTravellers] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  /* ── CountriesNow autocomplete state ── */
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [apiSuggestions, setApiSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  /* Stores the item the user picked from the dropdown */
  const [selectedDestination, setSelectedDestination] = useState(null);
  /* Cache the full countries+cities dataset after first fetch */
  const countriesDataRef = useRef(null);
  const dataFetchedRef = useRef(false);
  useEffect(() => {
    api
      .get("/destinations")
      .then((r) => {
        setDestinations(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /* ── Fetch & cache countries+cities on mount ── */
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    setSuggestionsLoading(true);
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((r) => r.json())
      .then((json) => {
        if (!json.error && Array.isArray(json.data)) {
          countriesDataRef.current = json.data;
        }
        setSuggestionsLoading(false);
      })
      .catch(() => setSuggestionsLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddTrip = (dest) => {
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
    document
      .getElementById("wander-dest-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };
  /* ── Pool to search against for the DESTINATIONS GRID below ── */
  const destinationPool =
    destinations.length > 0 ? destinations : POPULAR_DESTINATIONS;
  const filteredDestinations = where.trim()
    ? destinationPool.filter(
        (d) =>
          (d.name || "").toLowerCase().includes(where.toLowerCase()) ||
          (d.city || "").toLowerCase().includes(where.toLowerCase()) ||
          (d.state || "").toLowerCase().includes(where.toLowerCase()) ||
          (d.category || "").toLowerCase().includes(where.toLowerCase()),
      )
    : destinationPool;
  /* ──────────────────────────────────────────────────────────────
     CountriesNow — filter cached data locally on every keystroke
     API: https://countriesnow.space/api/v0.1/countries
  ────────────────────────────────────────────────────────────── */
  const getCountriesNowSuggestions = useCallback((query) => {
    const q = query.trim().toLowerCase();
    if (!q || !countriesDataRef.current) return [];

    const results = [];
    const seen = new Set();

    /* Helper: score a match (start-of-string beats mid-string) */
    const score = (str) => {
      const s = str.toLowerCase();
      if (s.startsWith(q)) return 0;
      if (s.includes(q)) return 1;
      return -1;
    };

    for (const entry of countriesDataRef.current) {
      const countryScore = score(entry.country);

      /* Country-level match */
      if (countryScore >= 0 && !seen.has(entry.country)) {
        seen.add(entry.country);
        results.push({
          id: `country-${entry.country}`,
          name: entry.country,
          subtitle: `${entry.cities.length} cities`,
          icon: "🌍",
          typeLabel: "Country",
          _score: countryScore,
        });
      }

      /* City-level matches within this country */
      if (Array.isArray(entry.cities)) {
        for (const city of entry.cities) {
          const cityScore = score(city);
          const key = `${city}|${entry.country}`;
          if (cityScore >= 0 && !seen.has(key)) {
            seen.add(key);
            results.push({
              id: key,
              name: city,
              subtitle: entry.country,
              icon: "🏙️",
              typeLabel: "City",
              _score: cityScore,
            });
          }
          /* Stop early if we already have plenty of candidates */
          if (results.length >= 120) break;
        }
      }
      if (results.length >= 120) break;
    }

    /* Sort: start matches first, then alphabetical within each tier */
    results.sort((a, b) =>
      a._score !== b._score
        ? a._score - b._score
        : a.name.localeCompare(b.name),
    );

    return results.slice(0, 8);
  }, []);

  /* Instant local filter — no debounce needed */
  const handleWhereChange = (e) => {
    const val = e.target.value;
    setWhere(val);
    setShowSuggestions(true);
    setActiveSuggestionIndex(-1);
    /* Clear the selected card whenever user edits the field */
    setSelectedDestination(null);
    if (!val.trim()) {
      setApiSuggestions([]);
      return;
    }
    const hits = getCountriesNowSuggestions(val);
    setApiSuggestions(hits);
  };

  /* Combined suggestion list: CountriesNow results first, fallback to local/popular pool */
  const suggestionList = (() => {
    if (apiSuggestions.length > 0) return apiSuggestions;
    if (where.trim()) {
      /* Text typed but no API hits yet — show local fallback */
      return filteredDestinations.slice(0, 6).map((d) => ({
        id: d._id,
        name: d.name,
        subtitle:
          [d.city, d.state].filter(Boolean).join(", ") ||
          d.category ||
          "Destination",
        icon: "📍",
        typeLabel: d.category || "",
      }));
    }
    /* Empty input — show popular picks */
    return POPULAR_DESTINATIONS.slice(0, 6).map((d) => ({
      id: d._id,
      name: d.name,
      subtitle:
        [d.city, d.state].filter(Boolean).join(", ") || d.category || "",
      icon: "⭐",
      typeLabel: d.category || "Popular",
    }));
  })();
  const handleSuggestionKeyDown = (e) => {
    if (!showSuggestions || !suggestionList.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) =>
        prev < suggestionList.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      if (
        activeSuggestionIndex >= 0 &&
        activeSuggestionIndex < suggestionList.length
      ) {
        e.preventDefault();
        handleSelectSuggestion(suggestionList[activeSuggestionIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
    }
  };
  /* Click / keyboard-select a suggestion → fill the input + show card */
  const handleSelectSuggestion = (item) => {
    /* Show "City, Country" in the input for city results */
    const display =
      item.typeLabel === "City" && item.subtitle
        ? `${item.name}, ${item.subtitle}`
        : item.name;
    setWhere(display);
    setSelectedDestination(item);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setApiSuggestions([]);
  };
  /* editorialDests removed — grid is now fully driven by filteredDestinations */
  return (
    <div className="wander-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`wander-nav ${scrolled ? "wander-nav-scrolled" : ""}`}>
        <Link to="/" className="wander-logo">
          Pack<span>Go</span>
        </Link>

        <ul className="wander-nav-links">
          <li>
            <a href="#wander-dest-section">Destinations</a>
          </li>
          <li>
            <a href="#wander-features">Experiences</a>
          </li>
          <li>
            <a href="#wander-features">Features</a>
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
            <SceneIceland />
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
          <div className="wander-sf">
            <div className="wander-sf-label">Where to</div>
            <div className="wander-sf-input-wrap">
              <input
                className="wander-sf-val"
                placeholder="Bali, Indonesia"
                value={where}
                onChange={handleWhereChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleSuggestionKeyDown}
                autoComplete="off"
                id="where-to-input"
                role="combobox"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                aria-expanded={showSuggestions && where.trim().length > 0}
                aria-controls="where-to-suggestions"
              />
              {where && (
                <button
                  type="button"
                  className="wander-sf-clear"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setWhere("");
                    setApiSuggestions([]);
                    setShowSuggestions(false);
                    setActiveSuggestionIndex(-1);
                  }}
                  aria-label="Clear destination"
                >
                  ×
                </button>
              )}
            </div>
            {showSuggestions && (
              <div
                id="where-to-suggestions"
                className="wander-suggestions-dropdown"
                role="listbox"
                aria-label="Destination suggestions"
              >
                {/* Header */}
                <div className="wander-suggestions-header">
                  <span className="wander-suggestions-header-icon">
                    {suggestionsLoading ? (
                      <span className="wander-suggestions-spinner" />
                    ) : where.trim() ? (
                      "🔍"
                    ) : (
                      "⭐"
                    )}
                  </span>
                  {suggestionsLoading && !where.trim()
                    ? "Loading destination data…"
                    : !where.trim()
                      ? "Popular destinations"
                      : suggestionList.length > 0
                        ? `${suggestionList.length} result${suggestionList.length !== 1 ? "s" : ""} for "${where}"`
                        : `No results for "${where}"`}
                </div>
                {suggestionList.length > 0 &&
                  suggestionList.map((item, index) => {
                    const displayText = item.name || "";
                    const matchIndex = displayText
                      .toLowerCase()
                      .indexOf(where.toLowerCase());
                    return (
                      <div
                        key={item.id || index}
                        className={`wander-suggestion-item ${index === activeSuggestionIndex ? "active" : ""}`}
                        role="option"
                        aria-selected={index === activeSuggestionIndex}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectSuggestion(item);
                        }}
                      >
                        <span className="wander-suggestion-icon">
                          {item.icon}
                        </span>
                        <div className="wander-suggestion-text">
                          <span className="wander-suggestion-name">
                            {matchIndex >= 0 ? (
                              <>
                                {displayText.substring(0, matchIndex)}
                                <strong>
                                  {displayText.substring(
                                    matchIndex,
                                    matchIndex + where.length,
                                  )}
                                </strong>
                                {displayText.substring(
                                  matchIndex + where.length,
                                )}
                              </>
                            ) : (
                              displayText
                            )}
                          </span>
                          <span className="wander-suggestion-country">
                            {item.subtitle}
                          </span>
                        </div>
                        {item.typeLabel && (
                          <span className="wander-suggestion-badge">
                            {item.typeLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                {!suggestionsLoading &&
                  suggestionList.length === 0 &&
                  where.trim() && (
                    <div className="wander-suggestions-empty">
                      <span style={{ fontSize: "1.5rem" }}>🌏</span>
                      <span>No destinations found</span>
                      <span className="wander-suggestions-empty-hint">
                        Try a country ("India") or city ("Paris", "Bali")
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>
          <div className="wander-sf">
            <div className="wander-sf-label">Check In</div>
            <div style={{ position: "relative" }}>
              <input
                className="wander-sf-val"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
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
            <input
              className="wander-sf-val"
              placeholder="2 Adults, 1 Child"
              value={travellers}
              onChange={(e) => setTravellers(e.target.value)}
            />
          </div>
          <button type="submit" className="wander-search-btn">
            <SearchIcon /> Search
          </button>
        </form>
      </div>

      {/* ═══ SELECTED DESTINATION CARD ═══ */}
      {selectedDestination && (
        <div className="wander-selected-card-section">
          <div className="wander-selected-card">
            {/* Dismiss */}
            <button
              className="wander-selected-card-dismiss"
              onClick={() => {
                setSelectedDestination(null);
                setWhere("");
                setApiSuggestions([]);
              }}
              aria-label="Clear selection"
            >
              ×
            </button>

            {/* Left: icon + info */}
            <div className="wander-selected-card-left">
              <div className="wander-selected-card-icon">
                {selectedDestination.icon}
              </div>
              <div className="wander-selected-card-info">
                <div className="wander-selected-card-eyebrow">
                  {selectedDestination.typeLabel === "City"
                    ? "City · " + (selectedDestination.subtitle || "")
                    : selectedDestination.typeLabel === "Country"
                      ? "Country"
                      : selectedDestination.typeLabel || "Destination"}
                </div>
                <h2 className="wander-selected-card-name">
                  {selectedDestination.name}
                </h2>
                {selectedDestination.subtitle &&
                  selectedDestination.typeLabel !== "Country" && (
                    <div className="wander-selected-card-location">
                      📍 {selectedDestination.subtitle}
                    </div>
                  )}

                {/* Quick facts */}
                <div className="wander-selected-card-facts">
                  <span className="wander-selected-card-fact">
                    {selectedDestination.typeLabel === "Country"
                      ? `🏙️ ${selectedDestination.subtitle}`
                      : `🌍 ${selectedDestination.subtitle || "International"}`}
                  </span>
                  <span className="wander-selected-card-fact-sep">·</span>
                  <span className="wander-selected-card-fact">
                    ✈️ Flights available
                  </span>
                  <span className="wander-selected-card-fact-sep">·</span>
                  <span className="wander-selected-card-fact">
                    🗓️ Year-round travel
                  </span>
                </div>

                {/* CTAs */}
                <div className="wander-selected-card-actions">
                  <button
                    className="wander-selected-card-cta-primary"
                    onClick={() => {
                      if (isAuthenticated) {
                        const today = new Date();
                        const next = new Date();
                        next.setDate(today.getDate() + 7);
                        dispatch(
                          addTrip({
                            destination: selectedDestination.name,
                            startDate:
                              checkIn || today.toISOString().split("T")[0],
                            endDate: next.toISOString().split("T")[0],
                            description: `Trip to ${selectedDestination.name}${selectedDestination.subtitle ? ", " + selectedDestination.subtitle : ""}`,
                          }),
                        );
                        navigate("/dashboard/trips");
                      } else {
                        navigate("/login");
                      }
                    }}
                  >
                    ✈️ Plan a Trip
                  </button>
                  <a
                    href="#wander-dest-section"
                    className="wander-selected-card-cta-secondary"
                  >
                    Explore destinations →
                  </a>
                </div>
              </div>
            </div>

            {/* Right: decorative destination preview */}
            <div className="wander-selected-card-right">
              <div className="wander-selected-card-preview">
                <div className="wander-selected-card-preview-bg" />
                <div className="wander-selected-card-preview-content">
                  <div className="wander-selected-card-preview-name">
                    {selectedDestination.name}
                  </div>
                  <div className="wander-selected-card-preview-sub">
                    {selectedDestination.typeLabel === "Country"
                      ? `${selectedDestination.subtitle}`
                      : selectedDestination.subtitle}
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="wander-selected-card-blob wander-selected-card-blob-1" />
                <div className="wander-selected-card-blob wander-selected-card-blob-2" />
                <div className="wander-selected-card-blob wander-selected-card-blob-3" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DESTINATIONS ═══ */}
      <section className="wander-section" id="wander-dest-section">
        <div className="wander-section-header">
          <div>
            <div className="wander-section-label">Top Picks</div>
            <div className="wander-section-title">
              {loading
                ? "Loading destinations…"
                : where.trim()
                  ? `${filteredDestinations.length} destination${filteredDestinations.length !== 1 ? "s" : ""} found`
                  : "Destinations that steal hearts"}
            </div>
          </div>
          <Link to={isAuthenticated ? "/dashboard/trips" : "/register"}>
            <button className="wander-see-all">View all destinations →</button>
          </Link>
        </div>
        {/* ── When user has typed/selected: show ONLY matched cards ── */}
        {where.trim() ? (
          filteredDestinations.length > 0 ? (
            <div className="wander-dest-grid-search">
              {filteredDestinations.map((dest, idx) => (
                <div
                  key={dest._id || idx}
                  className="wander-dest-card wander-dest-card-search"
                  onClick={() => handleAddTrip(dest)}
                >
                  <div className="wander-dest-card-img">
                    {dest.images?.[0] ? (
                      <img
                        src={dest.images[0]}
                        alt={dest.name}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="wander-dest-card-color-bg"
                        style={{
                          background: `hsl(${(idx * 47 + 200) % 360},40%,22%)`,
                          position: "absolute",
                          inset: 0,
                        }}
                      />
                    )}
                    <div className="wander-dest-overlay" />
                    {dest.category && (
                      <div className="wander-dest-tag">{dest.category}</div>
                    )}
                    <div className="wander-dest-info">
                      <div className="wander-dest-name">{dest.name}</div>
                      <div className="wander-dest-country">
                        {[dest.city, dest.state].filter(Boolean).join(", ") ||
                          "Destination"}
                        {dest.entrance_fee_inr != null && (
                          <>
                            {" "}
                            •{" "}
                            {dest.entrance_fee_inr === 0
                              ? "Free Entry"
                              : `₹${dest.entrance_fee_inr}`}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Zero results */
            <div className="wander-no-results">
              <div className="wander-no-results-icon">🌍</div>
              <div className="wander-no-results-title">
                No destinations found for "{where}"
              </div>
              <div className="wander-no-results-hint">
                Try searching for Bali, Paris, Goa or Dubai
              </div>
              <button
                className="wander-btn-primary"
                style={{
                  marginTop: "1.5rem",
                  fontSize: "0.85rem",
                  padding: "0.7rem 1.8rem",
                }}
                onClick={() => setWhere("")}
              >
                Clear Search
              </button>
            </div>
          )
        ) : (
          /* ── Default editorial 4-card grid (no active search) ── */
          <div className="wander-dest-grid">
            {/* TALL card */}
            {destinations[0] ? (
              <div
                className="wander-dest-card tall"
                onClick={() => handleAddTrip(destinations[0])}
              >
                <div className="wander-dest-card-img">
                  {destinations[0].images?.[0] ? (
                    <img
                      src={destinations[0].images[0]}
                      alt={destinations[0].name}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <SceneSantorini />
                  )}
                  <div className="wander-dest-overlay" />
                  <div className="wander-dest-tag">Trending</div>
                  <div className="wander-dest-info">
                    <div className="wander-dest-name">
                      {destinations[0].name || "Santorini"}
                    </div>
                    <div className="wander-dest-country">
                      {[destinations[0].city, destinations[0].state]
                        .filter(Boolean)
                        .join(", ") || "Greece"}{" "}
                      •{" "}
                      {destinations[0].entrance_fee_inr === 0
                        ? "Free Entry"
                        : destinations[0].entrance_fee_inr
                          ? `₹${destinations[0].entrance_fee_inr}`
                          : "Explore"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="wander-dest-card tall"
                style={{
                  background: "linear-gradient(135deg,#2D5986,#0F3A5C)",
                }}
              >
                <div className="wander-dest-card-img">
                  <SceneSantorini />
                  <div className="wander-dest-overlay" />
                  <div className="wander-dest-tag">Trending</div>
                  <div className="wander-dest-info">
                    <div className="wander-dest-name">Santorini</div>
                    <div className="wander-dest-country">
                      Greece • From ₹1,20,000
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Small cards */}
            {[
              {
                svgScene: <SceneAngkor />,
                fallbackName: "Angkor Wat",
                fallbackLoc: "Cambodia • From ₹65,000",
                bg: "linear-gradient(135deg,#5C4A2A,#2E2010)",
              },
              {
                svgScene: <SceneBali />,
                fallbackName: "Ubud, Bali",
                fallbackLoc: "Indonesia • From ₹55,000",
                bg: "linear-gradient(135deg,#2A5C3A,#0F2E18)",
              },
              {
                svgScene: <SceneSahara />,
                fallbackName: "Sahara Desert",
                fallbackLoc: "Morocco • From ₹95,000",
                bg: "linear-gradient(135deg,#5C3A2A,#2E150F)",
              },
            ].map((item, idx) => {
              const dest = destinations[idx + 1];
              return (
                <div
                  key={idx}
                  className="wander-dest-card"
                  style={{ background: item.bg }}
                  onClick={() => dest && handleAddTrip(dest)}
                >
                  <div className="wander-dest-card-img">
                    {dest?.images?.[0] ? (
                      <img
                        src={dest.images[0]}
                        alt={dest.name}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      item.svgScene
                    )}
                    <div className="wander-dest-overlay" />
                    <div className="wander-dest-info">
                      <div className="wander-dest-name">
                        {dest?.name || item.fallbackName}
                      </div>
                      <div className="wander-dest-country">
                        {dest
                          ? [dest.city, dest.state]
                              .filter(Boolean)
                              .join(", ") || item.fallbackLoc
                          : item.fallbackLoc}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
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

      {/* ═══ TESTIMONIAL ═══ */}
      <section className="wander-testi-section">
        <div>
          <div className="wander-testi-label">Traveller Stories</div>
          <div className="wander-testi-heading">
            Journeys that changed everything
          </div>
          <div className="wander-stars">★★★★★</div>
          <p className="wander-testi-quote">
            "PackGo turned our anniversary trip into something we'll tell
            grandkids about. Every single detail was perfect — from the sunrise
            hike in Santorini to the candlelit dinner by the Aegean."
          </p>
          <div className="wander-testi-author">
            <div className="wander-author-avatar">PS</div>
            <div>
              <div className="wander-author-name">Priya Sharma</div>
              <div className="wander-author-loc">Mumbai, India</div>
            </div>
          </div>
        </div>
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

      {/* ═══ FOOTER ═══ */}
      <footer className="wander-footer">
        <div className="wander-footer-top">
          <div className="wander-footer-brand">
            <Link to="/" className="wander-footer-logo">
              Pack<span>Go</span>
            </Link>

            <p>
              Discover breathtaking destinations, curated travel experiences,
              and unforgettable journeys with PackGo Travel.
            </p>
          </div>

          <div className="wander-footer-links-wrapper">
            <div className="wander-footer-col">
              <h4>Explore</h4>
              <a href="#wander-dest-section">Destinations</a>
              <a href="#wander-features">Experiences</a>
              <a href="#wander-features">Features</a>
            </div>

            <div className="wander-footer-col">
              <h4>Company</h4>
              <a href="/">About</a>
              <a href="/">Careers</a>
              <a href="/">Contact</a>
            </div>

            <div className="wander-footer-col">
              <h4>Support</h4>
              <a href="/">Help Center</a>
              <a href="/">Privacy Policy</a>
              <a href="/">Terms & Conditions</a>
            </div>
          </div>
        </div>

        <div className="wander-footer-bottom">
          <div className="wander-footer-copy">
            © {new Date().getFullYear()} PackGo Travel Co. All rights reserved.
          </div>

          <div className="wander-footer-socials">
            {/* Social media icons */}
            <a href="/" aria-label="Facebook">
              <FaFacebook />
            </a>
            <a href="/" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="/" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
