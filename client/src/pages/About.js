// src/pages/About.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "./Home.css";

/* ── TEAM DATA ── */
const TEAM = [
  {
    initials: "AK",
    name: "Aryan Kapoor",
    role: "Co-Founder & CEO",
    bio: "Former travel journalist with 12 years exploring 80+ countries. Aryan founded PackGo to make world-class travel accessible to everyone.",
    color: "#1a4a6b",
  },
  {
    initials: "NS",
    name: "Nisha Sharma",
    role: "Co-Founder & CTO",
    bio: "Ex-Google engineer turned travel-tech pioneer. Nisha architects the AI-powered itinerary engine that powers every PackGo journey.",
    color: "#e8735a",
  },
  {
    initials: "RV",
    name: "Ravi Verma",
    role: "Head of Experiences",
    bio: "Certified sommelier and cultural anthropologist. Ravi hand-picks every local experience, restaurant, and hidden gem in our catalogue.",
    color: "#2a6b4a",
  },
  {
    initials: "PM",
    name: "Priya Mehta",
    role: "Head of Customer Joy",
    bio: "10-year hospitality veteran. Priya leads the 24/7 support team ensuring every traveller feels cared for, before, during, and after their trip.",
    color: "#7b5ea7",
  },
];

/* ── WHY CHOOSE US DATA ── */
const WHY_US = [
  {
    icon: "🧭",
    title: "Expert Curation",
    desc: "Every destination, stay, and experience is handpicked by our in-house travel specialists — not algorithms.",
  },
  {
    icon: "💸",
    title: "Transparent Pricing",
    desc: "No hidden fees, no surprise surcharges. What you see is exactly what you pay — guaranteed.",
  },
  {
    icon: "⭐",
    title: "4.9★ Satisfaction",
    desc: "Rated best-in-class across 1,240+ verified reviews. Our travellers keep coming back — and bringing friends.",
  },
  {
    icon: "🛡️",
    title: "Trusted & Secure",
    desc: "100% secure booking, flexible cancellation policies, and full travel insurance partnership options.",
  },
  {
    icon: "🌐",
    title: "2,400+ Destinations",
    desc: "From the Himalayan foothills to Patagonian glaciers — we cover every corner of the globe.",
  },
  {
    icon: "🕐",
    title: "24/7 Live Support",
    desc: "Real humans, real help, any time. Flight delayed at 3 AM? We've got you covered instantly.",
  },
];

