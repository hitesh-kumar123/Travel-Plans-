import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}
      <div className="about-hero">
        <p className="about-eyebrow">Who we are</p>
        <h1 className="about-title">
          Pack<span>Go</span>
        </h1>
        <p className="about-tagline">Your all-in-one travel companion</p>
        <div className="about-divider" />
      </div>

      {/* Feature Cards */}
      <div className="about-grid">
        <div className="about-card">
          <span className="card-icon">🗺️</span>
          <h2 className="card-heading">Smart Trip Planning</h2>
          <p className="card-text">
            Manage every detail of your journey — from itineraries and
            checklists to accommodation and activities — all from one elegant
            dashboard.
          </p>
        </div>

        <div className="about-card">
          <span className="card-icon">💸</span>
          <h2 className="card-heading">Expense Tracking</h2>
          <p className="card-text">
            Stay on budget effortlessly. Track travel costs in real time,
            categorize spending, and get a clear picture of your finances
            wherever you are.
          </p>
        </div>

        <div className="about-card">
          <span className="card-icon">🌐</span>
          <h2 className="card-heading">Explore & Translate</h2>
          <p className="card-text">
            Discover destinations, check live weather forecasts, and break
            language barriers with built-in translation — travel with confidence
            anywhere.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="about-statement">
        <p>
          Our mission is to <strong>simplify travel planning</strong> with a
          modern, responsive platform built for every kind of traveler. Whether
          you're embarking on a solo adventure, a business trip, or a family
          vacation — PackGo makes organizing your journey{" "}
          <strong>simple, smart, and enjoyable</strong>.
        </p>

        {/* Stats */}
        <div className="about-stats">
          <div className="stat-item">
            <span className="stat-number">50K+</span>
            <span className="stat-label">Trips Planned</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">120+</span>
            <span className="stat-label">Countries</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.9★</span>
            <span className="stat-label">User Rating</span>
          </div>
        </div>
      </div>
    </div>
  );
}
