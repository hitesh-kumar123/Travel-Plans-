import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import TravelQuiz from "./TravelQuiz";
import "../components/Navbar.css";

const NAV_LINKS = [
  { label: "Destinations", href: "#wander-dest-section", section: "wander-dest-section" },
  { label: "Features", href: "#wander-features", section: "wander-features" },
  { label: "Experiences", href: "#wander-testimonials", section: "wander-testimonials" },
  { label: "Checklist", to: "/travel-checklist" },
];

const Navbar = () => {
  const { isAuthenticated } = useSelector((s) => s.auth);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("wander-dest-section");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = ["wander-dest-section", "wander-features", "wander-testimonials"];
    const onScroll = () => {
      const y = window.scrollY + 150;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && y >= el.offsetTop && y < el.offsetTop + el.offsetHeight) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = () => setMobileOpen(false);

  return (
    <>
      <nav className={`pn ${scrolled ? "pn--scrolled" : ""}`}>
        <div className="pn__inner">
          <Link to="/" className="pn__logo">
            Pack<span>Go</span>
          </Link>

          <ul className="pn__links">
            {NAV_LINKS.map((link) =>
              link.to ? (
                <li key={link.label}>
                  <Link to={link.to} className="pn__link">
                    {link.label}
                  </Link>
                </li>
              ) : (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`pn__link ${activeSection === link.section ? "pn__link--active" : ""}`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            )}
            {isAuthenticated && (
              <li>
                <Link to="/dashboard" className="pn__link">
                  Dashboard
                </Link>
              </li>
            )}
          </ul>

          <div className="pn__actions">
            <button
              className="pn__btn pn__btn--ghost pn__btn--quiz"
              onClick={() => setQuizOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Get Recommendation
            </button>
            {isAuthenticated ? (
              <Link to="/dashboard">
                <button className="pn__btn pn__btn--primary">My Dashboard</button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button className="pn__btn pn__btn--ghost">Log In</button>
                </Link>
                <Link to="/register">
                  <button className="pn__btn pn__btn--primary">Get Started</button>
                </Link>
              </>
            )}
          </div>

          <button
            className="pn__burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <span className={`pn__burger-line ${mobileOpen ? "pn__burger-line--open" : ""}`} />
            <span className={`pn__burger-line ${mobileOpen ? "pn__burger-line--open" : ""}`} />
          </button>
        </div>

        <div className="pn__horizon" />
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="pn__mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleNavClick}
          >
            <motion.div
              className="pn__mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pn__mobile-header">
                <Link to="/" className="pn__logo" onClick={handleNavClick}>
                  Pack<span>Go</span>
                </Link>
                <button
                  className="pn__burger"
                  onClick={handleNavClick}
                  aria-label="Close menu"
                >
                  <span className="pn__burger-line pn__burger-line--open" />
                  <span className="pn__burger-line pn__burger-line--open" />
                </button>
              </div>

              <div className="pn__mobile-links">
                {NAV_LINKS.map((link, i) =>
                  link.to ? (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Link to={link.to} className="pn__mobile-link" onClick={handleNavClick}>
                        {link.label}
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={link.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <a href={link.href} className="pn__mobile-link" onClick={handleNavClick}>
                        {link.label}
                      </a>
                    </motion.div>
                  )
                )}
                {isAuthenticated && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <Link to="/dashboard" className="pn__mobile-link" onClick={handleNavClick}>
                      Dashboard
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="pn__mobile-actions">
                <button
                  className="pn__btn pn__btn--outline pn__btn--full"
                  onClick={() => { setQuizOpen(true); setMobileOpen(false); }}
                >
                  Get Recommendation
                </button>
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={handleNavClick}>
                    <button className="pn__btn pn__btn--primary pn__btn--full">
                      My Dashboard
                    </button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={handleNavClick}>
                      <button className="pn__btn pn__btn--outline pn__btn--full">
                        Log In
                      </button>
                    </Link>
                    <Link to="/register" onClick={handleNavClick}>
                      <button className="pn__btn pn__btn--primary pn__btn--full">
                        Create Free Account
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TravelQuiz open={quizOpen} onClose={() => setQuizOpen(false)} />
    </>
  );
};

export default Navbar;
