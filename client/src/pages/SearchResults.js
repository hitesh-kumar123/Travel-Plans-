import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { useSelector } from "react-redux";
import "./Home.css";
import api from "../services/api";
import AuthModal from "../components/AuthModal";

/* ── SVG SCENES ─────────────────────────────────────────────── */
const SceneIceland = () => (
  <svg viewBox="0 0 460 360" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
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
    <path d="M0,120 Q115,80 230,110 Q345,140 460,100" stroke="#2ECC87" strokeWidth="3" fill="none" opacity="0.4" />
    <path d="M0,140 Q115,100 230,130 Q345,160 460,120" stroke="#2ECC87" strokeWidth="2" fill="none" opacity="0.25" />
    <path d="M0,105 Q115,65 230,95 Q345,125 460,85" stroke="#7B5EA7" strokeWidth="2.5" fill="none" opacity="0.3" />
    <path d="M0,280 L60,190 L120,230 L180,170 L240,220 L310,155 L370,210 L420,175 L460,200 L460,360 L0,360Z" fill="#0D2438" />
    <path d="M0,360 L0,290 L40,250 L90,280 L150,235 L200,260 L260,220 L320,255 L380,230 L420,250 L460,235 L460,360Z" fill="#081828" />
    <path d="M150,235 L165,252 L135,252Z" fill="rgba(255,255,255,0.6)" />
    <path d="M260,220 L278,240 L242,240Z" fill="rgba(255,255,255,0.6)" />
    <path d="M380,230 L394,246 L366,246Z" fill="rgba(255,255,255,0.5)" />
    <ellipse cx="230" cy="330" rx="140" ry="22" fill="#1A3A5C" opacity="0.7" />
    <path d="M110,320 Q180,310 230,318 Q280,310 350,320" stroke="rgba(139,175,196,0.4)" strokeWidth="1.5" fill="none" />
    <g fill="#0A1F30">
      <polygon points="30,310 42,275 54,310" />
      <polygon points="26,310 42,268 58,310" />
      <polygon points="60,315 72,285 84,315" />
      <polygon points="390,305 402,270 414,305" />
      <polygon points="386,305 402,262 418,305" />
      <polygon points="415,312 428,280 441,312" />
    </g>
    <path d="M0,340 Q115,325 230,335 Q345,345 460,330 L460,360 L0,360Z" fill="#06121E" />
    <rect x="15" y="15" width="140" height="28" rx="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
    <text x="27" y="33" fontFamily="DM Sans,sans-serif" fontSize="11" fill="rgba(255,255,255,0.85)" fontWeight="500">Iceland Northern Lights</text>
  </svg>
);

const SceneSantorini = () => (
  <svg viewBox="0 0 300 460" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
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
    <path d="M195,260 Q215,255 235,260 L230,272 L200,272Z" fill="#F5EFE0" opacity="0.9" />
    <line x1="215" y1="258" x2="215" y2="230" stroke="rgba(255,255,255,0.7)" strokeWidth="1" />
    <path d="M20,310 Q75,305 130,312 Q185,305 240,312" stroke="rgba(255,255,255,0.15)" strokeWidth="1" fill="none" />
  </svg>
);

const SceneBali = () => (
  <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <rect width="240" height="220" fill="#1A3A28" />
    <rect width="240" height="140" fill="#0D2A1E" />
    <rect y="140" width="240" height="80" fill="#0A1E14" />
    <path d="M0,220 L0,170 Q60,155 120,165 Q180,175 240,160 L240,220Z" fill="#1A5C2A" />
    <path d="M0,200 L0,175 Q60,162 120,172 Q180,182 240,167 L240,200Z" fill="#145022" />
    <path d="M0,185 L0,178 Q60,165 120,175 Q180,185 240,170 L240,185Z" fill="#3D8A3A" />
    <path d="M20,172 Q80,167 140,170" stroke="rgba(100,180,130,0.4)" strokeWidth="1" fill="none" />
    <line x1="180" y1="220" x2="175" y2="145" stroke="#2C1A08" strokeWidth="5" />
    <ellipse cx="165" cy="148" rx="22" ry="10" fill="#1A5018" transform="rotate(-15 165 148)" />
    <ellipse cx="185" cy="143" rx="18" ry="8" fill="#154015" transform="rotate(10 185 143)" />
    <rect x="60" y="165" width="18" height="12" fill="#5C3A10" />
    <path d="M56,167 L69,155 L82,167Z" fill="#3D2408" />
  </svg>
);

