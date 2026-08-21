import React, { useState, useMemo } from "react";
import { Search, ChevronDown } from "lucide-react";

const FAQSection = ({ faqs = [] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(-1);

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.q.toLowerCase().includes(query) ||
        faq.title.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query),
    );
  }, [faqs, searchQuery]);

  return (
    <div>
      {/* Search Input */}
      <div className="relative mb-6">
        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-[#877369]" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setOpenFaq(-1);
          }}
          className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 pl-8 text-base text-[#1C1B1B] placeholder-[#877369]/60 focus:ring-0 focus:border-[#6C2F00] transition-colors"
        />
      </div>

      {/* FAQ List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-1 divide-y divide-[#DAC2B6]/30">
          {filteredFaqs.map((faq, idx) => {
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
      ) : (
        <div className="py-12 text-center">
          <p className="text-[#877369] text-base font-sans">
            No matching FAQs found
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQSection;
