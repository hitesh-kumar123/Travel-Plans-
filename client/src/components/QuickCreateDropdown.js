import React, { useState, useEffect, useRef } from "react";
import {
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ChecklistIcon from "@mui/icons-material/Checklist";
import HotelIcon from "@mui/icons-material/Hotel";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTrip } from "../redux/actions/tripActions";
import { addExpense } from "../redux/actions/expenseActions";
/**
 * QuickCreateDropdown
 *
 * A floating Speed Dial button fixed to the bottom-right corner of the
 * Dashboard.  Clicking it expands four labelled actions:
 *   • New Trip       → opens Trip creation modal
 *   • New Expense    → opens Expense creation modal
 *   • Packing List   → navigates to the first trip's packing section
 *   • New Booking    → navigates to the Booking view
 *
 * Keyboard navigation:
 *   - Tab / Shift+Tab  move focus between action buttons
 *   - Enter / Space    activate the focused action
 *   - Escape           close the dial or the open modal
 *
 * Props:
 *   trips  {Array}  – current user trips (used to pre-populate expense trip select)
 */
const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Accommodation",
  "Activities",
  "Shopping",
  "Other",
];

const QuickCreateDropdown = ({ trips = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Speed Dial open state
  const [dialOpen, setDialOpen] = useState(false);

  // Which modal is currently open: null | 'trip' | 'expense'
  const [modal, setModal] = useState(null);

  // Snackbar feedback
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Trip form state
  const [tripForm, setTripForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    description: "",
  });

  // Expense form state
  const [expenseForm, setExpenseForm] = useState({
    tripId: "",
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Loading / error states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Ref for focus management inside modal
  const firstFieldRef = useRef(null);

  // Focus first field when modal opens
  useEffect(() => {
    if (modal && firstFieldRef.current) {
      setTimeout(() => firstFieldRef.current.focus(), 100);
    }
  }, [modal]);

  // ─── Speed Dial handlers ────────────────────────────────────────────────────

  const handleDialOpen = () => setDialOpen(true);
  const handleDialClose = () => setDialOpen(false);

  const openModal = (type) => {
    setDialOpen(false);
    setErrors({});
    setModal(type);
  };

  const closeModal = () => {
    setModal(null);
    setTripForm({
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      description: "",
    });
    setExpenseForm({
      tripId: "",
      amount: "",
      category: "Food",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setErrors({});
  };

  // ─── Keyboard handler for modal (Escape closes) ──────────────────────────

  const handleModalKeyDown = (e) => {
    if (e.key === "Escape") closeModal();
  };

  // ─── Trip form ────────────────────────────────────────────────────────────

  const validateTrip = () => {
    const errs = {};
    if (!tripForm.destination.trim())
      errs.destination = "Destination is required";
    if (!tripForm.startDate) errs.startDate = "Start date is required";
    if (!tripForm.endDate) errs.endDate = "End date is required";
    if (
      tripForm.startDate &&
      tripForm.endDate &&
      tripForm.startDate > tripForm.endDate
    )
      errs.endDate = "End date must be after start date";
    if (tripForm.budget && isNaN(Number(tripForm.budget)))
      errs.budget = "Budget must be a number";
    return errs;
  };

  const handleTripSubmit = async () => {
    const errs = validateTrip();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        addTrip({
          destination: tripForm.destination.trim(),
          startDate: tripForm.startDate,
          endDate: tripForm.endDate,
          budget: tripForm.budget ? Number(tripForm.budget) : undefined,
          description: tripForm.description.trim(),
          status: "Planned",
        }),
      );
      setSnack({
        open: true,
        message: "Trip created successfully!",
        severity: "success",
      });
      closeModal();
    } catch (err) {
      setSnack({
        open: true,
        message: err?.message || "Failed to create trip",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Expense form ─────────────────────────────────────────────────────────

  const validateExpense = () => {
    const errs = {};
    if (!expenseForm.tripId) errs.tripId = "Please select a trip";
    if (
      !expenseForm.amount ||
      isNaN(Number(expenseForm.amount)) ||
      Number(expenseForm.amount) <= 0
    )
      errs.amount = "Valid amount is required";
    if (!expenseForm.description.trim())
      errs.description = "Description is required";
    return errs;
  };

  const handleExpenseSubmit = async () => {
    const errs = validateExpense();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await dispatch(
        addExpense({
          trip: expenseForm.tripId,
          amount: Number(expenseForm.amount),
          category: expenseForm.category,
          description: expenseForm.description.trim(),
          date: expenseForm.date,
        }),
      );
      setSnack({
        open: true,
        message: "Expense added successfully!",
        severity: "success",
      });
      closeModal();
    } catch (err) {
      setSnack({
        open: true,
        message: err?.message || "Failed to add expense",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // ─── Speed Dial actions ──────────────────────────────────────────────────

  const actions = [
    {
      icon: <FlightTakeoffIcon />,
      name: "New Trip",
      key: "trip",
      action: () => openModal("trip"),
    },
    {
      icon: <AttachMoneyIcon />,
      name: "New Expense",
      key: "expense",
      action: () => openModal("expense"),
    },
    {
      icon: <ChecklistIcon />,
      name: "Packing List",
      key: "packing",
      action: () => {
        setDialOpen(false);
        if (trips.length > 0) {
          navigate(`/dashboard/trips/${trips[0]._id}?tab=packing`);
        } else {
          navigate("/dashboard/trips");
        }
      },
    },
    {
      icon: <HotelIcon />,
      name: "New Booking",
      key: "booking",
      action: () => {
        setDialOpen(false);
        navigate("/dashboard/booking");
      },
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Floating Speed Dial ── */}
      <SpeedDial
        ariaLabel="Quick Create actions"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1300,
          "& .MuiFab-primary": {
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          },
        }}
        icon={<SpeedDialIcon icon={<AddIcon />} openIcon={<CloseIcon />} />}
        open={dialOpen}
        onOpen={handleDialOpen}
        onClose={handleDialClose}
        FabProps={{
          "aria-label": dialOpen
            ? "Close quick create menu"
            : "Open quick create menu",
        }}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.key}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.action}
            FabProps={{
              "aria-label": action.name,
              tabIndex: dialOpen ? 0 : -1,
            }}
          />
        ))}
      </SpeedDial>

      {/* ── New Trip Modal ── */}
      <Dialog
        open={modal === "trip"}
        onClose={closeModal}
        onKeyDown={handleModalKeyDown}
        maxWidth="sm"
        fullWidth
        aria-labelledby="quick-trip-title"
      >
        <DialogTitle id="quick-trip-title">
          <Box display="flex" alignItems="center" gap={1}>
            <FlightTakeoffIcon color="primary" />
            <Typography variant="h6">Plan New Trip</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              inputRef={firstFieldRef}
              label="Destination *"
              value={tripForm.destination}
              onChange={(e) =>
                setTripForm({ ...tripForm, destination: e.target.value })
              }
              error={!!errors.destination}
              helperText={errors.destination}
              fullWidth
              autoComplete="off"
            />
            <Box display="flex" gap={2}>
              <TextField
                label="Start Date *"
                type="date"
                value={tripForm.startDate}
                onChange={(e) =>
                  setTripForm({ ...tripForm, startDate: e.target.value })
                }
                error={!!errors.startDate}
                helperText={errors.startDate}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End Date *"
                type="date"
                value={tripForm.endDate}
                onChange={(e) =>
                  setTripForm({ ...tripForm, endDate: e.target.value })
                }
                error={!!errors.endDate}
                helperText={errors.endDate}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
            <TextField
              label="Budget (₹)"
              type="number"
              value={tripForm.budget}
              onChange={(e) =>
                setTripForm({ ...tripForm, budget: e.target.value })
              }
              error={!!errors.budget}
              helperText={errors.budget}
              fullWidth
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Description"
              value={tripForm.description}
              onChange={(e) =>
                setTripForm({ ...tripForm, description: e.target.value })
              }
              multiline
              rows={2}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTripSubmit}
            disabled={loading}
            startIcon={<FlightTakeoffIcon />}
          >
            {loading ? "Creating…" : "Create Trip"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── New Expense Modal ── */}
      <Dialog
        open={modal === "expense"}
        onClose={closeModal}
        onKeyDown={handleModalKeyDown}
        maxWidth="sm"
        fullWidth
        aria-labelledby="quick-expense-title"
      >
        <DialogTitle id="quick-expense-title">
          <Box display="flex" alignItems="center" gap={1}>
            <AttachMoneyIcon color="primary" />
            <Typography variant="h6">Add Expense</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Box display="flex" flexDirection="column" gap={2} pt={1}>
            <TextField
              inputRef={firstFieldRef}
              select
              label="Trip *"
              value={expenseForm.tripId}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, tripId: e.target.value })
              }
              error={!!errors.tripId}
              helperText={
                errors.tripId ||
                (trips.length === 0 ? "No trips found — create one first" : "")
              }
              fullWidth
              disabled={trips.length === 0}
            >
              {trips.map((t) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.destination}
                </MenuItem>
              ))}
            </TextField>

            <Box display="flex" gap={2}>
              <TextField
                label="Amount (₹) *"
                type="number"
                value={expenseForm.amount}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, amount: e.target.value })
                }
                error={!!errors.amount}
                helperText={errors.amount}
                fullWidth
                inputProps={{ min: 0.01, step: "0.01" }}
              />
              <TextField
                select
                label="Category"
                value={expenseForm.category}
                onChange={(e) =>
                  setExpenseForm({ ...expenseForm, category: e.target.value })
                }
                fullWidth
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Description *"
              value={expenseForm.description}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, description: e.target.value })
              }
              error={!!errors.description}
              helperText={errors.description}
              fullWidth
            />

            <TextField
              label="Date"
              type="date"
              value={expenseForm.date}
              onChange={(e) =>
                setExpenseForm({ ...expenseForm, date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeModal} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleExpenseSubmit}
            disabled={loading || trips.length === 0}
            startIcon={<AttachMoneyIcon />}
          >
            {loading ? "Adding…" : "Add Expense"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Success / Error Snackbar ── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuickCreateDropdown;
