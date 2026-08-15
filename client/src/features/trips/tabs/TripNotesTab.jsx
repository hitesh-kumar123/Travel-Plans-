import React, { useState } from "react";
import { tripsApi } from "../../../services/api/tripsApi";
import { getErrorMessage } from "../../../services/api/client";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import { FileText, Save, CheckCircle2 } from "lucide-react";

export const TripNotesTab = ({ trip, onTripUpdated }) => {
  const [description, setDescription] = useState(trip.description || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const res = await tripsApi.update(trip._id, {
        description: description.trim(),
      });
      onTripUpdated(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to save trip notes."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-[#E5E2E1]">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] block mb-1">
          Travel Journal & Documentation
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
          Trip Notes & Journal
        </h3>
        <p className="text-xs text-[#54433A] mt-1">
          Record essential tips, emergency contacts, local recommendations, and
          reflections.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="bg-[#FFFFFF] p-8 border border-[#DAC2B6] rounded-md shadow-xs space-y-6"
      >
        {error && (
          <div className="p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
            {error}
          </div>
        )}

        {saved && (
          <div className="p-3 bg-[#CDEACE]/50 text-xs text-[#2E4632] rounded flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Notes updated successfully in the sanctuary registry.
          </div>
        )}

        <FormField
          as="textarea"
          label="Expedition Notes & Reminders"
          name="notes"
          rows={8}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write down flight PNRs, guide contact numbers, dress code rules for local temples, favorite sweetshops to try..."
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="terracotta"
            size="md"
            loading={loading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Notes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TripNotesTab;
