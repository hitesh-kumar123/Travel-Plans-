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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
  deleteExpense,
  getExpenseSummary,
} from "../../redux/actions/expenseActions";
import { getTrips } from "../../redux/actions/tripActions";
import PrimaryButton from "../../components/PrimaryButton";

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

const ExpensesView = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);
  const { trips } = useSelector((state) => state.trips);

  const [activeTripId, setActiveTripId] = useState("");
  const [open, setOpen] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

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

  const totalSpent = expenses
    ? expenses.reduce((acc, e) => acc + e.amount, 0)
    : 0;
  const activeTrip = trips?.find((t) => t._id === activeTripId);
  const budget = activeTrip?.budget || 0;
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

  // Calculate chart data from filtered/unfiltered list dynamically to be accurate
  const categoryTotals = {};
  filteredExpenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
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

  const dialogAmount = parseFloat(form.amount) || 0;
  const isOverBudgetDialog = budget > 0 && totalSpent + dialogAmount > budget;
  const overBudgetBy = totalSpent + dialogAmount - budget;

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
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
          <Tooltip title="Download CSV Report">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FileDownloadIcon />}
              onClick={handleExportCSV}
              disabled={!activeTripId || !expenses || expenses.length === 0}
              sx={{
                borderRadius: 2.5,
                fontWeight: 600,
                textTransform: "none",
                px: 2.5,
                borderWidth: "1.5px",
                "&:hover": { borderWidth: "1.5px" },
              }}
            >
              Export Report
            </Button>
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
                sx={{ opacity: 0.85, fontWeight: 600 }}
              >
                Total Expenses
              </Typography>
              <WalletIcon sx={{ opacity: 0.8 }} />
            </Box>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{ letterSpacing: "-1px" }}
            >
              ₹{totalSpent.toLocaleString()}
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
                Allocated Budget
              </Typography>
              <Box
                sx={{
                  p: 0.75,
                  borderRadius: 2,
                  bgcolor: "rgba(72, 187, 120, 0.1)",
                  color: "#48bb78",
                  display: "flex",
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 18 }} />
              </Box>
            </Box>
            <Typography
              variant="h3"
              fontWeight={800}
              color="text.primary"
              sx={{ letterSpacing: "-1px" }}
            >
              {budget > 0 ? `₹${budget.toLocaleString()}` : "—"}
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
              {remaining !== null ? `₹${remaining.toLocaleString()}` : "—"}
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
                        <TableCell
                          align="right"
                          sx={{ fontWeight: 700, color: "text.primary", py: 2 }}
                        >
                          ₹{expense.amount.toLocaleString()}
                        </TableCell>
                        <TableCell align="center" sx={{ py: 1.5 }}>
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

        {/* Visual Analytics Pie Chart */}
        <Grid item xs={12} md={4.5}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              border: "1px solid",
              borderColor: "rgba(224, 224, 224, 0.6)",
              boxShadow: "0 12px 32px -12px rgba(0,0,0,0.04)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
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
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="48%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        background: "rgba(255, 255, 255, 0.95)",
                        borderRadius: 12,
                        border: "1px solid rgba(224, 224, 224, 0.5)",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
                        fontFamily: "Poppins",
                      }}
                      itemStyle={{ fontFamily: "Poppins", fontWeight: 600 }}
                      formatter={(value) => [
                        `₹${value.toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Legend list with custom styled percentages */}
                <Box
                  sx={{
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                  }}
                >
                  {chartData.map((d, idx) => {
                    const percent = Math.round((d.value / totalSpent) * 100);
                    return (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: "50%",
                              bgcolor: d.color,
                            }}
                          />
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.primary"
                          >
                            {d.name}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", gap: 2, alignItems: "center" }}
                        >
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            ₹{d.value.toLocaleString()}
                          </Typography>
                          <Chip
                            label={`${percent}%`}
                            size="small"
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: 700,
                              bgcolor: d.color + "12",
                              color: d.color,
                              height: 20,
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 320,
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
          📝 Add Transaction Record
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
                    This transaction of ₹{dialogAmount.toLocaleString()} will
                    put you <strong>₹{overBudgetBy.toLocaleString()}</strong>{" "}
                    over your trip budget limit.
                  </Typography>
                </Box>
              </Box>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="Amount (₹) *"
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
                    setForm({ ...form, currency: e.target.value })
                  }
                  slotProps={{ input: { style: { borderRadius: 12 } } }}
                >
                  {["INR", "USD", "EUR", "GBP"].map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
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
            Confirm & Save
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesView;
