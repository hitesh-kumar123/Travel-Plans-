import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  MapPin,
  CheckSquare,
  Clock,
  Building,
  Plane,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export const TripOverviewTab = ({ trip }) => {
  const {
    destination,
    startDate,
    endDate,
    budget,
    activities = [],
    accommodation,
    transportation,
  } = trip;

  const calculateDays = () => {
    if (!startDate || !endDate) return "3 Days";
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return `${diffDays} Day${diffDays > 1 ? "s" : ""}`;
  };

  const nextActivity =
    activities && activities.length > 0 ? activities[0] : null;

  return (
    <div className="space-y-12">
      {/* ── 1. WELCOME & SNAPSHOT METRICS BAR ── */}
      <section className="space-y-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
          Your {destination} Journey
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-y border-[#DAC2B6]/40 bg-[#FFFFFF] px-6 rounded shadow-xs">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#877369] mb-1">
              Duration
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1B1B]">
              {calculateDays()}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#877369] mb-1">
              Planned Budget
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1B1B]">
              ₹{Number(budget || 0).toLocaleString("en-IN")}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#877369] mb-1">
              Activities
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#1C1B1B]">
              {activities.length} Planned
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-[#877369] mb-1">
              Status
            </p>
            <p className="font-serif text-xl sm:text-2xl font-bold text-[#6C2F00] capitalize">
              {trip.status || "Planned"}
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. NEXT UP HIGHLIGHT CARD ── */}
      <section className="bg-[#F6F3F2] p-6 sm:p-8 rounded border border-[#DAC2B6]/40 shadow-xs">
        <div className="flex items-center space-x-2 mb-4 text-[#6C2F00]">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            Next Up
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#877369]">
              {nextActivity?.date
                ? new Date(nextActivity.date).toLocaleDateString("en-IN", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })
                : "Upcoming Milestone"}
            </p>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1B1B]">
              {nextActivity?.name || `Explore ${destination} City Center`}
            </h3>
            <p className="text-xs sm:text-sm text-[#54433A] max-w-xl leading-relaxed">
              {nextActivity?.notes ||
                `Begin your expedition in ${destination}. Stroll through historic courtyards, local markets, and scenic lakeside promenades.`}
            </p>
          </div>

          <div className="w-full md:w-56 h-36 rounded overflow-hidden shrink-0 shadow-sm bg-[#1C1B1B]">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcahkpz5mpOYMwhwDZUc-EnvmmXYAIBqLSVrANrX2JFWwrDLFgERVUJF2ITaypkYu2inBd4HMzChumhm-VvamON_TXinZrJDM0avsuKoEaCaCwZx0B7Vt4krnF9gH9e1Rqa4Iy1X6sKLCbNu0CBlFx0I8BLagnGvGFMz3lnaV1V9yKKMb9ZXFEGpCDMFl8Sl7h1pipnCtmfs1dFQmUw-3bs4TLBp_i2XnUppxYfVripfsIiZHrdxw2Ww"
              alt="City Palace courtyard archway"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* ── 3. LOGISTICS (Accommodation & Transit) ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Accommodation */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#DAC2B6]/40 rounded shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#6C2F00]">
            <Building className="w-5 h-5" />
            <h4 className="font-serif text-xl font-bold text-[#1C1B1B]">
              Accommodation
            </h4>
          </div>

          <div className="text-xs space-y-2 text-[#54433A] pt-2 border-t border-[#F0EDED]">
            <p>
              <span className="text-[#877369] uppercase font-semibold block text-[10px]">
                Hotel / Heritage Haveli
              </span>
              <strong className="text-sm text-[#1C1B1B]">
                {accommodation?.name || `Taj Lake Palace / Heritage Haveli`}
              </strong>
            </p>
            {accommodation?.address && (
              <p>
                <span className="text-[#877369] uppercase font-semibold block text-[10px]">
                  Address
                </span>
                {accommodation.address}
              </p>
            )}
          </div>
        </div>

        {/* Transit */}
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#DAC2B6]/40 rounded shadow-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#6C2F00]">
            <Plane className="w-5 h-5" />
            <h4 className="font-serif text-xl font-bold text-[#1C1B1B]">
              Transit Logistics
            </h4>
          </div>

          <div className="text-xs space-y-2 text-[#54433A] pt-2 border-t border-[#F0EDED]">
            <p>
              <span className="text-[#877369] uppercase font-semibold block text-[10px]">
                Transit Mode
              </span>
              <strong className="text-sm text-[#1C1B1B]">
                {transportation?.type || "Direct Flight / Express Train"}
              </strong>
            </p>
            {transportation?.departureTime && (
              <p>
                <span className="text-[#877369] uppercase font-semibold block text-[10px]">
                  Departure Schedule
                </span>
                {new Date(transportation.departureTime).toLocaleDateString(
                  "en-IN",
                  {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  },
                )}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TripOverviewTab;
