import React, { useEffect, useState } from "react";
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
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import WalletIcon from "@mui/icons-material/Wallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
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
import useCurrencyConverter, {
  SUPPORTED_CURRENCIES,
} from "../../hooks/useCurrencyConverter";

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

// Currency symbol map
const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AUD: "A$",
  CAD: "C$",
  SGD: "S$",
  AED: "د.إ",
  THB: "฿",
};

const sym = (currency) => CURRENCY_SYMBOLS[currency] || currency;

const ExpensesView = () => {
  const dispatch = useDispatch();
  const { expenses, expenseSummary, loading } = useSelector(
    (state) => state.expenses,
  );
  const { trips } = useSelector((state) => state.trips);

  const [activeTripId, setActiveTripId] = useState("");
  const [open, setOpen] = useState(false);
  const [homeCurrency, setHomeCurrency] = useState("INR");
  const [amountError, setAmountError] = useState("");
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
    currency: "INR",
  });

  const {
    convert,
    loading: ratesLoading,
    error: ratesError,
  } = useCurrencyConverter(homeCurrency);

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

  // Total spent converted to home currency
  const totalSpent = expenses
    ? expenses.reduce((acc, e) => {
        const converted = convert(e.amount, e.currency);
        return acc + (converted !== null ? converted : e.amount);
      }, 0)
    : 0;

  const activeTrip = trips?.find((t) => t._id === activeTripId);
  const budget = activeTrip?.budget || 0;
  const remaining = budget > 0 ? budget - totalSpent : null;

  const chartData = expenseSummary
    ? expenseSummary.map((s) => ({ name: s._id, value: s.totalAmount }))
    : [];

  // Validate amount on every change
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
    dispatch(
      addExpense({
        ...form,
        trip: activeTripId,
        amount: parsed,
      }),
    );
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
      "Amount",
      "Currency",
      `Converted (${homeCurrency})`,
    ];
    const rows = expenses.map((e) => {
      const converted = convert(e.amount, e.currency);
      return [
        new Date(e.date).toLocaleDateString(),
        e.category,
        e.description || "",
        e.amount,
        e.currency,
        converted !== null ? converted : "N/A",
      ];
    });
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${activeTrip?.destination || "trip"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* Home Currency Selector */}
          <Tooltip title="Your home currency — all totals are converted to this">
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <CurrencyExchangeIcon sx={{ fontSize: 14 }} />
                  Home
                </Box>
              </InputLabel>
              <Select
                value={homeCurrency}
                label="Home Currency"
                onChange={(e) => setHomeCurrency(e.target.value)}
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {sym(c)} {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Tooltip>

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
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={!activeTripId}
            sx={{ borderRadius: 3 }}
          >
            Add Expense
          </Button>
        </Box>
      </Box>

      {/* Exchange rate error */}
      {ratesError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {ratesError}
        </Alert>
      )}

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
          <TextField
            select
            fullWidth
            label="Select Trip"
            value={activeTripId}
            onChange={(e) => setActiveTripId(e.target.value)}
            sx={{ maxWidth: 400 }}
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
              {ratesLoading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                `${sym(homeCurrency)}${totalSpent.toLocaleString()}`
              )}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              in {homeCurrency}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: budget > 0 ? "success.light" : "grey.100",
            }}
          >
            <WalletIcon sx={{ mb: 1, color: "success.main" }} />
            <Typography variant="body2" color="text.secondary">
              Budget
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {budget > 0
                ? `${sym(homeCurrency)}${budget.toLocaleString()}`
                : "—"}
            </Typography>
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
                  remaining !== null && remaining < 0
                    ? "error.main"
                    : "info.main",
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
                ? `${sym(homeCurrency)}${remaining.toLocaleString()}`
                : "—"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Expense Table */}
        <Grid item xs={12} md={7}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
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
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      {homeCurrency}
                    </TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={28} />
                      </TableCell>
                    </TableRow>
                  ) : expenses && expenses.length > 0 ? (
                    expenses.map((expense) => {
                      const converted = convert(
                        expense.amount,
                        expense.currency,
                      );
                      const isSameCurrency = expense.currency === homeCurrency;
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
                          <TableCell align="right" sx={{ fontWeight: 700 }}>
                            {sym(expense.currency)}
                            {expense.amount.toLocaleString()}{" "}
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {expense.currency}
                            </Typography>
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              fontWeight: 600,
                              color: isSameCurrency
                                ? "text.secondary"
                                : "primary.main",
                            }}
                          >
                            {ratesLoading ? (
                              <CircularProgress size={12} />
                            ) : converted !== null ? (
                              isSameCurrency ? (
                                "—"
                              ) : (
                                `${sym(homeCurrency)}${converted.toLocaleString()}`
                              )
                            ) : (
                              "N/A"
                            )}
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
                        colSpan={6}
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
                      `${sym(homeCurrency)}${value.toLocaleString()}`,
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
                <Typography color="text.secondary">
                  No data to display
                </Typography>
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
                  label="Amount *"
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
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {sym(c)} {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {/* Live conversion preview */}
            {form.amount && !amountError && form.currency !== homeCurrency && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <CurrencyExchangeIcon
                  sx={{ fontSize: 16, color: "primary.main" }}
                />
                <Typography variant="body2" color="primary.main">
                  {ratesLoading ? (
                    "Fetching rates..."
                  ) : (
                    <>
                      {sym(form.currency)}
                      {parseFloat(form.amount).toLocaleString()} {form.currency}{" "}
                      ≈{" "}
                      <strong>
                        {sym(homeCurrency)}
                        {(
                          convert(form.amount, form.currency) || 0
                        ).toLocaleString()}{" "}
                        {homeCurrency}
                      </strong>
                    </>
                  )}
                </Typography>
              </Box>
            )}

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
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{ px: 3 }}
            disabled={Boolean(amountError) || !form.amount}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesView;
