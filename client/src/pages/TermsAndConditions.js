import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
import "./LegalPage.css";

/* ── Section data ─────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <p>
          By accessing, browsing, or using the PackGo Travel platform (the
          "Service"), you acknowledge that you have read, understood, and agree
          to be legally bound by these Terms &amp; Conditions ("Terms") and our{" "}
          <Link to="/privacy-policy" className="legal-link">
            Privacy Policy
          </Link>
          , which is incorporated herein by reference.
        </p>
        <p>
          These Terms constitute a legally binding agreement between you
          ("User", "you", or "your") and <strong>PackGo Travel Co.</strong>{" "}
          ("Company", "we", "our", or "us"). If you do not agree to these Terms,
          you must immediately discontinue use of the Service.
        </p>
        <p>
          You must be at least 18 years of age to use our Service. By using
          PackGo, you represent and warrant that you are 18 years of age or
          older and have the legal capacity to enter into these Terms.
        </p>
      </>
    ),
  },
  {
    id: "user-responsibilities",
    title: "2. User Responsibilities",
    content: (
      <>
        <p>
          As a user of PackGo, you accept the following responsibilities when
          using our platform:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Account Accuracy:</strong> Provide accurate, current, and
            complete information when creating your account and keep it updated.
          </li>
          <li>
            <strong>Account Security:</strong> Maintain the confidentiality of
            your login credentials. You are responsible for all activities that
            occur under your account.
          </li>
          <li>
            <strong>Immediate Notification:</strong> Notify us immediately at
            security@packgo.travel of any unauthorised use of your account or
            any security breach.
          </li>
          <li>
            <strong>Compliance:</strong> Comply with all applicable local,
            national, and international laws, regulations, and travel
            requirements relevant to your trips.
          </li>
          <li>
            <strong>Travel Documentation:</strong> Ensure you hold valid
            passports, visas, travel insurance, and any other required
            documentation. PackGo is not responsible for denied entry due to
            inadequate documentation.
          </li>
          <li>
            <strong>Accurate Booking Information:</strong> Provide accurate
            passenger details, dates, and specifications when making bookings.
            Errors may result in non-refundable costs.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "permitted-use",
    title: "3. Permitted and Prohibited Use",
    content: (
      <>
        <h3 className="legal-sub-heading">Permitted Use</h3>
        <p>You may use PackGo solely for lawful purposes, including:</p>
        <ul className="legal-list">
          <li>
            Planning, researching, and booking personal or business travel.
          </li>
          <li>
            Creating, managing, and sharing travel itineraries for personal use.
          </li>
          <li>
            Accessing destination information, reviews, and travel guidance.
          </li>
          <li>Communicating with our support team regarding your bookings.</li>
        </ul>
        <h3 className="legal-sub-heading">Prohibited Use</h3>
        <p>You expressly agree not to:</p>
        <ul className="legal-list">
          <li>
            <strong>Illegal Activities:</strong> Use the platform for any
            unlawful purpose or in violation of any local, national, or
            international law.
          </li>
          <li>
            <strong>Fraudulent Bookings:</strong> Make false, fraudulent, or
            speculative reservations or engage in any form of booking fraud.
          </li>
          <li>
            <strong>Scraping or Automated Access:</strong> Use bots, scrapers,
            crawlers, or other automated tools to access, extract, or copy any
            content from the platform without prior written consent.
          </li>
          <li>
            <strong>System Interference:</strong> Attempt to gain unauthorised
            access to our systems, servers, or networks, or interfere with the
            platform's security features.
          </li>
          <li>
            <strong>Reselling:</strong> Resell, sublicense, or commercially
            exploit any part of the Service without our express written consent.
          </li>
          <li>
            <strong>Harmful Content:</strong> Post, transmit, or distribute any
            content that is defamatory, obscene, abusive, threatening, hateful,
            or otherwise objectionable.
          </li>
          <li>
            <strong>Impersonation:</strong> Impersonate any person or entity,
            including PackGo staff, or misrepresent your affiliation.
          </li>
        </ul>
        <p>
          Violations may result in immediate termination of your account and,
          where appropriate, referral to law enforcement authorities.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    content: (
      <>
        <p>
          All content on the PackGo platform — including but not limited to
          text, graphics, logos, icons, images, audio clips, data compilations,
          software, and the overall design and arrangement — is the property of{" "}
          <strong>PackGo Travel Co.</strong> or its content suppliers and is
          protected by Indian and international intellectual property laws.
        </p>
        <h3 className="legal-sub-heading">Our Rights</h3>
        <ul className="legal-list">
          <li>
            The PackGo name, logo, and taglines are registered trademarks. You
            may not use them without prior written consent.
          </li>
          <li>
            All destination content, itinerary templates, and curated travel
            guides are proprietary to PackGo.
          </li>
          <li>
            Our platform's source code, databases, and architecture are
            protected as trade secrets and by copyright law.
          </li>
        </ul>
        <h3 className="legal-sub-heading">Your Content</h3>
        <p>
          By uploading, posting, or submitting content to PackGo (such as
          reviews, photos, or itinerary descriptions), you grant PackGo a
          worldwide, royalty-free, non-exclusive licence to use, reproduce,
          modify, adapt, publish, and display such content for the purpose of
          operating and promoting the Service.
        </p>
        <p>
          You retain ownership of content you submit and represent that you have
          all rights necessary to grant this licence. You may delete your
          content at any time, subject to content that has already been shared
          or distributed.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "5. Limitation of Liability",
    content: (
      <>
        <p>
          To the maximum extent permitted by applicable law, PackGo Travel Co.
          and its affiliates, officers, directors, employees, agents, partners,
          and licensors shall not be liable for:
        </p>
        <ul className="legal-list">
          <li>
            Any indirect, incidental, special, consequential, punitive, or
            exemplary damages arising from your use of or inability to use the
            Service.
          </li>
          <li>
            Loss of profits, goodwill, data, or other intangible losses, even if
            we have been advised of the possibility of such damages.
          </li>
          <li>
            Any errors, omissions, interruptions, deletions, defects, or delays
            in operation or transmission of the Service.
          </li>
          <li>
            Acts or omissions of third-party travel providers, airlines, hotels,
            tour operators, or other service providers booked through our
            platform.
          </li>
          <li>
            Events beyond our reasonable control, including natural disasters,
            strikes, government actions, or other force majeure events.
          </li>
          <li>
            Any damage to your computer, device, or data arising from use of the
            platform.
          </li>
        </ul>
        <p>
          Our total aggregate liability to you for any claim arising out of or
          in connection with these Terms or the Service shall not exceed the
          total amount paid by you to PackGo in the twelve (12) months
          immediately preceding the event giving rise to the claim, or ₹5,000
          (whichever is greater).
        </p>
      </>
    ),
  },
  {
    id: "disclaimer",
    title: "6. Disclaimer",
    content: (
      <>
        <p>
          The PackGo Service is provided on an <strong>"as is"</strong> and{" "}
          <strong>"as available"</strong> basis without any warranties of any
          kind, either express or implied, including but not limited to:
        </p>
        <ul className="legal-list">
          <li>
            Implied warranties of merchantability, fitness for a particular
            purpose, or non-infringement.
          </li>
          <li>
            Warranties that the Service will be uninterrupted, error-free,
            secure, or free of viruses or other harmful components.
          </li>
          <li>
            Warranties regarding the accuracy, completeness, or reliability of
            any destination information, pricing, or availability data on the
            platform.
          </li>
        </ul>
        <p>
          Travel involves inherent risks. PackGo provides information and
          facilitates bookings as a platform service. We strongly recommend that
          you obtain comprehensive travel insurance for all trips planned
          through our platform. PackGo does not act as a travel insurer, tour
          operator, or carrier.
        </p>
        <p>
          Prices, availability, and itinerary information displayed on the
          platform are subject to change without notice. Final pricing is
          confirmed at the time of booking completion.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "7. Termination",
    content: (
      <>
        <p>
          Either party may terminate the use of the Service at any time and for
          any reason. Termination may occur under the following circumstances:
        </p>
        <h3 className="legal-sub-heading">Termination by You</h3>
        <ul className="legal-list">
          <li>
            You may close your account at any time by navigating to Account
            Settings and selecting "Delete Account", or by contacting our
            support team.
          </li>
          <li>
            Upon account deletion, your personal data will be removed in
            accordance with our Privacy Policy, subject to legal retention
            obligations.
          </li>
        </ul>
        <h3 className="legal-sub-heading">Termination by PackGo</h3>
        <ul className="legal-list">
          <li>
            We reserve the right to suspend or permanently terminate your
            account without notice if you violate these Terms, engage in
            fraudulent activity, or cause harm to other users or the platform.
          </li>
          <li>
            We may also discontinue the Service or any portion thereof at any
            time with 30 days' notice to registered users, except in cases of
            force majeure or legal compulsion.
          </li>
        </ul>
        <p>
          Upon termination, your right to use the Service immediately ceases.
          Clauses relating to intellectual property, disclaimer, limitation of
          liability, and governing law shall survive termination.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-terms",
    title: "8. Changes to Terms",
    content: (
      <>
        <p>
          We reserve the right to modify these Terms &amp; Conditions at any
          time at our sole discretion. When we make changes, we will:
        </p>
        <ul className="legal-list">
          <li>Update the "Last Updated" date at the top of this page.</li>
          <li>
            Notify registered users via email for material changes at least 14
            days before the changes take effect.
          </li>
          <li>
            Display a prominent banner on the platform announcing the upcoming
            changes.
          </li>
        </ul>
        <p>
          Your continued use of the Service after the effective date of any
          changes constitutes your acceptance of the revised Terms. If you do
          not agree with the changes, you must stop using the Service and may
          close your account before the effective date.
        </p>
        <p>
          We recommend reviewing these Terms periodically. The latest version
          will always be available at{" "}
          <Link to="/terms-and-conditions" className="legal-link">
            packgo.travel/terms-and-conditions
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "9. Contact Information",
    content: (
      <>
        <p>
          If you have any questions about these Terms &amp; Conditions or wish
          to report a violation, please contact our Legal team:
        </p>
        <div className="legal-contact-card">
          <div className="legal-contact-row">
            <span className="legal-contact-label">📧 Email</span>
            <span>legal@packgo.travel</span>
          </div>
          <div className="legal-contact-row">
            <span className="legal-contact-label">📍 Address</span>
            <span>
              PackGo Travel Co., 14th Floor, Cyberhub Tower, Gurugram, Haryana
              122002, India
            </span>
          </div>
          <div className="legal-contact-row">
            <span className="legal-contact-label">⚖️ Governing Law</span>
            <span>Courts of New Delhi, India (Indian Contract Act, 1872)</span>
          </div>
        </div>
        <p>
          For general support enquiries, please visit our{" "}
          <Link to="/" className="legal-link">
            Help Center
          </Link>
          . These Terms are governed by and construed in accordance with the
          laws of India, and any disputes shall be subject to the exclusive
          jurisdiction of the courts of New Delhi.
        </p>
      </>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════ */
