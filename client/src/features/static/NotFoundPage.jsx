import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const NotFoundPage = () => {
  return (
    <div className="bg-[#FCF9F8] text-[#1C1B1B] min-h-screen flex items-center pt-28 pb-20">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-16 grid grid-cols-1 md:grid-cols-12 gap-12 items-center min-h-[65vh]">
        {/* Left: Editorial Text Content */}
        <div className="md:col-span-5 flex flex-col justify-center order-2 md:order-1 z-10">
          <div className="w-12 h-[2px] bg-[#DAC2B6] mb-8" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#6C2F00] block mb-3">
            404 · PAGE NOT FOUND
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-[#1C1B1B] mb-6 leading-tight">
            Looks like you took a wrong turn.
          </h1>
          <p className="text-base sm:text-lg text-[#54433A] mb-10 max-w-md leading-relaxed">
            The destination you're looking for isn't here. Let's get you back on
            the journey and find somewhere extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/explore"
              className="bg-[#6C2F00] text-white px-8 py-4 rounded text-xs font-semibold uppercase tracking-widest text-center hover:bg-[#8B4513] transition-colors duration-300 flex items-center justify-center gap-2 group"
            >
              <span>Explore Destinations</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/"
              className="border border-[#DAC2B6] text-[#1C1B1B] px-8 py-4 rounded text-xs font-semibold uppercase tracking-widest text-center hover:bg-[#F6F3F2] transition-colors duration-300"
            >
              Go Home
            </Link>
          </div>
        </div>

        {/* Right: Cinematic Desert Dawn Image */}
        <div className="md:col-span-7 h-[45vh] md:h-[70vh] w-full relative rounded overflow-hidden order-1 md:order-2 group shadow-sm">
          <img
            alt="A cinematic view of a dusty path disappearing into a vast, misty desert landscape at dawn"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzZ6PA6MqsP9nelM3-1Ip2HK3o9Jf7xk8PbH3-aMl8GVh0gSHD6AfG1izshHpY-wnIQ403BFPsFeIDH2EBu-FHQXhUnoaedo2YDllda0RFrmOn2YY73DK-5wO6vt4vOHY7v4yqnwga7uWiMV57oikaxEI7St_G7Lm-kHrVdT7ToefB_yG-qbvpvyHv98BUhydnFRu2H1lU8To3f68KBARKtHbxm12qmWlQzMn40igncomV7sELrPBxoQ"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B]/30 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
