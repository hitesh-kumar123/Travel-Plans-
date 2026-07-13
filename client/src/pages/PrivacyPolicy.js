import React from "react";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Information We Collect",
      items: [
        "Account details such as name, email, and phone number",
        "Trip and booking information you provide",
        "Payment details processed securely via our payment partners",
        "Device and usage data to improve our services",
      ],
    },
    {
      title: "How We Use Your Information",
      items: [
        "To create and manage your account",
        "To process bookings and payments",
        "To send important updates about your trips",
        "To improve and personalize your experience on PackGo",
      ],
    },
    {
      title: "Data Sharing",
      content:
        "We do not sell your personal data. Information may be shared with trusted service providers (such as payment processors) strictly to fulfill your bookings, and only to the extent necessary.",
    },
    {
      title: "Data Security",
      content:
        "We use industry-standard security measures to protect your data, including encryption and access controls. However, no method of transmission over the internet is 100% secure.",
    },
    {
      title: "Your Rights",
      items: [
        "Access the personal data we hold about you",
        "Request corrections to inaccurate information",
        "Request deletion of your account and data",
        "Opt out of marketing communications at any time",
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
            Privacy Policy
          </h1>
          <p
            style={{
              color: "rgba(253, 250, 245, 0.7)",
              fontSize: "1rem",
            }}
          >
            Your privacy matters to us. Here's how we handle your data.
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
            <strong>Your Data, Your Control:</strong> We are committed to
            protecting your personal information and being transparent about how
            it's used.
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
            Questions About Your Privacy?
          </h2>
          <p style={{ color: "var(--dark)", marginBottom: "1rem" }}>
            Reach out to our privacy team:
          </p>
          <a
            href="mailto:privacy@packgo.com"
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
            privacy@packgo.com
          </a>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
