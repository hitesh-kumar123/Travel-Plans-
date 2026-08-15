import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react";

export const ContactHelpPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    {
      q: "Getting Started",
      title: "How do I create a trip?",
      answer:
        "Simply navigate to the Explore section, find your desired destination, and click 'Start Planning'. Our intuitive builder will guide you through the process step-by-step.",
    },
    {
      q: "Trips",
      title: "How do I manage my journey?",
      answer:
        "You can access all your upcoming and past journeys in your Account dashboard. From there, you can edit itineraries, add notes, and invite travel companions.",
    },
    {
      q: "Destinations",
      title: "How do I explore destinations?",
      answer:
        "Use our search functionality or browse our curated editorial collections. Each destination features comprehensive guides tailored to a premium travel experience.",
    },
    {
      q: "Account",
      title: "How do I update my profile?",
      answer:
        "Navigate to 'Settings' within your Account menu to update personal details, preferences, and payment information.",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen">
      {/* ── 1. HERO SECTION WITH VISIBLE EDITORIAL BACKGROUND IMAGE ── */}
      <section className="relative min-h-[60vh] flex items-center px-4 sm:px-8 lg:px-16 pt-32 pb-24 overflow-hidden">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="w-full h-full bg-cover bg-center absolute inset-0 opacity-40 transform scale-105 transition-transform duration-1000"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAOV-43zz_fQSzOafoR51SfV6I1RqXMZrQ9icbYKqE4SJaT1NdNcl592jB75eI1FhdJqpXK4381iSvJPz4IzqkdDkfp2W0AVrZwun8aWE1lEKtwH0mlY-VS_mCcb2Pz9rUudIBcRy-zMCBYwcldOspXp_9Jl9vPVlFpsK8EA25kXgGm8qiMcV9cxlO_SboqBFWGjW2NhXms4uFwQ9F9FUc1DnL37nRoyZaLglXwpSzX43qhtt7bQTR07g")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FCF9F8] via-[#FCF9F8]/80 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-8 space-y-4">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-bold text-[#6C2F00] leading-tight">
              How can we help?
            </h1>
            <p className="text-lg sm:text-xl text-[#54433A] max-w-2xl font-normal leading-relaxed">
              Have a question about PackGo or your journey? We're here to help.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. MAIN CONTENT (FAQ + Editorial Form) ── */}
      <section className="px-4 sm:px-8 lg:px-16 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
          {/* Left Column: FAQ */}
          <div className="lg:col-span-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6C2F00] mb-8 border-b border-[#DAC2B6]/30 pb-4">
              Help
            </h2>

            <div className="space-y-1 divide-y divide-[#DAC2B6]/30">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-6 cursor-pointer">
                    <div
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="flex justify-between items-center group cursor-pointer"
                    >
                      <h3 className="font-serif text-2xl font-semibold text-[#1C1B1B] group-hover:text-[#6C2F00] transition-colors">
                        {faq.q}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 text-[#877369] group-hover:text-[#6C2F00] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {isOpen && (
                      <div className="pt-4 text-base text-[#54433A] leading-relaxed font-sans animate-fade-in-up">
                        <strong className="text-[#1C1B1B] block mb-1">
                          {faq.title}
                        </strong>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Direct Contact */}
            <div className="mt-16 pt-8 border-t border-[#DAC2B6]/30">
              <h4 className="text-xs font-semibold text-[#877369] uppercase tracking-widest mb-2">
                Need help with your journey?
              </h4>
              <a
                className="font-serif text-3xl font-bold text-[#6C2F00] hover:text-[#8B4513] transition-colors inline-flex items-center gap-2"
                href="mailto:support@packgo.com"
              >
                <span>support@packgo.com</span>
                <ArrowUpRight className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Right Column: Editorial Contact Form */}
          <div className="lg:col-span-6 relative">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#6C2F00] mb-8 border-b border-[#DAC2B6]/30 pb-4">
                Send us a message
              </h2>

              {submitted ? (
                <div className="py-12 bg-white/70 p-8 rounded border border-[#DAC2B6]/40 text-center space-y-4 shadow-xs">
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#CDEACE] text-[#2E4632] flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
                    Message Sent Successfully
                  </h3>
                  <p className="text-sm text-[#54433A] max-w-sm mx-auto">
                    Thank you, <strong>{formData.name}</strong>. Our team has
                    received your note and will reply to{" "}
                    <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="mt-6 px-8 py-3 bg-[#1C1B1B] text-white rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#6C2F00] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div>
                    <label className="sr-only" htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Name"
                      className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-lg text-[#1C1B1B] placeholder-[#877369]/60 focus:ring-0 focus:border-[#6C2F00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Email Address"
                      className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-lg text-[#1C1B1B] placeholder-[#877369]/60 focus:ring-0 focus:border-[#6C2F00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="contact-subject">
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder="Subject"
                      className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-lg text-[#1C1B1B] placeholder-[#877369]/60 focus:ring-0 focus:border-[#6C2F00] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="sr-only" htmlFor="contact-message">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="How can we assist you?"
                      className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-lg text-[#1C1B1B] placeholder-[#877369]/60 focus:ring-0 focus:border-[#6C2F00] transition-colors resize-none"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-[#1C1B1B] text-[#FCF9F8] px-10 py-4 text-base font-normal border border-[#1C1B1B] hover:bg-[#6C2F00] hover:border-[#6C2F00] transition-all duration-300 w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. FINAL CTA ── */}
      <section className="px-4 sm:px-8 lg:px-16 py-24 border-t border-[#DAC2B6]/20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-4xl sm:text-6xl font-bold text-[#6C2F00]">
            Ready to keep exploring?
          </h2>
          <div className="pt-2">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 bg-[#1C1B1B] text-white px-10 py-4 text-base font-normal border border-[#1C1B1B] hover:bg-[#6C2F00] hover:border-[#6C2F00] transition-all duration-300 group cursor-pointer"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactHelpPage;
