import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Search, Sun, Moon, Map, Shield, Zap, Menu, X, Calendar, MapPin, Users } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Home.css";
import api from "../services/api";
import { addTrip } from "../redux/actions/tripActions";

/* ── SVG SCENES ── */
const SceneIceland = () => (
  <svg viewBox="0 0 460 360" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
    <defs>
      <linearGradient id="icelandSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0F2D4A" />
        <stop offset="100%" stopColor="#1A4A6B" />
      </linearGradient>
      <linearGradient id="aurora" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2ECC87" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#7B5EA7" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#2ECC87" stopOpacity="0.3" />
      </linearGradient>
    </defs>
    <rect width="460" height="360" fill="url(#icelandSky)" />
    {[...Array(15)].map((_, i) => (
      <circle key={i} cx={20 + i * 30 + (i % 4) * 12} cy={18 + (i % 6) * 10} r="1.2" fill="white" opacity={0.5 + Math.random() * 0.4} />
    ))}
    <circle cx="390" cy="55" r="24" fill="#FFF5D6" opacity="0.95" />
    <circle cx="400" cy="48" r="18" fill="#0F2D4A" />
    <path d="M0,120 Q115,80 230,110 Q345,140 460,100" stroke="url(#aurora)" strokeWidth="4" fill="none" />
    <path d="M0,140 Q115,100 230,130 Q345,160 460,120" stroke="#2ECC87" strokeWidth="2" fill="none" opacity="0.3" />
    <path d="M0,280 L60,190 L120,230 L180,170 L240,220 L310,155 L370,210 L420,175 L460,200 L460,360 L0,360Z" fill="#0D2438" />
    <path d="M0,360 L0,290 L40,250 L90,280 L150,235 L200,260 L260,220 L320,255 L380,230 L420,250 L460,235 L460,360Z" fill="#081828" />
    <path d="M150,235 L165,252 L135,252Z" fill="rgba(255,255,255,0.7)" />
    <path d="M260,220 L278,240 L242,240Z" fill="rgba(255,255,255,0.7)" />
    <path d="M380,230 L394,246 L366,246Z" fill="rgba(255,255,255,0.6)" />
    <path d="M0,340 Q115,325 230,335 Q345,345 460,330 L460,360 L0,360Z" fill="#06121E" />
  </svg>
);

const SceneSantorini = () => (
  <svg viewBox="0 0 300 460" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
    <defs>
      <linearGradient id="santoriniSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1A4060" />
        <stop offset="100%" stopColor="#0D2D44" />
      </linearGradient>
    </defs>
    <rect width="300" height="460" fill="url(#santoriniSky)" />
    <rect y="280" width="300" height="180" fill="#0D2D44" />
    <ellipse cx="80" cy="90" rx="55" ry="22" fill="rgba(255,255,255,0.08)" />
    <circle cx="240" cy="130" r="38" fill="#F4C460" opacity="0.9" />
    <rect y="260" width="300" height="30" fill="#E87820" opacity="0.3" />
    <path d="M0,460 L0,320 Q40,290 80,310 L80,460Z" fill="#0A1E2E" />
    <path d="M220,460 L220,300 Q260,280 300,295 L300,460Z" fill="#0A1E2E" />
    <path d="M95,460 L95,340 Q110,310 130,340 L130,460Z" fill="#F5EFE0" />
    <ellipse cx="130" cy="340" rx="35" ry="12" fill="#E8DCC8" />
    <circle cx="130" cy="325" r="12" fill="#1A7FA0" />
  </svg>
);

const SceneAngkor = () => (
  <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
    <defs>
      <linearGradient id="angkorSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8C42" />
        <stop offset="50%" stopColor="#E87C30" />
        <stop offset="100%" stopColor="#3D2910" />
      </linearGradient>
    </defs>
    <rect width="240" height="220" fill="url(#angkorSky)" />
    <rect y="140" width="240" height="80" fill="#1E1208" />
    <circle cx="40" cy="60" r="50" fill="#1A4A1A" opacity="0.8" />
    <circle cx="120" cy="40" r="60" fill="#154015" opacity="0.7" />
    <circle cx="200" cy="55" r="45" fill="#1A4A1A" opacity="0.8" />
    <path d="M80,220 L80,120 L90,105 L100,100 L110,105 L120,120 L120,220Z" fill="#C4A35A" />
    <rect x="88" y="95" width="24" height="12" fill="#B8923E" />
    <rect x="92" y="83" width="16" height="14" fill="#A07D32" />
    <rect x="96" y="72" width="8" height="13" fill="#8B6B2A" />
    <line x1="100" y1="100" x2="100" y2="80" stroke="#D4B36A" strokeWidth="2" />
    <line x1="100" y1="100" x2="110" y2="95" stroke="#D4B36A" strokeWidth="2" />
    <line x1="100" y1="100" x2="90" y2="95" stroke="#D4B36A" strokeWidth="2" />
  </svg>
);

