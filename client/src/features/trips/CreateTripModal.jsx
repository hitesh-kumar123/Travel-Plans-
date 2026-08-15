import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tripsApi } from "../../services/api/tripsApi";
import { destinationsApi } from "../../services/api/destinationsApi";
import { getErrorMessage } from "../../services/api/client";
import { MapPin, Calendar, AlertCircle, ArrowRight, X } from "lucide-react";

export const CreateTripModal = ({
  isOpen,
  onClose,
  initialDestination = "",
  onTripCreated,
}) => {
  const [formData, setFormData] = useState({
    destination: initialDestination,
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
    status: "planned",
    accommodationName: "",
    transportType: "",
  });

  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (initialDestination) {
      setFormData((prev) => ({ ...prev, destination: initialDestination }));
    }
  }, [initialDestination]);

  useEffect(() => {
    const q = formData.destination.trim();
    if (q.length < 2) {
      setAutocompleteResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await destinationsApi.search(q);
        if (Array.isArray(res.data)) {
          setAutocompleteResults(res.data);
        }
      } catch (err) {
        console.warn("Autocomplete error:", err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [formData.destination]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split("T")[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.destination.trim()) {
      setError("Please specify a destination.");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      setError("Please select start and end travel dates.");
      return;
    }
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("End date must be on or after start date.");
      return;
    }

    setLoading(true);

    const payload = {
      destination: formData.destination.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      description: formData.description.trim(),
      budget: formData.budget ? Number(formData.budget) : 0,
      status: formData.status,
    };

    if (formData.accommodationName) {
      payload.accommodation = {
        name: formData.accommodationName,
        checkIn: formData.startDate,
        checkOut: formData.endDate,
      };
    }

    if (formData.transportType) {
      payload.transportation = {
        type: formData.transportType,
      };
    }

    try {
      const res = await tripsApi.create(payload);
      onClose();
      if (onTripCreated) {
        onTripCreated(res.data);
      } else {
        navigate(`/trips/${res.data._id}`);
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to create trip. Please check your inputs.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-[#FCF9F8] border border-[#DAC2B6] rounded p-8 sm:p-12 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-[#877369] hover:text-[#1C1B1B] transition-colors p-2"
          aria-label="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-8 space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00]">
            NEW JOURNEY BUILDER
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1B]">
            Create your journey
          </h2>
          <p className="text-sm text-[#54433A]">
            Define dates, budget, and destination for your next expedition.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded bg-[#FFDAD6]/60 border border-[#BA1A1A]/30 flex items-start gap-3 text-xs text-[#BA1A1A]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Destination */}
          <div className="relative">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
              htmlFor="trip-destination"
            >
              Destination City or Region *
            </label>
            <input
              id="trip-destination"
              type="text"
              required
              value={formData.destination}
              onChange={(e) =>
                setFormData({ ...formData, destination: e.target.value })
              }
              placeholder="e.g. Udaipur, Jaipur, Kerala, Varanasi"
              className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
            />

            {autocompleteResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-[#FFFFFF] border border-[#DAC2B6] rounded shadow-lg max-h-48 overflow-y-auto">
                {autocompleteResults.map((item) => (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        destination: item.city || item.name,
                      });
                      setAutocompleteResults([]);
                    }}
                    className="w-full text-left px-4 py-3 text-xs hover:bg-[#F6F3F2] flex items-center justify-between border-b border-[#F0EDED] last:border-0"
                  >
                    <span className="font-semibold text-[#1C1B1B]">
                      {item.name}
                    </span>
                    <span className="text-[#877369]">
                      {item.city}, {item.state}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="trip-start-date"
              >
                Start Date *
              </label>
              <input
                id="trip-start-date"
                type="date"
                required
                min={todayStr}
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="trip-end-date"
              >
                End Date *
              </label>
              <input
                id="trip-end-date"
                type="date"
                required
                min={formData.startDate || todayStr}
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>
          </div>

          {/* Budget & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="trip-budget"
              >
                Target Budget (INR)
              </label>
              <input
                id="trip-budget"
                type="number"
                min="0"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder="e.g. 25000"
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors"
              />
            </div>

            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
                htmlFor="trip-status"
              >
                Journey Status
              </label>
              <select
                id="trip-status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] focus:ring-0 focus:border-[#6C2F00] transition-colors"
              >
                <option value="planned">Planned</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-[#877369] mb-1"
              htmlFor="trip-notes"
            >
              Trip Vision & Notes
            </label>
            <textarea
              id="trip-notes"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Notes about travel companions, preferred pace, must-see places..."
              className="w-full bg-transparent border-0 border-b border-[#DAC2B6] py-3 text-base text-[#1C1B1B] placeholder-[#877369]/50 focus:ring-0 focus:border-[#6C2F00] transition-colors resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-[#DAC2B6] text-[#54433A] rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#F6F3F2] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#6C2F00] text-white px-8 py-3.5 rounded text-xs font-semibold uppercase tracking-widest hover:bg-[#8B4513] transition-colors shadow-sm inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? "Creating..." : "Create Journey"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTripModal;
