import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, ArrowUpRight } from "lucide-react";
import Badge from "./Badge";

export const DestinationCard = ({ destination }) => {
  const {
    _id,
    name,
    city,
    state,
    rating,
    entrance_fee_inr,
    images = [],
    type,
    best_time_to_visit,
  } = destination;

  const fallbackImage =
    "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80";
  const imageSrc = images && images.length > 0 ? images[0] : fallbackImage;

  return (
    <Link
      to={`/destinations/${_id}`}
      className="group relative flex flex-col bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#DAC2B6]"
    >
      {/* Image container with subtle hover zoom */}
      <div className="relative h-72 w-full overflow-hidden bg-[#F0EDED]">
        <img
          src={imageSrc}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = fallbackImage;
          }}
        />

        {/* Gradient Scrim for editorial contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B]/60 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          {type ? (
            <Badge variant="dark" size="xs">
              {type}
            </Badge>
          ) : (
            <div />
          )}

          {rating ? (
            <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#1C1B1B]/70 backdrop-blur-md text-[#FCF9F8] text-xs font-semibold">
              <Star className="w-3 h-3 fill-[#F0BD8B] text-[#F0BD8B]" />
              <span>{rating}</span>
            </div>
          ) : null}
        </div>

        {/* Bottom location on image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center text-xs font-medium text-white/90 mb-1">
            <MapPin className="w-3.5 h-3.5 mr-1 text-[#FFB68C]" />
            <span>
              {city}
              {state ? `, ${state}` : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1 justify-between bg-[#FFFFFF]">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-serif text-2xl font-bold text-[#1C1B1B] group-hover:text-[#6C2F00] transition-colors leading-tight line-clamp-1">
              {name}
            </h3>
            <ArrowUpRight className="w-5 h-5 text-[#877369] group-hover:text-[#6C2F00] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0 ml-2" />
          </div>

          {best_time_to_visit && (
            <p className="mt-2 text-xs text-[#54433A] font-sans">
              <span className="font-semibold text-[#877369]">Best Time:</span>{" "}
              {best_time_to_visit}
            </p>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-[#F0EDED] flex items-center justify-between text-xs text-[#54433A]">
          <div>
            <span className="text-[#877369]">Entry: </span>
            <span className="font-semibold text-[#1C1B1B]">
              {entrance_fee_inr !== undefined && entrance_fee_inr !== null
                ? entrance_fee_inr === 0
                  ? "Free"
                  : `₹${entrance_fee_inr}`
                : "Free / Nominal"}
            </span>
          </div>
          <span className="text-xs font-semibold text-[#6C2F00] group-hover:underline">
            Explore Story →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;
