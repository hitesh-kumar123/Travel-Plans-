import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaEnvelope, FaGlobe, FaPhoneAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time error clearing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) {
      tempErrors.subject = "Subject is required";
    }
    if (!formData.message.trim()) {
      tempErrors.message = "Message is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } else {
      toast.error("Please correct the errors in the form.");
    }
  };

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
            We'd love to hear from <em>you</em>
          </h1>
          <p style={{ textAlign: "left" }}>
            Have a question about our curated itineraries, safety guidelines, or
            customized pricing packages? Our travel support specialists are
            available to help you map out your next perfect escape.
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
            <rect
              x="30"
              y="60"
              width="180"
              height="120"
              rx="12"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="2"
            />
            <path
              d="M30,70 L120,130 L210,70"
              fill="none"
              stroke="var(--coral)"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="120"
              cy="130"
              r="45"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <circle cx="120" cy="130" r="2" fill="var(--white)" />
          </svg>
        </div>
      </section>

      {/* ═══ CONTACT DETAILS & FORM ═══ */}
      <section
        className="wander-section"
        style={{ background: "var(--white)" }}
      >
        <div className="wander-testi-section" style={{ padding: "0" }}>
          {/* Left Column - Contact Details */}
          <div>
            <div className="wander-section-label">Get In Touch</div>
            <h2
              className="wander-section-title"
              style={{ marginBottom: "2rem" }}
            >
              Reach out through any of our channels
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              <div
                className="wander-feat-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="wander-feat-icon"
                  style={{ margin: 0, flexShrink: 0 }}
                >
                  <FaEnvelope size={18} color="var(--ocean)" />
                </div>
                <div>
                  <div
                    className="wander-feat-title"
                    style={{ fontSize: "1.05rem", margin: 0 }}
                  >
                    Email Us
                  </div>
                  <div
                    className="wander-feat-desc"
                    style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}
                  >
                    support@packgo.com
                  </div>
                </div>
              </div>

              <div
                className="wander-feat-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="wander-feat-icon"
                  style={{ margin: 0, flexShrink: 0 }}
                >
                  <FaGlobe size={18} color="var(--ocean)" />
                </div>
                <div>
                  <div
                    className="wander-feat-title"
                    style={{ fontSize: "1.05rem", margin: 0 }}
                  >
                    Our Website
                  </div>
                  <div
                    className="wander-feat-desc"
                    style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}
                  >
                    www.packgo.com
                  </div>
                </div>
              </div>

              <div
                className="wander-feat-card"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1.5rem",
                  padding: "1.5rem",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="wander-feat-icon"
                  style={{ margin: 0, flexShrink: 0 }}
                >
                  <FaPhoneAlt size={18} color="var(--ocean)" />
                </div>
                <div>
                  <div
                    className="wander-feat-title"
                    style={{ fontSize: "1.05rem", margin: 0 }}
                  >
                    Call Support
                  </div>
                  <div
                    className="wander-feat-desc"
                    style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}
                  >
                    +1 (555) 234-5678
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div
            style={{
              background: "var(--white)",
              border: "0.5px solid rgba(26, 74, 107, 0.1)",
              borderRadius: "16px",
              padding: "2.5rem",
              boxShadow: "0 8px 32px rgba(26, 74, 107, 0.05)",
            }}
          >
            <h3
              className="wander-section-title"
              style={{ fontSize: "1.6rem", marginBottom: "1.5rem" }}
            >
              Send a Message
            </h3>

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.2rem",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--mist)",
                    letterSpacing: "0.8px",
                    marginBottom: "0.4rem",
                  }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  style={{
                    textAlign: "left",
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: errors.name
                      ? "1px solid var(--coral)"
                      : "1px solid rgba(26, 74, 107, 0.15)",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "var(--ocean)",
                    background: "transparent",
                    outline: "none",
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                />
                {errors.name && (
                  <span
                    style={{
                      color: "var(--coral)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {errors.name}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--mist)",
                    letterSpacing: "0.8px",
                    marginBottom: "0.4rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: errors.email
                      ? "1px solid var(--coral)"
                      : "1px solid rgba(26, 74, 107, 0.15)",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "var(--ocean)",
                    background: "transparent",
                    outline: "none",
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                />
                {errors.email && (
                  <span
                    style={{
                      color: "var(--coral)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--mist)",
                    letterSpacing: "0.8px",
                    marginBottom: "0.4rem",
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Partnership Inquiry"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: errors.subject
                      ? "1px solid var(--coral)"
                      : "1px solid rgba(26, 74, 107, 0.15)",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "var(--ocean)",
                    background: "transparent",
                    outline: "none",
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                />
                {errors.subject && (
                  <span
                    style={{
                      color: "var(--coral)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {errors.subject}
                  </span>
                )}
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    textAlign: "left",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "var(--mist)",
                    letterSpacing: "0.8px",
                    marginBottom: "0.4rem",
                  }}
                >
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    border: errors.message
                      ? "1px solid var(--coral)"
                      : "1px solid rgba(26, 74, 107, 0.15)",
                    borderRadius: "8px",
                    fontSize: "0.95rem",
                    color: "var(--ocean)",
                    background: "transparent",
                    outline: "none",
                    resize: "vertical",
                    fontFamily: '"DM Sans", sans-serif',
                  }}
                />
                {errors.message && (
                  <span
                    style={{
                      color: "var(--coral)",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {errors.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="wander-btn-primary"
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                }}
              >
                Send Message
              </button>
            </form>
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

export default ContactUs;
