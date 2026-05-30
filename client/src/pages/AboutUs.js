import React from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaHeart, FaGlobe, FaUsers } from "react-icons/fa";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AboutUs = () => {
  return (
    <div className="wander-page">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section
        className="wander-hero"
        style={{ minHeight: "65vh", padding: "8rem 3rem 4rem 4rem" }}
      >
        <div className="wander-hero-content" style={{ maxWidth: "650px" }}>
          <h1 style={{ textAlign: "left" }}>
            Crafting journeys that make us <em>richer</em>
          </h1>
          <p style={{ textAlign: "left" }}>
            We believe travel is more than visiting places—it's about opening
            minds, bridging cultures, and creating lifelong memories. PackGo is
            dedicated to simplifying how you plan, map, and experience the
            world.
          </p>
        </div>
        <div
          className="wander-hero-visual"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            viewBox="0 0 240 240"
            width="80%"
            height="80%"
            className="wander-scene-svg"
            style={{ opacity: 0.85 }}
          >
            <circle
              cx="120"
              cy="120"
              r="90"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <circle
              cx="120"
              cy="120"
              r="70"
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <path
              d="M120,30 L120,210 M30,120 L210,120"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1"
            />
            <path
              d="M120,40 L130,105 L195,120 L130,135 L120,200 L110,135 L45,120 L110,105 Z"
              fill="var(--coral)"
            />
            <circle cx="120" cy="120" r="8" fill="var(--white)" />
          </svg>
        </div>
      </section>

      {/* ═══ MISSION & VISION ═══ */}
      <section
        className="wander-section"
        style={{ background: "var(--white)" }}
      >
        <div className="wander-testi-section" style={{ padding: "0" }}>
          <div>
            <div className="wander-section-label">Our Mission</div>
            <h2
              className="wander-section-title"
              style={{ marginBottom: "1.5rem" }}
            >
              Empowering every traveler to explore fearlessly
            </h2>
            <p
              style={{
                color: "var(--dark)",
                opacity: 0.8,
                fontSize: "1rem",
                lineHeight: "1.8",
                fontWeight: 300,
                marginBottom: "1.5rem",
              }}
            >
              Our mission is to democratize seamless travel planning. We provide
              intuitive tools, curated expert guides, and dynamic tracking,
              ensuring that every itinerary is safe, exciting, and tailored to
              your dreams. We handle the complexity so you can focus on the
              adventure.
            </p>
          </div>
          <div>
            <div className="wander-section-label">Our Vision</div>
            <h2
              className="wander-section-title"
              style={{ marginBottom: "1.5rem" }}
            >
              Connecting the world through shared adventures
            </h2>
            <p
              style={{
                color: "var(--dark)",
                opacity: 0.8,
                fontSize: "1rem",
                lineHeight: "1.8",
                fontWeight: 300,
              }}
            >
              We envision a world where planning a trip to a remote corner of
              the Earth is as effortless as booking a local ride. By leveraging
              open source collaboration and community-driven insights, we aim to
              build the world's most trusted travel companion.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ GOALS & CORE VALUES ═══ */}
      <section className="wander-features-section">
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 2rem",
          }}
        >
          <div className="wander-section-label">Core Values</div>
          <h2 className="wander-section-title">What drives PackGo</h2>
        </div>
        <div className="wander-feat-grid">
          <div className="wander-feat-card">
            <div className="wander-feat-icon">
              <FaGlobe size={20} color="var(--ocean)" />
            </div>
            <div className="wander-feat-title">Global Discovery</div>
            <div className="wander-feat-desc">
              Unlock off-the-beaten-path paths and classic sights. We curate
              destinations that offer truly authentic cultural experiences.
            </div>
          </div>
          <div className="wander-feat-card">
            <div className="wander-feat-icon">
              <FaUsers size={20} color="var(--ocean)" />
            </div>
            <div className="wander-feat-title">Community Driven</div>
            <div className="wander-feat-desc">
              Built by travelers, for travelers. Our platform updates
              dynamically with feedback, tips, and guidelines from real
              journeys.
            </div>
          </div>
          <div className="wander-feat-card">
            <div className="wander-feat-icon">
              <FaHeart size={20} color="var(--ocean)" />
            </div>
            <div className="wander-feat-title">Passion for Travel</div>
            <div className="wander-feat-desc">
              We are passionate about exploration. We strive to infuse that
              excitement and passion into every feature of PackGo.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TEAM & CONTRIBUTORS ═══ */}
      <section
        className="wander-section"
        style={{ background: "var(--white)" }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: 600,
            margin: "0 auto 3rem",
          }}
        >
          <div className="wander-section-label">Our Team</div>
          <h2 className="wander-section-title">The brains behind PackGo</h2>
        </div>
        <div className="wander-feat-grid">
          {/* Team Member 1 */}
          <div className="wander-feat-card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--sand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                color: "var(--ocean)",
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              JD
            </div>
            <div className="wander-feat-title">John Doe</div>
            <div
              style={{
                color: "var(--coral)",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "0.5rem",
              }}
            >
              Co-Founder & CEO
            </div>
            <div className="wander-feat-desc" style={{ fontSize: "0.85rem" }}>
              An avid explorer who has visited 50+ countries. John handles the
              vision and business strategies at PackGo.
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="wander-feat-card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--sand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                color: "var(--ocean)",
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              AS
            </div>
            <div className="wander-feat-title">Alice Smith</div>
            <div
              style={{
                color: "var(--coral)",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "0.5rem",
              }}
            >
              Lead Engineer
            </div>
            <div className="wander-feat-desc" style={{ fontSize: "0.85rem" }}>
              Full-stack wizard and open-source enthusiast. Alice builds the
              scalable tech infrastructure powering our planner.
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="wander-feat-card" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--sand)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                color: "var(--ocean)",
                fontSize: "1.8rem",
                fontWeight: "bold",
              }}
            >
              BM
            </div>
            <div className="wander-feat-title">Bob Mason</div>
            <div
              style={{
                color: "var(--coral)",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "0.5rem",
              }}
            >
              Head of Product
            </div>
            <div className="wander-feat-desc" style={{ fontSize: "0.85rem" }}>
              Focuses on user journey and experience design. Bob translates
              traveler needs into beautiful, simple user interfaces.
            </div>
          </div>
        </div>
      </section>

      {/* ═══ OPEN SOURCE CONTRIBUTION ═══ */}
      <div className="wander-cta-section" style={{ marginBottom: "5rem" }}>
        <div className="wander-cta-text">
          <h2>PackGo is Open Source</h2>
          <p>
            We believe in collaboration. Contribute to our codebase, submit
            features, and help travelers worldwide.
          </p>
        </div>
        <div className="wander-cta-actions">
          <a
            href="https://github.com/devmdave/Travel-Plans"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="wander-btn-primary"
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <FaGithub size={18} /> View on GitHub
            </button>
          </a>
          <Link to="/register">
            <button className="wander-btn-ghost">Join the Project</button>
          </Link>
        </div>
      </div>

      {/* ═══ FOOTER ═══ */}
      <Footer />
    </div>
  );
};

export default AboutUs;
