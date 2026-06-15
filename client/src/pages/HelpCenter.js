import React from "react";
import { Link } from "react-router-dom";

// Simple Help Center page placeholder
export default function HelpCenter() {
  return (
    <div className="help-center" style={{ padding: "2rem" }}>
      <h1>Help Center</h1>
      <p>Welcome to the Help Center. Here you can find FAQs, contact support, and get assistance.</p>
      <p>If you need immediate help, please email <a href="mailto:support@packgo.com">support@packgo.com</a>.</p>
      <Link to="/" className="btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>
        Back to Home
      </Link>
    </div>
  );
}
