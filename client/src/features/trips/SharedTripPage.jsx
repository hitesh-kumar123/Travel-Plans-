import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { tripsApi } from "../../services/api/tripsApi";
import { getErrorMessage } from "../../services/api/client";
import Badge from "../../components/Badge";
import Button from "../../components/Button";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";
import {
  Calendar,
  MapPin,
  Building,
  Plane,
  Compass,
  ArrowRight,
  Globe,
  Share2,
} from "lucide-react";

export const SharedTripPage = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSharedTrip = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await tripsApi.getSharedTrip(token);
        setTrip(res.data);
      } catch (err) {
        console.error("Shared trip load error:", err);
        setError(
          getErrorMessage(
            err,
            "This shared journey itinerary is either disabled or does not exist.",
          ),
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSharedTrip();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F8] pt-28 pb-20">
        <LoadingState message="Unfurling shared journey..." fullPage />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#FCF9F8] pt-28 pb-20 px-4 max-w-3xl mx-auto">
        <ErrorState
          title="Shared Journey Unavailable"
          message={
            error || "The requested shared journey could not be located."
          }
        />
        <div className="text-center mt-6">
          <Link to="/">
            <Button variant="primary" size="md">
              Explore PackGo
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const {
    destination,
    startDate,
    endDate,
    status,
    budget,
    description,
    activities = [],
    accommodation,
    transportation,
    images = [],
  } = trip;

  const coverImage =
    images && images.length > 0
      ? images[0]
      : "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85";

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FCF9F8] pb-24">
      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 w-full overflow-hidden bg-[#1C1B1B]">
        <img
          src={coverImage}
          alt={destination}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B1B]/90 via-[#1C1B1B]/50 to-transparent" />

        <div className="absolute bottom-8 left-4 sm:left-8 right-4 sm:right-8 max-w-7xl mx-auto text-white">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="terracotta" size="xs">
              <Globe className="w-3 h-3 mr-1" />
              Shared Journey Itinerary
            </Badge>
            <Badge variant={status} size="xs" className="capitalize">
              {status}
            </Badge>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Expedition to {destination}
          </h1>

          <div className="flex items-center text-xs sm:text-sm text-[#FFB68C] mt-2 space-x-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>
              {formatDate(startDate)} — {formatDate(endDate)}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-12">
        {/* Description / Story */}
        {description && (
          <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#E5E2E1] rounded-md shadow-xs space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] block">
              Travel Vision & Notes
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
              About This Itinerary
            </h3>
            <p className="text-sm text-[#54433A] leading-relaxed whitespace-pre-line font-sans">
              {description}
            </p>
          </div>
        )}

        {/* Daily Itinerary Activities Timeline */}
        {activities.length > 0 && (
          <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#E5E2E1] rounded-md shadow-xs space-y-6">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] block">
              Daily Program
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
              Planned Activities ({activities.length})
            </h3>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-[#DAC2B6] space-y-6 mt-6">
              {activities.map((act, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#6C2F00] border-4 border-[#FFFFFF]" />
                  <div className="p-4 bg-[#F6F3F2] rounded border border-[#E5E2E1] space-y-1">
                    <div className="flex items-center text-xs font-semibold text-[#6C2F00]">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      <span>
                        {act.date ? formatDate(act.date) : "Planned Stop"}
                      </span>
                    </div>
                    <h4 className="font-serif text-lg font-bold text-[#1C1B1B]">
                      {act.name}
                    </h4>
                    {act.location && (
                      <div className="flex items-center text-xs text-[#877369]">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        <span>{act.location}</span>
                      </div>
                    )}
                    {act.notes && (
                      <p className="text-xs text-[#54433A] pt-1 leading-relaxed">
                        {act.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Accommodation & Transportation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {accommodation?.name && (
            <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E2E1] rounded shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#6C2F00]">
                <Building className="w-5 h-5" />
                <h4 className="font-serif text-lg font-bold text-[#1C1B1B]">
                  Accommodation
                </h4>
              </div>
              <div className="text-xs space-y-1 text-[#54433A] pt-2 border-t border-[#F0EDED]">
                <p>
                  <strong>Hotel:</strong> {accommodation.name}
                </p>
                {accommodation.address && (
                  <p>
                    <strong>Address:</strong> {accommodation.address}
                  </p>
                )}
                {accommodation.checkIn && (
                  <p>
                    <strong>Check-in:</strong>{" "}
                    {formatDate(accommodation.checkIn)}
                  </p>
                )}
              </div>
            </div>
          )}

          {transportation?.type && (
            <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E2E1] rounded shadow-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#6C2F00]">
                <Plane className="w-5 h-5" />
                <h4 className="font-serif text-lg font-bold text-[#1C1B1B]">
                  Transit
                </h4>
              </div>
              <div className="text-xs space-y-1 text-[#54433A] pt-2 border-t border-[#F0EDED]">
                <p>
                  <strong>Transit Type:</strong> {transportation.type}
                </p>
                {transportation.departureTime && (
                  <p>
                    <strong>Departure:</strong>{" "}
                    {formatDate(transportation.departureTime)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PackGo Promotion Banner */}
        <div className="p-8 sm:p-10 bg-[#1C1B1B] text-[#FCF9F8] rounded text-center shadow-lg">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-2">
            Inspired by This Expedition?
          </h3>
          <p className="text-xs sm:text-sm text-[#DAC2B6] max-w-lg mx-auto mb-6">
            Chart your own bespoke journey across India with PackGo's curated
            destinations, budget tracking, and packing tools.
          </p>
          <Link to="/register">
            <Button variant="terracotta" size="md">
              <span>Start Planning Your Journey</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedTripPage;
