import "./Legal.css";
const HelpCenter = () => (
  <div className="legal-container">
    <h1>PackGo Help Center</h1>
    <div className="faq-item">
      <h3>How do I track expenses?</h3>
      <p>
        Navigate to the "Trips" dashboard, click on your specific trip, and use
        the "Add Expense" button to log costs by category.
      </p>
    </div>
    <div className="faq-item">
      <h3>Is my data secure?</h3>
      <p>
        Yes, we use JWT authentication and bcrypt password hashing to ensure
        your trip data remains private.
      </p>
    </div>
    <div className="faq-item">
      <h3>Need more help?</h3>
      <p>Reach out to our support team at support@packgo.com for assistance.</p>
    </div>
  </div>
);
export default HelpCenter;
