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
  InputAdornment,
  Fade,
  Checkbox,
  FormControlLabel,
  Switch,
  Collapse,
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

  const { expenses, loading, exchangeRates, baseCurrency, ratesFetchedAt } =
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

  const [openGlobalOverride, setOpenGlobalOverride] = useState(false);
  const [useGlobalOverrides, setUseGlobalOverrides] = useState(() => {
    return localStorage.getItem("useGlobalOverrides") === "true";
  });
  const [globalCustomRates, setGlobalCustomRates] = useState(() => {
    const cached = localStorage.getItem("globalCustomRates");
    return cached ? JSON.parse(cached) : {};
  });

  useEffect(() => {
    localStorage.setItem("useGlobalOverrides", useGlobalOverrides);
  }, [useGlobalOverrides]);

  useEffect(() => {
    localStorage.setItem(
      "globalCustomRates",
      JSON.stringify(globalCustomRates),
    );
  }, [globalCustomRates]);

  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    description: "",
    date: new Date().toISOString().split("T")[0],
    currency: "INR",
    isRateOverridden: false,
    exchangeRate: "",
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

  // Fetch exchange rates whenever user changes base currency.
  // Always fetches with base=INR so all rates are "1 INR = X currency",
  // which lets us convert between any two currencies using INR as pivot.
  useEffect(() => {
    dispatch(fetchCurrencyRates(selectedBase));
  }, [dispatch, selectedBase]);

  // Get standard fetched exchange rate from any currency to current baseCurrency
  const getRateToBase = (currency) => {
    if (currency === baseCurrency) return 1;
    if (!exchangeRates || Object.keys(exchangeRates).length === 0) return 1;

    let amountInINR;
    if (currency === "INR") {
      amountInINR = 1;
    } else {
      const rateToINR = exchangeRates[currency];
      if (!rateToINR) return 1;
      amountInINR = 1 / rateToINR;
    }

    if (baseCurrency === "INR") return amountInINR;
    const rateToBase = exchangeRates[baseCurrency];
    if (!rateToBase) return 1;
    return amountInINR * rateToBase;
  };

  // Converts any amount from its stored currency to the user's baseCurrency.
  // Supports individual transaction override, global overrides, and standard fetched rates.
  const toBase = (expenseOrAmount, optCurrency) => {
    let amount, currency, exchangeRate, isRateOverridden;
    if (typeof expenseOrAmount === "object" && expenseOrAmount !== null) {
      amount = expenseOrAmount.amount;
      currency = expenseOrAmount.currency;
      exchangeRate = expenseOrAmount.exchangeRate;
      isRateOverridden = expenseOrAmount.isRateOverridden;
    } else {
      amount = expenseOrAmount;
      currency = optCurrency;
    }

    if (currency === baseCurrency) return amount;

    // Case 1: Transaction-specific override
    if (isRateOverridden && exchangeRate) {
      return (amount * exchangeRate).toFixed(2);
    }

    // Case 2: Global manual rate override
    if (useGlobalOverrides && globalCustomRates[currency] !== undefined) {
      return (amount * globalCustomRates[currency]).toFixed(2);
    }

    // Case 3: Standard fetched rates (using INR as pivot)
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
    ? expenses.reduce((acc, e) => acc + parseFloat(toBase(e)), 0)
    : 0;

  const activeTrip = trips?.find((t) => t._id === activeTripId);

  // Budget is stored in INR in the Trip model, so convert it to baseCurrency
  const rawBudget = activeTrip?.budget || 0;
  const budget = rawBudget > 0 ? parseFloat(toBase(rawBudget, "INR")) : 0;

  const remaining = budget > 0 ? budget - totalSpent : null;

  // Filter and Search logic
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

  // Calculate chart data from filtered/unfiltered list dynamically to be accurate (converted to baseCurrency)
  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + parseFloat(toBase(e));
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
          exchangeRate: form.isRateOverridden
            ? parseFloat(form.exchangeRate)
            : undefined,
        }),
      );
    } else {
      dispatch(
        addExpense({
          ...form,
          trip: activeTripId,
          amount: parsed,
          exchangeRate: form.isRateOverridden
            ? parseFloat(form.exchangeRate)
            : undefined,
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
      isRateOverridden: false,
      exchangeRate: "",
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
      isRateOverridden: false,
      exchangeRate: "",
    });
    setEditingExpenseId(null);
  };

  const handleDelete = (id) => {
    dispatch(deleteExpense(id));
    setTimeout(() => {
      dispatch(getExpenses(activeTripId));
      dispatch(getExpenseSummary(activeTripId));
    }, 300);
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
  const dialogAmountConverted =
    parseFloat(
      toBase({
        amount: dialogAmount,
        currency: form.currency,
        exchangeRate: form.isRateOverridden
          ? parseFloat(form.exchangeRate)
          : undefined,
        isRateOverridden: form.isRateOverridden,
      }),
    ) || 0;
  const isOverBudgetDialog =
    budget > 0 && totalSpent + dialogAmountConverted > budget;
  const overBudgetBy = totalSpent + dialogAmountConverted - budget;

  const formattedTimestamp = ratesFetchedAt
    ? new Date(ratesFetchedAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Not available";

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1400, margin: "0 auto" }}>
      {/* Header Banner */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: "linear-gradient(90deg, #3f51b5 0%, #ff6e40 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.5px",
            }}
          >
            Expense Explorer
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
            Visualize and optimize your travel finances in real-time
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Export Expenses">
            <>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleExportMenuOpen}
                disabled={!activeTripId || !expenses || expenses.length === 0}
                sx={{ borderRadius: 3 }}
              >
                Export
              </Button>

              <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={handleExportMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleExportCSV();
                    handleExportMenuClose();
                  }}
                >
                  Export CSV
                </MenuItem>

                <MenuItem onClick={handleExportExcel}>
                  Export Excel (.xlsx)
                </MenuItem>
              </Menu>
            </>
          </Tooltip>
          <PrimaryButton
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            disabled={!activeTripId}
            sx={{
              borderRadius: 2.5,
              fontWeight: 600,
              px: 3,
              boxShadow: "0 8px 20px -6px rgba(63, 81, 181, 0.5)",
            }}
          >
            Add Expense
          </PrimaryButton>
        </Box>
      </Box>

      {/* Base Currency Selector */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              Display currency:
            </Typography>
            <TextField
              select
              size="small"
              value={selectedBase}
              onChange={(e) => setSelectedBase(e.target.value)}
              sx={{
                width: 120,
                "& .MuiOutlinedInput-root": { borderRadius: 3 },
              }}
            >
              {CURRENCIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {CURRENCY_SYMBOLS[c]} {c}
                </MenuItem>
              ))}
            </TextField>
            {ratesFetchedAt && (
              <Chip
                icon={<InfoIcon style={{ fontSize: 16 }} />}
                label={`Rates updated: ${formattedTimestamp}`}
                size="small"
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  color: "text.secondary",
                  borderColor: "rgba(63, 81, 181, 0.2)",
                  bgcolor: "rgba(63, 81, 181, 0.03)",
                  px: 0.5,
                }}
              />
            )}
          </Box>

          <Button
            variant="outlined"
            size="small"
            onClick={() => setOpenGlobalOverride(!openGlobalOverride)}
            color={useGlobalOverrides ? "warning" : "primary"}
            sx={{ borderRadius: 3, fontWeight: 600 }}
          >
            {useGlobalOverrides
              ? "✏️ Custom Rates Active"
              : "🔧 Override Rates Globally"}
          </Button>
        </Box>

        <Collapse in={openGlobalOverride}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mt: 1.5,
              borderRadius: 3,
              border: "1px dashed",
              borderColor: useGlobalOverrides ? "warning.main" : "grey.300",
              bgcolor: useGlobalOverrides
                ? "rgba(255, 167, 38, 0.05)"
                : "grey.50",
            }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              ⚙️ Global Exchange Rate Overrides
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ mb: 2 }}
            >
              Customize global rates for your session. These rates will override
              official rates for all calculations in Expense Explorer.
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={useGlobalOverrides}
                  onChange={(e) => setUseGlobalOverrides(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" fontWeight={600}>
                  Enable global custom rates
                </Typography>
              }
              sx={{ mb: useGlobalOverrides ? 2 : 0 }}
            />

            {useGlobalOverrides && (
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {CURRENCIES.filter((c) => c !== baseCurrency).map((c) => {
                  const fetchedRate = getRateToBase(c);
                  const currentCustomVal =
                    globalCustomRates[c] !== undefined
                      ? globalCustomRates[c]
                      : fetchedRate.toFixed(4);
                  return (
                    <Grid item xs={6} sm={3} key={c}>
                      <TextField
                        size="small"
                        label={`1 ${c} in ${baseCurrency}`}
                        type="number"
                        value={currentCustomVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGlobalCustomRates((prev) => ({
                            ...prev,
                            [c]: val !== "" ? parseFloat(val) : fetchedRate,
                          }));
                        }}
                        slotProps={{
                          htmlInput: { min: 0.0001, step: 0.0001 },
                          input: { style: { borderRadius: 8 } },
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Paper>
        </Collapse>
      </Box>

      {/* Trip Selector */}
      {/* Select Trip Panel */}
      {trips && trips.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 4,
            border: "1px solid",
            borderColor: "rgba(224, 224, 224, 0.6)",
            background: "rgba(255, 255, 255, 0.8)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="subtitle2"
                fontWeight={700}
                sx={{ mb: 1, color: "text.primary" }}
              >
                Active Trip Profile
              </Typography>
              <TextField
                select
                fullWidth
                value={activeTripId}
                onChange={(e) => setActiveTripId(e.target.value)}
                variant="outlined"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    bgcolor: "rgba(245, 247, 250, 0.5)",
                  },
                }}
              >
                {trips.map((t) => (
                  <MenuItem key={t._id} value={t._id}>
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
              <Grid
                item
                xs={12}
                md={6}
                sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Trip Schedule
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {new Date(activeTrip.startDate).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                      },
                    )}{" "}
                    -{" "}
                    {new Date(activeTrip.endDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={activeTrip.status.toUpperCase()}
                      size="small"
                      color={
                        activeTrip.status === "completed"
                          ? "success"
                          : activeTrip.status === "ongoing"
                            ? "secondary"
                            : "primary"
                      }
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        borderRadius: 1.5,
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Financial Status Summary */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Total Spent Card */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: "linear-gradient(135deg, #3f51b5 0%, #002984 100%)",
              color: "white",
              boxShadow: "0 12px 24px -10px rgba(63, 81, 181, 0.4)",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.08)",
              },
            }}
          >
            <WalletIcon sx={{ mb: 1, opacity: 0.8 }} />
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
              Total Spent
            </Typography>
            <Typography variant="h5" fontWeight={700}>
              {currencySymbol}
              {totalSpent.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </Typography>
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 1.5, opacity: 0.8 }}
            >
              Aggregated across all categories
            </Typography>
          </Paper>
        </Grid>

        {/* Budget Card */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "rgba(72, 187, 120, 0.2)",
              background: "rgba(255, 255, 255, 0.8)",
              boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)",
            }}
          >
            <WalletIcon sx={{ mb: 1, color: "success.main" }} />
            <Typography variant="body2" color="text.secondary">
              Budget
            </Typography>
            <Typography variant="h5" fontWeight={700} color="success.main">
              {budget > 0
                ? `${currencySymbol}${budget.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1.5 }}
            >
              {budget > 0 ? "Target maximum limit" : "No budget configured yet"}
            </Typography>
          </Paper>
        </Grid>

        {/* Remaining Card */}
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor:
                remaining !== null && remaining < 0
                  ? "rgba(245, 101, 101, 0.2)"
                  : "rgba(66, 153, 225, 0.2)",
              background:
                remaining !== null && remaining < 0
                  ? "rgba(254, 242, 242, 0.6)"
                  : "rgba(240, 249, 255, 0.6)",
              boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                fontWeight={600}
              >
                Balance Remaining
              </Typography>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: 2,
                  bgcolor:
                    remaining !== null && remaining < 0
                      ? "rgba(245, 101, 101, 0.15)"
                      : "rgba(66, 153, 225, 0.15)",
                  color:
                    remaining !== null && remaining < 0 ? "#f56565" : "#4299e1",
                  display: "flex",
                }}
              >
                {remaining !== null && remaining < 0 ? (
                  <ErrorIcon sx={{ fontSize: 18 }} />
                ) : (
                  <InfoIcon sx={{ fontSize: 18 }} />
                )}
              </Box>
            </Box>
            <Typography
              variant="h3"
              fontWeight={800}
              color={
                remaining !== null && remaining < 0 ? "error.main" : "info.main"
              }
              sx={{ letterSpacing: "-1px" }}
            >
              {remaining !== null
                ? `${currencySymbol}${remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
                : "—"}
            </Typography>
            <Typography
              variant="caption"
              color={
                remaining !== null && remaining < 0
                  ? "error.main"
                  : "text.secondary"
              }
              fontWeight={remaining !== null && remaining < 0 ? 600 : 400}
              sx={{ display: "block", mt: 1.5 }}
            >
              {remaining !== null && remaining < 0
                ? "⚠️ Warning: Budget limit exceeded!"
                : remaining !== null
                  ? "Safe zone spending budget"
                  : "Awaiting trip budget setup"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Analytics Area */}
      <Grid container spacing={4}>
        {/* Expenses List & Filter Card */}
        <Grid item xs={12} md={7.5}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid",
              borderColor: "rgba(224, 224, 224, 0.6)",
              overflow: "hidden",
              boxShadow: "0 12px 32px -12px rgba(0,0,0,0.04)",
            }}
          >
            <Box
              sx={{
                p: 3,
                borderBottom: "1px solid",
                borderColor: "rgba(224, 224, 224, 0.6)",
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "stretch", sm: "center" },
                gap: 2,
                background: "rgba(255, 255, 255, 0.5)",
              }}
            >
              <Typography variant="h6" fontWeight={800} color="text.primary">
                Ledger Records
              </Typography>

              {/* Filters */}
              <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <TextField
                  placeholder="Search..."
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon
                            sx={{ color: "text.disabled", fontSize: 20 }}
                          />
                        </InputAdornment>
                      ),
                      style: { borderRadius: 10 },
                    },
                  }}
                  sx={{ width: { xs: "100%", sm: 160 } }}
                />
                <TextField
                  select
                  size="small"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <FilterListIcon
                            sx={{ color: "text.disabled", fontSize: 18 }}
                          />
                        </InputAdornment>
                      ),
                      style: { borderRadius: 10 },
                    },
                  }}
                  sx={{ width: { xs: "100%", sm: 140 } }}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {EXPENSE_CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 420 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}
                    >
                      Date
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}
                    >
                      Description
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, color: "text.secondary", py: 2 }}
                    >
                      Amount
                    </TableCell>
                    <TableCell align="center" sx={{ py: 2 }} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={32} />
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length > 0 ? (
                    filteredExpenses.map((expense) => (
                      <TableRow
                        key={expense._id}
                        hover
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell sx={{ whiteSpace: "nowrap", py: 2 }}>
                          {new Date(expense.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell sx={{ py: 1.5 }}>
                          <Chip
                            label={expense.category}
                            size="small"
                            sx={{
                              bgcolor:
                                (CATEGORY_COLORS[expense.category] ||
                                  "#9e9e9e") + "18",
                              color:
                                CATEGORY_COLORS[expense.category] || "#9e9e9e",
                              fontWeight: 700,
                              borderRadius: 1.5,
                              fontSize: "0.75rem",
                              border: "1px solid",
                              borderColor:
                                (CATEGORY_COLORS[expense.category] ||
                                  "#9e9e9e") + "30",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{ color: "text.primary", fontWeight: 500, py: 2 }}
                        >
                          {expense.description || "—"}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700 }}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "flex-end",
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                justifyContent: "flex-end",
                              }}
                            >
                              <Typography variant="body2" fontWeight={700}>
                                {CURRENCY_SYMBOLS[expense.currency] ||
                                  expense.currency}
                                {expense.amount.toLocaleString()}
                              </Typography>
                              {expense.currency !== baseCurrency && (
                                <Chip
                                  label={`≈ ${currencySymbol}${parseFloat(toBase(expense)).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
                                  size="small"
                                  color="secondary"
                                  variant="outlined"
                                  sx={{
                                    height: 20,
                                    fontSize: "0.7rem",
                                    fontWeight: 600,
                                    borderColor: "rgba(156, 39, 176, 0.3)",
                                    bgcolor: "rgba(156, 39, 176, 0.04)",
                                  }}
                                />
                              )}
                            </Box>
                            {expense.isRateOverridden && (
                              <Typography
                                variant="caption"
                                color="warning.main"
                                sx={{
                                  display: "block",
                                  fontSize: "0.65rem",
                                  mt: 0.25,
                                }}
                              >
                                Rate overridden: 1 {expense.currency} ={" "}
                                {expense.exchangeRate} {baseCurrency}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              justifyContent: "center",
                            }}
                          >
                            <Tooltip title="Edit Expense">
                              <IconButton
                                size="small"
                                sx={{
                                  color: "primary.main",
                                  bgcolor: "rgba(63, 81, 181, 0.05)",
                                  "&:hover": {
                                    bgcolor: "rgba(63, 81, 181, 0.15)",
                                  },
                                  borderRadius: 2,
                                }}
                                onClick={() => handleEditClick(expense)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Expense">
                              <IconButton
                                size="small"
                                sx={{
                                  color: "error.main",
                                  bgcolor: "rgba(245, 101, 101, 0.05)",
                                  "&:hover": {
                                    bgcolor: "rgba(245, 101, 101, 0.15)",
                                  },
                                  borderRadius: 2,
                                }}
                                onClick={() => handleDelete(expense._id)}
                              >
                                <DeleteIcon fontSize="small" />
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
                            gap: 1.5,
                            alignItems: "center",
                          }}
                        >
                          <WalletIcon
                            sx={{
                              fontSize: 44,
                              color: "text.disabled",
                              opacity: 0.6,
                            }}
                          />
                          <Typography
                            variant="body1"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            No ledger records match filters
                          </Typography>
                          <Typography variant="caption" color="text.disabled">
                            Try broadening your search criteria or adding a new
                            expense
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Pie Chart */}
        <Grid xs={12} md={5}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxSizing: "border-box",
              alignSelf: "flex-start",
            }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={800}
              mb={3}
              color="text.primary"
            >
              Spending Allocation
            </Typography>
            {chartData.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <Box sx={{ flex: 1, minWidth: 180, width: 0 }}>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart
                      margin={{ top: 15, right: 15, bottom: 15, left: 30 }}
                    >
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
                          `${currencySymbol}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
                          "",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                {/* Custom Legend */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.75,
                    alignSelf: "center",
                    pl: 1,
                    flexShrink: 0,
                  }}
                >
                  {chartData.map((entry) => (
                    <Box
                      key={entry.name}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Box
                        sx={{
                          width: 15,
                          height: 15,
                          borderRadius: "3px",
                          bgcolor: CATEGORY_COLORS[entry.name] || "#8884d8",
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                        {entry.name}
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
                  height: 120,
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "grey.50",
                    border: "2px dashed",
                    borderColor: "grey.200",
                    display: "flex",
                  }}
                >
                  <WalletIcon
                    sx={{ fontSize: 32, color: "text.disabled", opacity: 0.6 }}
                  />
                </Box>
                <Typography color="text.secondary" fontWeight={500}>
                  Insufficient spending data
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  align="center"
                  sx={{ maxWidth: 200 }}
                >
                  Add a transaction to generate real-time financial charts
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add Expense Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        transitionDuration={350}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1.5,
            boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: "1.35rem",
            pb: 1,
            color: "text.primary",
          }}
        >
          {editingExpenseId
            ? "📝 Edit Transaction Record"
            : "📝 Add Transaction Record"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 3 }}
          >
            {/* Real-time Over Budget Warning Alert */}
            {isOverBudgetDialog && (
              <Box
                sx={{
                  p: 2,
                  borderRadius: 3,
                  bgcolor: "error.light",
                  color: "error.main",
                  border: "1px solid",
                  borderColor: "rgba(245, 101, 101, 0.2)",
                  display: "flex",
                  gap: 1.5,
                  alignItems: "flex-start",
                }}
              >
                <WarningIcon sx={{ mt: 0.25 }} />
                <Box>
                  <Typography variant="body2" fontWeight={700}>
                    Over-Budget Alert!
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mt: 0.5 }}
                  >
                    This transaction of{" "}
                    {CURRENCY_SYMBOLS[form.currency] || form.currency}
                    {dialogAmount.toLocaleString()} (≈ {currencySymbol}
                    {dialogAmountConverted.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                    ) will put you{" "}
                    <strong>
                      {currencySymbol}
                      {overBudgetBy.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </strong>{" "}
                    over your trip budget limit.
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
                  slotProps={{
                    htmlInput: { min: 0.01, step: 0.01 },
                    input: { style: { borderRadius: 12 } },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      currency: e.target.value,
                      isRateOverridden: false,
                      exchangeRate: "",
                    })
                  }
                  slotProps={{ input: { style: { borderRadius: 12 } } }}
                >
                  {CURRENCIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {CURRENCY_SYMBOLS[c]} {c}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            {form.currency !== baseCurrency && dialogAmount > 0 && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: "rgba(156, 39, 176, 0.04)",
                  border: "1px solid rgba(156, 39, 176, 0.1)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="body2"
                  color="secondary.main"
                  fontWeight={600}
                >
                  Conversion Preview:
                </Typography>
                <Typography
                  variant="body2"
                  color="secondary.main"
                  fontWeight={700}
                >
                  ≈ {currencySymbol}
                  {dialogAmountConverted.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  {baseCurrency}
                </Typography>
              </Box>
            )}

            {form.currency !== baseCurrency && (
              <Box>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.isRateOverridden || false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setForm({
                          ...form,
                          isRateOverridden: checked,
                          exchangeRate: checked
                            ? getRateToBase(form.currency).toFixed(4)
                            : "",
                        });
                      }}
                      size="small"
                    />
                  }
                  label={
                    <Typography variant="body2" color="text.secondary">
                      Override exchange rate for this transaction
                    </Typography>
                  }
                />

                <Collapse in={form.isRateOverridden}>
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      label={`Custom Exchange Rate (1 ${form.currency} = ? ${baseCurrency})`}
                      type="number"
                      value={form.exchangeRate}
                      onChange={(e) =>
                        setForm({ ...form, exchangeRate: e.target.value })
                      }
                      slotProps={{
                        htmlInput: { min: 0.0001, step: 0.0001 },
                        input: { style: { borderRadius: 12 } },
                      }}
                      helperText={`Leave blank or enter custom rate. Default fetched rate is ~${getRateToBase(form.currency).toFixed(4)}`}
                    />
                  </Box>
                </Collapse>
              </Box>
            )}

            <TextField
              fullWidth
              select
              label="Expense Category *"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              slotProps={{ input: { style: { borderRadius: 12 } } }}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Transaction Note"
              placeholder="e.g. Lunch at Jules Verne"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              slotProps={{ input: { style: { borderRadius: 12 } } }}
            />

            <TextField
              fullWidth
              type="date"
              label="Transaction Date"
              slotProps={{
                inputLabel: { shrink: true },
                input: { style: { borderRadius: 12 } },
              }}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <Button
            onClick={handleClose}
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Cancel
          </Button>
          <PrimaryButton
            onClick={handleSubmit}
            disabled={Boolean(amountError) || !form.amount}
            sx={{ px: 4, borderRadius: 2.5, fontWeight: 600 }}
          >
            {editingExpenseId ? "Save Changes" : "Confirm & Save"}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesView;
