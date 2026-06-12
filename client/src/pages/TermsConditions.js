import React from "react";
import { motion } from "framer-motion";

const TermsConditions = () => {
  const sections = [
    {
      title: "Acceptance of Terms",
      content:
        "By accessing and using PackGo, you accept and agree to be bound by these terms. If you do not agree, please do not use our service.",
    },
    {
      title: "User Responsibilities",
      items: [
        "Provide accurate and complete information",
        "Maintain security of your account credentials",
        "Accept responsibility for all account activities",
        "Not use the platform for illegal purposes",
        "Respect intellectual property rights",
      ],
    },
    {
      title: "Booking & Payment Terms",
      items: [
        "All bookings subject to availability",
        "Prices may change without prior notice",
        "Cancellation policies vary by provider",
        "Refunds processed according to refund policy",
      ],
    },
    {
      title: "Intellectual Property",
      items: [
        "All content and features are owned by PackGo",
        "No copying or distribution without permission",
        "User content grants us license to use it",
        "Trademarks require written consent for use",
      ],
    },
    {
      title: "Limitation of Liability",
      content:
        "PackGo shall not be liable for indirect, incidental, or consequential damages resulting from your use of the service. We provide the platform 'as is' without warranties.",
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
              "linear-gradient(135deg, var(--dark) 0%, var(--ocean) 100%)",
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
            Terms & Conditions
          </h1>
          <p
            style={{
              color: "rgba(253, 250, 245, 0.7)",
              fontSize: "1rem",
            }}
          >
            Please read these terms carefully before using PackGo
          </p>
        </motion.div>

        {/* Introduction Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            background: "rgba(232, 115, 90, 0.1)",
            borderLeft: `4px solid var(--coral)`,
            borderRadius: "12px",
            padding: "1rem 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p style={{ color: "var(--dark)", margin: 0 }}>
            <strong>Legal Agreement:</strong> These Terms & Conditions
            constitute a legally binding agreement between you and PackGo.
          </p>
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
            {section.content ? (
              <p style={{ color: "var(--dark)", lineHeight: "1.8" }}>
                {section.content}
              </p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    style={{
                      padding: "0.75rem 0",
                      borderBottom:
                        i < section.items.length - 1
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
            )}
          </motion.div>
        ))}

        {/* Additional Clauses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          style={{
            background: "var(--sand)",
            borderRadius: "20px",
            padding: "2rem",
            marginBottom: "1.5rem",
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
            Additional Provisions
          </h2>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                color: "var(--coral)",
                marginBottom: "0.5rem",
                fontSize: "1.1rem",
              }}
            >
              Termination
            </h3>
            <p style={{ color: "var(--dark)" }}>
              We reserve the right to terminate or suspend your account for
              violation of these Terms.
            </p>
          </div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3
              style={{
                color: "var(--coral)",
                marginBottom: "0.5rem",
                fontSize: "1.1rem",
              }}
            >
              Governing Law
            </h3>
            <p style={{ color: "var(--dark)" }}>
              These Terms shall be governed by the laws of India.
            </p>
          </div>
          <div>
            <h3
              style={{
                color: "var(--coral)",
                marginBottom: "0.5rem",
                fontSize: "1.1rem",
              }}
            >
              Changes to Terms
            </h3>
            <p style={{ color: "var(--dark)" }}>
              We may modify these Terms at any time. Material changes will be
              notified 30 days in advance.
            </p>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{
            textAlign: "center",
            padding: "2rem",
            background:
              "linear-gradient(135deg, var(--white) 0%, var(--sand) 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(26, 74, 107, 0.1)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.3rem",
              color: "var(--ocean)",
              marginBottom: "0.5rem",
            }}
          >
            Questions About Terms?
          </h2>
          <p style={{ color: "var(--dark)", marginBottom: "1rem" }}>
            Contact our legal team:
          </p>
          <a
            href="mailto:legal@packgo.com"
            style={{
              background: "var(--coral)",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "100px",
              textDecoration: "none",
              fontWeight: "500",
              display: "inline-block",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 24px rgba(232, 115, 90, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            legal@packgo.com
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsConditions;
