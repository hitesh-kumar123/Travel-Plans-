import React, { useState, useEffect } from "react";
import { placesApi } from "../../../services/api/placesApi";
import { getErrorMessage } from "../../../services/api/client";
import Badge from "../../../components/Badge";
import Button from "../../../components/Button";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import {
  Compass,
  MapPin,
  ExternalLink,
  Tag,
  Star,
  Banknote,
  Search,
  Filter,
} from "lucide-react";

export const TripPlacesTab = ({ trip }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", label: "All Sights" },
    { id: "SIGHTS", label: "Viewpoints & Mon." },
    { id: "HISTORICAL", label: "Historic" },
    { id: "BEACH_PARK", label: "Nature & Parks" },
    { id: "RESTAURANT", label: "Culinary" },
    { id: "SHOPPING", label: "Bazaars" },
  ];

  const fetchPlaces = async (cats = []) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { destination: trip.destination };
      if (cats && cats.length > 0) {
        payload.categories = cats;
      }
      const res = await placesApi.search(payload);
      if (res.data?.places) {
        setPlaces(res.data.places);
      }
    } catch (err) {
      console.warn("Places search error:", err);
      setError(
        getErrorMessage(
          err,
          `Could not load live points of interest for ${trip.destination}. Ensure OpenTripMap API key is set.`,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip.destination) {
      fetchPlaces(selectedCategory === "all" ? [] : [selectedCategory]);
    }
  }, [trip.destination, selectedCategory]);

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E5E2E1]">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] block mb-1">
            Attractions & Landmark Discovery
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
            Points of Interest in {trip.destination}
          </h3>
          <p className="text-xs text-[#54433A] mt-1">
            Curated historical monuments, vistas, and cultural hotspots from
            OpenTripMap.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-[#6C2F00] text-white"
                  : "bg-[#FFFFFF] text-[#54433A] border border-[#DAC2B6] hover:border-[#1C1B1B]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState
          message={`Searching points of interest in ${trip.destination}...`}
        />
      ) : error ? (
        <div className="p-8 bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded text-center">
          <p className="text-xs font-semibold text-[#BA1A1A]">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => fetchPlaces()}
          >
            Retry Search
          </Button>
        </div>
      ) : places.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div
              key={place.id || place.name}
              className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs hover:border-[#DAC2B6] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="terracotta" size="xs">
                    {place.category}
                  </Badge>
                  {place.rank > 0 && (
                    <div className="flex items-center space-x-1 text-[11px] text-[#877369]">
                      <Star className="w-3 h-3 fill-[#F0BD8B] text-[#F0BD8B]" />
                      <span>Score {place.rank}</span>
                    </div>
                  )}
                </div>

                <h4 className="font-serif text-xl font-bold text-[#1C1B1B] leading-snug">
                  {place.name}
                </h4>

                <div className="flex items-center text-xs text-[#54433A]">
                  <Banknote className="w-3.5 h-3.5 mr-1.5 text-[#6C2F00]" />
                  <span>
                    Est. Admission:{" "}
                    <strong>
                      {place.price > 0 ? `₹${place.price}` : "Free / Public"}
                    </strong>
                  </span>
                </div>

                {place.tags && place.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2">
                    {place.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-[#F6F3F2] rounded text-[10px] text-[#877369] uppercase font-mono"
                      >
                        #{tag.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* External Links */}
              {place.bookingLinks && (
                <div className="mt-6 pt-4 border-t border-[#F0EDED] flex items-center justify-between text-xs font-semibold">
                  <a
                    href={place.bookingLinks.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#6C2F00] hover:underline inline-flex items-center"
                  >
                    <span>View Map</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>

                  <a
                    href={place.bookingLinks.tripAdvisor}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#877369] hover:text-[#1C1B1B] inline-flex items-center"
                  >
                    <span>TripAdvisor</span>
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No Landmarks Found"
          description={`We could not identify cataloged OpenTripMap landmarks in ${trip.destination} matching the active category.`}
          actionLabel="View All Categories"
          onAction={() => setSelectedCategory("all")}
        />
      )}
    </div>
  );
};

export default TripPlacesTab;
