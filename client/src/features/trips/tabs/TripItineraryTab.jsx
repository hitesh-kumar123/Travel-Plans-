import React, { useState } from "react";
import { tripsApi } from "../../../services/api/tripsApi";
import { getErrorMessage } from "../../../services/api/client";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import Modal from "../../../components/Modal";
import EmptyState from "../../../components/EmptyState";
import {
  Calendar,
  MapPin,
  Plus,
  Trash2,
  Clock,
  CheckCircle,
} from "lucide-react";

export const TripItineraryTab = ({ trip, onTripUpdated }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activityForm, setActivityForm] = useState({
    name: "",
    date: trip.startDate ? trip.startDate.split("T")[0] : "",
    location: "",
    notes: "",
  });

  const activities = trip.activities || [];

  const handleAddActivity = async (e) => {
    e.preventDefault();
    setError("");

    if (!activityForm.name.trim()) {
      setError("Activity title is required.");
      return;
    }

    setLoading(true);
    const updatedActivities = [
      ...activities,
      {
        name: activityForm.name.trim(),
        date: activityForm.date
          ? new Date(activityForm.date)
          : new Date(trip.startDate),
        location: activityForm.location.trim(),
        notes: activityForm.notes.trim(),
      },
    ];

    try {
      const res = await tripsApi.update(trip._id, {
        activities: updatedActivities,
      });
      onTripUpdated(res.data);
      setIsAddModalOpen(false);
      setActivityForm({
        name: "",
        date: trip.startDate ? trip.startDate.split("T")[0] : "",
        location: "",
        notes: "",
      });
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save activity."));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (indexToDelete) => {
    const updatedActivities = activities.filter(
      (_, idx) => idx !== indexToDelete,
    );
    try {
      const res = await tripsApi.update(trip._id, {
        activities: updatedActivities,
      });
      onTripUpdated(res.data);
    } catch (err) {
      console.error("Failed to delete activity:", err);
    }
  };

  // Sort activities chronologically
  const sortedActivities = [...activities].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E2E1]">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
            Daily Expedition Itinerary
          </h3>
          <p className="text-xs text-[#54433A] mt-1">
            Chart planned excursions, monument visits, and cultural moments.
          </p>
        </div>
        <Button
          variant="terracotta"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {sortedActivities.length > 0 ? (
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#DAC2B6] space-y-8 my-6">
          {sortedActivities.map((act, idx) => (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#6C2F00] border-4 border-[#FCF9F8]" />

              <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs hover:border-[#DAC2B6] transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-semibold text-[#6C2F00]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {act.date
                        ? new Date(act.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })
                        : "Flexible Date"}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-bold text-[#1C1B1B]">
                    {act.name}
                  </h4>

                  {act.location && (
                    <div className="flex items-center text-xs text-[#877369]">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      <span>{act.location}</span>
                    </div>
                  )}

                  {act.notes && (
                    <p className="text-xs text-[#54433A] leading-relaxed pt-1 whitespace-pre-line font-sans">
                      {act.notes}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteActivity(idx)}
                  className="text-[#877369] hover:text-[#BA1A1A] transition-colors p-1.5 rounded hover:bg-[#FFDAD6]/30 self-end sm:self-start"
                  title="Remove Activity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Calendar}
          title="No Activities Scheduled"
          description="Build your day-by-day itinerary with monuments, tours, dining, and scenic stops."
          actionLabel="Add First Activity"
          onAction={() => setIsAddModalOpen(true)}
        />
      )}

      {/* Add Activity Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Schedule Activity"
          subtitle={`Add an itinerary item for ${trip.destination}`}
        >
          {error && (
            <div className="mb-4 p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleAddActivity} className="space-y-5">
            <FormField
              label="Activity Title"
              name="name"
              value={activityForm.name}
              onChange={(e) =>
                setActivityForm({ ...activityForm, name: e.target.value })
              }
              placeholder="e.g. Guided tour of City Palace & Crystal Gallery"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Date"
                name="date"
                type="date"
                value={activityForm.date}
                onChange={(e) =>
                  setActivityForm({ ...activityForm, date: e.target.value })
                }
              />

              <FormField
                label="Location / Landmark"
                name="location"
                icon={MapPin}
                value={activityForm.location}
                onChange={(e) =>
                  setActivityForm({ ...activityForm, location: e.target.value })
                }
                placeholder="e.g. Lake Pichola"
              />
            </div>

            <FormField
              as="textarea"
              label="Notes & Tips"
              name="notes"
              rows={3}
              value={activityForm.notes}
              onChange={(e) =>
                setActivityForm({ ...activityForm, notes: e.target.value })
              }
              placeholder="e.g. Arrive before sunset for the best lighting. Ticket ₹400."
            />

            <div className="pt-4 border-t border-[#E5E2E1] flex justify-end space-x-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="terracotta"
                size="md"
                loading={loading}
              >
                Save Activity
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TripItineraryTab;
