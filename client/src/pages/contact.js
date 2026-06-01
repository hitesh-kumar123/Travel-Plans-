import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formData);

    alert("Thank you! Your message has been sent.");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a4a6b, #0f2f47)",
          color: "#fff",
          textAlign: "center",
          padding: "100px 20px 80px",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            marginBottom: "15px",
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "0 auto",
            fontSize: "1.1rem",
            opacity: 0.9,
          }}
        >
          Have questions about your next adventure? Our travel experts are here
          to help you plan the perfect journey.
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "-50px auto 60px",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "30px",
        }}
      >
        {/* Contact Information */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "35px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              color: "#1a4a6b",
              marginBottom: "30px",
            }}
          >
            Get In Touch
          </h2>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              alignItems: "flex-start",
            }}
          >
            <FaEnvelope
              style={{
                color: "#ff6b57",
                fontSize: "22px",
                marginTop: "4px",
              }}
            />

            <div>
              <h4 style={{ margin: "0 0 5px", color: "#1a4a6b" }}>Email</h4>
              <p style={{ margin: 0, color: "#666" }}>support@packgo.com</p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              alignItems: "flex-start",
            }}
          >
            <FaPhone
              style={{
                color: "#ff6b57",
                fontSize: "22px",
                marginTop: "4px",
              }}
            />

            <div>
              <h4 style={{ margin: "0 0 5px", color: "#1a4a6b" }}>Phone</h4>
              <p style={{ margin: 0, color: "#666" }}>+91 98765 43210</p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "25px",
              alignItems: "flex-start",
            }}
          >
            <FaMapMarkerAlt
              style={{
                color: "#ff6b57",
                fontSize: "22px",
                marginTop: "4px",
              }}
            />

            <div>
              <h4 style={{ margin: "0 0 5px", color: "#1a4a6b" }}>Office</h4>
              <p style={{ margin: 0, color: "#666" }}>
                Mumbai, Maharashtra, India
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "35px",
              paddingTop: "20px",
              borderTop: "1px solid #eee",
            }}
          >
            <h4 style={{ color: "#1a4a6b", marginBottom: "12px" }}>
              Business Hours
            </h4>

            <p style={{ color: "#666", margin: "6px 0" }}>
              Monday – Friday: 9:00 AM – 6:00 PM
            </p>

            <p style={{ color: "#666", margin: "6px 0" }}>
              Saturday: 10:00 AM – 4:00 PM
            </p>

            <p style={{ color: "#666", margin: "6px 0" }}>Sunday: Closed</p>
          </div>
        </div>

        {/* Contact Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "35px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2
            style={{
              color: "#1a4a6b",
              marginBottom: "25px",
            }}
          >
            Send Us A Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                }}
              >
                Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                }}
              >
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                }}
              >
                Subject
              </label>

              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                }}
              >
                Message
              </label>

              <textarea
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                required
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "15px",
                border: "none",
                borderRadius: "12px",
                background: "#ff6b57",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
