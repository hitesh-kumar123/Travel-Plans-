import React, { useState, useEffect } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { tripsApi } from "../../services/api/tripsApi";
import { getErrorMessage } from "../../services/api/client";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import Modal from "../../components/Modal";
import LoadingState from "../../components/LoadingState";
import ErrorState from "../../components/ErrorState";

import TripOverviewTab from "./tabs/TripOverviewTab";
import TripItineraryTab from "./tabs/TripItineraryTab";
import TripPlacesTab from "./tabs/TripPlacesTab";
import TripBudgetTab from "./tabs/TripBudgetTab";
import TripPackingTab from "./tabs/TripPackingTab";
import TripWeatherTab from "./tabs/TripWeatherTab";
import TripNotesTab from "./tabs/TripNotesTab";

import {
  ArrowLeft,
  Calendar,
  Share2,
  Trash2,
  MapPin,
  CheckCircle,
  Copy,
  AlertTriangle,
  Globe,
  Edit,
} from "lucide-react";

export const TripDetailPage = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Share & Delete state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const fetchTrip = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await tripsApi.getById(id);
      setTrip(res.data);
    } catch (err) {
      console.error("Failed to load trip:", err);
      setError("Unable to retrieve trip records. You may not have permission.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTrip();
  }, [id]);

  const handleShareClick = async () => {
    try {
      let token = trip.shareToken;
      if (!token) {
        const res = await tripsApi.generateShareLink(trip._id);
        token = res.data.shareToken;
        setTrip((prev) => ({ ...prev, shareToken: token, shareEnabled: true }));
      }
      const fullUrl = `${window.location.origin}/share/${token}`;
      setShareLink(fullUrl);
      setIsShareModalOpen(true);
    } catch (err) {
      console.error("Failed to generate share link:", err);
    }
  };

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleToggleSharing = async () => {
    try {
      const res = await tripsApi.toggleSharing(trip._id);
      setTrip((prev) => ({ ...prev, shareEnabled: res.data.shareEnabled }));
    } catch (err) {
      console.error("Failed to toggle sharing:", err);
    }
  };

  const handleDeleteTrip = async () => {
    setDeleteLoading(true);
    try {
      await tripsApi.delete(trip._id);
      navigate("/my-journey");
    } catch (err) {
      console.error("Failed to delete trip:", err);
      alert(getErrorMessage(err, "Failed to delete trip."));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F8] pt-28 pb-20">
        <LoadingState message="Unfurling journey overview..." fullPage />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#FCF9F8] pt-28 pb-20 px-4 max-w-3xl mx-auto">
        <ErrorState
          title="Journey Not Available"
          message={error || "The requested journey could not be located."}
          onRetry={fetchTrip}
        />
      </div>
    );
  }

  const { destination, startDate, endDate, status, budget, images = [] } = trip;
  const coverImage =
    images && images.length > 0
      ? images[0]
      : "https://lh3.googleusercontent.com/aida-public/AB6AXuAP7Eydm5klYyHztk8KE4KpZIyD83iGhMUvryuywAzGAGgOn2jZs7FQbQWQOMeKhHlwAYGAeSpvj-1Y5hO08P4zVVUvvz9LzlXTRS5mAFaDA6r9AtzD5ZPvz7VZQYOz31KH_L4ULdg08ExDnOTOpYzQUH9jOCNGkrTVjXE6cwibu4jNnQe5c6N3aH39Xj1H5iOFxaQLiRQStop3An0PGby3Rw5rjaiBFJgfc3oZriy_ucxO1VVg39hkDA";

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "itinerary", label: "Itinerary" },
    { id: "places", label: "Places" },
    { id: "budget", label: "Budget & Expenses" },
    { id: "packing", label: "Packing" },
    { id: "weather", label: "Weather" },
    { id: "notes", label: "Notes" },
  ];

  return (
    <div className="min-h-screen bg-[#FCF9F8] pb-24">
      {/* ── 1. CINEMATIC HERO HEADER ── */}
      <section className="relative w-full h-[580px] sm:h-[680px] bg-[#1C1B1B] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${coverImage}")` }}
        />
        <div className="absolute inset-0 scrim-top" />
        <div className="absolute inset-0 scrim-bottom" />

        {/* Top Back Link */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link
            to="/my-journey"
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1C1B1B]/70 backdrop-blur-md text-xs font-semibold text-white hover:bg-[#6C2F00] transition-colors border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Journeys</span>
          </Link>
        </div>

        {/* Hero Bottom Banner Content */}
        <div className="relative h-full flex flex-col justify-end pb-10 sm:pb-12 px-4 sm:px-8 max-w-7xl mx-auto z-10 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-[#FFB68C]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#FFB68C]">
                  {destination}, India
                </span>
                {trip.shareEnabled && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#CDEACE] text-[#2E4632] text-[10px] font-semibold uppercase">
                    <Globe className="w-3 h-3 mr-1" />
                    Public
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl sm:text-6xl font-bold leading-tight drop-shadow-md">
                Expedition to {destination}
              </h1>

              <div className="flex items-center space-x-2 text-xs sm:text-sm text-white/90">
                <Calendar className="w-4 h-4 mr-1" />
                <span>
                  {formatDate(startDate)} – {formatDate(endDate)}
                </span>
              </div>
            </div>

            {/* Glass-Panel Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={handleShareClick}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-full glass-panel-dark text-white hover:bg-white hover:text-[#1C1B1B] text-xs font-semibold transition-all duration-300 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Trip</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2.5 rounded-full glass-panel-dark text-[#FFDAD6] hover:bg-[#BA1A1A] hover:text-white text-xs font-semibold transition-all duration-300 cursor-pointer"
                title="Delete Journey"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STICKY SUB-NAVIGATION BAR ── */}
      <div className="sticky top-[73px] z-30 bg-[#FCF9F8]/95 backdrop-blur-md border-b border-[#DAC2B6]/40 px-4 sm:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center space-x-6 sm:space-x-8 overflow-x-auto hide-scrollbar py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`text-xs font-semibold uppercase tracking-widest transition-colors whitespace-nowrap cursor-pointer pb-1 ${
                activeTab === tab.id
                  ? "text-[#6C2F00] border-b-2 border-[#6C2F00]"
                  : "text-[#54433A] hover:text-[#1C1B1B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. ACTIVE TAB CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {activeTab === "overview" && <TripOverviewTab trip={trip} />}
        {activeTab === "itinerary" && (
          <TripItineraryTab trip={trip} onTripUpdated={setTrip} />
        )}
        {activeTab === "places" && <TripPlacesTab trip={trip} />}
        {activeTab === "budget" && <TripBudgetTab trip={trip} />}
        {activeTab === "packing" && <TripPackingTab trip={trip} />}
        {activeTab === "weather" && <TripWeatherTab trip={trip} />}
        {activeTab === "notes" && (
          <TripNotesTab trip={trip} onTripUpdated={setTrip} />
        )}
      </main>

      {/* ── SHARE MODAL ── */}
      {isShareModalOpen && (
        <Modal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          title="Share Journey Itinerary"
          subtitle={`Generate a public view link for your ${destination} trip.`}
        >
          <div className="space-y-6">
            <p className="text-xs text-[#54433A] leading-relaxed">
              Anyone with this link can view your itinerary, dates, and
              accommodation without needing an account.
            </p>

            <div className="p-3 bg-[#F6F3F2] border border-[#DAC2B6] rounded flex items-center justify-between gap-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="bg-transparent text-xs font-mono text-[#1C1B1B] w-full focus:outline-none"
              />
              <Button
                variant="terracotta"
                size="sm"
                className="shrink-0"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E5E2E1] text-xs">
              <span className="text-[#54433A]">Public Link Access:</span>
              <button
                type="button"
                onClick={handleToggleSharing}
                className={`px-3 py-1 font-semibold rounded text-xs transition-colors ${
                  trip.shareEnabled
                    ? "bg-[#CDEACE] text-[#2E4632]"
                    : "bg-[#FFDAD6] text-[#BA1A1A]"
                }`}
              >
                {trip.shareEnabled ? "Enabled (Public)" : "Disabled (Private)"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── DELETE MODAL ── */}
      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Journey Record"
          subtitle="Please confirm this destructive action."
        >
          <div className="space-y-6">
            <div className="p-4 bg-[#FFDAD6]/40 border border-[#BA1A1A]/30 rounded flex items-start space-x-3 text-xs text-[#BA1A1A]">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Permanent Deletion Warning</p>
                <p className="mt-1 leading-relaxed">
                  Deleting this journey will permanently erase all associated
                  expense logs, daily itinerary activities, and packing
                  checklists.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-[#E5E2E1]">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Keep Journey
              </Button>
              <Button
                variant="danger"
                size="md"
                loading={deleteLoading}
                onClick={handleDeleteTrip}
              >
                Permanently Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TripDetailPage;
