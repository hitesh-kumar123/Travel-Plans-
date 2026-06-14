import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const contactDetails = [
  {
    icon: FaEnvelope,
    label: "Email",
    value: "support@packgo.com",
  },
  {
    icon: FaPhone,
    label: "Phone",
    value: "+91 98765 43210",
  },
  {
    icon: FaMapMarkerAlt,
    label: "Office",
    value: "Mumbai, Maharashtra, India",
  },
];

const businessHours = [
  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM" },
  { day: "Saturday", hours: "10:00 AM – 4:00 PM" },
  { day: "Sunday", hours: "Closed" },
];

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
          padding: "clamp(56px, 8vw, 72px) 20px clamp(48px, 6vw, 64px)",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            marginBottom: "12px",
            fontWeight: 700,
          }}
        >
          Contact Us
        </h1>

        <p
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontSize: "clamp(0.95rem, 2vw, 1.05rem)",
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          Have questions about your next adventure? Our travel experts are here
          to help you plan the perfect journey.
        </p>
      </div>

      {/* Main Content */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "-36px auto 48px",
          padding: "0 16px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          alignItems: "start",
          textAlign: "left",
        }}
      >
        {/* Contact Information */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              color: "#1a4a6b",
              marginBottom: "20px",
              fontSize: "1.35rem",
              fontWeight: 700,
              paddingBottom: "12px",
              borderBottom: "2px solid #f0f4f8",
            }}
          >
            Get In Touch
          </h2>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {contactDetails.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  padding: "14px 16px",
                  background: "#f8fafc",
                  borderRadius: "12px",
                  border: "1px solid #e8eef3",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255, 107, 87, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: "2px",
                  }}
                >
                  <Icon
                    style={{
                      color: "#ff6b57",
                      fontSize: "18px",
                    }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4
                    style={{
                      margin: "0 0 2px",
                      color: "#1a4a6b",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      textAlign: "left",
                    }}
                  >
                    {label}
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      color: "#64748b",
                      fontSize: "0.9rem",
                      lineHeight: 1.4,
                      textAlign: "left",
                    }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              background: "linear-gradient(135deg, #f8fafc, #f0f4f8)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
            }}
          >
            <h4
              style={{
                color: "#1a4a6b",
                margin: "0 0 14px",
                fontSize: "0.95rem",
                fontWeight: 700,
              }}
            >
              Business Hours
            </h4>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {businessHours.map(({ day, hours }, index) => (
                <div
                  key={day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    padding: "6px 0",
                    borderBottom:
                      index < businessHours.length - 1
                        ? "1px solid #e8eef3"
                        : "none",
                    fontSize: "0.875rem",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      color: "#1a4a6b",
                      fontWeight: 500,
                      textAlign: "left",
                    }}
                  >
                    {day}
                  </span>
                  <span
                    style={{
                      color: "#64748b",
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {hours}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <h2
            style={{
              color: "#1a4a6b",
              marginBottom: "20px",
              fontSize: "1.35rem",
              fontWeight: 700,
              paddingBottom: "12px",
              borderBottom: "2px solid #f0f4f8",
            }}
          >
            Send Us A Message
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                  fontSize: "0.9rem",
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
                  padding: "12px 14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                  fontSize: "0.9rem",
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
                  padding: "12px 14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                  fontSize: "0.9rem",
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
                  padding: "12px 14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  boxSizing: "border-box",
                  fontSize: "0.95rem",
                }}
              />
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "6px",
                  color: "#1a4a6b",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Message
              </label>

              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help..."
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid #d8e0e8",
                  borderRadius: "10px",
                  resize: "vertical",
                  boxSizing: "border-box",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "10px",
                background: "#ff6b57",
                color: "#fff",
                fontSize: "15px",
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
