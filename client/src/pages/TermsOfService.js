import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./TermsOfService.css";

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    content: `By accessing or using PackGo's platform, mobile application, or any related services (collectively, the "Service"), you confirm that you are at least 18 years of age, have read and understood these Terms, and agree to be bound by them. If you are using the Service on behalf of an organization, you represent that you have authority to bind that organization to these Terms.

These Terms constitute a legally binding agreement between you and PackGo Travel Co. ("PackGo", "we", "us", or "our"). Your continued use of the Service following any modifications to these Terms constitutes acceptance of those changes.`,
  },
  {
    id: "account",
    number: "02",
    title: "Account Registration & Security",
    content: `To access certain features of the Service, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate.

You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify PackGo of any unauthorized use of your account or any other breach of security. PackGo will not be liable for any loss or damage arising from your failure to protect your account information.

We reserve the right to suspend or terminate accounts that violate these Terms, provide false information, or engage in any activity that we determine, in our sole discretion, to be harmful to other users, third parties, or PackGo.`,
  },
  {
    id: "services",
    number: "03",
    title: "Use of Services",
    content: `PackGo grants you a limited, non-exclusive, non-transferable, and revocable license to access and use the Service for your personal, non-commercial travel planning purposes. This license does not include the right to:

• Reproduce, duplicate, copy, sell, resell, or exploit any portion of the Service
• Use automated systems or software to extract data from the Service (screen scraping)
• Modify, translate, adapt, or create derivative works based on the Service
• Reverse engineer or attempt to extract the source code of the Service
• Use the Service for any unlawful purpose or in violation of any regulations

PackGo reserves the right to modify, suspend, or discontinue any aspect of the Service at any time without notice or liability.`,
  },
  {
    id: "trips",
    number: "04",
    title: "Trip Planning & Bookings",
    content: `PackGo provides tools to help you plan, organize, and manage travel itineraries. While we strive to provide accurate destination information, weather data, and travel recommendations, we do not guarantee the accuracy, completeness, or timeliness of any information provided.

PackGo acts as a platform facilitating trip organization. We are not a licensed travel agency and do not directly sell flights, accommodations, or travel packages unless explicitly stated. Any third-party bookings made through integrated services are subject to the terms and conditions of those third-party providers.

You acknowledge that travel inherently involves risks, and PackGo is not responsible for events beyond our reasonable control, including natural disasters, political unrest, airline cancellations, or changes in local conditions.`,
  },
  {
    id: "privacy",
    number: "05",
    title: "Privacy & Data",
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service, you consent to the collection, use, and sharing of your information as described in the Privacy Policy.

We collect information you provide directly (such as account details and trip data), information generated through your use of the Service (such as itineraries and preferences), and information from third-party services you connect to your account.

We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    id: "content",
    number: "06",
    title: "User Content",
    content: `You retain ownership of any content you submit, post, or display through the Service ("User Content"). By submitting User Content, you grant PackGo a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content solely for the purpose of providing and improving the Service.

You represent and warrant that your User Content does not violate any third-party rights, including intellectual property rights and privacy rights, and does not contain any unlawful, harmful, threatening, abusive, or otherwise objectionable material.

PackGo reserves the right to remove any User Content that violates these Terms or that we find objectionable, without prior notice.`,
  },
  {
    id: "payment",
    number: "07",
    title: "Payments & Subscriptions",
    content: `Certain features of the Service may require payment. All fees are stated in Indian Rupees (INR) unless otherwise specified and are exclusive of applicable taxes. You agree to pay all fees associated with your chosen plan.

Subscription fees are billed in advance on a recurring basis (monthly or annually, depending on your selection). You authorize PackGo to charge your payment method on file for all applicable fees. Subscriptions automatically renew unless cancelled at least 24 hours before the renewal date.

Refunds are handled on a case-by-case basis. We reserve the right to modify our pricing at any time, with at least 30 days' notice for existing subscribers. Continued use of the Service after a price change constitutes acceptance of the new pricing.`,
  },
  {
    id: "intellectual",
    number: "08",
    title: "Intellectual Property",
    content: `The Service and all of its original content, features, and functionality — including but not limited to text, graphics, logos, icons, images, audio clips, and software — are owned by PackGo Travel Co. and are protected by Indian and international copyright, trademark, patent, trade secret, and other intellectual property laws.

The PackGo name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of PackGo Travel Co. You may not use such marks without prior written permission. All other names, logos, product and service names, designs, and slogans on the Service are the trademarks of their respective owners.`,
  },
  {
    id: "liability",
    number: "09",
    title: "Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, PackGo and its officers, directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages — including loss of profits, data, goodwill, or other intangible losses — resulting from your access to or use of (or inability to access or use) the Service.

In no event shall PackGo's total liability to you for all claims arising out of or relating to these Terms or the Service exceed the amount you have paid to PackGo in the twelve (12) months preceding the event giving rise to the claim, or INR 5,000, whichever is greater.

Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so the above limitations may not apply to you.`,
  },
  {
    id: "termination",
    number: "10",
    title: "Termination",
    content: `You may terminate your account at any time by contacting us at support@packgo.travel or through your account settings. Upon termination, your right to use the Service will immediately cease.

PackGo may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, provisions that by their nature should survive will survive, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.

We will retain your data for a period of 30 days following account termination, after which it will be permanently deleted from our systems, subject to legal obligations.`,
  },
  {
    id: "governing",
    number: "11",
    title: "Governing Law & Disputes",
    content: `These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Ahmedabad, Gujarat, India.

Before initiating formal legal proceedings, you agree to first attempt to resolve any dispute informally by contacting PackGo at legal@packgo.travel. We will attempt to resolve the dispute within 30 days of receiving written notice.

If informal resolution fails, disputes shall be resolved through binding arbitration in accordance with the Arbitration and Conciliation Act, 1996 of India.`,
  },
  {
    id: "changes",
    number: "12",
    title: "Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. When we make material changes, we will notify you by email (to the address associated with your account) and/or by displaying a prominent notice on the Service at least 14 days before the changes take effect.

Your continued use of the Service after the effective date of any modifications constitutes your acceptance of the revised Terms. If you do not agree to the modified Terms, you must stop using the Service and may close your account.

We encourage you to review these Terms periodically to stay informed of any updates. The "Last Updated" date at the top of this page indicates when these Terms were last revised.`,
  },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const offsets = sections
        .map((s) => {
          const el = document.getElementById(`section-${s.id}`);
          return el ? { id: s.id, top: el.getBoundingClientRect().top } : null;
        })
        .filter(Boolean);

      const visible = offsets.filter((o) => o.top <= 140);
      if (visible.length > 0) {
        setActiveSection(visible[visible.length - 1].id);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="tos-page">
      {/* NAV */}
      <nav className={`tos-nav ${scrolled ? "tos-nav-scrolled" : ""}`}>
        <Link to="/" className="tos-logo">
          Pack<span>Go</span>
        </Link>
        <div className="tos-nav-links">
          <Link to="/privacy" className="tos-nav-link">
            Privacy Policy
          </Link>
          <Link to="/register" className="tos-nav-cta">
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="tos-hero">
        <div className="tos-hero-inner">
          <div className="tos-hero-badge">Legal</div>
          <h1 className="tos-hero-title">Terms of Service</h1>
          <p className="tos-hero-subtitle">
            Please read these terms carefully before using PackGo. They govern
            your access to and use of our travel planning platform.
          </p>
          <div className="tos-hero-meta">
            <span className="tos-meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Effective: January 1, 2025
            </span>
            <span className="tos-meta-dot" />
            <span className="tos-meta-item">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              ~12 min read
            </span>
            <span className="tos-meta-dot" />
            <span className="tos-meta-item">12 sections</span>
          </div>
        </div>
        <div className="tos-hero-decor" aria-hidden="true">
          <div className="tos-decor-ring tos-ring-1" />
          <div className="tos-decor-ring tos-ring-2" />
          <div className="tos-decor-ring tos-ring-3" />
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <div className="tos-layout">
        {/* SIDEBAR */}
        <aside className="tos-sidebar">
          <div className="tos-sidebar-inner">
            <p className="tos-sidebar-label">Contents</p>
            <nav className="tos-sidebar-nav">
              {sections.map((s) => (
                <button
                  key={s.id}
                  className={`tos-sidebar-item ${activeSection === s.id ? "active" : ""}`}
                  onClick={() => scrollToSection(s.id)}
                >
                  <span className="tos-sidebar-num">{s.number}</span>
                  <span className="tos-sidebar-title">{s.title}</span>
                </button>
              ))}
            </nav>
            <div className="tos-sidebar-contact">
              <p className="tos-contact-label">Questions?</p>
              <a href="mailto:legal@packgo.travel" className="tos-contact-link">
                legal@packgo.travel
              </a>
            </div>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="tos-content">
          <div className="tos-summary-card">
            <div className="tos-summary-icon" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <p className="tos-summary-title">Plain English Summary</p>
              <p className="tos-summary-text">
                Use PackGo responsibly for personal travel planning. Keep your
                account secure. We protect your data. You own your content. We
                can terminate accounts that abuse the platform. Indian law
                governs these terms.
              </p>
            </div>
          </div>

          {sections.map((s, i) => (
            <section key={s.id} id={`section-${s.id}`} className="tos-section">
              <div className="tos-section-header">
                <span className="tos-section-number">{s.number}</span>
                <h2 className="tos-section-title">{s.title}</h2>
              </div>
              <div className="tos-section-body">
                {s.content.split("\n\n").map((para, j) => (
                  <p key={j} className="tos-para">
                    {para.startsWith("•") ? (
                      <span className="tos-bullet-block">
                        {para.split("\n").map((line, k) => (
                          <span key={k} className="tos-bullet-line">
                            {line.startsWith("•") ? (
                              <>
                                <span className="tos-bullet-dot">—</span>
                                {line.slice(1).trim()}
                              </>
                            ) : (
                              line
                            )}
                          </span>
                        ))}
                      </span>
                    ) : (
                      para
                    )}
                  </p>
                ))}
              </div>
              {i < sections.length - 1 && <div className="tos-divider" />}
            </section>
          ))}

          {/* FOOTER CARD */}
          <div className="tos-footer-card">
            <div className="tos-footer-card-left">
              <p className="tos-footer-card-title">Still have questions?</p>
              <p className="tos-footer-card-text">
                Our legal team is happy to clarify anything in these Terms.
                Reach out and we'll respond within 2 business days.
              </p>
            </div>
            <a
              href="mailto:legal@packgo.travel"
              className="tos-footer-card-btn"
            >
              Contact Legal Team
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="tos-footer">
        <div className="tos-footer-inner">
          <Link to="/" className="tos-footer-logo">
            Pack<span>Go</span>
          </Link>
          <div className="tos-footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/">Home</Link>
            <Link to="/register">Sign Up</Link>
          </div>
          <p className="tos-footer-copy">
            © {new Date().getFullYear()} PackGo Travel Co. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
