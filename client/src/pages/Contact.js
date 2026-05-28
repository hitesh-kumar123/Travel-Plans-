import { useState } from "react";
import "./Contact.css";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-inner">
        {/* ── Left Info Panel ── */}
        <div className="contact-panel">
          <div>
            <p className="panel-eyebrow">Get in touch</p>
            <h1 className="panel-title">
              Let's talk
              <br />
              about your
              <br />
              <span>journey.</span>
            </h1>
            <p className="panel-desc">
              Have a question, suggestion, or just want to say hello? We're here
              and happy to help you plan your next adventure.
            </p>
            <div className="panel-divider" />
          </div>

          <div className="panel-info">
            <div className="panel-info-item">
              <span className="panel-info-icon">📍</span>
              Available worldwide
            </div>
            <div className="panel-info-item">
              <span className="panel-info-icon">⏱️</span>
              Response within 24 hours
            </div>
            <div className="panel-info-item">
              <span className="panel-info-icon">✉️</span>
              hello@packgo.app
            </div>
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="contact-form-panel">
          <p className="form-eyebrow">Send a message</p>
          <h2 className="form-heading">We'd love to hear from you.</h2>

          {submitted && (
            <div className="success-banner">
              <span>✓</span> Your message was sent — we'll be in touch soon!
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <div className="input-group">
              <label className="input-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Jane Smith"
                value={formData.name}
                onChange={handleChange}
                className={`contact-input${errors.name ? " has-error" : ""}`}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`contact-input${errors.email ? " has-error" : ""}`}
              />
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                rows="5"
                name="message"
                placeholder="Tell us how we can help…"
                value={formData.message}
                onChange={handleChange}
                className={`contact-textarea${errors.message ? " has-error" : ""}`}
              />
              {errors.message && (
                <span className="error-text">{errors.message}</span>
              )}
            </div>

            <button type="submit" className="contact-btn">
              Send Message
              <span className="btn-arrow">→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
