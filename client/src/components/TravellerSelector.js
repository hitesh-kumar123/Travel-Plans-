import React, { useState } from "react";
import Popover from "@mui/material/Popover";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

/**
 * TravellerSelector
 * A booking-platform-style traveller picker (Adults / Children / Infants)
 * that opens in an MUI Popover anchored to the search field.
 *
 * Props:
 *  - travellers: { adults: number, children: number, infants: number }
 *  - onChange: (next) => void
 */
const TRAVELLER_TYPES = [
  {
    key: "adults",
    label: "Adults",
    sub: "Ages 13 or above",
    min: 1, // at least 1 adult always required
  },
  {
    key: "children",
    label: "Children",
    sub: "Ages 2 - 12",
    min: 0,
  },
  {
    key: "infants",
    label: "Infants",
    sub: "Under 2",
    min: 0,
  },
];

const MAX_PER_TYPE = 10;

export const formatTravellerSummary = (travellers) => {
  const { adults = 0, children = 0, infants = 0 } = travellers || {};
  const parts = [];

  if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  if (children > 0) parts.push(`${children} Child${children > 1 ? "ren" : ""}`);
  if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "Add travellers";
};

const TravellerSelector = ({ travellers, onChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const updateCount = (key, delta, min) => {
    const current = travellers?.[key] ?? min;
    const next = Math.min(MAX_PER_TYPE, Math.max(min, current + delta));
    onChange({ ...travellers, [key]: next });
  };

  const totalTravellers =
    (travellers?.adults || 0) +
    (travellers?.children || 0) +
    (travellers?.infants || 0);

  return (
    <>
      <div
        className="wander-sf-val"
        role="button"
        tabIndex={0}
        onClick={handleOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleOpen(e);
        }}
        style={{ cursor: "pointer", userSelect: "none" }}
      >
        {formatTravellerSummary(travellers)}
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 2.5,
              width: 300,
              borderRadius: "14px",
              boxShadow: "0 16px 32px rgba(15, 45, 64, 0.18)",
            },
          },
        }}
      >
        {TRAVELLER_TYPES.map((type) => {
          const count = travellers?.[type.key] ?? type.min;
          return (
            <div
              key={type.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom:
                  type.key !== "infants"
                    ? "1px solid rgba(15,45,64,0.08)"
                    : "none",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#1A4A6B",
                  }}
                >
                  {type.label}
                </div>
                <div style={{ fontSize: "0.78rem", color: "#6B8499" }}>
                  {type.sub}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <IconButton
                  size="small"
                  onClick={() => updateCount(type.key, -1, type.min)}
                  disabled={count <= type.min}
                  sx={{
                    border: "1px solid rgba(15,45,64,0.18)",
                    width: 30,
                    height: 30,
                  }}
                  aria-label={`Decrease ${type.label}`}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>

                <span
                  style={{
                    minWidth: 18,
                    textAlign: "center",
                    fontWeight: 600,
                  }}
                >
                  {count}
                </span>

                <IconButton
                  size="small"
                  onClick={() => updateCount(type.key, 1, type.min)}
                  disabled={count >= MAX_PER_TYPE}
                  sx={{
                    border: "1px solid rgba(15,45,64,0.18)",
                    width: 30,
                    height: 30,
                  }}
                  aria-label={`Increase ${type.label}`}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </div>
            </div>
          );
        })}

        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(15,45,64,0.08)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "#6B8499" }}>
            Total: {totalTravellers} traveller{totalTravellers !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={handleClose}
            className="wander-btn-primary"
            style={{ padding: "6px 18px", fontSize: "0.85rem" }}
          >
            Done
          </button>
        </div>
      </Popover>
    </>
  );
};

export default TravellerSelector;
