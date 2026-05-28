import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import WorkIcon from "@mui/icons-material/Work";
import ForestIcon from "@mui/icons-material/Forest";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import LuggageIcon from "@mui/icons-material/Luggage";

const CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Medicine",
  "Other",
];

const CATEGORY_COLORS = {
  Clothing: "primary",
  Toiletries: "secondary",
  Electronics: "info",
  Documents: "warning",
  Medicine: "error",
  Other: "default",
};

const TEMPLATES = [
  {
    key: "beach",
    label: "Beach Trip",
    icon: <BeachAccessIcon fontSize="small" />,
  },
  {
    key: "business",
    label: "Business Travel",
    icon: <WorkIcon fontSize="small" />,
  },
  { key: "camping", label: "Camping", icon: <ForestIcon fontSize="small" /> },
];

const PackingView = () => {
  const dispatch = useDispatch();
  const { loading, list, error } = useSelector((state) => state.packing);
  const { trips } = useSelector((state) => state.trips);

  const [selectedTripId, setSelectedTripId] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemCategory, setItemCategory] = useState("Other");
  const [filterCategory, setFilterCategory] = useState("All");
  const [confirmClear, setConfirmClear] = useState(false);

  // Auto-select the first trip if available
  useEffect(() => {
    if (trips && trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0]._id);
    }
  }, [trips, selectedTripId]);

  // Fetch packing list whenever selected trip changes
  useEffect(() => {
    if (selectedTripId) {
      dispatch(fetchPackingList(selectedTripId));
      setFilterCategory("All");
    }
  }, [dispatch, selectedTripId]);

  const handleAdd = () => {
    const trimmed = itemName.trim();
    if (!trimmed || !selectedTripId) return;
    dispatch(addPackingItem(selectedTripId, trimmed, itemCategory));
    setItemName("");
    setItemCategory("Other");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  const handleToggle = (itemId) =>
    dispatch(togglePackingItem(selectedTripId, itemId));
  const handleDelete = (itemId) =>
    dispatch(deletePackingItem(selectedTripId, itemId));
  const handleTemplate = (templateKey) =>
    dispatch(applyTemplate(selectedTripId, templateKey));
  const handleClearAll = () => {
    dispatch(clearPackingList(selectedTripId));
    setConfirmClear(false);
  };

  const items = list?.items || [];
  const total = items.length;
  const packed = items.filter((i) => i.packed).length;
  const progress = total === 0 ? 0 : Math.round((packed / total) * 100);

  const filteredItems =
    filterCategory === "All"
      ? items
      : items.filter((i) => i.category === filterCategory);

  const unpacked = filteredItems.filter((i) => !i.packed);
  const packedItems = filteredItems.filter((i) => i.packed);

  // No trips exist at all
  if (!trips || trips.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight={400}
        gap={2}
        color="text.secondary"
      >
        <LuggageIcon sx={{ fontSize: 64, opacity: 0.3 }} />
        <Typography variant="h6">No trips yet</Typography>
        <Typography variant="body2">
          Create a trip first, then come back to build your packing list.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" fontWeight={600}>
          🎒 Packing Checklist
        </Typography>
        {total > 0 && (
          <Tooltip title="Clear all items">
            <IconButton
              color="error"
              size="small"
              onClick={() => setConfirmClear(true)}
            >
              <DeleteSweepIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Trip selector */}
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <InputLabel>Select Trip</InputLabel>
        <Select
          value={selectedTripId}
          label="Select Trip"
          onChange={(e) => setSelectedTripId(e.target.value)}
        >
          {trips.map((trip) => (
            <MenuItem key={trip._id} value={trip._id}>
              {trip.name || trip.title || "Unnamed Trip"}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Loading spinner while fetching list */}
      {loading && !list && (
        <Box display="flex" justifyContent="center" py={6}>
          <CircularProgress />
        </Box>
      )}

      {selectedTripId && !loading && (
        <>
          {/* Progress bar */}
          {total > 0 && (
            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={0.5}>
                <Typography variant="body2" color="text.secondary">
                  {packed} / {total} items packed
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  color={progress === 100 ? "success.main" : "text.primary"}
                >
                  {progress}%{progress === 100 ? " ✅ All packed!" : ""}
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 8, borderRadius: 4 }}
                color={progress === 100 ? "success" : "primary"}
              />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Quick-start templates (shown only on empty list) */}
          {total === 0 && (
            <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" mb={1}>
                Quick-start with a template:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                {TEMPLATES.map((t) => (
                  <Button
                    key={t.key}
                    variant="outlined"
                    size="small"
                    startIcon={t.icon}
                    onClick={() => handleTemplate(t.key)}
                    sx={{ borderRadius: 2 }}
                  >
                    {t.label}
                  </Button>
                ))}
              </Box>
            </Paper>
          )}

          {/* Add item form */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={1.5}>
              Add a new item
            </Typography>
            <Grid container spacing={1.5} sx={{ alignItems: "center" }}>
              <Grid xs={12} sm={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Item name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Passport"
                />
              </Grid>
              <Grid xs={8} sm={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={itemCategory}
                    label="Category"
                    onChange={(e) => setItemCategory(e.target.value)}
                  >
                    {CATEGORIES.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid xs={4} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAdd}
                  disabled={!itemName.trim()}
                  sx={{ height: 40, borderRadius: 2 }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Template chips (shown when list already has items) */}
          {total > 0 && (
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              mb={2}
              flexWrap="wrap"
            >
              <Typography variant="caption" color="text.secondary">
                Add template:
              </Typography>
              {TEMPLATES.map((t) => (
                <Chip
                  key={t.key}
                  icon={t.icon}
                  label={t.label}
                  size="small"
                  variant="outlined"
                  onClick={() => handleTemplate(t.key)}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
          )}

          {/* Category filter chips */}
          {total > 0 && (
            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              {["All", ...CATEGORIES].map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  size="small"
                  color={filterCategory === cat ? "primary" : "default"}
                  variant={filterCategory === cat ? "filled" : "outlined"}
                  onClick={() => setFilterCategory(cat)}
                  sx={{ cursor: "pointer" }}
                />
              ))}
            </Box>
          )}

          {/* Empty state */}
          {filteredItems.length === 0 && total === 0 && (
            <Box textAlign="center" py={6} color="text.secondary">
              <Typography variant="h2">🧳</Typography>
              <Typography variant="body1" mt={1}>
                No items yet. Add one above or pick a template!
              </Typography>
            </Box>
          )}

          {filteredItems.length === 0 && total > 0 && (
            <Typography color="text.secondary" align="center" py={3}>
              No items in this category.
            </Typography>
          )}

          {/* Unpacked items */}
          {unpacked.map((item) => (
            <ItemRow
              key={item._id}
              item={item}
              onToggle={() => handleToggle(item._id)}
              onDelete={() => handleDelete(item._id)}
            />
          ))}

          {/* Divider between packed / unpacked */}
          {packedItems.length > 0 && unpacked.length > 0 && (
            <Divider sx={{ my: 1.5 }}>
              <Typography variant="caption" color="text.secondary">
                Packed
              </Typography>
            </Divider>
          )}

          {packedItems.map((item) => (
            <ItemRow
              key={item._id}
              item={item}
              onToggle={() => handleToggle(item._id)}
              onDelete={() => handleDelete(item._id)}
            />
          ))}
        </>
      )}

      {/* Clear all confirmation dialog */}
      <Dialog open={confirmClear} onClose={() => setConfirmClear(false)}>
        <DialogTitle>Clear packing list?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove all {total} items from this trip's
            packing list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmClear(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleClearAll}>
            Clear all
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

// ─── Sub-component: single item row ────────────────────────────────────────
const ItemRow = ({ item, onToggle, onDelete }) => (
  <Box
    display="flex"
    alignItems="center"
    sx={{
      py: 0.75,
      px: 1,
      mb: 0.5,
      borderRadius: 2,
      backgroundColor: item.packed ? "action.hover" : "background.paper",
      border: "1px solid",
      borderColor: "divider",
      transition: "background-color 0.2s",
    }}
  >
    <Checkbox
      checked={item.packed}
      onChange={onToggle}
      size="small"
      color="success"
    />
    <Typography
      variant="body2"
      sx={{
        flexGrow: 1,
        ml: 0.5,
        textDecoration: item.packed ? "line-through" : "none",
        color: item.packed ? "text.disabled" : "text.primary",
      }}
    >
      {item.name}
    </Typography>
    <Chip
      label={item.category}
      size="small"
      color={CATEGORY_COLORS[item.category] || "default"}
      variant="outlined"
      sx={{ mr: 1, fontSize: "0.7rem" }}
    />
    <Tooltip title="Remove item">
      <IconButton size="small" onClick={onDelete}>
        <DeleteOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Box>
);

export default PackingView;
