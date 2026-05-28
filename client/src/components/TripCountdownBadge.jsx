import React from "react";
import Chip from "@mui/material/Chip";
import { getTripCountdown } from "../utils/tripCountdown";

const STATUS_CONFIG = {
  upcoming: { color: "primary", variant: "outlined" },
  today: { color: "success", variant: "filled" },
  ongoing: { color: "warning", variant: "filled" },
  completed: { color: "default", variant: "outlined" },
};

export default function TripCountdownBadge({ startDate, endDate, size = "small", sx = {}, ...props }) {
  const { type, label } = getTripCountdown(startDate, endDate);
  const { color, variant } = STATUS_CONFIG[type];

  return (
    <Chip
      label={label}
      color={color}
      variant={variant}
      size={size}
      aria-label={`Trip status: ${label}`}
      sx={{ fontWeight: 600, fontSize: size === "small" ? "0.72rem" : "0.875rem", ...sx }}
      {...props}
    />
  );
}
