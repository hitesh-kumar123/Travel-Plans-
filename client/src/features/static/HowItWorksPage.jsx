import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  DollarSign,
  Luggage,
  ArrowRight,
} from "lucide-react";

export const HowItWorksPage = () => {
  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] overflow-x-hidden min-h-screen">
      {/* ── 1. HERO SECTION ── */}
      <section className="relative w-full h-[88vh] min-h-[580px] flex items-end pb-20 md:pb-28">
        <div className="absolute inset-0 z-0">
          <img
            className="w-full h-full object-cover object-center"
            alt="Historic Indian stepwell and palace complex at dawn"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6haOTtvEnK6d6CjwUuZaD8EmAq5t-5f4JYc86ae_ghR3w3BQK8u_Cw1XoD6Y1jIa_eN4bCUGOqU-QETzD5bZQz2H6FnNiHfRkAvqifXjxCY6djxVmHoGvKEJFAhEB6t2gq-pRNpbxL_OA4EK-CX20_rYVZi0i9RDDNHIZqukwQpNC3YJVCzy9_mBXWxFpLQzOQ3N2cg1UroDdY1owDZjEeR8bgnLM6SkbNw0PizHzspgyztXkFtgmzw"
          />
          <div className="absolute inset-0 scrim-bottom" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 w-full text-white">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#FFB68C] block mb-3">
              THE PACKGO PHILOSOPHY
            </span>
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 drop-shadow-xs leading-tight">
              From inspiration to your next journey.
            </h1>
            <p className="text-base sm:text-xl text-[#FCF9F8]/90 max-w-2xl font-normal leading-relaxed">
              PackGo helps you discover destinations across India, turn ideas
              into trips, and keep everything organized in one place.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. STORY JOURNEY STEPS (3 Detailed Editorial Sections) ── */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Step 01 */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 mb-28 sm:mb-36">
          <div className="w-full md:w-5/12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] mb-3 block">
              01 / DISCOVER
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] mb-5">
              Find a place worth exploring.
            </h2>
            <p className="text-base text-[#54433A] leading-relaxed">
              Explore Indian destinations, hidden heritage sites, and cultural
              experiences to find somewhere that deeply inspires you.
            </p>
          </div>
          <div className="w-full md:w-7/12 relative aspect-[4/3] overflow-hidden bg-[#F6F3F2] rounded border border-[#877369]/10 p-3 sm:p-4 image-zoom shadow-sm">
            <img
              className="w-full h-full object-cover rounded"
              alt="Vintage map and destination postcards"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5ruMeI0D_x73il0rhDR-wzERUYuF14X0tT-QanJLBLs9aYXhQOpU-mFVVvVlldds5eftTdtFvfoMgeQWX892QlGZrzMx5W_UgpRRykwIzw_dXY2P39Vo110N40HzmbdhNgptT-Dp0AEW6sUFEmQGptOKbFyQlIyeljZ6cZVUcOpmv_JKSvT8a8wQzULTSVMRvYOothELX7lH5rCDMuHF4W2Ui0yX8c-6Za_au0llJ4wxf-0GHq_2hdg"
            />
          </div>
        </div>

        {/* Step 02 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20 mb-28 sm:mb-36">
          <div className="w-full md:w-5/12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] mb-3 block">
              02 / PLAN
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] mb-5">
              Turn inspiration into a trip.
            </h2>
            <p className="text-base text-[#54433A] leading-relaxed">
              Choose your destination, dates, and budget, then create your
              personalized journey with structured day-by-day itineraries.
            </p>
          </div>
          <div className="w-full md:w-7/12 relative aspect-[4/3] overflow-hidden bg-[#F6F3F2] rounded border border-[#877369]/10 p-3 sm:p-4 image-zoom shadow-sm">
            <img
              className="w-full h-full object-cover rounded shadow-xs"
              alt="Travel notebook, sunglasses, and polaroids"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9_tKWMp8k1smy5oz8qIiTctpXuam-riWLdbof_LRy0z_gmHvmTSr4z0tGFiqG6W5kpuh01fZHrEX6newUuhHn_7FEjOFr7nhwWcNZDEVspGJFtkdZKRujFgDDm2vF-ttQiW6Wsq_NR6rXSRfwgfxT2xlOwf1_GD_3Tml0iodwCTpy8pmc5yLIMCNbKkOroHGQodXnO0XJMQ3-M7xafOp-oFxYs_1uOFrXgXBrVJ6VFr0qa-4nGGKIEA"
            />
          </div>
        </div>

        {/* Step 03 */}
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="w-full md:w-5/12">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] mb-3 block">
              03 / MANAGE
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] mb-5">
              Keep your journey together.
            </h2>
            <p className="text-base text-[#54433A] leading-relaxed">
              Organize your itinerary, saved places, real-time expenses, packing
              lists, live weather forecasts, and trip notes from one intuitive
              interface.
            </p>
          </div>
          <div className="w-full md:w-7/12 relative aspect-[16/10] overflow-hidden bg-[#F6F3F2] rounded border border-[#877369]/10 p-3 sm:p-4 image-zoom shadow-sm">
            <img
              className="w-full h-full object-cover rounded"
              alt="Digital travel planner tablet with morning tea"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJgxw4D2KyJcgXLRuXuMK4zDQnAlXpIWTLz2r4CNkHTdzqfzW55vl1QAi7HJMS3ChvKL6nFUwe0IAXoGrd-LqMnxzk-l4q0VS0HY0hhdvaFoRSdkOD_fhXu_37RQaeO22mGX7gY9HqHNVEzmUCFRHhDNGGF4-Vf57-CdGJcD-Jqw1v5d3V3Rtp2P8IqLkrR8WHmECqNJKOFIkb-zVYQy-DHrl7Ovo1KnMgvCE8w7sGQNM0ypPuk1hSnw"
            />
          </div>
        </div>
      </section>

      {/* ── 3. ECOSYSTEM SECTION (4 Badges) ── */}
      <section className="bg-[#F6F3F2] py-24 sm:py-32 border-y border-[#DAC2B6]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] mb-4">
            Everything for your journey, in one place.
          </h2>
          <p className="text-base sm:text-lg text-[#54433A] max-w-2xl mx-auto">
            A suite of thoughtful tools designed to keep your focus on the
            experience, not the logistics.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white/70 rounded border border-[#DAC2B6]/30 group hover:border-[#6C2F00]/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#F0EDED] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#FFDBC9] transition-all duration-300">
              <Calendar className="w-6 h-6 text-[#6C2F00]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1B]">
              Itinerary
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white/70 rounded border border-[#DAC2B6]/30 group hover:border-[#6C2F00]/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#F0EDED] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#FFDBC9] transition-all duration-300">
              <MapPin className="w-6 h-6 text-[#6C2F00]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1B]">
              Places
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white/70 rounded border border-[#DAC2B6]/30 group hover:border-[#6C2F00]/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#F0EDED] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#FFDBC9] transition-all duration-300">
              <DollarSign className="w-6 h-6 text-[#6C2F00]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1B]">
              Budget & Expenses
            </span>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white/70 rounded border border-[#DAC2B6]/30 group hover:border-[#6C2F00]/40 transition-colors">
            <div className="w-16 h-16 rounded-full bg-[#F0EDED] flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-[#FFDBC9] transition-all duration-300">
              <Luggage className="w-6 h-6 text-[#6C2F00]" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1C1B1B]">
              Packing Checklist
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. CTA SECTION ── */}
      <section className="py-24 sm:py-32 max-w-4xl mx-auto px-4 sm:px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C1B1B] mb-5">
          Ready to start exploring?
        </h2>
        <p className="text-base sm:text-lg text-[#54433A] mb-10 max-w-xl mx-auto">
          Find a destination and begin planning your next journey across India.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/explore"
            className="px-8 py-4 bg-[#6C2F00] text-white rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#8B4513] transition-colors duration-300 inline-flex items-center justify-center gap-2"
          >
            <span>Explore Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/register"
            className="px-8 py-4 bg-transparent text-[#6C2F00] rounded text-xs font-semibold uppercase tracking-widest border border-[#6C2F00] hover:bg-[#6C2F00]/5 transition-colors duration-300 inline-flex items-center justify-center"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;
