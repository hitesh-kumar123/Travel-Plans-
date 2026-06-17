import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPackingList,
  addPackingItem,
  togglePackingItem,
  deletePackingItem,
  applyTemplate,
  clearPackingList,
} from "../../redux/actions/packingActions";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Checkbox,
  Chip,
  LinearProgress,
  CircularProgress,
  Tooltip,
  Divider,
  Paper,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Grid,
  Zoom,
  Fade,
  Collapse,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import WorkIcon from "@mui/icons-material/Work";
import ForestIcon from "@mui/icons-material/Forest";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import LuggageIcon from "@mui/icons-material/Luggage";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import SpaIcon from "@mui/icons-material/Spa";
import DevicesIcon from "@mui/icons-material/Devices";
import ArticleIcon from "@mui/icons-material/Article";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShowMoreList from "../../components/ShowMoreList";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Medicine",
  "Other",
];

const CATEGORY_META = {
  Clothing: {
    color: "#6366f1",
    bg: "#eef2ff",
    icon: <CheckroomIcon fontSize="small" />,
    muiColor: "primary",
  },
  Toiletries: {
    color: "#ec4899",
    bg: "#fdf2f8",
    icon: <SpaIcon fontSize="small" />,
    muiColor: "secondary",
  },
  Electronics: {
    color: "#0ea5e9",
    bg: "#f0f9ff",
    icon: <DevicesIcon fontSize="small" />,
    muiColor: "info",
  },
  Documents: {
    color: "#f59e0b",
    bg: "#fffbeb",
    icon: <ArticleIcon fontSize="small" />,
    muiColor: "warning",
  },
  Medicine: {
    color: "#ef4444",
    bg: "#fef2f2",
    icon: <MedicalServicesIcon fontSize="small" />,
    muiColor: "error",
  },
  Other: {
    color: "#64748b",
    bg: "#f8fafc",
    icon: <CategoryIcon fontSize="small" />,
    muiColor: "default",
  },
};

