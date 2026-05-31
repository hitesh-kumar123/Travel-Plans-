import React, { useState } from "react";
import {
  ArrowLeft,
  Globe,
  Shield,
  FileText,
  User,
  Scale,
  Zap,
  RefreshCw,
  Mail,
  ChevronDown,
} from "lucide-react";

const sections = [
  {
    id: "01",
    icon: Scale,
    title: "Acceptance of Terms",
    content:
      "By using PackGo, you agree to these Terms & Conditions. If you do not agree, you must stop using the platform immediately. Continued access to any part of the platform constitutes your acceptance.",
  },
  {
    id: "02",
    icon: Globe,
    title: "Use of the Platform",
    content:
      "PackGo provides tools for planning trips and managing travel. You agree to use it responsibly and legally. Any misuse, scraping, or unauthorized automation of the platform is strictly prohibited.",
  },
  {
    id: "03",
    icon: User,
    title: "User Accounts",
    content:
      "You are responsible for your account security and all actions under it. Keep your credentials confidential and notify us immediately of any unauthorized access.",
  },
  {
    id: "04",
    icon: FileText,
    title: "User Content",
    content:
      "You retain ownership of your content but are responsible for ensuring it does not violate laws or third-party rights. By posting, you grant PackGo a non-exclusive license to display your content on the platform.",
  },
  {
    id: "05",
    icon: Shield,
    title: "Limitation of Liability",
    content:
      'PackGo is provided "as is". We are not responsible for losses or errors arising from use of the platform. Our liability is limited to the maximum extent permitted by applicable law.',
  },
  {
    id: "06",
    icon: Zap,
    title: "Third-Party Services",
    content:
      "External services linked in PackGo are not controlled by us. We are not responsible for their content, privacy practices, or availability. Use them at your own discretion.",
  },
  {
    id: "07",
    icon: RefreshCw,
    title: "Changes to Terms",
    content:
      "We may update these Terms at any time. Continued use means acceptance of changes. We will make reasonable efforts to notify users of significant updates via email or in-app notifications.",
  },
  {
    id: "08",
    icon: Mail,
    title: "Contact",
    content:
      "For questions, contact the PackGo support team at support@packgo.com. We aim to respond to all queries within 2 business days.",
  },
];

