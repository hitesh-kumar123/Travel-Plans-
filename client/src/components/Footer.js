import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import "../pages/Home.css";

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
            <Link to="/">Destinations</Link>
            <Link to="/">Experiences</Link>
            <Link to="/">Features</Link>
          </div>

          <div className="wander-footer-col">
            <h4>Company</h4>
            <Link to="/">About</Link>
            <Link to="/">Careers</Link>
            <Link to="/">Contact</Link>
          </div>

          <div className="wander-footer-col">
            <h4>Support</h4>
            <Link to="/">Help Center</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
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
            <FaTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