const TEMPLATES = [
  {
    key: "beach",
    label: "Beach Trip",
    icon: <BeachAccessIcon />,
    color: "#0ea5e9",
    bg: "linear-gradient(135deg, #bae6fd 0%, #e0f2fe 100%)",
    desc: "Sunscreen, swimwear & more",
  },
  {
    key: "business",
    label: "Business",
    icon: <WorkIcon />,
    color: "#6366f1",
    bg: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
    desc: "Suits, laptop & documents",
  },
  {
    key: "camping",
    label: "Camping",
    icon: <ForestIcon />,
    color: "#22c55e",
    bg: "linear-gradient(135deg, #dcfce7 0%, #d1fae5 100%)",
    desc: "Tent, boots & gear",
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────

const PackingView = () => {
  const dispatch = useDispatch();
  const { loading, list, error } = useSelector((state) => state.packing);
  const { trips } = useSelector((state) => state.trips);

  const [selectedTripId, setSelectedTripId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Other");
  const [filterCategory, setFilterCategory] = useState("All");
  const [confirmClear, setConfirmClear] = useState(false);
  const [showPacked, setShowPacked] = useState(true);
  const [newlyAdded, setNewlyAdded] = useState(null);

  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0]._id);
    }
  }, [trips, selectedTripId]);

  useEffect(() => {
    if (selectedTripId) {
      dispatch(fetchPackingList(selectedTripId));
      setFilterCategory("All");
    }
  }, [dispatch, selectedTripId]);

  const handleAdd = useCallback(() => {
    const trimmed = itemName.trim();
    if (!trimmed || !selectedTripId) return;
    dispatch(addPackingItem(selectedTripId, trimmed, itemCategory));
    setNewlyAdded(trimmed);
    setItemName("");
    setItemCategory("Other");
    setTimeout(() => setNewlyAdded(null), 1500);
  }, [dispatch, selectedTripId, itemName, itemCategory]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleToggle = (id) => dispatch(togglePackingItem(selectedTripId, id));
  const handleDelete = (id) => dispatch(deletePackingItem(selectedTripId, id));
  const handleTemplate = (key) => dispatch(applyTemplate(selectedTripId, key));
  const handleClearAll = () => {
    dispatch(clearPackingList(selectedTripId));
    setConfirmClear(false);
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  const items = list?.items || [];
  const total = items.length;
  const packed = items.filter((i) => i.packed).length;
  const remaining = total - packed;
  const progress = total === 0 ? 0 : Math.round((packed / total) * 100);
  const allDone = total > 0 && progress === 100;

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = items.filter((i) => i.category === cat).length;
    return acc;
  }, {});

  const filteredItems =
    filterCategory === "All"
      ? items
      : items.filter((i) => i.category === filterCategory);
  const unpacked = filteredItems.filter((i) => !i.packed);
  const packedItems = filteredItems.filter((i) => i.packed);

  const selectedTrip = trips?.find((t) => t._id === selectedTripId);
  const tripName =
    selectedTrip?.name ||
    selectedTrip?.destination ||
    selectedTrip?.title ||
    "Your Trip";

  // ── Empty trips guard ──────────────────────────────────────────────────────
  if (!trips || trips.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={460}
        gap={2}
        sx={{ textAlign: "center", px: 3 }}
      >
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <LuggageIcon sx={{ fontSize: 56, color: "#6366f1" }} />
        </Box>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          No active trips found
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 360 }}
        >
          Create your first trip inside the planner board, then come back to
          build your packing checklist here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 780, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              flexShrink: 0,
              background: "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <LuggageIcon sx={{ color: "#fff", fontSize: 24 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{ letterSpacing: "-0.01em", lineHeight: 1.2 }}
            >
              Packing Checklist
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ lineHeight: 1.3 }}
            >
              Track what you're bringing for your journey.
            </Typography>
          </Box>
        </Box>

        {total > 0 && (
          <Tooltip title="Clear entire list" TransitionComponent={Zoom}>
            <IconButton
              color="error"
              size="small"
              onClick={() => setConfirmClear(true)}
              sx={{
                border: "1px solid",
                borderColor: "error.light",
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "#fff",
                  borderColor: "error.main",
                },
              }}
            >
              <DeleteSweepIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* ── Trip Selector ────────────────────────────────────────────────────── */}
      <FormControl fullWidth size="medium" sx={{ mb: 4 }}>
        <InputLabel id="trip-select-label">Active Travel Plan</InputLabel>
        <Select
          labelId="trip-select-label"
          value={selectedTripId}
          label="Active Travel Plan"
          onChange={(e) => setSelectedTripId(e.target.value)}
          sx={{ borderRadius: 3 }}
        >
          {trips.map((trip) => (
            <MenuItem key={trip._id} value={trip._id} sx={{ py: 1.5 }}>
              {trip.name || trip.destination || trip.title || "Unnamed Trip"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ── Loading ──────────────────────────────────────────────────────────── */}
      {loading && !list && (
        <Box display="flex" justifyContent="center" alignItems="center" py={10}>
          <CircularProgress thickness={4} size={48} sx={{ color: "#6366f1" }} />
        </Box>
      )}

      {selectedTripId && !loading && (
        <>
          {/* ── Error ──────────────────────────────────────────────────────── */}
          {error && (
            <Alert
              severity="error"
              variant="outlined"
              sx={{ mb: 3, borderRadius: 3 }}
            >
              {error}
            </Alert>
          )}

          {/* ── Progress Card ───────────────────────────────────────────────── */}
          {total > 0 && (
            <Fade in>
              <Paper
                elevation={0}
                sx={{
                  mb: 4,
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: allDone ? "success.light" : "divider",
                  background: allDone
                    ? "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)"
                    : "linear-gradient(135deg, #fafafa 0%, #f1f5f9 100%)",
                  transition: "all 0.4s ease",
                }}
              >
                {/* Top accent bar */}
                <Box
                  sx={{
                    height: 4,
                    background: allDone
                      ? "linear-gradient(90deg, #22c55e, #4ade80)"
                      : `linear-gradient(90deg, #6366f1 ${progress}%, #e2e8f0 ${progress}%)`,
                    transition: "background 0.6s ease",
                  }}
                />

                <Box sx={{ p: 2.5 }}>
                  {/* Title + % chip row */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {allDone ? (
                        <EmojiEventsIcon
                          sx={{ color: "#22c55e", fontSize: 22 }}
                        />
                      ) : (
                        <LuggageIcon sx={{ color: "#6366f1", fontSize: 22 }} />
                      )}
                      <Typography
                        variant="subtitle1"
                        fontWeight={700}
                        color={allDone ? "success.dark" : "text.primary"}
                      >
                        {allDone ? "All packed! Ready to go!" : tripName}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${progress}%`}
                      size="small"
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.8rem",
                        borderRadius: 2,
                        backgroundColor: allDone ? "#22c55e" : "#6366f1",
                        color: "#fff",
                        flexShrink: 0,
                      }}
                    />
                  </Box>

                  {/* Stat counters — 3 boxes side by side */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 2,
                      mb: 2.5,
                    }}
                  >
                    {[
                      { label: "Total", value: total, color: "#64748b" },
                      { label: "Packed", value: packed, color: "#22c55e" },
                      {
                        label: "Remaining",
                        value: remaining,
                        color: remaining > 0 ? "#f59e0b" : "#22c55e",
                      },
                    ].map((s) => (
                      <Box
                        key={s.label}
                        sx={{
                          flex: 1,
                          textAlign: "center",
                          py: 1.5,
                          px: 1,
                          borderRadius: 2.5,
                          backgroundColor: "rgba(255,255,255,0.7)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        <Typography
                          variant="h5"
                          fontWeight={800}
                          sx={{ color: s.color, lineHeight: 1.1 }}
                        >
                          {s.value}
                        </Typography>
                        <Typography
                          component="div"
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                          sx={{
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            display: "block",
                          }}
                        >
                          {s.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  {/* Progress bar */}
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 0.75,
                      }}
                    >
                      <Typography
                        component="span"
                        variant="caption"
                        fontWeight={600}
                        color="text.secondary"
                      >
                        {packed} of {total} items packed
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        fontWeight={700}
                        color={allDone ? "success.main" : "primary.main"}
                      >
                        {progress}% complete
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 10,
                        borderRadius: 99,
                        backgroundColor: "rgba(0,0,0,0.07)",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 99,
                          background: allDone
                            ? "linear-gradient(90deg, #22c55e, #4ade80)"
                            : "linear-gradient(90deg, #6366f1, #818cf8)",
                          transition:
                            "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Paper>
            </Fade>
          )}

          {/* ── Empty-state Quick-Start Templates ──────────────────────────── */}
          {total === 0 && (
            <Fade in>
              <Paper
                variant="outlined"
                sx={{
                  p: 3.5,
                  mb: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  borderStyle: "dashed",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    mx: "auto",
                    mb: 1.5,
                    background:
                      "linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <LuggageIcon sx={{ fontSize: 32, color: "#6366f1" }} />
                </Box>
                <Typography variant="h6" fontWeight={700} mb={0.5}>
                  Your checklist is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Add items manually below, or kick-start with a preset template
                  for your trip style:
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                  {TEMPLATES.map((t) => (
                    <Grid item xs={12} sm={4} key={t.key}>
                      <Paper
                        elevation={0}
                        onClick={() => handleTemplate(t.key)}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          cursor: "pointer",
                          background: t.bg,
                          border: "1px solid transparent",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-3px)",
                            boxShadow: `0 8px 24px ${t.color}30`,
                            borderColor: t.color + "40",
                          },
                        }}
                      >
                        <Box
                          sx={{
                            color: t.color,
                            mb: 0.75,
                            "& svg": { fontSize: 28 },
                          }}
                        >
                          {t.icon}
                        </Box>
                        <Typography
                          variant="subtitle2"
                          fontWeight={700}
                          color="text.primary"
                        >
                          {t.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {t.desc}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Fade>
          )}

          {/* ── Add Item Form ────────────────────────────────────────────────── */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mb: 4,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "divider",
              background: "#fff",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <AddIcon sx={{ fontSize: 18, color: "#6366f1" }} />
              <Typography
                variant="subtitle2"
                fontWeight={700}
                color="text.primary"
              >
                Add New Item
              </Typography>
            </Box>
            <Grid container spacing={1.5} alignItems="stretch">
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="medium"
                  label="Item name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g., Passport, Charger..."
                  InputProps={{ sx: { borderRadius: 3 } }}
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="medium">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={itemCategory}
                    label="Category"
                    onChange={(e) => setItemCategory(e.target.value)}
                    sx={{ borderRadius: 3 }}
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              color: CATEGORY_META[c]?.color,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {CATEGORY_META[c]?.icon}
                          </Box>
                          {c}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  disabled={!itemName.trim()}
                  sx={{
                    height: 56,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #818cf8 100%)",
                    boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
                    "&:hover": {
                      boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
                      transform: "translateY(-1px)",
                    },
                    "&:disabled": {
                      background: "#e2e8f0",
                      color: "#94a3b8",
                      boxShadow: "none",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  Add Item
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* ── Category Filter Chips ────────────────────────────────────────── */}
          {total > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.disabled"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  mb: 1.5,
                }}
              >
                Filter by category
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip
                  label={`All (${total})`}
                  clickable
                  onClick={() => setFilterCategory("All")}
                  sx={{
                    fontWeight: 700,
                    borderRadius: 2,
                    backgroundColor:
                      filterCategory === "All" ? "#6366f1" : "transparent",
                    color: filterCategory === "All" ? "#fff" : "text.secondary",
                    border: "1.5px solid",
                    borderColor:
                      filterCategory === "All" ? "#6366f1" : "divider",
                    transition: "all 0.2s",
                  }}
                />
                {CATEGORIES.map((cat) => {
                  if (categoryCounts[cat] === 0) return null;
                  const meta = CATEGORY_META[cat];
                  const active = filterCategory === cat;
                  return (
                    <Chip
                      key={cat}
                      label={`${cat} (${categoryCounts[cat]})`}
                      clickable
                      onClick={() => setFilterCategory(cat)}
                      sx={{
                        fontWeight: 700,
                        borderRadius: 2,
                        backgroundColor: active ? meta.color : "transparent",
                        color: active ? "#fff" : "text.secondary",
                        border: "1.5px solid",
                        borderColor: active ? meta.color : "divider",
                        transition: "all 0.2s",
                        "&:hover": {
                          backgroundColor: active ? meta.color : meta.bg,
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>
          )}

          {/* ── Item List ────────────────────────────────────────────────────── */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {/* Unpacked items */}
            <ShowMoreList
              items={unpacked}
              initialCount={3}
              itemLabel="Items"
              renderItem={(item) => (
                <Fade in key={item._id}>
                  <Box>
                    <ItemRow
                      item={item}
                      isNew={newlyAdded === item.name}
                      onToggle={() => handleToggle(item._id)}
                      onDelete={() => handleDelete(item._id)}
                    />
                  </Box>
                </Fade>
              )}
            />

            {/* Packed section divider + toggle */}
            {packedItems.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 1,
                    mb: 0.5,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setShowPacked((v) => !v)}
                >
                  <Divider sx={{ flex: 1 }} />
                  <Chip
                    label={`${packedItems.length} packed`}
                    size="small"
                    icon={showPacked ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    onClick={() => setShowPacked((v) => !v)}
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      fontSize: "0.72rem",
                      backgroundColor: "#f0fdf4",
                      color: "#16a34a",
                      border: "1px solid #bbf7d0",
                      "& .MuiChip-icon": { color: "#16a34a" },
                      cursor: "pointer",
                    }}
                  />
                  <Divider sx={{ flex: 1 }} />
                </Box>

                <Collapse in={showPacked}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {packedItems.map((item) => (
                      <Fade in key={item._id}>
                        <Box sx={{ opacity: 0.7 }}>
                          <ItemRow
                            item={item}
                            onToggle={() => handleToggle(item._id)}
                            onDelete={() => handleDelete(item._id)}
                          />
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </Collapse>
              </>
            )}

            {/* Empty filter state */}
            {filteredItems.length === 0 && total > 0 && (
              <Typography
                color="text.secondary"
                align="center"
                py={4}
                variant="body2"
              >
                No items in the <strong>{filterCategory}</strong> category yet.
              </Typography>
            )}
          </Box>

          {/* ── Bottom Template Injectors ────────────────────────────────────── */}
          {total > 0 && (
            <Box
              mt={4}
              pt={2.5}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                borderTop: "1px dashed",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.disabled"
                sx={{ textTransform: "uppercase", letterSpacing: "0.07em" }}
              >
                Add preset pack:
              </Typography>
              {TEMPLATES.map((t) => (
                <Chip
                  key={t.key}
                  icon={
                    <Box
                      sx={{
                        display: "flex",
                        color: t.color,
                        ml: "8px !important",
                      }}
                    >
                      {t.icon}
                    </Box>
                  }
                  label={t.label}
                  size="small"
                  onClick={() => handleTemplate(t.key)}
                  sx={{
                    fontWeight: 600,
                    borderRadius: 2,
                    py: 1.5,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: t.color + "50",
                    backgroundColor: t.color + "10",
                    color: t.color,
                    "&:hover": {
                      backgroundColor: t.color + "20",
                      borderColor: t.color,
                    },
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Box>
          )}
        </>
      )}

      {/* ── Confirm Clear Dialog ─────────────────────────────────────────────── */}
      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1, maxWidth: 380 } }}
      >
        <DialogTitle fontWeight={700} sx={{ pb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteSweepIcon color="error" />
            Clear packing list?
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2">
            This will permanently remove all <strong>{total} items</strong> from
            your checklist for this trip. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 2, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setConfirmClear(false)}
            variant="outlined"
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              flex: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleClearAll}
            sx={{
              borderRadius: 2.5,
              textTransform: "none",
              fontWeight: 600,
              boxShadow: "none",
              flex: 1,
            }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ─── ItemRow Sub-component ─────────────────────────────────────────────────────

const ItemRow = ({ item, onToggle, onDelete, isNew }) => {
  const meta = CATEGORY_META[item.category] || CATEGORY_META["Other"];

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1,
        pl: 0.5,
        pr: 1.5,
        borderRadius: 2.5,
        backgroundColor: item.packed ? "#f8fafc" : "#fff",
        border: "1px solid",
        borderColor: item.packed ? "#f1f5f9" : "divider",
        borderLeft: `3px solid ${item.packed ? "#e2e8f0" : meta.color}`,
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        outline: isNew ? `2px solid ${meta.color}40` : "none",
        outlineOffset: 2,
        "&:hover": {
          boxShadow: item.packed ? "none" : "0 2px 12px rgba(0,0,0,0.07)",
          borderColor: item.packed ? "#f1f5f9" : meta.color + "60",
        },
      }}
    >
      {/* Checkbox */}
      <Checkbox
        checked={item.packed}
        onChange={onToggle}
        size="medium"
        icon={<RadioButtonUncheckedIcon sx={{ color: "#cbd5e1" }} />}
        checkedIcon={<CheckCircleIcon sx={{ color: "#22c55e" }} />}
        sx={{ p: 1.25, ml: 0.25, mr: 0.5, flexShrink: 0 }}
      />

      {/* Item name */}
      <Typography
        variant="body2"
        fontWeight={item.packed ? 400 : 600}
        sx={{
          flexGrow: 1,
          textDecoration: item.packed ? "line-through" : "none",
          color: item.packed ? "text.disabled" : "text.primary",
          transition: "all 0.25s ease",
        }}
      >
        {item.name}
      </Typography>

      {/* Category badge */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: 1.25,
          py: 0.4,
          mr: 1,
          borderRadius: 99,
          backgroundColor: item.packed ? "transparent" : meta.bg,
          color: item.packed ? "text.disabled" : meta.color,
          border: "1px solid",
          borderColor: item.packed ? "transparent" : meta.color + "40",
          opacity: item.packed ? 0.5 : 1,
          transition: "all 0.25s ease",
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: "flex", "& svg": { fontSize: 13 } }}>
          {meta.icon}
        </Box>
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ fontSize: "0.67rem", lineHeight: 1 }}
        >
          {item.category}
        </Typography>
      </Box>

      {/* Delete button */}
      <Tooltip title="Remove item" placement="top" TransitionComponent={Zoom}>
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            color: "text.disabled",
            flexShrink: 0,
            "&:hover": { color: "#ef4444", backgroundColor: "#fef2f2" },
            transition: "all 0.2s ease",
          }}
        >
          <DeleteOutlineIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Paper>
  );
};

export default PackingView;
