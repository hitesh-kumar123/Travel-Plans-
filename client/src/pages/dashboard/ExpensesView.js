import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
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
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import WalletIcon from "@mui/icons-material/Wallet";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  getExpenses,
  addExpense,
  deleteExpense,
  getExpenseSummary,
} from "../../redux/actions/expenseActions";
import { getTrips } from "../../redux/actions/tripActions";
import PrimaryButton from "../../components/PrimaryButton";

// ─── Currency Config ────────────────────────────────────────────────────────
const CURRENCIES = [
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
];

// rates is keyed from INR base: { USD: 0.012, EUR: 0.011, ... }
// To convert amount FROM currency A TO currency B:
//   step 1: amount / rates[A]  → gives INR value
//   step 2: INR value * rates[B] → gives B value
const convertAmount = (amount, fromCode, toCode, rates) => {
  if (fromCode === toCode || !rates || Object.keys(rates).length === 0)
    return amount;
  const fromRate = fromCode === "INR" ? 1 : rates[fromCode];
  const toRate = toCode === "INR" ? 1 : rates[toCode];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
};

const getCurrencySymbol = (code) =>
  CURRENCIES.find((c) => c.code === code)?.symbol || code;

// ─── Expense Categories ──────────────────────────────────────────────────────
const EXPENSE_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Food",
  "Activities",
  "Shopping",
  "Other",
];

const CHART_COLORS = [
  "#1976D2",
  "#00BCD4",
  "#4CAF50",
  "#FF9800",
  "#9C27B0",
  "#F44336",
];

const CATEGORY_COLORS = {
  Accommodation: "#1976D2",
  Transportation: "#00BCD4",
  Food: "#4CAF50",
  Activities: "#FF9800",
  Shopping: "#9C27B0",
  Other: "#F44336",
};