const SceneBali = () => (
  <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
    <defs>
      <linearGradient id="baliSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4A8C6A" />
        <stop offset="100%" stopColor="#1A3A28" />
      </linearGradient>
    </defs>
    <rect width="240" height="220" fill="url(#baliSky)" />
    <rect width="240" height="140" fill="#0D2A1E" />
    <path d="M0,220 L0,170 Q60,155 120,165 Q180,175 240,160 L240,220Z" fill="#2D6A3A" />
    <path d="M0,200 L0,175 Q60,162 120,172 Q180,182 240,167 L240,200Z" fill="#1E5528" />
    <line x1="180" y1="220" x2="175" y2="145" stroke="#4A2A10" strokeWidth="5" />
    <ellipse cx="165" cy="148" rx="22" ry="10" fill="#1A5018" transform="rotate(-15 165 148)" />
    <rect x="60" y="165" width="18" height="12" fill="#8B6B3A" />
    <path d="M56,167 L69,155 L82,167Z" fill="#6B4A1A" />
  </svg>
);

const SceneSahara = () => (
  <svg viewBox="0 0 240 220" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
    <defs>
      <linearGradient id="saharaSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#2A1510" />
        <stop offset="60%" stopColor="#1A3050" />
        <stop offset="100%" stopColor="#2A1510" />
      </linearGradient>
    </defs>
    <rect width="240" height="220" fill="url(#saharaSky)" />
    <path d="M0,220 L0,160 Q50,130 100,148 Q150,165 200,140 Q225,128 240,135 L240,220Z" fill="#C4884A" />
    <path d="M0,220 L0,175 Q40,155 90,167 Q140,178 190,160 L240,165 L240,220Z" fill="#A0703A" />
    <ellipse cx="120" cy="162" rx="20" ry="10" fill="#1A0C04" opacity="0.8" />
  </svg>
);

const DestinationMedia = ({ src, alt, fallback }) => {
  const [failed, setFailed] = useState(false);
  if (src && !failed) {
    return <img className="wander-dest-media" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
  }
  return fallback || null;
};

/* ── Animation Variants ── */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

