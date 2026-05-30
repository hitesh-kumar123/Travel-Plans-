import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="wander-footer">
      <div className="wander-footer-top">
        <div className="wander-footer-brand">
          <Link to="/" className="wander-footer-logo">
            Pack<span>Go</span>
          </Link>

          <p>
            Discover breathtaking destinations, curated travel experiences, and
            unforgettable journeys with PackGo Travel.
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
            <Link to="/about">About</Link>
            <a href="/">Careers</a>
            <Link to="/contact">Contact</Link>
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
  );
};

export default Footer;
