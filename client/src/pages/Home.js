import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="packgo-page">
      {/* ═══ NAVBAR ═══ */}
      <nav className="packgo-nav">
        <div className="packgo-logo">PackGo</div>
        <ul className="packgo-nav-links">
          <li>
            <a href="#destinations">Destinations</a>
          </li>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <Link to="/travel-checklist">Checklist</Link>
          </li>
          <li>
            <Link to="/login">Log In</Link>
          </li>
        </ul>

        <div className="packgo-nav-spacer">
          {/* Functional Book Now Button */}
          <Link to="/register" tabIndex="-1">
            <button className="btn-nav-book">Book now ↗</button>
          </Link>

          <div className="packgo-mobile-menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </div>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <header className="packgo-hero">
        <h1 className="packgo-hero-title">
          Pack your <span className="font-serif highlight">dreams</span>, we'll
          handle the <span className="font-serif highlight">plan</span>
        </h1>

        <div className="packgo-hero-visual-wrapper">
          {/* The wider, shorter sage background shape */}
          <div className="packgo-hero-backdrop"></div>

          {/* The main hero image */}
          <img
            src="https://images.unsplash.com/photo-1539635278303-d4002c07eae3?q=80&w=1200&auto=format&fit=crop"
            alt="Friends running on beach"
            className="packgo-hero-img"
          />

          {/* Floating dark olive search bar */}
          <div className="packgo-search-bar">
            <input
              type="text"
              placeholder="Destination"
              className="search-input"
            />
            <input
              type="text"
              placeholder="Check in"
              className="search-input"
            />
            <input
              type="text"
              placeholder="Total travellers"
              className="search-input"
            />
            <button className="btn-search">Search ↗</button>
          </div>
        </div>
      </header>

      {/* ═══ FEATURES SECTION ═══ */}
      <section id="features" className="packgo-features-section">
        <h2 className="section-title font-serif highlight">Features</h2>

        <div className="packgo-features-grid">
          <div className="feature-card">
            <div className="feature-divider"></div>
            <h3>Smart trip planning</h3>
            <p>
              Create, organize, and manage every journey in one place. Plan
              trips with destination autocomplete, track their progress from
              Planned to Completed, set personalized budgets, and enjoy
              automatically fetched destination images that bring every
              itinerary to life.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-divider"></div>
            <h3>Budget and expense tracking</h3>
            <p>
              Stay on top of your travel spending with an intuitive expense
              tracker. Categorize expenses, monitor budget utilization through
              interactive progress indicators, visualize spending patterns with
              insightful charts, and export your records whenever you need them.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-divider"></div>
            <h3>Remove Language Barriers</h3>
            <p>
              Break language barriers wherever you go. Instantly translate text
              into more than 28 languages, detect languages automatically,
              access commonly used travel phrases, and copy translations with a
              single click for seamless communication.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-divider"></div>
            <h3>Weather insights</h3>
            <p>
              Travel confidently with accurate weather forecasts for your
              destination. View current conditions, explore a detailed 5-day
              forecast, and receive smart travel recommendations based on the
              expected temperature and weather.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ SHOWCASE IMAGE ═══ */}
      <section className="packgo-showcase-section">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop"
          alt="Lush green rolling hills"
          className="packgo-showcase-img"
        />
      </section>

      {/* ═══ CONNECT SECTION ═══ */}
      <section id="contact" className="packgo-connect-section">
        <h2 className="font-serif">Connect with us</h2>
        <p>
          Questions, feedback, or collaboration? We'd love to hear from you.
          Stay connected through our social channels and be part of our travel
          community.
        </p>

        {/* Functional CTA Button */}
        <Link to="/register" tabIndex="-1">
          <button className="btn-primary">Book now ↗</button>
        </Link>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="packgo-footer">
        <div className="footer-left">
          <div className="footer-logo">PackGo</div>
          <p className="footer-tagline">Your own smart travel partner</p>
          <div className="footer-socials">
            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/hitesh_sundesha157/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16   11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>

            {/* LinkedIn Link */}
            <a
              href="https://www.linkedin.com/in/hitesh-kumar-dev/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            {/* X / Twitter Link */}
            <a
              href="https://x.com/hitesh_kumar123"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4   4l11.733 16h4.267l-11.733 -16z"></path>
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-nav-col">
            <h4>Features</h4>
            <ul>
              <li>
                <a href="#1">Trip planning</a>
              </li>
              <li>
                <a href="#2">Expense tracking</a>
              </li>
              <li>
                <a href="#3">Weather insights</a>
              </li>
            </ul>
          </div>
          <div className="footer-nav-col">
            <h4>Learn more</h4>
            <ul>
              <li>
                <a href="#1">Blog</a>
              </li>
              <li>
                <a href="#2">Case studies</a>
              </li>
              <li>
                <a href="#3">Customer stories</a>
              </li>
              <li>
                <a href="#4">Best practices</a>
              </li>
            </ul>
          </div>
          <div className="footer-nav-col">
            <h4>Support</h4>
            <ul>
              <li>
                <a href="#1">Contact</a>
              </li>
              <li>
                <a href="#2">Support</a>
              </li>
              <li>
                <a href="#3">Legal</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
