import React from "react";
import { motion } from "framer-motion";
import ScrollLink from "../components/ScrollLink";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import "./Home.css";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const About = () => {
  return (
    <div className="wander-page">
      <Navbar />

      {/* ═══ ABOUT HERO ═══ */}
      <section className="wander-hero" style={{ minHeight: "60vh" }}>
        <motion.div
          className="wander-hero-content"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.div className="wander-hero-badge" variants={fadeUp}>
            <div className="wander-dot" /> Our Story
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1}>
            We believe travel <em>changes lives</em>
          </motion.h1>
          <motion.p variants={fadeUp} custom={2}>
            PackGo was born from a passion for exploration and a desire to make
            extraordinary journeys accessible to everyone. Since 2018, we've
            helped over 40,000 travellers discover the world's most breathtaking
            destinations with carefully curated itineraries and seamless
            planning.
          </motion.p>
        </motion.div>
        <motion.div
          className="wander-hero-visual"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="wander-hero-card-main">
            <svg
              viewBox="0 0 460 360"
              xmlns="http://www.w3.org/2000/svg"
              className="wander-scene-svg"
            >
              <rect width="460" height="360" fill="#1A3A5C" />
              <circle cx="60" cy="30" r="1.2" fill="white" opacity="0.7" />
              <circle cx="200" cy="20" r="1" fill="white" opacity="0.6" />
              <circle cx="300" cy="40" r="1.3" fill="white" opacity="0.8" />
              <circle cx="420" cy="60" r="1.1" fill="white" opacity="0.7" />
              <path
                d="M0,120 Q115,80 230,110 Q345,140 460,100"
                stroke="#2ECC87"
                strokeWidth="3"
                fill="none"
                opacity="0.4"
              />
              <path
                d="M0,280 L60,190 L120,230 L180,170 L240,220 L310,155 L370,210 L420,175 L460,200 L460,360 L0,360Z"
                fill="#0D2438"
              />
              <path
                d="M0,360 L0,290 L40,250 L90,280 L150,235 L200,260 L260,220 L320,255 L380,230 L420,250 L460,235 L460,360Z"
                fill="#081828"
              />
              <ellipse
                cx="230"
                cy="330"
                rx="140"
                ry="22"
                fill="#1A3A5C"
                opacity="0.7"
              />
            </svg>
          </div>
        </motion.div>
      </section>

      {/* ═══ MISSION SECTION ═══ */}
      <section
        className="wander-features-section"
        style={{ background: "var(--sand)", padding: "6rem 1.5rem" }}
      >
        <motion.div
          style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 3rem" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
        >
          <div className="wander-section-label">Why we exist</div>
          <div className="wander-section-title">Our mission is simple</div>
          <p style={{ color: "#6b8fa3", marginTop: "1rem" }}>
            To empower travellers with authentic, safe, and unforgettable
            experiences – without the stress of planning.
          </p>
        </motion.div>
        <motion.div
          className="wander-feat-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
        >
          <motion.div className="wander-feat-card" variants={fadeUp}>
            <div className="wander-feat-icon">🌍</div>
            <div className="wander-feat-title">Authentic Travel</div>
            <div className="wander-feat-desc">
              We work with local experts to uncover hidden gems and cultural
              treasures.
            </div>
          </motion.div>
          <motion.div className="wander-feat-card" variants={fadeUp} custom={1}>
            <div className="wander-feat-icon">💚</div>
            <div className="wander-feat-title">Sustainable Tourism</div>
            <div className="wander-feat-desc">
              Every trip supports local communities and minimises environmental
              impact.
            </div>
          </motion.div>
          <motion.div className="wander-feat-card" variants={fadeUp} custom={2}>
            <div className="wander-feat-icon">✈️</div>
            <div className="wander-feat-title">Stress‑Free Planning</div>
            <div className="wander-feat-desc">
              From flights to activities – we handle every detail so you can
              focus on the joy.
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className="wander-testi-section" style={{ background: "white" }}>
        <motion.div
          className="wander-stats-grid"
          style={{ maxWidth: 800, margin: "0 auto" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={stagger}
        >
          <motion.div className="wander-stat-box" variants={fadeUp}>
            <div className="wander-stat-big">40K+</div>
            <div className="wander-stat-desc">Happy travellers</div>
          </motion.div>
          <motion.div className="wander-stat-box" variants={fadeUp} custom={1}>
            <div className="wander-stat-big">120+</div>
            <div className="wander-stat-desc">Countries</div>
          </motion.div>
          <motion.div className="wander-stat-box" variants={fadeUp} custom={2}>
            <div className="wander-stat-big">24/7</div>
            <div className="wander-stat-desc">Support</div>
          </motion.div>
          <motion.div className="wander-stat-box" variants={fadeUp} custom={3}>
            <div className="wander-stat-big">4.9★</div>
            <div className="wander-stat-desc">Average rating</div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ FOOTER ═══ */}
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
              <a href="/#wander-dest-section">Destinations</a>
              <a href="/#wander-features">Experiences</a>
              <a href="/#wander-features">Features</a>
            </div>
            <div className="wander-footer-col">
              <h4>Company</h4>
              <ScrollLink to="/about">About</ScrollLink>
              <ScrollLink to="/careers">Careers</ScrollLink>
              <ScrollLink to="/contact">Contact</ScrollLink>
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

export default About;
