import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "How do I create a trip?",
    answer:
      "Go to the Dashboard → Trips section and click on 'Create Trip'. Fill in your destination and dates to get started.",
  },
  {
    question: "Can I track my expenses during a trip?",
    answer:
      "Yes. PackGo provides a built-in expense tracker where you can add, categorize, and view summaries of your trip spending.",
  },
  {
    question: "How does the weather feature work?",
    answer:
      "We use real-time weather APIs to show live forecasts for your selected destinations.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. Your data is protected using JWT authentication and secure backend practices.",
  },
  {
    question: "Can I book flights and hotels from PackGo?",
    answer:
      "Yes. You can search and explore flight and hotel options directly within the booking section.",
  },
  {
    question: "Does PackGo support multiple languages?",
    answer:
      "Yes. The live translator feature helps you translate text in real time for better travel communication.",
  },
];

const FAQSection = () => {
  return (
    <section
      style={{
        padding: "5rem 1.5rem",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily:
          "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "2.8rem" }}>
        <h2
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.02em",
            marginBottom: "0.6rem",
          }}
        >
          Frequently Asked Questions
        </h2>

        <p
          style={{
            color: "#64748b",
            fontSize: "1.05rem",
            fontWeight: 400,
          }}
        >
          Everything you need to know about PackGo
        </p>
      </div>

      {/* FAQ Items */}
      <div>
        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            disableGutters
            elevation={0}
            style={{
              marginBottom: "14px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "#0f172a" }} />}
              style={{
                backgroundColor: "#f8fafc",
                padding: "0.9rem 1.1rem",
              }}
            >
              <Typography
                style={{
                  fontWeight: 600,
                  color: "#0f172a",
                  fontSize: "1rem",
                }}
              >
                {faq.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails
              style={{
                backgroundColor: "#ffffff",
                padding: "1rem 1.2rem",
              }}
            >
              <Typography
                style={{
                  color: "#475569",
                  lineHeight: "1.7",
                  fontSize: "0.95rem",
                }}
              >
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
