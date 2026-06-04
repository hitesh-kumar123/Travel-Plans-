import React, { useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Drawer,
  Slider,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  TextField,
  MenuItem,
  Divider,
  Tooltip,
  IconButton,
  Chip,
  Button,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import {
  setBudgetInputs,
  resetBudget,
} from "../../redux/actions/budgetActions";
import { calculateBudget, formatINR } from "../../utils/budgetUtils";
import {
  ACCOMMODATION_MULTIPLIERS,
  TRANSPORT_OPTIONS,
  ACTIVITY_OPTIONS,
  FOOD_RANGE,
  DAYS_RANGE,
  PAX_RANGE,
} from "../../constants/budgetConstants";

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <Typography
    variant="overline"
    sx={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.08em",
      color: "text.disabled",
      display: "block",
      mb: 1,
    }}
  >
    {children}
  </Typography>
);

const BreakdownBar = ({ label, value, total, color, icon }) => (
  <Box sx={{ mb: 1.5 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontSize: 12,
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <span>{icon}</span> {label}
      </Typography>
      <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
        {formatINR(value)}
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0}
      sx={{
        height: 6,
        borderRadius: 3,
        bgcolor: "action.hover",
        "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 3 },
      }}
    />
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * BudgetCalculator
 *
 * Props:
 *   open       {boolean}  – controls Drawer visibility
 *   onClose    {function} – called when user closes the drawer
 *   tripData   {object}   – optional: { destination, duration, travelers }
 *                           pre-fills inputs when opened from TripDetail
 */
const BudgetCalculator = ({ open, onClose, tripData, onSaveBudget }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Pull saved inputs from Redux so state persists across nav
  const inputs = useSelector((state) => state.budget.inputs);

  // Pre-fill from tripData the first time the drawer opens
  React.useEffect(() => {
    if (open && tripData) {
      dispatch(
        setBudgetInputs({
          destination: tripData.destination || inputs.destination,
          days: tripData.duration || inputs.days,
          travelers: tripData.travelers || inputs.travelers,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Derived budget numbers (pure calculation, no API) ──────────────────────
  const result = useMemo(() => calculateBudget(inputs), [inputs]);

  // ── Input handlers ─────────────────────────────────────────────────────────
  const handleChange = useCallback(
    (field) => (_, value) => dispatch(setBudgetInputs({ [field]: value ?? _ })),
    [dispatch],
  );

  const handleTextChange = useCallback(
    (field) => (e) => dispatch(setBudgetInputs({ [field]: e.target.value })),
    [dispatch],
  );

  const handleSlider = useCallback(
    (field) => (_, value) => dispatch(setBudgetInputs({ [field]: value })),
    [dispatch],
  );

  const handleReset = () => dispatch(resetBudget());

  // ── Export as plain text summary ───────────────────────────────────────────
  const handleExport = () => {
    const lines = [
      `Trip Budget Estimate`,
      `====================`,
      `Destination  : ${inputs.destination || "Not set"}`,
      `Duration     : ${inputs.days} days`,
      `Travelers    : ${inputs.travelers}`,
      ``,
      `BREAKDOWN`,
      `---------`,
      `Accommodation: ${formatINR(result.stay)}`,
      `Transport    : ${formatINR(result.travel)}`,
      `Food         : ${formatINR(result.food)}`,
      `Activities   : ${formatINR(result.activities)}`,
      `Buffer (10%) : ${formatINR(result.buffer)}`,
      ``,
      `TOTAL        : ${formatINR(result.total)}`,
      `Per day      : ${formatINR(result.perDay)}`,
      `Per person   : ${formatINR(result.perPerson)}`,
      ``,
      `Quick ranges`,
      `Budget   : ${formatINR(result.ranges.budget)}`,
      `Standard : ${formatINR(result.ranges.standard)}`,
      `Luxury   : ${formatINR(result.ranges.luxury)}`,
    ].join("\n");

    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `budget-estimate-${inputs.destination || "trip"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100vw" : 440,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
          >
            Budget Estimator
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 12 }}
          >
            Approximate costs · all amounts in INR
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Reset all inputs">
            <IconButton size="small" onClick={handleReset}>
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export summary">
            <IconButton size="small" onClick={handleExport}>
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* ── Scrollable body ── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
        {/* ── 1. Trip basics ── */}
        <SectionLabel>1 · Trip basics</SectionLabel>

        <TextField
          fullWidth
          size="small"
          label="Destination"
          placeholder="e.g. Goa, Paris, Bali"
          value={inputs.destination}
          onChange={handleTextChange("destination")}
          sx={{ mb: 2 }}
        />

        <TextField
          select
          fullWidth
          size="small"
          label="Destination tier"
          value={inputs.destinationTier}
          onChange={handleTextChange("destinationTier")}
          sx={{ mb: 2.5 }}
          helperText="Sets baseline accommodation and food rates"
        >
          <MenuItem value="budget">Budget (small cities, rural)</MenuItem>
          <MenuItem value="standard">Standard (domestic metros)</MenuItem>
          <MenuItem value="premium">Premium (international / luxury)</MenuItem>
        </TextField>

        <Typography
          variant="body2"
          gutterBottom
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Duration</span>
          <strong>
            {inputs.days} {inputs.days === 1 ? "day" : "days"}
          </strong>
        </Typography>
        <Slider
          value={inputs.days}
          min={DAYS_RANGE.min}
          max={DAYS_RANGE.max}
          step={DAYS_RANGE.step}
          onChange={handleSlider("days")}
          sx={{ mb: 2.5 }}
        />

        <Typography
          variant="body2"
          gutterBottom
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Travelers</span>
          <strong>{inputs.travelers}</strong>
        </Typography>
        <Slider
          value={inputs.travelers}
          min={PAX_RANGE.min}
          max={PAX_RANGE.max}
          step={PAX_RANGE.step}
          onChange={handleSlider("travelers")}
          sx={{ mb: 2.5 }}
        />

        <Divider sx={{ my: 2 }} />

        {/* ── 2. Accommodation ── */}
        <SectionLabel>2 · Accommodation</SectionLabel>
        <ToggleButtonGroup
          value={inputs.accommodationType}
          exclusive
          onChange={handleChange("accommodationType")}
          fullWidth
          size="small"
          sx={{ mb: 2.5 }}
        >
          {Object.entries(ACCOMMODATION_MULTIPLIERS).map(([key, { label }]) => (
            <ToggleButton
              key={key}
              value={key}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider sx={{ my: 2 }} />

        {/* ── 3. Transport ── */}
        <SectionLabel>3 · Transport (return trip)</SectionLabel>
        <ToggleButtonGroup
          value={inputs.transportType}
          exclusive
          onChange={handleChange("transportType")}
          fullWidth
          size="small"
          sx={{ mb: 2.5 }}
        >
          {TRANSPORT_OPTIONS.map(({ key, label }) => (
            <ToggleButton
              key={key}
              value={key}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Divider sx={{ my: 2 }} />

        {/* ── 4. Food ── */}
        <SectionLabel>4 · Food</SectionLabel>
        <Typography
          variant="body2"
          gutterBottom
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <span>Per person per day</span>
          <strong>{formatINR(inputs.foodPerPersonPerDay)}</strong>
        </Typography>
        <Slider
          value={inputs.foodPerPersonPerDay}
          min={FOOD_RANGE.min}
          max={FOOD_RANGE.max}
          step={FOOD_RANGE.step}
          onChange={handleSlider("foodPerPersonPerDay")}
          sx={{ mb: 0.5 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
          <Typography variant="caption" color="text.disabled">
            Street food
          </Typography>
          <Typography variant="caption" color="text.disabled">
            Fine dining
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* ── 5. Activities ── */}
        <SectionLabel>5 · Activities</SectionLabel>
        <ToggleButtonGroup
          value={inputs.activityType}
          exclusive
          onChange={handleChange("activityType")}
          fullWidth
          size="small"
          sx={{ mb: 3 }}
        >
          {ACTIVITY_OPTIONS.map(({ key, label }) => (
            <ToggleButton
              key={key}
              value={key}
              sx={{ textTransform: "none", fontSize: 12 }}
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* ── Sticky results panel ── */}
      <Box
        sx={{
          flexShrink: 0,
          borderTop: "1px solid",
          borderColor: "divider",
          px: 3,
          py: 2,
          bgcolor: "background.paper",
        }}
      >
        {/* Total */}
        <Box
          sx={{
            bgcolor: "success.lighter", // falls back gracefully if theme doesn't define it
            background: (t) =>
              t.palette.mode === "dark" ? "rgba(29,158,117,0.15)" : "#E1F5EE",
            border: "1px solid",
            borderColor: (t) =>
              t.palette.mode === "dark" ? "rgba(29,158,117,0.4)" : "#9FE1CB",
            borderRadius: 2,
            p: 2,
            mb: 2,
          }}
        >
          <Typography
            variant="overline"
            sx={{ fontSize: 10, color: "#0F6E56", letterSpacing: "0.08em" }}
          >
            Estimated total
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 700,
              color: "#085041",
              lineHeight: 1.2,
            }}
          >
            {formatINR(result.total)}
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: 12, color: "#1D9E75", mt: 0.25 }}
          >
            {formatINR(result.perDay)} / day &nbsp;·&nbsp;{" "}
            {formatINR(result.perPerson)} / person
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "#1D9E75", opacity: 0.75, display: "block", mt: 0.5 }}
          >
            Includes 10% contingency buffer
          </Typography>
        </Box>

        {/* Breakdown bars */}
        <SectionLabel>Breakdown</SectionLabel>
        <BreakdownBar
          label="Accommodation"
          value={result.stay}
          total={result.total}
          color="#1D9E75"
          icon="🏨"
        />
        <BreakdownBar
          label="Transport"
          value={result.travel}
          total={result.total}
          color="#378ADD"
          icon="✈️"
        />
        <BreakdownBar
          label="Food"
          value={result.food}
          total={result.total}
          color="#EF9F27"
          icon="🍽️"
        />
        <BreakdownBar
          label="Activities"
          value={result.activities}
          total={result.total}
          color="#7F77DD"
          icon="🎯"
        />
        <BreakdownBar
          label="Buffer (10%)"
          value={result.buffer}
          total={result.total}
          color="#D4537E"
          icon="🛡️"
        />

        <Divider sx={{ my: 1.5 }} />

        {/* Quick range */}
        <SectionLabel>Quick range</SectionLabel>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip
            label={`Budget\n${formatINR(result.ranges.budget)}`}
            size="small"
            color="success"
            variant="outlined"
            sx={{ fontSize: 11, height: "auto", py: 0.5, whiteSpace: "pre" }}
          />
          <Chip
            label={`Standard\n${formatINR(result.ranges.standard)}`}
            size="small"
            color="info"
            variant="outlined"
            sx={{ fontSize: 11, height: "auto", py: 0.5, whiteSpace: "pre" }}
          />
          <Chip
            label={`Luxury\n${formatINR(result.ranges.luxury)}`}
            size="small"
            color="warning"
            variant="outlined"
            sx={{ fontSize: 11, height: "auto", py: 0.5, whiteSpace: "pre" }}
          />
        </Stack>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 12 }} />
          Estimates are indicative. Actual prices vary by season and
          availability.
        </Typography>

        {onSaveBudget && (
          <Button
            variant="outlined"
            color="success"
            fullWidth
            onClick={() => {
              onSaveBudget(result.total);
              onClose();
            }}
            sx={{
              mb: 1,
              textTransform: "none",
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
            }}
          >
            Apply to Trip Budget 💰
          </Button>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={onClose}
          sx={{ textTransform: "none", fontFamily: "Poppins, sans-serif" }}
        >
          Done
        </Button>
      </Box>
    </Drawer>
  );
};

export default BudgetCalculator;