/*  COMPONENT                                                      */
/* ══════════════════════════════════════════════════════════════ */
const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Terms & Conditions | PackGo Travel";
  }, []);

  return (
    <div className="wander-page">
      <Navbar />

      {/* ═══ PAGE HERO ═══ */}
      <section className="legal-hero legal-hero--terms">
        <div className="legal-hero-inner">
          <div className="wander-section-label" style={{ textAlign: "center" }}>
            Legal
          </div>
          <h1 className="legal-hero-title">Terms &amp; Conditions</h1>
          <p className="legal-hero-sub">
            Last updated: <strong>May 30, 2026</strong>
          </p>
          <p className="legal-hero-desc">
            Please read these Terms carefully before using PackGo. They govern
            your use of our platform and services.
          </p>
        </div>
      </section>

      {/* ═══ MAIN CONTENT ═══ */}
      <div className="legal-layout">
        {/* Sticky table of contents */}
        <aside className="legal-toc">
          <div className="legal-toc-inner">
            <div className="legal-toc-title">Contents</div>
            <nav>
              {SECTIONS.map((sec) => (
                <a key={sec.id} href={`#${sec.id}`} className="legal-toc-link">
                  {sec.title}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Article body */}
        <article className="legal-content">
          {SECTIONS.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="legal-section"
              style={{ scrollMarginTop: "100px" }}
            >
              <h2 className="legal-section-title">{sec.title}</h2>
              <div className="legal-prose">{sec.content}</div>
            </section>
          ))}

          <div className="legal-back-row">
            <Link to="/" className="wander-btn-ghost legal-back-btn">
              ← Back to Home
            </Link>
            <Link
              to="/privacy-policy"
              className="wander-nav-cta legal-sister-btn"
            >
              Privacy Policy →
            </Link>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;