const Terms = () => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f7f4f0",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#1a2b4a",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Sora:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --navy: #1a2b4a;
          --navy-mid: #243755;
          --navy-light: #2e4a70;
          --peach: #f97c4a;
          --peach-light: #ffb49a;
          --peach-pale: #fff0ea;
          --offwhite: #f7f4f0;
          --offwhite-dark: #ede9e3;
          --muted: #8a9ab5;
          --text-body: #3d5278;
        }

        .navbar {
          background: var(--navy);
          padding: 0 40px;
          height: 62px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 2px 12px rgba(26,43,74,0.18);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 9px;
          text-decoration: none;
        }
        .logo-icon {
          width: 32px;
          height: 32px;
          background: var(--peach);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo-text {
          font-family: 'Sora', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.2s;
          font-weight: 500;
          letter-spacing: 0.01em;
        }
        .back-btn:hover { color: #fff; }

        .hero-band {
          background: var(--navy);
          padding: 52px 40px 0;
          position: relative;
          overflow: hidden;
        }

        .hero-band-inner {
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .hero-wave {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 56px;
          background: var(--offwhite);
          clip-path: ellipse(55% 100% at 50% 100%);
        }

        .hero-bg-circles {
          position: absolute;
          top: -60px; right: -80px;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          border: 1px solid rgba(249,124,74,0.12);
          pointer-events: none;
        }
        .hero-bg-circles::after {
          content: '';
          position: absolute;
          top: 40px; left: 40px; right: 40px; bottom: 40px;
          border-radius: 50%;
          border: 1px solid rgba(249,124,74,0.08);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(249,124,74,0.15);
          border: 1px solid rgba(249,124,74,0.3);
          border-radius: 20px;
          padding: 5px 13px;
          font-size: 12px;
          color: var(--peach-light);
          font-weight: 500;
          letter-spacing: 0.04em;
          margin-bottom: 18px;
        }

        .hero-title {
          font-family: 'Sora', sans-serif;
          font-size: clamp(30px, 5vw, 46px);
          font-weight: 700;
          color: #fff;
          line-height: 1.15;
          letter-spacing: -0.5px;
          margin-bottom: 14px;
        }
        .hero-title span { color: var(--peach); }

        .hero-desc {
          font-size: 15px;
          color: var(--muted);
          line-height: 1.7;
          margin-bottom: 38px;
          font-weight: 400;
          text-align: center;
        }

        .meta-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          margin-bottom: 52px;
        }
        .meta-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.07);
          border-radius: 8px;
          padding: 7px 14px;
          font-size: 12.5px;
          color: #b0c0d8;
          font-weight: 400;
        }
        .meta-pill strong { color: #fff; font-weight: 600; }

        .main-content {
          max-width: 900px;
          margin: 0 auto;
          padding: 48px 40px 72px;
        }

        .toc-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .toc-label {
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted);
          margin-right: 4px;
        }
        .toc-chip {
          font-size: 12px;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1px solid var(--offwhite-dark);
          background: #fff;
          color: var(--navy-light);
          cursor: pointer;
          transition: all 0.18s;
          font-weight: 500;
        }
        .toc-chip:hover {
          border-color: var(--peach);
          color: var(--peach);
          background: var(--peach-pale);
        }

        .section-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .sec-card {
          background: #fff;
          border-radius: 12px;
          border: 1.5px solid var(--offwhite-dark);
          overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .sec-card:hover {
          border-color: #c8d8ef;
          box-shadow: 0 2px 16px rgba(26,43,74,0.07);
        }
        .sec-card.open {
          border-color: var(--peach);
          box-shadow: 0 4px 20px rgba(249,124,74,0.1);
        }

        .sec-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px 22px;
          cursor: pointer;
          user-select: none;
        }

        .sec-num {
          font-family: 'Sora', sans-serif;
          font-size: 11px;
          font-weight: 700;
          color: var(--peach);
          background: var(--peach-pale);
          border-radius: 6px;
          padding: 3px 8px;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }

        .sec-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #eef3fa;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .sec-card.open .sec-icon-wrap {
          background: var(--peach-pale);
        }

        .sec-title {
          flex: 1;
          font-size: 15px;
          font-weight: 600;
          color: var(--navy);
          letter-spacing: -0.1px;
        }

        .sec-chevron {
          color: var(--muted);
          transition: transform 0.28s ease, color 0.2s;
          flex-shrink: 0;
        }
        .sec-card.open .sec-chevron {
          transform: rotate(180deg);
          color: var(--peach);
        }

        .sec-body {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease, padding 0.25s ease;
          padding: 0 22px;
        }
        .sec-body.open {
          max-height: 200px;
          padding: 0 22px 20px;
        }
        .sec-body-inner {
          font-size: 14px;
          line-height: 1.75;
          color: var(--text-body);
          padding-top: 12px;
          border-top: 1px solid var(--offwhite-dark);
        }

        .footer-card {
          background: var(--navy);
          border-radius: 16px;
          padding: 36px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-top: 40px;
          position: relative;
          overflow: hidden;
        }
        .footer-card::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: rgba(249,124,74,0.08);
          pointer-events: none;
        }

        .footer-title {
          font-family: 'Sora', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .footer-sub {
          font-size: 13.5px;
          color: var(--muted);
          line-height: 1.6;
        }

        .btn-primary {
          padding: 12px 26px;
          background: var(--peach);
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          text-decoration: none;
          transition: background 0.18s, transform 0.15s;
          white-space: nowrap;
          display: inline-block;
        }
        .btn-primary:hover { background: #e86d3a; transform: translateY(-1px); }

        .btn-outline {
          padding: 12px 26px;
          background: transparent;
          border: 1.5px solid rgba(255,255,255,0.18);
          color: #c8d8ef;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          text-decoration: none;
          transition: all 0.18s;
          white-space: nowrap;
          display: inline-block;
        }
        .btn-outline:hover {
          border-color: rgba(255,255,255,0.4);
          color: #fff;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.5s ease both; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.13s; }
        .d3 { animation-delay: 0.2s; }
        .d4 { animation-delay: 0.28s; }
      `}</style>

      {/* Navbar */}
      <nav className="navbar">
        <a href="/" className="back-btn">
          <ArrowLeft size={14} />
          Back to Home
        </a>
      </nav>

      {/* Hero */}
      <div className="hero-band">
        <div className="hero-bg-circles" />
        <div className="hero-wave" />
        <div className="hero-band-inner">
          <div className="badge fade-up d1">
            <FileText size={11} />
            Legal · Terms & Conditions
          </div>
          <h1 className="hero-title fade-up d2">
            Our Terms of <span>Service</span>
          </h1>
          <p className="hero-desc fade-up d3">
            Please read these terms carefully before using PackGo. They explain
            your rights, responsibilities, and how we work together to make your
            travel experience seamless.
          </p>
          <div className="meta-row fade-up d4">
            <div className="meta-pill">
              Last updated:{" "}
              <strong style={{ marginLeft: 5 }}>May 31, 2026</strong>
            </div>
            <div className="meta-pill">
              <strong>8</strong>&nbsp;sections
            </div>
            <div className="meta-pill">~2 min read</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main-content">
        {/* Section cards */}
        <div className="section-list">
          {sections.map((sec, i) => {
            const Icon = sec.icon;
            const isOpen = activeSection === sec.id;
            return (
              <div key={sec.id} className={`sec-card ${isOpen ? "open" : ""}`}>
                <div
                  className="sec-header"
                  onClick={() => setActiveSection(isOpen ? null : sec.id)}
                >
                  <span className="sec-num">{sec.id}</span>
                  <div className="sec-icon-wrap">
                    <Icon
                      size={16}
                      color={isOpen ? "#f97c4a" : "#3d5278"}
                      strokeWidth={1.8}
                    />
                  </div>
                  <span className="sec-title">{sec.title}</span>
                  <ChevronDown size={18} className="sec-chevron" />
                </div>
                <div className={`sec-body ${isOpen ? "open" : ""}`}>
                  <div className="sec-body-inner">{sec.content}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer card */}
        <div className="footer-card">
          <div>
            <p className="footer-title">Need help understanding our terms?</p>
            <p className="footer-sub">
              Our support team is ready to answer any questions you have.
            </p>
          </div>
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            <a href="/register" className="btn-outline">
              Create Account
            </a>
            <a href="/" className="btn-primary">
              Return Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