const SceneSahara = () => (
  <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
    <rect width="240" height="220" fill="#2A1510" />
    <rect width="240" height="130" fill="#1A3050" />
    <path d="M0,50 Q120,30 240,60" stroke="rgba(200,210,255,0.15)" strokeWidth="20" fill="none" />
    <circle cx="30" cy="25" r="1" fill="white" opacity="0.8" />
    <circle cx="80" cy="15" r="1.2" fill="white" opacity="0.7" />
    <circle cx="150" cy="30" r="0.8" fill="white" opacity="0.9" />
    <circle cx="200" cy="20" r="1" fill="white" opacity="0.6" />
    <circle cx="60" cy="45" r="0.7" fill="white" opacity="0.5" />
    <circle cx="170" cy="55" r="1.1" fill="white" opacity="0.8" />
    <path d="M0,220 L0,160 Q50,130 100,148 Q150,165 200,140 Q225,128 240,135 L240,220Z" fill="#5C3A1A" />
    <path d="M0,220 L0,175 Q40,155 90,167 Q140,178 190,160 L240,165 L240,220Z" fill="#3D2510" />
    <path d="M0,220 L0,188 Q50,172 100,182 Q150,190 200,178 L240,182 L240,220Z" fill="#2A1A08" />
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

/* ── SVG ICONS ── */
const SearchIcon = ({ className }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SUGGESTED_DESTS = [
  { name: "Nearby", desc: "Find what's around you", icon: "📍" },
  { name: "Varanasi, Uttar Pradesh", desc: "Popular with travellers near you", icon: "🏙️" },
  { name: "Ranchi, Jharkhand", desc: "A hidden gem", icon: "🏡" },
  { name: "Puri, Odisha", desc: "For its seaside allure", icon: "🌊" },
];

const MOCK_DESTS = [
  {
    _id: "m1",
    name: "Santorini",
    city: "Oia",
    state: "Greece",
    images: ["https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000"],
    entrance_fee_inr: 120000,
    rating: "4.9",
    reviews: "2.1k",
    tag: "Trending"
  },
  {
    _id: "m2",
    name: "Iceland",
    city: "Reykjavik",
    state: "North Atlantic",
    images: ["https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?q=80&w=2000"],
    entrance_fee_inr: 89000,
    rating: "4.8",
    reviews: "1.2k",
    tag: "Top Rated"
  },
  {
    _id: "m3",
    name: "Ubud, Bali",
    city: "Ubud",
    state: "Indonesia",
    images: ["https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000"],
    entrance_fee_inr: 55000,
    rating: "4.7",
    reviews: "3.4k",
    tag: "Best Value"
  },
  {
    _id: "m4",
    name: "Sahara Desert",
    city: "Merzouga",
    state: "Morocco",
    images: ["https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000"],
    entrance_fee_inr: 95000,
    rating: "4.9",
    reviews: "890",
    tag: "Bucket List"
  },
  {
    _id: "m5",
    name: "Kyoto",
    city: "Gion",
    state: "Japan",
    images: ["https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000"],
    entrance_fee_inr: 75000,
    rating: "4.8",
    reviews: "1.5k",
    tag: "Cultural"
  },
  {
    _id: "m6",
    name: "Amalfi Coast",
    city: "Positano",
    state: "Italy",
    images: ["https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000"],
    entrance_fee_inr: 110000,
    rating: "4.9",
    reviews: "2.8k",
    tag: "Romantic"
  }
];

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  // const { isAuthenticated } = useSelector((s) => s.auth);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [where, setWhere] = useState(query);
  const [checkIn, setCheckIn] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [guestCount, setGuestCount] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);
  const [isComingSoonModalOpen, setIsComingSoonModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    setWhere(query);
  }, [query]);

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

  const searchBarRef = useRef(null);

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const handleDateClick = (day) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setCheckIn(d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }));
    setActiveField(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 150);
    };
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
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
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

  useEffect(() => {
    setLoading(true);
    api
      .get(`/destinations?q=${encodeURIComponent(query)}`)
      .then((r) => {
        if (r.data && r.data.length > 0) {
          setDestinations(r.data);
        } else {
          // Fallback filter mock dests
          const filtered = query.trim()
            ? MOCK_DESTS.filter(
              (d) =>
                (d.name || "").toLowerCase().includes(query.toLowerCase()) ||
                (d.city || "").toLowerCase().includes(query.toLowerCase()) ||
                (d.state || "").toLowerCase().includes(query.toLowerCase())
            )
            : MOCK_DESTS;
          setDestinations(filtered);
        }
        setLoading(false);
      })
      .catch(() => {
        const filtered = query.trim()
          ? MOCK_DESTS.filter(
            (d) =>
              (d.name || "").toLowerCase().includes(query.toLowerCase()) ||
              (d.city || "").toLowerCase().includes(query.toLowerCase()) ||
              (d.state || "").toLowerCase().includes(query.toLowerCase())
          )
          : MOCK_DESTS;
        setDestinations(filtered);
        setLoading(false);
      });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    setIsExpanded(false);
    if (where.trim()) {
      navigate(`/search?q=${encodeURIComponent(where.trim())}`);
    } else {
      navigate(`/search`);
    }
  };

  return (
    <div className="wander-page">
      {/* ═══ TWO-LEVEL HEADER ═══ */}
      <header className={`wander-header ${scrolled ? "scrolled" : ""} ${isExpanded ? "expanded" : ""}`}>
        {/* Row 1: Brand & Nav Links */}
        <div className="wander-nav-top">
          <Link to="/" className="wander-logo">
            <img src="/logo_chat.png" alt="PackGo" />
          </Link>

          {mobileMenuOpen && <div className="mobile-menu-backdrop show-mobile-only" onClick={() => setMobileMenuOpen(false)} onTouchMove={(e) => e.preventDefault()} />}
          <ul className={`wander-nav-center ${mobileMenuOpen ? "mobile-open" : ""}`} onTouchMove={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header show-mobile-only">
              <span className="mobile-menu-brand">PackGo</span>
              <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)} aria-label="Close">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <li onClick={() => setMobileMenuOpen(false)}>
              <Link to="/">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                <span>Home</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); navigate("/"); }}>
              <Link to="/">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span>India</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); setIsComingSoonModalOpen(true); }}>
              <Link to="/group-tours">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                <span>Group Tour</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); setIsComingSoonModalOpen(true); }}>
              <Link to="/packages">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                <span>Packages</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); setIsComingSoonModalOpen(true); }}>
              <Link to="/honeymoon">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>Honeymoon</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); setIsComingSoonModalOpen(true); }}>
              <Link to="/wedding">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polygon points="12 2 15 8 21 9 16.5 14 18 20 12 17 6 20 7.5 14 3 9 9 8 12 2"></polygon></svg>
                <span>Wedding</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); navigate("/"); }}>
              <Link to="/">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <span>About</span>
              </Link>
            </li>
            <li onClick={() => { setMobileMenuOpen(false); setIsComingSoonModalOpen(true); }}>
              <Link to="/contact">
                <svg className="nav-icon show-mobile-only" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <span>Contact</span>
              </Link>
            </li>
          </ul>

          <div className="wander-nav-right">
            <span className="become-host" onClick={() => { setAuthMode("register"); setIsAuthModalOpen(true); }}>Book Now</span>
            <button className="hamburger-btn show-mobile-only" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
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
          <div className="mobile-search-pill show-mobile-only" onClick={() => { setIsExpanded(true); setActiveField("where"); }}>
            <div className="pill-content">
              <SearchIcon className="pill-search-icon" />
              <div className="pill-text">
                <span className="pill-main">{where ? where : "Start your search"}</span>
                <span className="pill-sub">
                  {checkIn ? checkIn : "Any week"} • {(() => {
                    const total = Object.values(guestCount).reduce((a, b) => a + b, 0);
                    return total > 0 ? `${total} guest${total > 1 ? "s" : ""}` : "Add guests";
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* 💻 DESKTOP COMPACT PILL */}
          {scrolled && !isExpanded && !isMobile ? (
            <div className="wander-compact-pill hide-mobile">
              <div className="compact-item" onClick={() => { setIsExpanded(true); setActiveField("where"); }}>{where || "Anywhere"}</div>
              <div className="compact-sep"></div>
              <div className="compact-item" onClick={() => { setIsExpanded(true); setActiveField("when"); }}>{checkIn || "Anytime"}</div>
              <div className="compact-sep"></div>
              <div className="compact-item" onClick={() => { setIsExpanded(true); setActiveField("who"); }}>
                {(() => {
                  const total = Object.values(guestCount).reduce((a, b) => a + b, 0);
                  return total > 0 ? `${total} guest${total > 1 ? "s" : ""}` : "Add Guests";
                })()}
              </div>
              <button className="compact-search-btn" onClick={() => { setIsExpanded(true); setActiveField("where"); }}>
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
                    <div className={`wander-sf ${activeField === "where" ? "active" : ""}`} onClick={() => setActiveField(activeField === "where" ? null : "where")}>
                      <div className="wander-sf-main">
                        <div className="wander-sf-label">Where</div>
                        <input className="wander-sf-val" placeholder="Search destinations" value={where} onChange={(e) => setWhere(e.target.value)} />
                      </div>
                      {where && (
                        <button type="button" className="sf-clear-btn" onClick={(e) => { e.stopPropagation(); setWhere(""); }}>
                          <svg width="12" height="12" viewBox="0 0 32 32"><path d="m6 6 20 20M26 6 6 26" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                        </button>
                      )}
                      {activeField === "where" && (
                        <div className="search-dropdown dest-dropdown">
                          <div className="dropdown-title">Suggested destinations</div>
                          {SUGGESTED_DESTS.map((d, i) => (
                            <div key={i} className="dest-item" onClick={() => { setWhere(d.name); setActiveField(null); setIsExpanded(false); navigate(`/search?q=${encodeURIComponent(d.name)}`); }}>
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

                    <div className={`wander-sf ${activeField === "when" ? "active" : ""}`} onClick={() => setActiveField(activeField === "when" ? null : "when")}>
                      <div className="wander-sf-main">
                        <div className="wander-sf-label">When</div>
                        <div className="wander-sf-val">{checkIn || "Add dates"}</div>
                      </div>
                      {checkIn && (
                        <button type="button" className="sf-clear-btn" onClick={(e) => { e.stopPropagation(); setCheckIn(""); }}>
                          <svg width="12" height="12" viewBox="0 0 32 32"><path d="m6 6 20 20M26 6 6 26" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                        </button>
                      )}
                      {activeField === "when" && (
                        <div className="search-dropdown date-dropdown">
                          <div className="calendar-header">
                            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))); }}>&lt;</button>
                            <div className="calendar-month-year">{currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
                            <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))); }}>&gt;</button>
                          </div>
                          <div className="calendar-grid">
                            {[...Array(daysInMonth(currentMonth))].map((_, i) => (
                              <div
                                key={i + 1}
                                className={`calendar-day ${checkIn === `${i + 1} ${currentMonth.toLocaleString('default', { month: 'short' })}` ? "selected" : ""}`}
                                onClick={(e) => { e.stopPropagation(); handleDateClick(i + 1); setActiveField("who"); }}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`wander-sf ${activeField === "who" ? "active" : ""}`} onClick={() => setActiveField(activeField === "who" ? null : "who")}>
                      <div className="wander-sf-main">
                        <div className="wander-sf-label">Who</div>
                        <div className="wander-sf-val">
                          {(() => {
                            const total = Object.values(guestCount).reduce((a, b) => a + b, 0);
                            return total > 0 ? `${total} guest${total > 1 ? "s" : ""}` : "Add guests";
                          })()}
                        </div>
                      </div>
                      {Object.values(guestCount).some((v) => v > 0) && (
                        <button type="button" className="sf-clear-btn" onClick={(e) => { e.stopPropagation(); setGuestCount({ adults: 0, children: 0, infants: 0, pets: 0 }); }}>
                          <svg width="12" height="12" viewBox="0 0 32 32"><path d="m6 6 20 20M26 6 6 26" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                        </button>
                      )}
                      {activeField === "who" && (
                        <div className="search-dropdown guest-dropdown" onClick={(e) => e.stopPropagation()}>
                          {['adults', 'children', 'infants', 'pets'].map((k) => (
                            <div key={k} className="guest-row">
                              <div className="guest-info">
                                <div className="guest-type">{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                                <div className="guest-age">{k === 'adults' ? 'Ages 13+' : k === 'children' ? 'Ages 2–12' : k === 'infants' ? 'Under 2' : 'Service animals'}</div>
                              </div>
                              <div className="guest-controls">
                                <button type="button" onClick={() => setGuestCount((p) => ({ ...p, [k]: Math.max(0, p[k] - 1) }))}>-</button>
                                <span>{guestCount[k]}</span>
                                <button type="button" onClick={() => setGuestCount((p) => ({ ...p, [k]: p[k] + 1 }))}>+</button>
                              </div>
                            </div>
                          ))}
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

      {/* ═══ SEARCH RESULTS SECTION ═══ */}
      <section className="wander-section" style={{ paddingTop: scrolled ? "140px" : "220px", minHeight: "85vh", transition: "padding-top 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div className="wander-section-header">
          <div>
            <div className="wander-section-label">Search Results</div>
            <div className="wander-section-title">
              {loading
                ? "Searching destinations…"
                : `${destinations.length} destination${destinations.length !== 1 ? "s" : ""} found ${query ? `for "${query}"` : ""}`}
            </div>
          </div>
          {query && (
            <button className="wander-see-all" onClick={() => navigate("/search")}>
              Clear search filter →
            </button>
          )}
        </div>

        <div className="wander-dest-grid">
          {destinations.map((dest, i) => (
            <div
              key={dest._id || i}
              className="wander-dest-card"
              onClick={() => dest?._id && navigate(`/destination/${dest._id}`)}
            >
              <div className="wander-dest-card-img">
                {dest.images?.[0] ? (
                  <img
                    src={dest.images[0]}
                    alt={dest.name}
                    className="wander-zoom-img"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="dest-svg-placeholder">
                    {i % 4 === 0 ? <SceneSantorini /> : i % 4 === 1 ? <SceneIceland /> : i % 4 === 2 ? <SceneBali /> : <SceneSahara />}
                  </div>
                )}
                <div className="wander-dest-overlay" />

                <div className="wander-card-tag">
                  {i % 3 === 0 ? "Trending" : i % 3 === 1 ? "Top Rated" : "Best Value"}
                </div>

                <div className="wander-card-rating">
                  4.{8 + (i % 2)}★
                </div>

                <div className="wander-dest-info">
                  <div className="wander-dest-name">{dest.name}</div>
                  <div className="wander-dest-country">
                    {[dest.city, dest.state].filter(Boolean).join(", ") || "Explore"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="wander-footer">
        <div className="wander-footer-main">
          <div className="footer-col">
            <h4>Support</h4>
            <button type="button" className="footer-link-btn">Help Centre</button>
            <button type="button" className="footer-link-btn">AirCover</button>
            <button type="button" className="footer-link-btn">Anti-discrimination</button>
            <button type="button" className="footer-link-btn">Disability support</button>
            <button type="button" className="footer-link-btn">Cancellation options</button>
            <button type="button" className="footer-link-btn">Report neighbourhood concern</button>
          </div>
          <div className="footer-col">
            <h4>Hosting</h4>
            <button type="button" className="footer-link-btn">PackGo your home</button>
            <button type="button" className="footer-link-btn">AirCover for Hosts</button>
            <button type="button" className="footer-link-btn">Hosting resources</button>
            <button type="button" className="footer-link-btn">Community forum</button>
            <button type="button" className="footer-link-btn">Hosting responsibly</button>
            <button type="button" className="footer-link-btn">Join a free hosting class</button>
          </div>
          <div className="footer-col">
            <h4>PackGo</h4>
            <button type="button" className="footer-link-btn">Newsroom</button>
            <button type="button" className="footer-link-btn">New features</button>
            <button type="button" className="footer-link-btn">Careers</button>
            <button type="button" className="footer-link-btn">Investors</button>
            <button type="button" className="footer-link-btn">PackGo stays</button>
            <button type="button" className="footer-link-btn">Emergency support</button>
          </div>
        </div>

        <div className="wander-footer-bottom">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} PackGo, Inc.</span>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">Privacy</button>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">Terms</button>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">Sitemap</button>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">Company details</button>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-util">
              <span className="util-item">🌐 English (IN)</span>
              <span className="util-item">₹ INR</span>
            </div>
            <div className="footer-socials">
              <button type="button" className="footer-link-btn" aria-label="Facebook"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg></button>
              <button type="button" className="footer-link-btn" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.92 4.92 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg></button>
              <button type="button" className="footer-link-btn" aria-label="Instagram"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.199-4.345-2.621-6.777-6.979-6.978C15.668.014 15.259 0 12 0z" /><path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.137a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg></button>
            </div>
          </div>
        </div>
      </footer>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* 📱 MOBILE BOTTOM NAVIGATION (Airbnb Style) */}
      {(!isExpanded && !mobileMenuOpen) && (
        <div className="mobile-bottom-nav show-mobile-only">
          <div className="mobile-nav-item active">
            <SearchIcon />
            <span>Explore</span>
          </div>
          <div className="mobile-nav-item">
            <HeartIcon />
            <span>Wishlists</span>
          </div>
          <div className="mobile-nav-item" onClick={() => { setAuthMode("login"); setIsAuthModalOpen(true); }}>
            <UserIcon />
            <span>Log in</span>
          </div>
        </div>
      )}
      {/* 📱 FULL-SCREEN MOBILE SEARCH OVERLAY (Root Level) */}
      {isExpanded && isMobile && (
        <div className="mobile-search-overlay">
          <div className="overlay-header">
            <button className="close-overlay" onClick={() => setIsExpanded(false)}>✕</button>
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
                      { name: "Nearby", desc: "Find what's around you", icon: "📍" },
                      { name: "Varanasi, Uttar Pradesh", desc: "Popular with travellers near you", icon: "🏛️" },
                      { name: "Ranchi, Jharkhand", desc: "A hidden gem", icon: "🏞️" },
                      { name: "Puri, Odisha", desc: "For its seaside allure", icon: "🏖️" },
                      { name: "Kolkata, West Bengal", desc: "For sights like Victoria Memorial", icon: "🎨" }
                    ].map((d, i) => (
                      <div key={i} className="suggested-item" onClick={() => { setWhere(d.name); setActiveField("when"); }}>
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
              <div className="overlay-card collapsed" onClick={() => setActiveField("where")}>
                <span className="collapsed-label">Where</span>
                <span className="collapsed-val">{where || "Search destinations"}</span>
              </div>
            )}

            {/* When Card */}
            {activeField === "when" ? (
              <div className="overlay-card active-card">
                <h3>When?</h3>
                <div className="calendar-header">
                  <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))); }}>&lt;</button>
                  <div className="calendar-month-year">{currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</div>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))); }}>&gt;</button>
                </div>
                <div className="calendar-grid">
                  {[...Array(daysInMonth(currentMonth))].map((_, i) => (
                    <div
                      key={i + 1}
                      className={`calendar-day ${checkIn === `${i + 1} ${currentMonth.toLocaleString('default', { month: 'short' })}` ? "selected" : ""}`}
                      onClick={(e) => { e.stopPropagation(); handleDateClick(i + 1); setActiveField("who"); }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overlay-card collapsed" onClick={() => setActiveField("when")}>
                <span className="collapsed-label">When</span>
                <span className="collapsed-val">{checkIn || "Add dates"}</span>
              </div>
            )}

            {/* Who Card */}
            {activeField === "who" ? (
              <div className="overlay-card active-card">
                <h3>Who?</h3>
                <div className="guests-list">
                  {['adults', 'children', 'infants', 'pets'].map(k => (
                    <div key={k} className="guest-row">
                      <div className="guest-info">
                        <div className="guest-type">{k.charAt(0).toUpperCase() + k.slice(1)}</div>
                        <div className="guest-age">{k === 'adults' ? 'Ages 13+' : k === 'children' ? 'Ages 2–12' : k === 'infants' ? 'Under 2' : 'Service animals'}</div>
                      </div>
                      <div className="guest-controls">
                        <button type="button" onClick={() => setGuestCount(p => ({ ...p, [k]: Math.max(0, p[k] - 1) }))}>-</button>
                        <span>{guestCount[k]}</span>
                        <button type="button" onClick={() => setGuestCount(p => ({ ...p, [k]: p[k] + 1 }))}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="overlay-card collapsed" onClick={() => setActiveField("who")}>
                <span className="collapsed-label">Who</span>
                <span className="collapsed-val">
                  {(() => {
                    const total = Object.values(guestCount).reduce((a, b) => a + b, 0);
                    return total > 0 ? `${total} guest${total > 1 ? "s" : ""}` : "Add guests";
                  })()}
                </span>
              </div>
            )}
          </div>

          <div className="overlay-footer">
            <button className="clear-all" onClick={() => { setWhere(""); setCheckIn(""); setGuestCount({ adults: 0, children: 0, infants: 0, pets: 0 }); }}>Clear all</button>
            <button className="pink-search-btn" onClick={handleSearch}>
              <SearchIcon />
              <span>Search</span>
            </button>
          </div>
        </div>
      )}
      {/* 🛠️ COMING SOON MODAL 🛠️ */}
      {isComingSoonModalOpen && (
        <div className="coming-soon-overlay" onClick={() => setIsComingSoonModalOpen(false)}>
          <div className="coming-soon-card" onClick={(e) => e.stopPropagation()}>
            <button className="cs-close-btn" onClick={() => setIsComingSoonModalOpen(false)}>×</button>
            <div className="cs-icon">✨</div>
            <h2>Coming Soon!</h2>
            <p>We're currently handcrafting this experience to make it absolutely perfect for you. Stay tuned for something extraordinary.</p>
            <div className="cs-badge">Coming Very Soon</div>
            <button className="cs-btn-primary" onClick={() => setIsComingSoonModalOpen(false)}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