// ─── Component ───────────────────────────────────────────────────────────────
const ExpensesView = () => {
  const dispatch = useDispatch();
  const { expenses, expenseSummary, loading } = useSelector(
    (state) => state.expenses,
  );
  const { trips } = useSelector((state) => state.trips);

  const [activeTripId, setActiveTripId] = useState("");
  const [open, setOpen] = useState(false);
  const [amountError, setAmountError] = useState("");

  // display currency + live exchange rates
  const [displayCurrency, setDisplayCurrency] = useState("INR");
  const [exchangeRates, setExchangeRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
    currency: "INR",
  });

  // ── Fetch live rates (base = INR) once on mount ──────────────────────────
  useEffect(() => {
    setRatesLoading(true);
    fetch("https://open.er-api.com/v6/latest/INR")
      .then((res) => res.json())
      .then((data) => {
        if (data?.rates) {
          setExchangeRates(data.rates);
        } else {
          setRatesError(true);
        }
      })
      .catch(() => setRatesError(true))
      .finally(() => setRatesLoading(false));
  }, []);

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

  // ── Derived values ────────────────────────────────────────────────────────
  const symbol = getCurrencySymbol(displayCurrency);

  // Total spent: convert each expense from its own currency to displayCurrency
  const totalSpent = expenses
    ? expenses.reduce((acc, e) => {
        const converted = convertAmount(
          e.amount,
          e.currency || "INR",
          displayCurrency,
          exchangeRates,
        );
        return acc + converted;
      }, 0)
    : 0;

  const activeTrip = trips?.find((t) => t._id === activeTripId);

  // Budget is stored in INR (no currency field yet), convert to display currency
  const budgetRaw = activeTrip?.budget || 0;
  const budget = convertAmount(budgetRaw, "INR", displayCurrency, exchangeRates);
  const remaining = budgetRaw > 0 ? budget - totalSpent : null;

  // Chart data: convert each category total to display currency
  const chartData = expenseSummary
    ? expenseSummary.map((s) => ({
        name: s._id,
        value: parseFloat(
          convertAmount(s.totalAmount, "INR", displayCurrency, exchangeRates).toFixed(2),
        ),
      }))
    : [];

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(form.amount);
    if (!form.amount || isNaN(parsed) || parsed <= 0) {
      setAmountError("Please enter a valid amount greater than zero.");
      return;
    }
    if (!activeTripId) return;

    dispatch(addExpense({ ...form, trip: activeTripId, amount: parsed }));
    setOpen(false);
    setForm({
      amount: "",
      category: "Food",
      description: "",
      date: new Date().toISOString().split("T")[0],
      currency: "INR",
    });
    setAmountError("");
    setTimeout(() => dispatch(getExpenseSummary(activeTripId)), 500);
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
  };

  const handleDelete = (id) => {
    dispatch(deleteExpense(id));
    setTimeout(() => dispatch(getExpenseSummary(activeTripId)), 500);
  };

  const handleExportCSV = () => {
    if (!expenses || expenses.length === 0) return;
    const headers = [
      "Date",
      "Category",
      "Description",
      `Amount (${displayCurrency})`,
      "Original Amount",
      "Original Currency",
    ];
    const rows = expenses.map((e) => [
      new Date(e.date).toLocaleDateString(),
      e.category,
      e.description || "",
      convertAmount(
        e.amount,
        e.currency || "INR",
        displayCurrency,
        exchangeRates,
      ).toFixed(2),
      e.amount,
      e.currency || "INR",
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${activeTrip?.destination || "trip"}_${displayCurrency}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Expense Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage trip expenses
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Export CSV">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportCSV}
              sx={{ borderRadius: 3 }}
            >
              Export
            </Button>
          </Tooltip>
          <PrimaryButton
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={!activeTripId}
            sx={{ borderRadius: 3 }}
          >
            Add Expense
          </PrimaryButton>
        </Box>
      </Box>

      {/* Trip Selector */}
      {trips && trips.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
            <TextField
              select
              label="Select Trip"
              value={activeTripId}
              onChange={(e) => setActiveTripId(e.target.value)}
              sx={{ minWidth: 280 }}
            >
              {trips.map((t) => (
                <MenuItem key={t._id} value={t._id}>
                  {t.destination} —{" "}
                  {new Date(t.startDate).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </MenuItem>
              ))}
            </TextField>

            {/* ── Display Currency Selector ── */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                Display in:
              </Typography>
              <TextField
                select
                size="small"
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
                sx={{ minWidth: 160 }}
              >
                {CURRENCIES.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {c.symbol} {c.code} — {c.name}
                  </MenuItem>
                ))}
              </TextField>
              {ratesLoading && (
                <Tooltip title="Fetching live rates…">
                  <CircularProgress size={16} />
                </Tooltip>
              )}
              {ratesError && (
                <Tooltip title="Live rates unavailable. Amounts shown in original currency.">
                  <Typography variant="caption" color="error">
                    ⚠ rates offline
                  </Typography>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            <WalletIcon sx={{ mb: 1, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Total Spent
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {symbol}{totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              in {displayCurrency}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: budgetRaw > 0 ? "success.light" : "grey.100",
            }}
          >
            <WalletIcon sx={{ mb: 1, color: "success.main" }} />
            <Typography variant="body2" color="text.secondary">
              Budget
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {budgetRaw > 0
                ? `${symbol}${budget.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"}
            </Typography>
            {budgetRaw > 0 && (
              <Typography variant="caption" color="text.secondary">
                in {displayCurrency}
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor:
                remaining !== null && remaining < 0
                  ? "error.light"
                  : "info.light",
            }}
          >
            <WalletIcon
              sx={{
                mb: 1,
                color:
                  remaining !== null && remaining < 0 ? "error.main" : "info.main",
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Remaining
            </Typography>
            <Typography
              variant="h5"
              fontWeight={700}
              color={
                remaining !== null && remaining < 0 ? "error.main" : "info.main"
              }
            >
              {remaining !== null
                ? `${symbol}${remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"}
            </Typography>
            {remaining !== null && (
              <Typography variant="caption" color="text.secondary">
                in {displayCurrency}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Expense Table */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider" }}
          >
            <Box sx={{ p: 2.5 }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Expenses List
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "grey.50" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      Amount
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : expenses && expenses.length > 0 ? (
                    expenses.map((expense) => {
                      const expCurrency = expense.currency || "INR";
                      const expSymbol = getCurrencySymbol(expCurrency);
                      const converted = convertAmount(
                        expense.amount,
                        expCurrency,
                        displayCurrency,
                        exchangeRates,
                      );
                      const showOriginal = expCurrency !== displayCurrency;

                      return (
                        <TableRow key={expense._id} hover>
                          <TableCell sx={{ whiteSpace: "nowrap" }}>
                            {new Date(expense.date).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={expense.category}
                              size="small"
                              sx={{
                                bgcolor:
                                  CATEGORY_COLORS[expense.category] + "22",
                                color: CATEGORY_COLORS[expense.category],
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>
                            {expense.description || "—"}
                          </TableCell>
                          <TableCell align="right">
                            <Box>
                              <Typography
                                variant="body2"
                                fontWeight={700}
                              >
                                {symbol}
                                {converted.toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}
                              </Typography>
                              {/* Show original if different from display currency */}
                              {showOriginal && (
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                >
                                  {expSymbol}
                                  {expense.amount.toLocaleString()} {expCurrency}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(expense._id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        align="center"
                        sx={{ py: 4, color: "text.secondary" }}
                      >
                        No expenses recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Spending Breakdown
            </Typography>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ReTooltip
                    formatter={(value) => [
                      `${symbol}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                      "",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 280,
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <WalletIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography color="text.secondary">No data to display</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Expense Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Expense</DialogTitle>
        <DialogContent>
          <Box
            sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2.5 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={`Amount (${getCurrencySymbol(form.currency)}) *`}
                  type="number"
                  value={form.amount}
                  onChange={handleAmountChange}
                  error={Boolean(amountError)}
                  helperText={amountError}
                  inputProps={{ min: 0.01, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                >
                  {CURRENCIES.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.symbol} {c.code} — {c.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              select
              label="Category *"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Description / Note"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <TextField
              fullWidth
              type="date"
              label="Date"
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <PrimaryButton
            onClick={handleSubmit}
            sx={{ px: 3 }}
            disabled={Boolean(amountError) || !form.amount}
          >
            Save
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesView;