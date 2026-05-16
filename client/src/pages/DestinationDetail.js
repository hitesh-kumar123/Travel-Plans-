import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "./Home.css";

const DestinationDetail = () => {
  const { id } = useParams();
  const [dest, setDest] = useState(null);

  useEffect(() => {
    // In a real app, you'd fetch from API
    // For now, we'll find it from the same mock data
    const MOCK_DESTS = [
      {
        _id: "m1",
        name: "Santorini",
        city: "Oia",
        state: "Greece",
        images: [
          "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=2000",
        ],
        entrance_fee_inr: 120000,
        rating: "4.9",
        reviews: "2.1k",
        desc: "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape. The whitewashed, cubiform houses of its 2 principal towns, Fira and Oia, cling to cliffs above an underwater caldera (crater).",
      },
      {
        _id: "m2",
        name: "Iceland",
        city: "Reykjavik",
        state: "North Atlantic",
        images: [
          "https://images.unsplash.com/photo-1520637102912-2df6bb2aec6d?q=80&w=2000",
        ],
        entrance_fee_inr: 89000,
        rating: "4.8",
        reviews: "1.2k",
        desc: "Iceland, a Nordic island nation, is defined by its dramatic landscape with volcanoes, geysers, hot springs and lava fields. Massive glaciers are protected in Vatnäjokull and Snæfellsjökull national parks. Most of the population lives in the capital, Reykjavik.",
      },
      {
        _id: "m3",
        name: "Ubud, Bali",
        city: "Ubud",
        state: "Indonesia",
        images: [
          "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2000",
        ],
        entrance_fee_inr: 55000,
        rating: "4.7",
        reviews: "3.4k",
        desc: "Ubud, a town on the Indonesian island of Bali in Ubud District, located amongst rice paddies and steep ravines in the central foothills of the Gianyar regency. Promoted as an arts and culture centre, it has developed a large tourism industry.",
      },
      {
        _id: "m4",
        name: "Sahara Desert",
        city: "Merzouga",
        state: "Morocco",
        images: [
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2000",
        ],
        entrance_fee_inr: 95000,
        rating: "4.9",
        reviews: "890",
        desc: "The Sahara is a desert on the African continent. With an area of 9,200,000 square kilometres, it is the largest hot desert in the world and the third largest desert overall, smaller only than the deserts of Antarctica and the northern Arctic.",
      },
      {
        _id: "m5",
        name: "Kyoto",
        city: "Gion",
        state: "Japan",
        images: [
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2000",
        ],
        entrance_fee_inr: 75000,
        rating: "4.8",
        reviews: "1.5k",
        desc: "Kyoto, once the capital of Japan, is a city on the island of Honshu. It's famous for its numerous classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.",
      },
      {
        _id: "m6",
        name: "Amalfi Coast",
        city: "Positano",
        state: "Italy",
        images: [
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=2000",
        ],
        entrance_fee_inr: 110000,
        rating: "4.9",
        reviews: "2.8k",
        desc: "The Amalfi Coast is a 50-kilometer stretch of coastline along the southern edge of Italy’s Sorrentine Peninsula, in the Campania region. It’s a popular holiday destination, with sheer cliffs and a rugged shoreline dotted with small beaches and pastel-colored fishing villages.",
      },
    ];
    setDest(MOCK_DESTS.find((d) => d._id === id));
  }, [id]);

  if (!dest) return <div className="wander-loading">Loading...</div>;

  return (
    <div className="wander-page">
      <Header />

      <div className="wander-detail-hero">
        <img
          src={dest.images[0]}
          alt={dest.name}
          className="wander-detail-hero-img"
        />
        <div className="wander-dest-overlay" style={{ opacity: 0.6 }} />
        <div className="wander-detail-title-box">
          <h1>{dest.name}</h1>
          <p>
            {dest.city}, {dest.state}
          </p>
        </div>
      </div>

      <main className="wander-detail-main">
        <div className="wander-detail-content">
          <div className="wander-section-label">Overview</div>
          <p className="wander-detail-desc">{dest.desc}</p>

          <div className="wander-detail-stats">
            <div className="wander-detail-stat">
              <div className="stat-val">{dest.rating}★</div>
              <div className="stat-label">{dest.reviews} reviews</div>
            </div>
            <div className="wander-detail-stat">
              <div className="stat-val">
                ₹{dest.entrance_fee_inr.toLocaleString()}
              </div>
              <div className="stat-label">Avg. cost / person</div>
            </div>
          </div>
        </div>

        <div className="wander-detail-sidebar">
          <div className="wander-detail-sidebar-card">
            <h3>Book this experience</h3>
            <div className="sidebar-price-box">
              <div className="price-label">PRICE</div>
              <div className="price-val">
                ₹{dest.entrance_fee_inr.toLocaleString()} <span>/ person</span>
              </div>
            </div>
            <button className="reserve-btn">Reserve Now</button>
            <p className="reserve-note">You won't be charged yet</p>
          </div>
        </div>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="wander-footer">
        <div className="wander-footer-main">
          <div className="footer-col">
            <h4>Support</h4>
            <button type="button" className="footer-link-btn">
              Help Centre
            </button>
            <button type="button" className="footer-link-btn">
              AirCover
            </button>
            <button type="button" className="footer-link-btn">
              Anti-discrimination
            </button>
            <button type="button" className="footer-link-btn">
              Disability support
            </button>
            <button type="button" className="footer-link-btn">
              Cancellation options
            </button>
            <button type="button" className="footer-link-btn">
              Report neighbourhood concern
            </button>
          </div>
          <div className="footer-col">
            <h4>Hosting</h4>
            <button type="button" className="footer-link-btn">
              PackGo your home
            </button>
            <button type="button" className="footer-link-btn">
              AirCover for Hosts
            </button>
            <button type="button" className="footer-link-btn">
              Hosting resources
            </button>
            <button type="button" className="footer-link-btn">
              Community forum
            </button>
            <button type="button" className="footer-link-btn">
              Hosting responsibly
            </button>
            <button type="button" className="footer-link-btn">
              Join a free hosting class
            </button>
          </div>
          <div className="footer-col">
            <h4>PackGo</h4>
            <button type="button" className="footer-link-btn">
              Newsroom
            </button>
            <button type="button" className="footer-link-btn">
              New features
            </button>
            <button type="button" className="footer-link-btn">
              Careers
            </button>
            <button type="button" className="footer-link-btn">
              Investors
            </button>
            <button type="button" className="footer-link-btn">
              PackGo stays
            </button>
            <button type="button" className="footer-link-btn">
              Emergency support
            </button>
          </div>
        </div>

        <div className="wander-footer-bottom">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} PackGo, Inc.</span>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">
              Privacy
            </button>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">
              Terms
            </button>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">
              Sitemap
            </button>
            <span className="footer-dot">·</span>
            <button type="button" className="footer-link-btn">
              Company details
            </button>
          </div>
          <div className="footer-bottom-right">
            <div className="footer-util">
              <span className="util-item">🌐 English (IN)</span>
              <span className="util-item">₹ INR</span>
            </div>
            <div className="footer-socials">
              <button
                type="button"
                className="footer-link-btn"
                aria-label="Facebook"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
              <button
                type="button"
                className="footer-link-btn"
                aria-label="Twitter"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </button>
              <button
                type="button"
                className="footer-link-btn"
                aria-label="Instagram"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975-.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.355 2.618 6.778 6.98 6.978 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.199-4.345-2.621-6.777-6.979-6.978C15.668.014 15.259 0 12 0z" />
                  <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4.162 4.162 0 110-8.324 4.162 4.162 0 010 8.324zM18.406 4.137a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DestinationDetail;
