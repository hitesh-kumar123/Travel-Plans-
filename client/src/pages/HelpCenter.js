import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HelpCenter = () => {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const categories = [
    { id: "all", name: "All Questions" },
    { id: "getting-started", name: "Getting Started" },
    { id: "account", name: "Account & Profile" },
    { id: "trips", name: "Planning Trips" },
    { id: "bookings", name: "Bookings" },
    { id: "technical", name: "Technical Support" },
  ];

  const faqs = [
    {
      id: 1,
      category: "getting-started",
      question: "How do I create an account on PackGo?",
      answer:
        'Click the "Register" button in the top right corner. Fill in your name, email, and create a password. You can also sign up using Google or Facebook for quick access.',
    },
    {
      id: 2,
      category: "getting-started",
      question: "Is PackGo free to use?",
      answer:
        "Yes! PackGo offers a free plan that includes basic trip planning, expense tracking, and itinerary management. Premium features like AI recommendations are available in our paid plans.",
    },
    {
      id: 3,
      category: "account",
      question: "How do I reset my password?",
      answer:
        'Go to the Login page and click "Forgot Password". Enter your registered email address and we\'ll send you a password reset link. Follow the instructions to create a new password.',
    },
    {
      id: 4,
      category: "account",
      question: "How do I update my profile information?",
      answer:
        "Log in to your account, go to Dashboard → Profile. You can update your name, profile picture, and contact information there.",
    },
    {
      id: 5,
      category: "trips",
      question: "How do I create a new trip plan?",
      answer:
        'From your Dashboard, click "Create New Trip". Enter destination, dates, budget, and activities. You can add expenses, accommodations, and transportation details as you go.',
    },
    {
      id: 6,
      category: "trips",
      question: "Can I share my trip itinerary with friends?",
      answer:
        'Yes! Each trip has a "Share" button that generates a unique link. Share this link with friends and family to let them view your travel plans.',
    },
    {
      id: 7,
      category: "bookings",
      question: "How do I search for flights and hotels?",
      answer:
        "Go to Dashboard → Booking. Enter your destination, dates, and number of travelers. Our system will show available options from trusted partners.",
    },
    {
      id: 8,
      category: "bookings",
      question: "Are bookings instantly confirmed?",
      answer:
        "Most bookings are confirmed instantly. For some special packages, confirmation may take up to 24 hours. You'll receive an email confirmation once processed.",
    },
    {
      id: 9,
      category: "technical",
      question: "The weather forecast isn't loading. What should I do?",
      answer:
        "Check your internet connection and refresh the page. If the issue persists, try clearing your browser cache or using a different browser. Our API has rate limits, so wait a few minutes before trying again.",
    },
    {
      id: 10,
      category: "technical",
      question: "Why am I getting logged out automatically?",
      answer:
        "For security reasons, sessions expire after 24 hours of inactivity. Simply log in again to continue. If it happens frequently, check if your browser cookies are enabled.",
    },
    {
      id: 11,
      category: "account",
      question: "How do I delete my account?",
      answer:
        "Go to Dashboard → Profile → Account Settings → Delete Account. Note: This action is permanent and will remove all your trip data, expenses, and saved destinations.",
    },
    {
      id: 12,
      category: "trips",
      question: "Can I add expenses to existing trips?",
      answer:
        'Absolutely! Open any trip from your dashboard, go to the "Expenses" tab, and click "Add Expense". You can categorize expenses by type (food, transport, accommodation, etc.)',
    },
  ];

  const filteredFAQs =
    activeCategory === "all"
      ? faqs
      : faqs.filter((faq) => faq.category === activeCategory);

  const troubleshootingGuides = [
    {
      title: "🌐 Connection Issues",
      steps: [
        "Check your internet connection",
        "Refresh the page (F5 or Cmd+R)",
        "Clear browser cache and cookies",
        "Try using incognito/private mode",
        "Disable VPN or proxy temporarily",
      ],
    },
    {
      title: "🔐 Login Problems",
      steps: [
        "Verify your email and password are correct",
        'Use "Forgot Password" to reset',
        "Check if Caps Lock is on",
        "Try logging in with Google/Facebook",
        "Contact support if issue persists",
      ],
    },
    {
      title: "📱 Mobile App Issues",
      steps: [
        "Update to latest version",
        "Clear app cache (Settings → Apps → PackGo → Clear Cache)",
        "Reinstall the app",
        "Check device storage space",
        "Ensure OS is up to date",
      ],
    },
  ];

  const platformGuides = [
    {
      title: "Getting Started Guide",
      description: "Learn the basics of PackGo",
      icon: "🚀",
      link: "/guides/getting-started",
    },
    {
      title: "Trip Planning 101",
      description: "How to plan your perfect trip",
      icon: "🗺️",
      link: "/guides/trip-planning",
    },
    {
      title: "Budget Management",
      description: "Track expenses effectively",
      icon: "💰",
      link: "/guides/budget-management",
    },
    {
      title: "Booking Tips",
      description: "Get the best deals",
      icon: "✈️",
      link: "/guides/booking-tips",
    },
  ];

  return (
    <div className="wander-page">
      <main
        style={{
          maxWidth: "1400px",
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
            Help Center
          </h1>
          <p
            style={{
              color: "rgba(253, 250, 245, 0.7)",
              fontSize: "1.1rem",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Find answers, guides, and support for all your PackGo questions
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              background: "var(--white)",
              borderRadius: "60px",
              padding: "0.5rem 1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              border: "1px solid rgba(26, 74, 107, 0.2)",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🔍</span>
            <input
              type="text"
              placeholder="Search for help..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "0.8rem 0",
                fontSize: "1rem",
                background: "transparent",
              }}
            />
            <button
              style={{
                background: "var(--coral)",
                border: "none",
                padding: "0.5rem 1.5rem",
                borderRadius: "40px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "3rem",
          }}
        >
          {[
            { icon: "❓", title: "FAQs", color: "var(--ocean)" },
            { icon: "🔧", title: "Troubleshooting", color: "var(--coral)" },
            { icon: "📚", title: "Guides", color: "var(--mist)" },
            { icon: "💬", title: "Contact Support", color: "var(--dark)" },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "var(--white)",
                padding: "1rem",
                borderRadius: "16px",
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s ease",
                border: "1px solid rgba(26, 74, 107, 0.1)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
                {item.icon}
              </div>
              <div style={{ fontWeight: "600", color: item.color }}>
                {item.title}
              </div>
            </div>
          ))}
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2rem",
              color: "var(--ocean)",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Frequently Asked Questions
          </h2>

          {/* Category Filters */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              justifyContent: "center",
              marginBottom: "2rem",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  background:
                    activeCategory === cat.id ? "var(--coral)" : "var(--white)",
                  color: activeCategory === cat.id ? "white" : "var(--ocean)",
                  border: `1px solid ${activeCategory === cat.id ? "var(--coral)" : "rgba(26, 74, 107, 0.2)"}`,
                  padding: "0.5rem 1rem",
                  borderRadius: "30px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: "var(--white)",
                  borderRadius: "16px",
                  marginBottom: "1rem",
                  border: "1px solid rgba(26, 74, 107, 0.1)",
                  overflow: "hidden",
                }}
              >
                <div
                  onClick={() => toggleFAQ(faq.id)}
                  style={{
                    padding: "1.25rem",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontWeight: "500",
                    color: "var(--ocean)",
                  }}
                >
                  <span>{faq.question}</span>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      transition: "transform 0.3s",
                      transform:
                        openFAQ === faq.id ? "rotate(180deg)" : "rotate(0)",
                    }}
                  >
                    ▼
                  </span>
                </div>
                <AnimatePresence>
                  {openFAQ === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        padding: "0 1.25rem 1.25rem 1.25rem",
                        color: "var(--dark)",
                        lineHeight: "1.6",
                        borderTop: "1px solid rgba(26, 74, 107, 0.08)",
                      }}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Troubleshooting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            background: "var(--sand)",
            borderRadius: "24px",
            padding: "2rem",
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              color: "var(--ocean)",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            🔧 Common Troubleshooting Guides
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {troubleshootingGuides.map((guide, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--white)",
                  borderRadius: "16px",
                  padding: "1.5rem",
                  border: "1px solid rgba(26, 74, 107, 0.1)",
                }}
              >
                <h3
                  style={{
                    color: "var(--coral)",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  {guide.title}
                </h3>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.2rem",
                    color: "var(--dark)",
                  }}
                >
                  {guide.steps.map((step, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Platform Guides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            marginBottom: "3rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              color: "var(--ocean)",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            📚 Platform Guides & Resources
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1rem",
            }}
          >
            {platformGuides.map((guide, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--white)",
                  borderRadius: "16px",
                  padding: "1.25rem",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid rgba(26, 74, 107, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(15, 45, 64, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
                  {guide.icon}
                </div>
                <h3
                  style={{
                    color: "var(--ocean)",
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  {guide.title}
                </h3>
                <p style={{ color: "var(--mist)", fontSize: "0.85rem" }}>
                  {guide.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            background:
              "linear-gradient(135deg, var(--white) 0%, var(--sand) 100%)",
            borderRadius: "24px",
            padding: "2rem",
            textAlign: "center",
            border: "1px solid rgba(26, 74, 107, 0.1)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.8rem",
              color: "var(--ocean)",
              marginBottom: "0.5rem",
            }}
          >
            Still Need Help?
          </h2>
          <p style={{ color: "var(--dark)", marginBottom: "1.5rem" }}>
            Our support team is here to assist you
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
              href="mailto:support@packgo.com"
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
                e.target.style.boxShadow =
                  "0 8px 24px rgba(232, 115, 90, 0.35)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              📧 Email Support
            </a>
            <a
              href="/contact"
              style={{
                background: "var(--white)",
                color: "var(--ocean)",
                padding: "0.75rem 1.5rem",
                borderRadius: "100px",
                textDecoration: "none",
                fontWeight: "500",
                display: "inline-block",
                border: "1px solid var(--coral)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "var(--coral)";
                e.target.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "var(--white)";
                e.target.style.color = "var(--ocean)";
              }}
            >
              📝 Contact Form
            </a>
          </div>
          <p
            style={{
              color: "var(--mist)",
              fontSize: "0.85rem",
              marginTop: "1.5rem",
            }}
          >
            Average response time: 24 hours
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default HelpCenter;