/* ── Component ── */
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);

  const getInitialTheme = () => {
    if (typeof window === "undefined") return "light";
    const savedTheme = window.localStorage.getItem("packgo-theme");
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [travellers, setTravellers] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    api.get("/destinations")
      .then((r) => {
        setDestinations(Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.destinations) ? r.data.destinations : []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("packgo-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const handleAddTrip = (dest) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + 7);
    dispatch(addTrip({
      destination: dest.name,
      startDate: checkIn || today.toISOString().split("T")[0],
      endDate: next.toISOString().split("T")[0],
      description: `Trip to ${dest.city || dest.name}`,
    }));
    navigate("/dashboard/trips");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    document.getElementById("wander-dest-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredDestinations = where.trim()
    ? (Array.isArray(destinations) ? destinations : []).filter(d =>
        (d.name || "").toLowerCase().includes(where.toLowerCase()) ||
        (d.city || "").toLowerCase().includes(where.toLowerCase()) ||
        (d.state || "").toLowerCase().includes(where.toLowerCase()) ||
        (d.category || "").toLowerCase().includes(where.toLowerCase())
      )
    : (Array.isArray(destinations) ? destinations : []);

  const editorialDests = filteredDestinations.slice(0, 4);

  return (
    <div className="wander-page" data-theme={theme}>
      {/* Navbar */}
      <nav className={`wander-nav ${scrolled ? "wander-nav-scrolled" : ""}`}>
        <Link to="/" className="wander-logo">Pack<span>Go</span></Link>

        <ul className="wander-nav-links">
          <li><a href="#wander-dest-section">Destinations</a></li>
          <li><a href="#wander-features">Experiences</a></li>
          <li><a href="#wander-testimonials">Reviews</a></li>
          {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
        </ul>

        <div className="wander-nav-actions">
          <button type="button" className="wander-theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {isAuthenticated ? (
            <Link to="/dashboard"><button className="wander-btn-primary">My Dashboard</button></Link>
          ) : (
            <Link to="/register"><button className="wander-btn-primary">Book Now</button></Link>
          )}
        </div>

        <button className="wander-mobile-menu" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="wander-mobile-dropdown">
          <a href="#wander-dest-section" onClick={() => setMobileOpen(false)}>Destinations</a>
          <a href="#wander-features" onClick={() => setMobileOpen(false)}>Features</a>
          <a href="#wander-testimonials" onClick={() => setMobileOpen(false)}>Reviews</a>
          {isAuthenticated ? (
            <Link to="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)}>Log In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)}>Sign Up Free →</Link>
            </>
          )}
        </div>
      )}

      {/* Hero Section */}
      <section className="wander-hero">
        <div className="wander-hero-badge">
          <div className="dot" /> 2,400+ destinations worldwide
        </div>
        <h1>Travel is the only thing you buy that makes you <em>richer</em></h1>
        <p>Curated journeys to the world's most extraordinary places. Handpicked experiences, flawless planning, memories that last forever.</p>
        
        <form className="wander-search-bar" onSubmit={handleSearch}>
          <div className="wander-sf">
            <div className="wander-sf-label"><MapPin size={14} /> Where to</div>
            <input type="text" placeholder="Search destinations..." value={where} onChange={(e) => setWhere(e.target.value)} />
          </div>
          <div className="wander-sf">
            <div className="wander-sf-label"><Calendar size={14} /> Check In</div>
            <DatePicker 
              selected={checkIn} 
              onChange={(date) => setCheckIn(date)} 
              placeholderText="Add dates"
              className="wander-sf-val"
              minDate={new Date()}
              dateFormat="MMM d, yyyy"
            />
          </div>
          <div className="wander-sf">
            <div className="wander-sf-label"><Users size={14} /> Travellers</div>
            <input type="text" placeholder="2 Adults, 1 Child" value={travellers} onChange={(e) => setTravellers(e.target.value)} />
          </div>
          <button type="submit" className="wander-search-btn"><Search size={18} /> Search</button>
        </form>
      </section>

      {/* Destinations Section */}
      <motion.section 
        className="wander-section" id="wander-dest-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
      >
        <div className="wander-section-header">
          <div>
            <div className="wander-section-label">Top Picks</div>
            <div className="wander-section-title">
              {loading ? "Curating destinations..." : where.trim() ? `${filteredDestinations.length} escapes found` : "Destinations that steal hearts"}
            </div>
          </div>
        </div>

        <div className="wander-dest-grid">
          {editorialDests[0] ? (
            <motion.div variants={fadeInUp} className="wander-dest-card tall" onClick={() => handleAddTrip(editorialDests[0])}>
              <DestinationMedia src={editorialDests[0].images?.[0]} alt={editorialDests[0].name} fallback={<SceneSantorini />} />
              <div className="wander-dest-overlay" />
              <div className="wander-dest-info">
                <div className="wander-dest-name">{editorialDests[0].name}</div>
                <div className="wander-dest-country">
                  {[editorialDests[0].city, editorialDests[0].state].filter(Boolean).join(", ") || "Europe"}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="wander-dest-card tall" onClick={() => handleAddTrip({ name: "Santorini" })}>
              <SceneSantorini />
              <div className="wander-dest-overlay" />
              <div className="wander-dest-info">
                <div className="wander-dest-name">Santorini</div>
                <div className="wander-dest-country">Greece • From ₹1,20,000</div>
              </div>
            </motion.div>
          )}

          {[
            { svg: <SceneAngkor />, name: "Angkor Wat", loc: "Cambodia • From ₹65,000" },
            { svg: <SceneBali />, name: "Ubud, Bali", loc: "Indonesia • From ₹55,000" },
            { svg: <SceneSahara />, name: "Sahara Desert", loc: "Morocco • From ₹95,000" },
          ].map((item, idx) => {
            const dest = editorialDests[idx + 1];
            return (
              <motion.div key={idx} variants={fadeInUp} className="wander-dest-card" onClick={() => dest && handleAddTrip(dest)}>
                <DestinationMedia src={dest?.images?.[0]} alt={dest?.name || item.name} fallback={item.svg} />
                <div className="wander-dest-overlay" />
                <div className="wander-dest-info">
                  <div className="wander-dest-name">{dest?.name || item.name}</div>
                  <div className="wander-dest-country">
                    {dest ? [dest.city, dest.state].filter(Boolean).join(", ") || item.loc : item.loc}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Features */}
      <section className="wander-features" id="wander-features">
        <motion.div 
          className="wander-section"
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <div className="wander-section-header">
            <div>
              <div className="wander-section-label">Why PackGo</div>
              <div className="wander-section-title">Travel smarter, not harder</div>
            </div>
          </div>
          <div className="wander-feat-grid">
            {[
              { icon: <Map size={28} />, title: "Curated Itineraries", desc: "Handcrafted routes designed by local travel experts for the perfect experience." },
              { icon: <Shield size={28} />, title: "Safe & Insured", desc: "Full trip protection and 24/7 emergency support included in all packages." },
              { icon: <Zap size={28} />, title: "Instant Booking", desc: "Confirm your dream holiday in minutes without endless back-and-forth emails." }
            ].map((f, i) => (
              <motion.div key={i} variants={fadeInUp} className="wander-feat-card">
                <div className="wander-feat-icon">{f.icon}</div>
                <div className="wander-feat-title">{f.title}</div>
                <div className="wander-feat-desc">{f.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <motion.section 
        className="wander-section" id="wander-testimonials"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
      >
        <div className="wander-testi-grid">
          <motion.div variants={fadeInUp}>
            <div className="wander-section-label">Traveller Stories</div>
            <div className="wander-section-title" style={{marginBottom: "2rem"}}>Journeys that changed everything</div>
            <div className="wander-quote">
              PackGo turned our anniversary trip into something we'll tell grandkids about. Every single detail was perfect.
            </div>
            <div className="wander-author">
              <div className="wander-author-avatar">PS</div>
              <div>
                <div className="wander-author-name">Priya Sharma</div>
                <div className="wander-author-loc">Mumbai, India</div>
              </div>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp} className="wander-stats">
            {[
              { big: "2.4K+", desc: "Destinations available" },
              { big: "98%", desc: "Customer satisfaction" },
              { big: "14yr", desc: "Of travel expertise" },
              { big: "180+", desc: "Countries covered" }
            ].map((s, i) => (
              <div key={i} className="wander-stat-box">
                <div className="wander-stat-big">{s.big}</div>
                <div className="wander-stat-desc">{s.desc}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* CTA */}
      <motion.div 
        className="wander-cta"
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
      >
        <h2>Your next adventure is one click away</h2>
        <p>Join 40,000+ travellers who explored the world with PackGo</p>
        <Link to={isAuthenticated ? "/dashboard/trips" : "/register"}>
          <button className="wander-btn-primary">{isAuthenticated ? "Plan My Trip" : "Create Free Account"}</button>
        </Link>
      </motion.div>

      {/* Footer */}
      <footer className="wander-footer">
        <div className="wander-footer-grid">
          <div className="wander-footer-col">
            <Link to="/" className="wander-logo" style={{display: 'inline-block', marginBottom: '1rem'}}>Pack<span>Go</span></Link>
            <p>Discover breathtaking destinations, curated travel experiences, and unforgettable journeys.</p>
          </div>
          <div className="wander-footer-col">
            <h4>Explore</h4>
            <a href="#wander-dest-section">Destinations</a>
            <a href="#wander-features">Experiences</a>
            <a href="#wander-testimonials">Reviews</a>
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
            <a href="/">Terms</a>
          </div>
        </div>
        <div className="wander-footer-bottom">
          <div>© {new Date().getFullYear()} PackGo Travel Co. All rights reserved.</div>
          <div className="wander-socials">
            <a href="/"><FaFacebook size={20} /></a>
            <a href="/"><FaInstagram size={20} /></a>
            <a href="/"><FaTwitter size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;