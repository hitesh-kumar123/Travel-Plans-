import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Fade,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import DownloadIcon from "@mui/icons-material/Download";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  fetchCurrencyRates,
} from "../../redux/actions/expenseActions";
import { getTrips } from "../../redux/actions/tripActions";
import PrimaryButton from "../../components/PrimaryButton";
import * as XLSX from "xlsx";
import Menu from "@mui/material/Menu";

const EXPENSE_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Food",
  "Activities",
  "Shopping",
  "Other",
];

const CATEGORY_COLORS = {
  Accommodation: "#3f51b5",
  Transportation: "#00bcd4",
  Food: "#4caf50",
  Activities: "#ed8936",
  Shopping: "#ff6e40",
  Other: "#f56565",
};

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "JPY", "AED", "SGD", "AUD"];

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AED: "د.إ",
  SGD: "S$",
  AUD: "A$",
};

const ExpensesView = () => {
  const dispatch = useDispatch();

  const { expenses, loading, exchangeRates, baseCurrency, ratesLoading } =
    useSelector((state) => state.expenses);
  const { trips } = useSelector((state) => state.trips);

  const [activeTripId, setActiveTripId] = useState("");
  const [open, setOpen] = useState(false);
  const [amountError, setAmountError] = useState("");

  const [exportAnchorEl, setExportAnchorEl] = useState(null);

  const handleExportMenuOpen = (event) => {
    setExportAnchorEl(event.currentTarget);
  };

  const handleExportMenuClose = () => {
    setExportAnchorEl(null);
  };
  const [selectedBase, setSelectedBase] = useState("INR");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
    currency: "INR",
  });

  useEffect(() => {
    dispatch(getTrips());
  }, [dispatch]);

  useEffect(() => {
    if (trips && trips.length > 0 && !activeTripId) {
      setActiveTripId(trips[0]._id);
    }
  }, [trips, activeTripId]);

  useEffect(() => {
    if (activeTripId) {
      dispatch(getExpenses(activeTripId));
      dispatch(getExpenseSummary(activeTripId));
    }
  }, [dispatch, activeTripId]);

  useEffect(() => {
    dispatch(fetchCurrencyRates(selectedBase));
  }, [dispatch, selectedBase]);

  const toBase = (amount, currency) => {
    if (currency === baseCurrency) return amount;
    if (!exchangeRates || Object.keys(exchangeRates).length === 0)
      return amount;

    let amountInINR;
    if (currency === "INR") {
      amountInINR = amount;
    } else {
      const rateToINR = exchangeRates[currency];
      if (!rateToINR) return amount;
      amountInINR = amount / rateToINR;
    }

    if (baseCurrency === "INR") return amountInINR.toFixed(2);
    const rateToBase = exchangeRates[baseCurrency];
    if (!rateToBase) return amount;
    return (amountInINR * rateToBase).toFixed(2);
  };

  const currencySymbol = CURRENCY_SYMBOLS[baseCurrency] || baseCurrency;

  const totalSpent = expenses
    ? expenses.reduce(
        (acc, e) => acc + parseFloat(toBase(e.amount, e.currency)),
        0,
      )
    : 0;

  const activeTrip = trips?.find((t) => t._id === activeTripId);

  const rawBudget = activeTrip?.budget || 0;
  const budget = rawBudget > 0 ? parseFloat(toBase(rawBudget, "INR")) : 0;

  const remaining = budget > 0 ? budget - totalSpent : null;

  const filteredExpenses = expenses
    ? expenses.filter((e) => {
        const matchesSearch = (e.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCategory =
          filterCategory === "All" || e.category === filterCategory;
        return matchesSearch && matchesCategory;
      })
    : [];

  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) +
      parseFloat(toBase(e.amount, e.currency));
  });

  const chartData = Object.keys(categoryTotals).map((cat) => ({
    name: cat,
    value: categoryTotals[cat],
    color: CATEGORY_COLORS[cat] || "#9e9e9e",
  }));

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, amount: value });
    if (value === "") {
      setAmountError("");
    } else if (parseFloat(value) < 0) {
      setAmountError("Amount must be a positive number.");
    } else if (parseFloat(value) === 0) {
      setAmountError("Amount must be greater than zero.");
    } else {
      setAmountError("");
    }
  };

  const handleEditClick = (expense) => {
    setEditingExpenseId(expense._id);
    setForm({
      amount: expense.amount.toString(),
      category: expense.category,
      description: expense.description || "",
      date: expense.date
        ? new Date(expense.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      currency: expense.currency || "INR",
    });
    setOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(form.amount);

    if (!form.amount || isNaN(parsed) || parsed <= 0) {
      setAmountError("Please enter a valid amount greater than zero.");
      return;
    }
    if (!activeTripId) return;

    if (editingExpenseId) {
      dispatch(
        updateExpense(editingExpenseId, {
          ...form,
          amount: parsed,
        }),
      );
    } else {
      dispatch(
        addExpense({
          ...form,
          trip: activeTripId,
          amount: parsed,
        }),
      );
    }
    setOpen(false);
    setForm({
      amount: "",
      category: "Food",
      description: "",
      date: new Date().toISOString().split("T")[0],
      currency: "INR",
    });
    setEditingExpenseId(null);
    setAmountError("");
    setTimeout(() => {
      dispatch(getExpenses(activeTripId));
      dispatch(getExpenseSummary(activeTripId));
    }, 300);
  };

  const handleClose = () => {
    setOpen(false);
    setAmountError("");
    setForm({
      amount: "",
      category: "Food",
      description: "",
      date: new Date().toISOString().split("T")[0],
      currency: "INR",
    });
    setEditingExpenseId(null);
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    dispatch(deleteExpense(deleteTarget));
    setDeleteTarget(null);
    setTimeout(() => {
      dispatch(getExpenses(activeTripId));
      dispatch(getExpenseSummary(activeTripId));
    }, 300);
  };

  const cancelDelete = () => {
    setDeleteTarget(null);
  };

  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }
    const headers = ["Date", "Category", "Description", "Amount", "Currency"];
    const rows = expenses.map((e) => [
      new Date(e.date).toLocaleDateString(),
      e.category,
      e.description || "",
      e.amount,
      e.currency,
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${activeTrip?.destination || "trip"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    if (!expenses || expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }

    const data = expenses.map((e) => ({
      Date: new Date(e.date).toLocaleDateString(),
      Category: e.category,
      Description: e.description || "",
      Amount: e.amount,
      Currency: e.currency,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(
      workbook,
      `expenses_${activeTrip?.destination || "trip"}.xlsx`,
    );

    handleExportMenuClose();
  };

  const dialogAmount = parseFloat(form.amount) || 0;
  const isOverBudgetDialog = budget > 0 && totalSpent + dialogAmount > budget;
  const overBudgetBy = totalSpent + dialogAmount - budget;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto", width: "100%" }}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
              }}
            >
              <WalletIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography
              sx={{
                fontSize: { xs: "1.35rem", md: "1.6rem" },
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.3px",
              }}
            >
              Expense Tracker
            </Typography>
          </Box>
          <Typography
            sx={{ mt: 0.5, color: "#64748b", fontWeight: 500, fontSize: 14, pl: "50px" }}
          >
            Visualize and manage your travel finances in real-time
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
          {/* Currency inline selector */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              background: "#f8fafc",
              border: "1.5px solid #e2e8f0",
              borderRadius: "10px",
              px: 1.5,
              py: 0.6,
            }}
          >
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", whiteSpace: "nowrap" }}>
              Display in
            </Typography>
            <TextField
              select
              size="small"
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              disabled={ratesLoading}
              variant="standard"
              sx={{
                width: 85,
                "& .MuiInput-underline:before": { display: "none" },
                "& .MuiInput-underline:after": { display: "none" },
                "& .MuiSelect-select": {
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#3b82f6",
                  py: 0,
                },
              }}
            >
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {CURRENCY_SYMBOLS[c]} {c}
                </MenuItem>
              ))}
            </TextField>
            {ratesLoading && (
              <CircularProgress size={13} thickness={5} sx={{ color: "#3b82f6" }} />
            )}
          </Box>

          {/* Export */}
          <Tooltip title="Export Expenses">
            <Box component="span" sx={{ display: "inline-flex" }}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon sx={{ fontSize: 15 }} />}
                onClick={handleExportMenuOpen}
                disabled={!activeTripId || !expenses || expenses.length === 0}
                sx={{
                  borderRadius: "10px",
                  border: "1.5px solid #e2e8f0",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: 13,
                  py: 0.75,
                  px: 2,
                  "&:hover": { borderColor: "#3b82f6", color: "#3b82f6", background: "#eff6ff" },
                }}
              >
                Export
              </Button>
              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={handleExportMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: "12px",
                    border: "1.5px solid #e2e8f0",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    mt: 0.5,
                  },
                }}
              >
                <MenuItem
                  onClick={() => { handleExportCSV(); handleExportMenuClose(); }}
                  sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}
                >
                  Export CSV
                </MenuItem>
                <MenuItem
                  onClick={handleExportExcel}
                  sx={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}
                >
                  Export Excel (.xlsx)
                </MenuItem>
              </Menu>
            </Box>
          </Tooltip>

          {/* Add Expense */}
          <PrimaryButton
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={!activeTripId}
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: 13,
              px: 2.5,
              py: 0.9,
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                boxShadow: "0 6px 20px rgba(59,130,246,0.4)",
              },
            }}
          >
            Add Expense
          </PrimaryButton>
        </Box>
      </Box>

      {/* ── Trip Selector ───────────────────────────────────────────────────── */}
      {trips && trips.length > 0 && (
        <Box
          sx={{
            background: "white",
            borderRadius: "14px",
            border: "1.5px solid #e2e8f0",
            p: 2.5,
            mb: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  mb: 0.75,
                }}
              >
                ✈️ Active Trip
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                value={activeTripId}
                onChange={(e) => setActiveTripId(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#0f172a",
                    "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                    "&:hover fieldset": { borderColor: "#3b82f6" },
                    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                  },
                }}
              >
                {trips.map((t) => (
                  <MenuItem key={t._id} value={t._id} sx={{ fontSize: 14, fontWeight: 600 }}>
                    🌍 {t.destination} (
                    {new Date(t.startDate).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })}
                    )
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {activeTrip && (
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 3,
                    flexWrap: "wrap",
                    alignItems: "center",
                    pl: { md: 2 },
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Schedule
                    </Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#0f172a", mt: 0.25 }}>
                      {new Date(activeTrip.startDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                      {" – "}
                      {new Date(activeTrip.endDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        mb: 0.5,
                      }}
                    >
                      Status
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-block",
                        px: 1.5,
                        py: 0.3,
                        borderRadius: "20px",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        color: "white",
                        background:
                          activeTrip.status === "completed"
                            ? "#22c55e"
                            : activeTrip.status === "ongoing"
                              ? "#3b82f6"
                              : "#f59e0b",
                      }}
                    >
                      {activeTrip.status.toUpperCase()}
                    </Box>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* ── Summary Cards ───────────────────────────────────────────────────── */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Total Spent */}
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
              borderRadius: "14px",
              p: 2.5,
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 8px 24px rgba(59,130,246,0.25)",
              height: "100%",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -30,
                right: -30,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                bottom: -20,
                right: 20,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.07)",
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <WalletIcon sx={{ color: "white", fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Total Spent
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 800, color: "white", letterSpacing: "-0.5px" }}>
              {currencySymbol}
              {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.6)", mt: 1 }}>
              Aggregated across all categories
            </Typography>
          </Box>
        </Grid>

        {/* Budget */}
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              background: "white",
              borderRadius: "14px",
              p: 2.5,
              border: "1.5px solid #dcfce7",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "10px",
                background: "#dcfce7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 1.5,
              }}
            >
              <WalletIcon sx={{ color: "#16a34a", fontSize: 20 }} />
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b", mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Budget
            </Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 800, color: "#16a34a", letterSpacing: "-0.5px" }}>
              {budget > 0
                ? `${currencySymbol}${budget.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "#94a3b8", mt: 1 }}>
              {budget > 0 ? "Target maximum limit" : "No budget configured yet"}
            </Typography>
          </Box>
        </Grid>

        {/* Balance */}
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              background: "white",
              borderRadius: "14px",
              p: 2.5,
              border: `1.5px solid ${remaining !== null && remaining < 0 ? "#fecaca" : "#bfdbfe"}`,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              height: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                mb: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: remaining !== null && remaining < 0 ? "#fee2e2" : "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {remaining !== null && remaining < 0 ? (
                  <ErrorIcon sx={{ color: "#ef4444", fontSize: 20 }} />
                ) : (
                  <InfoIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
                )}
              </Box>
              {remaining !== null && remaining < 0 && (
                <Box
                  sx={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "white",
                    background: "#ef4444",
                    px: 1,
                    py: 0.3,
                    borderRadius: "6px",
                    letterSpacing: 0.5,
                  }}
                >
                  OVER BUDGET
                </Box>
              )}
            </Box>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#64748b", mb: 0.5, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Balance Remaining
            </Typography>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 800,
                color: remaining !== null && remaining < 0 ? "#ef4444" : "#3b82f6",
                letterSpacing: "-0.5px",
              }}
            >
              {remaining !== null
                ? `${currencySymbol}${remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: remaining !== null && remaining < 0 ? "#ef4444" : "#94a3b8",
                fontWeight: remaining !== null && remaining < 0 ? 600 : 400,
                mt: 1,
              }}
            >
              {remaining !== null && remaining < 0
                ? "⚠️ Budget limit exceeded!"
                : remaining !== null
                  ? "Safe zone — within budget"
                  : "Awaiting trip budget setup"}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* ── Main Area ───────────────────────────────────────────────────────── */}
      <Grid container spacing={3} justifyContent="center">

        {/* Ledger Records */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              background: "white",
              borderRadius: "14px",
              border: "1.5px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            {/* Header row */}
            <Box
              sx={{
                px: 3,
                py: 2,
                borderBottom: "1.5px solid #f1f5f9",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}>
                💳 Ledger Records
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                {/* Search */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    background: "#f8fafc",
                    border: "1.5px solid #e2e8f0",
                    borderRadius: "10px",
                    px: 1.25,
                    py: 0.5,
                    "&:focus-within": { borderColor: "#3b82f6" },
                  }}
                >
                  <SearchIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
                  <input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      fontSize: 13,
                      color: "#0f172a",
                      fontFamily: "Poppins, Roboto, sans-serif",
                      width: 120,
                    }}
                  />
                </Box>
                {/* Category dropdown */}
                <TextField
                  select
                  size="small"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  variant="outlined"
                  sx={{
                    width: 140,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      fontSize: 13,
                      fontWeight: 600,
                      "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                      "&:hover fieldset": { borderColor: "#3b82f6" },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FilterListIcon sx={{ color: "#94a3b8", fontSize: 15 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                >
                  <MenuItem value="All" sx={{ fontSize: 13, fontWeight: 600 }}>All Categories</MenuItem>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c} sx={{ fontSize: 13, fontWeight: 600 }}>{c}</MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Category pill filters */}
            <Box
              sx={{
                px: 3,
                py: 1.5,
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                gap: 0.75,
                flexWrap: "wrap",
              }}
            >
              {["All", ...EXPENSE_CATEGORIES].map((cat) => (
                <Box
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  sx={{
                    px: 1.5,
                    py: 0.35,
                    borderRadius: "20px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1.5px solid",
                    transition: "all 0.15s ease",
                    userSelect: "none",
                    borderColor: filterCategory === cat ? "transparent" : "#e2e8f0",
                    background: filterCategory === cat ? "#0f172a" : "white",
                    color: filterCategory === cat ? "white" : "#64748b",
                    "&:hover": {
                      borderColor: filterCategory === cat ? "transparent" : "#3b82f6",
                      color: filterCategory === cat ? "white" : "#3b82f6",
                    },
                  }}
                >
                  {cat}
                </Box>
              ))}
            </Box>

            {/* Table */}
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {[
                      { label: "Date", align: "left" },
                      { label: "Category", align: "left" },
                      { label: "Description", align: "left" },
                      { label: "Amount", align: "right" },
                      { label: "", align: "center" },
                    ].map((col) => (
                      <TableCell
                        key={col.label}
                        align={col.align}
                        sx={{
                          fontWeight: 700,
                          fontSize: 10,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          py: 1.5,
                          background: "#f8fafc",
                          borderBottom: "1.5px solid #f1f5f9",
                        }}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={28} sx={{ color: "#3b82f6" }} />
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow
                        key={expense._id}
                        sx={{
                          "&:last-child td": { border: 0 },
                          "&:hover": { background: "#f8fafc" },
                          transition: "background 0.1s",
                        }}
                      >
                        <TableCell
                          sx={{
                            py: 1.75,
                            fontSize: 12,
                            color: "#475569",
                            fontWeight: 500,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1.25,
                              py: 0.3,
                              borderRadius: "6px",
                              fontSize: 11,
                              fontWeight: 700,
                              letterSpacing: 0.3,
                              background:
                                (CATEGORY_COLORS[expense.category] || "#9e9e9e") + "18",
                              color: CATEGORY_COLORS[expense.category] || "#9e9e9e",
                              border: `1px solid ${(CATEGORY_COLORS[expense.category] || "#9e9e9e")}30`,
                            }}
                          >
                            {expense.category}
                          </Box>
                        </TableCell>
                        <TableCell
                          sx={{ py: 1.75, fontSize: 13, color: "#0f172a", fontWeight: 500 }}
                        >
                          {expense.description || "—"}
                        </TableCell>
                        <TableCell align="right" sx={{ py: 1.75 }}>
                          <Typography
                            sx={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}
                          >
                            {CURRENCY_SYMBOLS[expense.currency] || expense.currency}
                            {expense.amount.toLocaleString()}
                          </Typography>
                          {expense.currency !== baseCurrency && (
                            <Typography sx={{ fontSize: 11, color: "#94a3b8" }}>
                              ≈ {currencySymbol}
                              {parseFloat(
                                toBase(expense.amount, expense.currency),
                              ).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Box
                            sx={{ display: "flex", gap: 0.75, justifyContent: "center" }}
                          >
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(expense)}
                                sx={{
                                  color: "#3b82f6",
                                  background: "#eff6ff",
                                  borderRadius: "8px",
                                  "&:hover": { background: "#dbeafe" },
                                  width: 28,
                                  height: 28,
                                }}
                              >
                                <EditIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                onClick={() => handleDelete(expense._id)}
                                sx={{
                                  color: "#ef4444",
                                  background: "#fef2f2",
                                  borderRadius: "8px",
                                  "&:hover": { background: "#fee2e2" },
                                  width: 28,
                                  height: 28,
                                }}
                              >
                                <DeleteIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              p: 2,
                              borderRadius: "50%",
                              background: "#f1f5f9",
                              border: "2px dashed #e2e8f0",
                              display: "flex",
                            }}
                          >
                            <WalletIcon sx={{ fontSize: 36, color: "#cbd5e1" }} />
                          </Box>
                          <Typography
                            sx={{ fontWeight: 700, color: "#475569", fontSize: 14 }}
                          >
                            No ledger records match filters
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: "#94a3b8" }}>
                            Try broadening your search or add a new expense
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>

        {/* Spending Allocation Chart */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              background: "white",
              borderRadius: "14px",
              border: "1.5px solid #e2e8f0",
              p: 3,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <Typography sx={{ fontSize: 15, fontWeight: 800, color: "#0f172a", mb: 2.5 }}>
              📊 Spending Allocation
            </Typography>
            {chartData.length > 0 ? (
              <Box>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name] || "#8884d8"}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      formatter={(value) => [
                        `${currencySymbol}${value.toLocaleString()}`,
                        "",
                      ]}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1.5px solid #e2e8f0",
                        fontSize: 12,
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend */}
                <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                  {chartData.map((entry) => (
                    <Box
                      key={entry.name}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        py: 0.5,
                        px: 1,
                        borderRadius: "8px",
                        "&:hover": { background: "#f8fafc" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "3px",
                            background: CATEGORY_COLORS[entry.name] || "#8884d8",
                            flexShrink: 0,
                          }}
                        />
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>
                          {entry.name}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>
                        {currencySymbol}
                        {entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  gap: 1.5,
                  py: 5,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "50%",
                    background: "#f1f5f9",
                    border: "2px dashed #e2e8f0",
                    display: "flex",
                  }}
                >
                  <WalletIcon sx={{ fontSize: 32, color: "#cbd5e1" }} />
                </Box>
                <Typography sx={{ fontWeight: 700, color: "#475569", fontSize: 13 }}>
                  Insufficient spending data
                </Typography>
                <Typography
                  sx={{
                    fontSize: 12,
                    color: "#94a3b8",
                    textAlign: "center",
                    maxWidth: 180,
                  }}
                >
                  Add transactions to generate financial charts
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* ── Add / Edit Expense Dialog ───────────────────────────────────────── */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={300}
        PaperProps={{
          sx: {
            borderRadius: "18px",
            p: 0.5,
            boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            border: "1.5px solid #e2e8f0",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.05rem", pb: 1, color: "#0f172a" }}>
          {editingExpenseId ? "📝 Edit Transaction" : "📝 Add Transaction"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 2.5 }}>
            {/* Over Budget Warning */}
            {isOverBudgetDialog && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  background: "#fef2f2",
                  border: "1.5px solid #fca5a5",
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <WarningIcon sx={{ color: "#ef4444", mt: 0.2, fontSize: 20 }} />
                <Box>
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#ef4444" }}>
                    Over-Budget Alert!
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#dc2626", mt: 0.25, lineHeight: 1.5 }}>
                    This transaction will put you{" "}
                    <strong>₹{overBudgetBy.toLocaleString()}</strong> over budget.
                  </Typography>
                </Box>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Amount *"
                  type="number"
                  value={form.amount}
                  onChange={handleAmountChange}
                  error={Boolean(amountError)}
                  helperText={amountError}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                    },
                  }}
                  slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                    },
                  }}
                >
                  {CURRENCIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {CURRENCY_SYMBOLS[c]} {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              select
              label="Expense Category *"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                },
              }}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Transaction Note"
              placeholder="e.g. Lunch at Jules Verne"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                },
              }}
            />

            <TextField
              fullWidth
              type="date"
              label="Transaction Date"
              slotProps={{ inputLabel: { shrink: true } }}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",
                  "& fieldset": { borderColor: "#e2e8f0", borderWidth: "1.5px" },
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{
              fontWeight: 600,
              color: "#64748b",
              borderRadius: "10px",
              border: "1.5px solid #e2e8f0",
              px: 2.5,
              "&:hover": { background: "#f8fafc" },
            }}
          >
            Cancel
          </Button>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={Boolean(amountError) || !form.amount}
            sx={{
              px: 3,
              borderRadius: "10px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
            }}
          >
            {editingExpenseId ? "Save Changes" : "Confirm & Save"}
          </PrimaryButton>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirmation Dialog ──────────────────────────────────────── */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={cancelDelete}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            border: "1.5px solid #fecaca",
            boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem" }}>
          🗑️ Delete Expense
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ fontSize: 14, color: "#475569" }}>
            Are you sure you want to delete this expense? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={cancelDelete}
            sx={{
              fontWeight: 600,
              color: "#64748b",
              borderRadius: "10px",
              border: "1.5px solid #e2e8f0",
              "&:hover": { background: "#f8fafc" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            sx={{
              fontWeight: 700,
              borderRadius: "10px",
              background: "#ef4444",
              color: "white",
              px: 2.5,
              "&:hover": { background: "#dc2626" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesView;
