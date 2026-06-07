import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Name and email address for account management",
        "Profile information and travel preferences",
        "Travel itineraries and trip plans",
        "Expense tracking and budget data",
        "Saved destinations and favorite locations",
      ],
    },
    {
      title: "How We Use Your Information",
      content: [
        "Personalize your travel recommendations",
        "Track and manage your travel expenses",
        "Display real-time weather for destinations",
        "Enable language translation features",
        "Improve and optimize our services",
      ],
    },
    {
      title: "Data Storage & Security",
      content: [
        "End-to-end encryption for sensitive data",
        "Regular security audits and updates",
        "Secure JWT-based authentication",
        "Protected API endpoints with rate limiting",
        "Regular database backups",
      ],
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal data at any time",
        "Request corrections to your information",
        "Delete your account and associated data",
        "Opt-out of non-essential communications",
        "Export your travel data",
      ],
    },
  ];

  return (
    <div className="wander-page">
      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "120px 2rem 4rem",
          minHeight: "calc(100vh - 400px)",
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background:
              "linear-gradient(135deg, var(--ocean) 0%, var(--dark) 100%)",
            borderRadius: "24px",
            padding: "3rem",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "var(--white)",
              marginBottom: "1rem",
            }}
          >
            Privacy Policy
          </h1>
          <p
            style={{
              color: "rgba(253, 250, 245, 0.7)",
              fontSize: "1rem",
            }}
          >
            Last Updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </motion.div>

        {/* Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "var(--white)",
            borderRadius: "20px",
            padding: "2rem",
            marginBottom: "2rem",
            border: "1px solid rgba(26, 74, 107, 0.1)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              color: "var(--ocean)",
              marginBottom: "1rem",
            }}
          >
            Our Commitment to Your Privacy
          </h2>
          <p
            style={{
              color: "var(--dark)",
              lineHeight: "1.8",
              marginBottom: "1rem",
            }}
          >
            At PackGo, we take your privacy seriously. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you use our travel planning platform.
          </p>
          <div
            style={{
              background: "var(--sand)",
              padding: "1rem 1.5rem",
              borderRadius: "12px",
              borderLeft: `4px solid var(--coral)`,
            }}
          >
            <p style={{ color: "var(--ocean)", fontSize: "0.9rem", margin: 0 }}>
              <strong>📌 Quick Overview:</strong> We only collect necessary data
              to provide you with the best travel planning experience. We never
              sell your personal information.
            </p>
          </div>
        </motion.div>

        {/* Sections */}
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 2) }}
            style={{
              background: "var(--white)",
              borderRadius: "20px",
              padding: "2rem",
              marginBottom: "1.5rem",
              border: "1px solid rgba(26, 74, 107, 0.1)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
            }}
            whileHover={{
              y: -4,
              boxShadow: "0 8px 32px rgba(15, 45, 64, 0.1)",
            }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.5rem",
                color: "var(--ocean)",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  background: "var(--coral)",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>
              {section.title}
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {section.content.map((item, i) => (
                <li
                  key={i}
                  style={{
                    padding: "0.75rem 0",
                    borderBottom:
                      i < section.content.length - 1
                        ? "1px solid rgba(26, 74, 107, 0.08)"
                        : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      background: "var(--coral)",
                      borderRadius: "50%",
                      display: "inline-block",
                      opacity: 0.6,
                    }}
                  ></span>
                  <span style={{ color: "var(--dark)" }}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            background:
              "linear-gradient(135deg, var(--sand) 0%, var(--white) 100%)",
            borderRadius: "20px",
            padding: "2rem",
            textAlign: "center",
            border: "1px solid rgba(26, 74, 107, 0.1)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.5rem",
              color: "var(--ocean)",
              marginBottom: "1rem",
            }}
          >
            Contact Us
          </h2>
          <p style={{ color: "var(--dark)", marginBottom: "1.5rem" }}>
            If you have questions about this Privacy Policy, please contact us:
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <a
              href="mailto:privacy@packgo.com"
              style={{
                background: "var(--coral)",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "100px",
                textDecoration: "none",
                fontWeight: "500",
                transition: "all 0.3s ease",
                display: "inline-block",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow =
                  "0 8px 24px rgba(232, 115, 90, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              privacy@packgo.com
            </a>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
