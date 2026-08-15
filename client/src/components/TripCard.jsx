import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Badge from "./Badge";

export const TripCard = ({ trip }) => {
  const {
    _id,
    destination,
    startDate,
    endDate,
    budget,
    status = "planned",
    images = [],
    description,
  } = trip;

  const fallbackImage =
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80";
  const imageSrc = images && images.length > 0 ? images[0] : fallbackImage;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate days difference
  const calculateDaysRemaining = () => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) return `${diffDays} days to go`;
    if (diffDays === 0) return "Starts today";
    return "Ongoing / Completed";
  };

  const daysText = calculateDaysRemaining();

  return (
    <div className="group relative flex flex-col bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#DAC2B6]">
      {/* Cover Image */}
      <div className="relative h-56 w-full overflow-hidden bg-[#F0EDED]">
        <img
          src={imageSrc}
          alt={destination}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B]/70 via-transparent to-transparent opacity-80" />

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <Badge variant={status} size="xs" className="capitalize">
            {status}
          </Badge>
        </div>

        {/* Days badge */}
        {daysText && status === "planned" && (
          <div className="absolute top-4 right-4 bg-[#1C1B1B]/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-[#FCF9F8]">
            {daysText}
          </div>
        )}

        {/* Destination text overlay */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center text-xs font-semibold text-[#FFB68C] uppercase tracking-wider mb-0.5">
            <MapPin className="w-3.5 h-3.5 mr-1" />
            <span>Journey to</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white leading-tight">
            {destination}
          </h3>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 flex flex-col flex-1 justify-between">
        <div className="space-y-3">
          <div className="flex items-center text-xs text-[#54433A]">
            <Calendar className="w-4 h-4 mr-2 text-[#877369] shrink-0" />
            <span>
              {formatDate(startDate)} — {formatDate(endDate)}
            </span>
          </div>

          {description && (
            <p className="text-xs text-[#54433A] line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {budget > 0 && (
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#F0EDED]">
              <span className="text-[#877369]">Planned Budget</span>
              <span className="font-semibold text-[#1C1B1B]">
                ₹{budget.toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#F0EDED] flex items-center justify-end">
          <Link
            to={`/trips/${_id}`}
            className="inline-flex items-center text-xs font-semibold text-[#6C2F00] group-hover:text-[#8B4513] transition-colors"
          >
            <span>Open Journey Overview</span>
            <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
