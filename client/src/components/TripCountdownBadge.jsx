import React from "react";
import Chip from "@mui/material/Chip";
import { getTripCountdown } from "../utils/tripCountdown";

const STATUS_CONFIG = {
  upcoming: { color: "primary", variant: "outlined" },
  today: { color: "success", variant: "filled" },
  ongoing: { color: "warning", variant: "filled" },
  completed: { color: "default", variant: "outlined" },
};

export default function TripCountdownBadge({ startDate, endDate, sx = {} }) {
  const { type, label } = getTripCountdown(startDate, endDate);
  const { color, variant } = STATUS_CONFIG[type];

  return (
    <Chip
      label={label}
      color={color}
      variant={variant}
      size="small"
      sx={{ fontWeight: 600, fontSize: "0.72rem", ...sx }}
    />
  );
}
