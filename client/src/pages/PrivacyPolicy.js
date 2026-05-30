import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";
import "./LegalPage.css";

/* ── Section data ─────────────────────────────────────────────── */
const SECTIONS = [
  {
    id: "introduction",
    title: "1. Introduction",
    content: (
      <>
        <p>
          Welcome to <strong>PackGo Travel</strong> ("we", "our", or "us"). We
          are committed to protecting your personal information and your right
          to privacy. This Privacy Policy explains how we collect, use,
          disclose, and safeguard your information when you visit our website
          and use our travel planning services.
        </p>
        <p>
          Please read this policy carefully. If you disagree with its terms,
          please discontinue use of our platform. By accessing or using PackGo,
          you acknowledge that you have read, understood, and agree to be bound
          by this Privacy Policy.
        </p>
      </>
    ),
  },
  {
    id: "information-collection",
    title: "2. Information We Collect",
    content: (
      <>
        <p>
          We collect information you provide directly to us, information we
          collect automatically when you use our services, and information from
          third-party sources.
        </p>
        <h3 className="legal-sub-heading">Information You Provide</h3>
        <ul className="legal-list">
          <li>
            <strong>Account Information:</strong> Name, email address, password,
            and profile details when you register.
          </li>
          <li>
            <strong>Travel Preferences:</strong> Destinations, travel dates,
            number of travellers, and itinerary details.
          </li>
          <li>
            <strong>Payment Information:</strong> Credit card details and
            billing address (processed securely via PCI-compliant payment
            processors).
          </li>
          <li>
            <strong>Communications:</strong> Messages you send us, feedback,
            survey responses, and support requests.
          </li>
          <li>
            <strong>User-Generated Content:</strong> Trip notes, reviews, and
            photos you upload to our platform.
          </li>
        </ul>
        <h3 className="legal-sub-heading">
          Information Collected Automatically
        </h3>
        <ul className="legal-list">
          <li>
            <strong>Usage Data:</strong> Pages viewed, features used, search
            queries, and click-through data.
          </li>
          <li>
            <strong>Device Information:</strong> IP address, browser type,
            operating system, device identifiers, and screen resolution.
          </li>
          <li>
            <strong>Location Data:</strong> General geographic location derived
            from your IP address.
          </li>
          <li>
            <strong>Log Data:</strong> Server logs, access times, referring
            URLs, and error reports.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-usage",
    title: "3. How We Use Your Data",
    content: (
      <>
        <p>
          We use the information we collect for the following purposes, always
          in compliance with applicable data protection laws:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Service Delivery:</strong> To create and manage your
            account, process bookings, and deliver travel planning features.
          </li>
          <li>
            <strong>Personalisation:</strong> To tailor destination
            recommendations, itinerary suggestions, and content to your
            preferences.
          </li>
          <li>
            <strong>Communications:</strong> To send booking confirmations,
            travel reminders, updates about your trips, and important account
            notifications.
          </li>
          <li>
            <strong>Marketing:</strong> To send promotional emails and offers,
            subject to your consent and opt-out preferences.
          </li>
          <li>
            <strong>Analytics &amp; Improvement:</strong> To analyse usage
            trends, monitor performance, identify bugs, and improve our
            platform.
          </li>
          <li>
            <strong>Security &amp; Fraud Prevention:</strong> To detect,
            prevent, and address fraudulent activity, abuse, and security
            incidents.
          </li>
          <li>
            <strong>Legal Compliance:</strong> To fulfil legal obligations,
            respond to lawful requests, and enforce our Terms &amp; Conditions.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "data-storage",
    title: "4. Data Storage and Security",
    content: (
      <>
        <p>
          We implement industry-standard technical and organisational measures
          to protect your personal data against unauthorised access, alteration,
          disclosure, or destruction. These measures include:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Encryption:</strong> All data transmitted between your
            browser and our servers is encrypted using TLS (Transport Layer
            Security).
          </li>
          <li>
            <strong>Access Controls:</strong> Strict role-based access controls
            ensure only authorised personnel can access personal data.
          </li>
          <li>
            <strong>Secure Storage:</strong> Data is stored on secure, ISO
            27001-certified cloud infrastructure with regular security audits.
          </li>
          <li>
            <strong>Password Hashing:</strong> Passwords are hashed using bcrypt
            and are never stored in plain text.
          </li>
        </ul>
        <p>
          We retain your personal data only as long as necessary to fulfil the
          purposes outlined in this policy, or as required by applicable law.
          Account data is retained for the lifetime of your account plus a
          90-day grace period. You may request deletion of your data at any
          time.
        </p>
        <p>
          While we strive to protect your personal information, no method of
          transmission over the Internet or electronic storage is 100% secure.
          We encourage you to use strong, unique passwords for your account.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "5. Third-Party Services",
    content: (
      <>
        <p>
          PackGo integrates with select third-party services to provide a
          seamless travel planning experience. These third parties may have
          access to your personal information only to perform specific tasks on
          our behalf and are obligated not to disclose or use it for any other
          purpose.
        </p>
        <ul className="legal-list">
          <li>
            <strong>Payment Processors:</strong> Secure payment gateways (e.g.,
            Stripe, Razorpay) that process transactions in compliance with PCI
            DSS standards.
          </li>
          <li>
            <strong>Analytics Providers:</strong> Services such as Google
            Analytics that help us understand platform usage (subject to their
            own privacy policies).
          </li>
          <li>
            <strong>Cloud Infrastructure:</strong> Hosting providers (e.g., AWS,
            Vercel) that store and serve our platform data.
          </li>
          <li>
            <strong>Email Services:</strong> Transactional email providers for
            sending booking confirmations and account notifications.
          </li>
          <li>
            <strong>Mapping Services:</strong> Leaflet/OpenStreetMap for
            interactive destination maps.
          </li>
        </ul>
        <p>
          We are not responsible for the privacy practices of third-party
          websites or services linked from our platform. We encourage you to
          review their privacy policies before providing any personal
          information.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "6. Cookies and Tracking Technologies",
    content: (
      <>
        <p>
          We use cookies and similar tracking technologies to enhance your
          experience on our platform. Cookies are small text files stored on
          your device that help us remember your preferences and understand how
          you interact with our services.
        </p>
        <h3 className="legal-sub-heading">Types of Cookies We Use</h3>
        <ul className="legal-list">
          <li>
            <strong>Essential Cookies:</strong> Required for core platform
            functionality, such as maintaining your login session and security
            tokens. These cannot be disabled.
          </li>
          <li>
            <strong>Preference Cookies:</strong> Remember your settings and
            preferences, such as language and display options.
          </li>
          <li>
            <strong>Analytics Cookies:</strong> Help us understand how visitors
            use our platform so we can improve it. Data is aggregated and
            anonymised.
          </li>
          <li>
            <strong>Marketing Cookies:</strong> Used to deliver relevant
            advertisements and track campaign effectiveness, with your consent.
          </li>
        </ul>
        <p>
          You can control or disable cookies through your browser settings.
          However, disabling essential cookies may affect the functionality of
          our platform. For more information on managing cookies, visit{" "}
          <a
            href="https://www.allaboutcookies.org"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            allaboutcookies.org
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "user-rights",
    title: "7. Your Rights",
    content: (
      <>
        <p>
          Depending on your location, you may have the following rights
          regarding your personal data under applicable data protection laws
          (including GDPR and India's Digital Personal Data Protection Act):
        </p>
        <ul className="legal-list">
          <li>
            <strong>Right to Access:</strong> Request a copy of the personal
            data we hold about you.
          </li>
          <li>
            <strong>Right to Rectification:</strong> Request correction of
            inaccurate or incomplete personal data.
          </li>
          <li>
            <strong>Right to Erasure:</strong> Request deletion of your personal
            data ("right to be forgotten"), subject to certain conditions.
          </li>
          <li>
            <strong>Right to Restrict Processing:</strong> Request that we limit
            how we use your data in certain circumstances.
          </li>
          <li>
            <strong>Right to Data Portability:</strong> Receive your data in a
            structured, machine-readable format.
          </li>
          <li>
            <strong>Right to Object:</strong> Object to processing of your
            personal data for marketing purposes.
          </li>
          <li>
            <strong>Right to Withdraw Consent:</strong> Where processing is
            based on consent, withdraw it at any time without affecting prior
            processing.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please contact us at the details
          below. We will respond within 30 days. We may need to verify your
          identity before processing your request.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "8. Contact Information",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or our data practices, please reach out to our Data Protection
          team:
        </p>
        <div className="legal-contact-card">
          <div className="legal-contact-row">
            <span className="legal-contact-label">📧 Email</span>
            <span>privacy@packgo.travel</span>
          </div>
          <div className="legal-contact-row">
            <span className="legal-contact-label">📍 Address</span>
            <span>
              PackGo Travel Co., 14th Floor, Cyberhub Tower, Gurugram, Haryana
              122002, India
            </span>
          </div>
          <div className="legal-contact-row">
            <span className="legal-contact-label">🕐 Response Time</span>
            <span>Within 30 business days</span>
          </div>
        </div>
        <p>
          For general enquiries, you may also use the{" "}
          <Link to="/" className="legal-link">
            Help Center
          </Link>{" "}
          on our website.
        </p>
      </>
    ),
  },
  {
    id: "policy-updates",
    title: "9. Policy Updates",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices, legal requirements, or platform features. When we
          make material changes, we will notify you by:
        </p>
        <ul className="legal-list">
          <li>Updating the "Last Updated" date at the top of this page.</li>
          <li>
            Sending an email notification to your registered email address for
            significant changes.
          </li>
          <li>
            Displaying a prominent notice on our platform for 30 days following
            significant changes.
          </li>
        </ul>
        <p>
          Your continued use of PackGo after any changes constitutes acceptance
          of the updated Privacy Policy. We encourage you to review this page
          periodically to stay informed about how we protect your information.
        </p>
      </>
    ),
  },
];

/* ══════════════════════════════════════════════════════════════ */
/*  COMPONENT                                                      */
/* ══════════════════════════════════════════════════════════════ */
const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.title = "Privacy Policy | PackGo Travel";
  }, []);

  return (
    <div className="wander-page">
      <Navbar />

      {/* ═══ PAGE HERO ═══ */}
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <div className="wander-section-label" style={{ textAlign: "center" }}>
            Legal
          </div>
          <h1 className="legal-hero-title">Privacy Policy</h1>
          <p className="legal-hero-sub">
            Last updated: <strong>May 30, 2026</strong>
          </p>
          <p className="legal-hero-desc">
            Your privacy matters to us. This policy explains how PackGo
            collects, uses, and protects your personal information.
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
              to="/terms-and-conditions"
              className="wander-nav-cta legal-sister-btn"
            >
              Terms &amp; Conditions →
            </Link>
          </div>
        </article>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