const About = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="wander-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`wander-nav ${scrolled ? "wander-nav-scrolled" : ""}`}>
        <Link to="/" className="wander-logo">
          Pack<span>Go</span>
        </Link>

        <ul className="wander-nav-links">
          <li><a href="/#wander-dest-section">Destinations</a></li>
          <li><a href="/#wander-features">Features</a></li>
          <li><a href="/#wander-testimonials">Experiences</a></li>
          <li><Link to="/about" style={{ opacity: 1, color: "var(--coral)" }}>About</Link></li>
          <li><Link to="/travel-checklist">Checklist</Link></li>
        </ul>

        <Link to="/register">
          <button className="wander-nav-cta">Book Now</button>
        </Link>

        <button
          className="wander-mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {mobileOpen && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0,
            background: "var(--white)", borderBottom: "0.5px solid rgba(26,74,107,0.12)",
            boxShadow: "0 16px 32px rgba(15,45,64,0.14)", padding: "1rem 1.5rem",
            display: "flex", flexDirection: "column", gap: "1rem", zIndex: 1001,
          }}>
            <a href="/#wander-dest-section" style={{ color: "var(--ocean)", textDecoration: "none", fontWeight: 500 }} onClick={() => setMobileOpen(false)}>Destinations</a>
            <a href="/#wander-testimonials" style={{ color: "var(--ocean)", textDecoration: "none", fontWeight: 500 }} onClick={() => setMobileOpen(false)}>Experiences</a>
            <a href="/#wander-features" style={{ color: "var(--ocean)", textDecoration: "none", fontWeight: 500 }} onClick={() => setMobileOpen(false)}>Features</a>
            <Link to="/about" style={{ color: "var(--coral)", fontWeight: 600, textDecoration: "none" }} onClick={() => setMobileOpen(false)}>About</Link>
            <Link to="/travel-checklist" style={{ color: "var(--ocean)", textDecoration: "none", fontWeight: 500 }} onClick={() => setMobileOpen(false)}>Checklist</Link>
            <Link to="/register" style={{ color: "var(--coral)", fontWeight: 600, textDecoration: "none" }} onClick={() => setMobileOpen(false)}>Book Now →</Link>
          </div>
        )}
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="wander-hero" style={{ minHeight: "72vh" }}>
        <div className="wander-hero-content">
          <div className="wander-hero-badge">
            <div className="wander-dot" />
            &nbsp;Est. 2018 · 40,000+ happy travellers
          </div>
          <h1>We plan. <em>You explore.</em></h1>
          <p>
            PackGo was born from one simple belief: extraordinary travel
            shouldn't require extraordinary effort. We handle every detail so
            you can focus on what matters — the joy of discovery.
          </p>
          <div className="wander-hero-actions">
            <a href="#about-story">
              <button className="wander-btn-primary">Our Story</button>
            </a>
            <Link to="/register">
              <button className="wander-btn-ghost">Start Planning →</button>
            </Link>
          </div>
        </div>

        <div className="wander-hero-visual">
          <div className="wander-hero-card-main">
            <svg viewBox="0 0 460 360" xmlns="http://www.w3.org/2000/svg" className="wander-scene-svg">
              <rect width="460" height="360" fill="#1A3A5C" />
              {[[60,30],[120,55],[200,20],[300,40],[380,25],[420,60],[160,70],[90,15],[340,65],[450,35],[30,50],[250,10]].map(([cx,cy],i) => (
                <circle key={i} cx={cx} cy={cy} r={0.8 + (i%3)*0.3} fill="white" opacity={0.4 + (i%4)*0.15} />
              ))}
              <circle cx="230" cy="175" r="110" fill="none" stroke="rgba(139,175,196,0.3)" strokeWidth="1" />
              <circle cx="230" cy="175" r="110" fill="rgba(26,74,107,0.4)" />
              {[0.3, 0.55, 0.78].map((ratio, i) => {
                const r = 110 * Math.sin(Math.acos(ratio - 0.5));
                return <ellipse key={i} cx="230" cy={175 + (ratio-0.5)*220} rx={Math.min(r,108)} ry="8" fill="none" stroke="rgba(139,175,196,0.2)" strokeWidth="0.8" />;
              })}
              <ellipse cx="230" cy="175" rx="55" ry="110" fill="none" stroke="rgba(139,175,196,0.2)" strokeWidth="0.8" />
              <ellipse cx="230" cy="175" rx="95" ry="110" fill="none" stroke="rgba(139,175,196,0.15)" strokeWidth="0.8" />
              <path d="M170,140 Q185,125 200,135 Q215,145 210,160 Q200,172 185,168 Q168,162 170,140Z" fill="#2ECC87" opacity="0.6" />
              <path d="M220,130 Q240,118 258,128 Q270,140 265,158 Q255,170 238,165 Q222,155 220,130Z" fill="#2ECC87" opacity="0.5" />
              <path d="M245,175 Q262,168 275,178 Q282,190 272,200 Q258,205 248,196 Q240,185 245,175Z" fill="#2ECC87" opacity="0.45" />
              <path d="M175,178 Q188,170 198,180 Q204,192 195,200 Q183,205 176,196 Q170,186 175,178Z" fill="#2ECC87" opacity="0.4" />
              <circle cx="196" cy="147" r="4" fill="#e8735a" />
              <circle cx="196" cy="147" r="7" fill="none" stroke="#e8735a" strokeWidth="1.5" opacity="0.5" />
              <circle cx="255" cy="138" r="4" fill="#e8735a" />
              <circle cx="255" cy="138" r="7" fill="none" stroke="#e8735a" strokeWidth="1.5" opacity="0.5" />
              <circle cx="266" cy="186" r="4" fill="#e8735a" />
              <path d="M196,147 Q225,120 255,138 Q268,158 266,186" stroke="#e8735a" strokeWidth="1.5" fill="none" strokeDasharray="4 3" opacity="0.7" />
              <path d="M0,300 L60,230 L120,268 L180,215 L240,255 L310,200 L370,245 L420,218 L460,238 L460,360 L0,360Z" fill="#0D2438" />
              <path d="M0,360 L0,315 L50,278 L100,305 L160,265 L210,288 L270,248 L330,278 L390,255 L440,272 L460,260 L460,360Z" fill="#081828" />
            </svg>
          </div>
          <div className="wander-price-tag">
            <div className="wander-price-label">2,400+</div>
            <div className="wander-price-val" style={{ fontSize: "1.1rem" }}>Destinations</div>
          </div>
          <div className="wander-stat-tag">
            <div className="wander-stat-num">4.9★</div>
            <div className="wander-stat-txt">1,240 reviews</div>
          </div>
        </div>
      </section>

      {/* ═══ OUR STORY ═══ */}
      <section id="about-story" className="wander-section" style={{ background: "var(--white)" }}>
        <div className="about-story-grid">
          <div className="about-story-text">
            <div className="wander-section-label">Our Story</div>
            <div className="wander-section-title">From a napkin sketch to 40,000 adventures</div>
            <p className="about-body-text" style={{ marginTop: "1.5rem" }}>
              In 2018, two friends — a travel journalist and a software engineer —
              sat in a tiny Mumbai café, frustrated. Despite spending weeks planning
              a trip to Patagonia, things kept falling through: overbooked hotels,
              hidden fees, zero local knowledge. They sketched out an idea: a platform
              that combined editorial-quality curation with seamless tech.
            </p>
            <p className="about-body-text">
              PackGo launched six months later with just 12 destinations. Today, we
              cover 2,400+ handpicked places across every continent, partnering with
              local experts who know their regions intimately. We've helped over
              40,000 travellers experience the world — from first-time solo backpackers
              to families celebrating milestone anniversaries.
            </p>
            <p className="about-body-text">
              The café napkin? It's framed in our Mumbai office. A reminder that the
              best journeys start with a single, unreasonable idea.
            </p>
          </div>
          <div className="about-story-visual">
            <div className="about-timeline">
              {[
                { year: "2018", label: "Founded", desc: "PackGo launches with 12 destinations and a bold vision" },
                { year: "2019", label: "10,000 travellers", desc: "Crossed our first major milestone in just 14 months" },
                { year: "2021", label: "1,000+ destinations", desc: "Expanded globally through local expert partnerships" },
                { year: "2024", label: "40K+ adventures", desc: "Trusted by travellers across 85 countries worldwide" },
              ].map((item, i) => (
                <div className="about-timeline-item" key={i}>
                  <div className="about-timeline-year">{item.year}</div>
                  <div className="about-timeline-dot" />
                  <div className="about-timeline-content">
                    <div className="about-timeline-label">{item.label}</div>
                    <div className="about-timeline-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OUR MISSION ═══ */}
      <section className="wander-features-section" style={{ background: "var(--sand)", padding: "5rem 3rem" }}>
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 3.5rem" }}>
          <div className="wander-section-label">Our Mission</div>
          <div className="wander-section-title">To make extraordinary travel effortless</div>
          <p style={{ color: "var(--ocean)", marginTop: "1rem", opacity: 0.7, lineHeight: 1.8 }}>
            We believe everyone deserves to explore the world without the stress of
            planning. PackGo combines editorial curation, local expertise, and
            seamless technology to deliver journeys across 2,400+ destinations
            that feel personally crafted — because they are.
          </p>
        </div>
        <div className="wander-feat-grid">
          <div className="wander-feat-card">
            <div className="wander-feat-icon">🌍</div>
            <div className="wander-feat-title">Authentic Experiences</div>
            <div className="wander-feat-desc">We work with local experts to surface hidden gems, cultural rituals, and off-the-beaten-path adventures unavailable elsewhere.</div>
          </div>
          <div className="wander-feat-card">
            <div className="wander-feat-icon">💚</div>
            <div className="wander-feat-title">Sustainable Tourism</div>
            <div className="wander-feat-desc">Every trip actively supports local communities and is designed to minimise environmental footprint without compromising quality.</div>
          </div>
          <div className="wander-feat-card">
            <div className="wander-feat-icon">✈️</div>
            <div className="wander-feat-title">Effortless Planning</div>
            <div className="wander-feat-desc">Flights, hotels, transfers, activities — we handle every detail so you arrive relaxed and leave with memories that last a lifetime.</div>
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE US ═══ */}
      <section className="wander-section" style={{ background: "var(--white)", padding: "5rem 3rem" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 3.5rem" }}>
          <div className="wander-section-label">Why Choose Us</div>
          <div className="wander-section-title">What sets PackGo apart</div>
        </div>
        <div className="wander-feat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {WHY_US.map((item, i) => (
            <div className="wander-feat-card about-why-card" key={i}>
              <div className="wander-feat-icon">{item.icon}</div>
              <div className="wander-feat-title">{item.title}</div>
              <div className="wander-feat-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section style={{ background: "var(--ocean)", padding: "5rem 3rem" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 3rem" }}>
          <div className="wander-section-label" style={{ color: "rgba(253,250,245,0.6)" }}>By the Numbers</div>
          <div className="wander-section-title" style={{ color: "var(--white)" }}>Trust built trip by trip</div>
        </div>
        <div className="about-stats-row">
          {[
            { big: "40K+", desc: "Happy travellers" },
            { big: "2,400+", desc: "Destinations worldwide" },
            { big: "4.9★", desc: "Average rating" },
            { big: "1,240+", desc: "Verified reviews" },
            { big: "85+", desc: "Countries covered" },
            { big: "24/7", desc: "Live support" },
          ].map((s, i) => (
            <div className="about-stat-item" key={i}>
              <div className="about-stat-big">{s.big}</div>
              <div className="about-stat-desc">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ TEAM ═══ */}
      <section className="wander-section" style={{ background: "var(--sand)", padding: "5rem 3rem" }}>
        <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto 3.5rem" }}>
          <div className="wander-section-label">Our Team</div>
          <div className="wander-section-title">The people behind your adventures</div>
          <p style={{ color: "var(--ocean)", opacity: 0.65, marginTop: "1rem", lineHeight: 1.8 }}>
            We're a passionate crew of travellers, technologists, and storytellers —
            united by the belief that the world is best experienced in person.
          </p>
        </div>
        <div className="about-team-grid">
          {TEAM.map((member, i) => (
            <div className="about-team-card" key={i}>
              <div className="about-team-avatar" style={{ background: member.color }}>{member.initials}</div>
              <div className="about-team-name">{member.name}</div>
              <div className="about-team-role">{member.role}</div>
              <p className="about-team-bio">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section style={{ padding: "5rem 3rem" }}>
        <div className="wander-cta-section">
          <div className="wander-cta-text">
            <h2>Ready to start your next adventure?</h2>
            <p>Join 40,000+ travellers who trust PackGo to plan their dream journeys. Your next unforgettable experience is just one click away.</p>
          </div>
          <div className="wander-cta-actions">
            <a href="/#wander-dest-section">
              <button className="wander-btn-primary">Explore Destinations</button>
            </a>
            <Link to="/register">
              <button className="wander-btn-ghost" style={{ color: "white", borderColor: "rgba(255,255,255,0.3)" }}>Book Now</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="wander-footer">
        <div className="wander-footer-top">
          <div className="wander-footer-brand">
            <Link to="/" className="wander-footer-logo">Pack<span>Go</span></Link>
            <p>Discover breathtaking destinations, curated travel experiences, and unforgettable journeys with PackGo Travel.</p>
          </div>
          <div className="wander-footer-links-wrapper">
            <div className="wander-footer-col">
              <h4>Explore</h4>
              <a href="/#wander-dest-section">Destinations</a>
              <a href="/#wander-testimonials">Experiences</a>
              <a href="/#wander-features">Features</a>
            </div>
            <div className="wander-footer-col">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="wander-footer-col">
              <h4>Support</h4>
              <Link to="/travel-checklist">Travel Checklist</Link>
              <Link to="/login">Log In</Link>
              <Link to="/register">Sign Up Free</Link>
            </div>
          </div>
        </div>
        <div className="wander-footer-bottom">
          <div className="wander-footer-copy">© {new Date().getFullYear()} PackGo Travel Co. All rights reserved.</div>
          <div className="wander-footer-socials">
            <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
            <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;