import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Skeleton,
  Alert,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Warning,
  CheckCircle,
  ErrorOutline,
  MonetizationOn,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  fetchBudgetForecast,
  clearBudgetForecast,
} from "../../redux/actions/budgetForecastActions";

// ─── helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const HEALTH_CONFIG = {
  healthy: { color: "#4caf50", icon: <CheckCircle />, label: "On Track" },
  warning: { color: "#ff9800", icon: <Warning />, label: "Watch Out" },
  critical: { color: "#f44336", icon: <ErrorOutline />, label: "Over Budget" },
};

const CATEGORY_COLORS = {
  food: "#FF6B6B",
  transport: "#4ECDC4",
  accommodation: "#45B7D1",
  activities: "#96CEB4",
  shopping: "#FFEAA7",
  other: "#DDA0DD",
};

// ─── sub-components ───────────────────────────────────────────────────────────
function StatCard({ title, value, subtitle, icon, color, loading }) {
  return (
    <Card
      elevation={2}
      sx={{ height: "100%", borderLeft: `4px solid ${color}` }}
    >
      <CardContent>
        {loading ? (
          <>
            <Skeleton width="60%" />
            <Skeleton width="80%" height={40} />
            <Skeleton width="50%" />
          </>
        ) : (
          <>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={600}
                textTransform="uppercase"
              >
                {title}
              </Typography>
              <Box sx={{ color }}>{icon}</Box>
            </Box>
            <Typography variant="h5" fontWeight={700} color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ─── main component ───────────────────────────────────────────────────────────
export default function BudgetForecastView() {
  const dispatch = useDispatch();
  const { trips } = useSelector((s) => s.trips);
  const { loading, data, error } = useSelector((s) => s.budgetForecast);
  const [selectedTrip, setSelectedTrip] = useState("");

  // Auto-select the first trip that has a budget and expenses
  useEffect(() => {
    if (trips?.length && !selectedTrip) setSelectedTrip(trips[0]._id);
  }, [trips]);

  useEffect(() => {
    if (selectedTrip) {
      dispatch(fetchBudgetForecast(selectedTrip));
    }
    return () => dispatch(clearBudgetForecast());
  }, [selectedTrip, dispatch]);

  const health = data ? HEALTH_CONFIG[data.healthScore] : null;

  return (
    <Box p={{ xs: 2, md: 3 }}>
      {/* ── Header ── */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            📊 Smart Budget Forecast
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Spending trends · Drift analysis · End-of-trip projection
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 220 }}>
          <InputLabel>Select Trip</InputLabel>
          <Select
            value={selectedTrip}
            label="Select Trip"
            onChange={(e) => setSelectedTrip(e.target.value)}
          >
            {(trips || []).map((t) => (
              <MenuItem key={t._id} value={t._id}>
                {t.destination}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ── Error ── */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── Health Badge ── */}
      {(loading || data) && (
        <Box mb={3}>
          {loading ? (
            <Skeleton width={160} height={36} />
          ) : (
            <Chip
              icon={health.icon}
              label={`Budget Health: ${health.label}`}
              sx={{
                bgcolor: `${health.color}22`,
                color: health.color,
                fontWeight: 700,
                fontSize: "0.85rem",
                px: 1,
                border: `1px solid ${health.color}44`,
              }}
            />
          )}
        </Box>
      )}

      {/* ── Stat Cards ── */}
      <Grid container spacing={2} mb={3}>
        {[
          {
            title: "Total Budget",
            value: data ? fmt(data.budget) : "—",
            subtitle: `${data?.tripDays} day trip`,
            icon: <AccountBalance fontSize="small" />,
            color: "#1976d2",
          },
          {
            title: "Spent So Far",
            value: data ? fmt(data.totalSpent) : "—",
            subtitle: `${data?.daysElapsed} of ${data?.tripDays} days elapsed`,
            icon: <MonetizationOn fontSize="small" />,
            color: "#9c27b0",
          },
          {
            title: "Forecasted Total",
            value: data ? fmt(data.forecastedTotal) : "—",
            subtitle: `At ₹${data?.dailySpendRate}/day pace`,
            icon: <TrendingUp fontSize="small" />,
            color: health?.color || "#757575",
          },
          {
            title:
              data?.budgetDrift >= 0
                ? "Projected Overspend"
                : "Projected Savings",
            value: data ? fmt(Math.abs(data.budgetDrift)) : "—",
            subtitle: `${Math.abs(data?.driftPercentage || 0)}% ${data?.budgetDrift >= 0 ? "over" : "under"} budget`,
            icon:
              data?.budgetDrift >= 0 ? (
                <TrendingUp fontSize="small" />
              ) : (
                <TrendingDown fontSize="small" />
              ),
            color: data?.budgetDrift >= 0 ? "#f44336" : "#4caf50",
          },
        ].map((card, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>

      {/* ── Budget Progress Bar ── */}
      {(loading || data) && (
        <Card elevation={2} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              Budget Utilisation
            </Typography>
            {loading ? (
              <Skeleton height={24} />
            ) : (
              <>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption">
                    Spent: {fmt(data.totalSpent)}
                  </Typography>
                  <Typography variant="caption">
                    Forecasted: {fmt(data.forecastedTotal)} / {fmt(data.budget)}
                  </Typography>
                </Box>
                {/* Actual spend bar */}
                <Tooltip title={`Actual: ${fmt(data.totalSpent)}`}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min((data.totalSpent / data.budget) * 100, 100)}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      mb: 1,
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": { bgcolor: health?.color },
                    }}
                  />
                </Tooltip>
                {/* Forecast bar */}
                <Tooltip title={`Forecasted: ${fmt(data.forecastedTotal)}`}>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      (data.forecastedTotal / data.budget) * 100,
                      100,
                    )}
                    sx={{
                      height: 6,
                      borderRadius: 6,
                      bgcolor: "#e0e0e0",
                      "& .MuiLinearProgress-bar": {
                        bgcolor:
                          data.forecastedTotal > data.budget
                            ? "#f44336"
                            : "#4caf50",
                      },
                    }}
                  />
                </Tooltip>
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="text.secondary">
                    ▬ Actual &nbsp; ▬ Forecasted
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.daysRemaining} days remaining
                  </Typography>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Charts Row ── */}
      <Grid container spacing={2} mb={3}>
        {/* Spending Trend Line Chart */}
        <Grid item xs={12} md={7}>
          <Card elevation={2} sx={{ height: 320 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Cumulative Spend vs Budget Line
              </Typography>
              {loading ? (
                <Skeleton height={240} />
              ) : data?.spendingTrend?.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={data.spendingTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <RTooltip formatter={(v) => fmt(v)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cumulativeSpend"
                      name="Actual Spend"
                      stroke="#9c27b0"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="budgetLine"
                      name="Expected Pace"
                      stroke="#4caf50"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={220}
                >
                  <Typography color="text.secondary">
                    No expense data yet for this trip.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Category Bar Chart */}
        <Grid item xs={12} md={5}>
          <Card elevation={2} sx={{ height: 320 }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>
                Spend by Category
              </Typography>
              {loading ? (
                <Skeleton height={240} />
              ) : data?.categoryBreakdown?.length > 0 ? (
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={data.categoryBreakdown} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="category"
                      tick={{ fontSize: 11 }}
                      width={90}
                    />
                    <RTooltip formatter={(v) => fmt(v)} />
                    <Bar dataKey="spent" name="Amount" radius={[0, 4, 4, 0]}>
                      {data.categoryBreakdown.map((entry) => (
                        <Cell
                          key={entry.category}
                          fill={CATEGORY_COLORS[entry.category] || "#8884d8"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  height={220}
                >
                  <Typography color="text.secondary">
                    No categories found.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ── Overspending Alerts ── */}
      {data?.overspendingCategories?.length > 0 && (
        <Card elevation={2} sx={{ mb: 3, borderLeft: "4px solid #ff9800" }}>
          <CardContent>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              mb={1}
              color="warning.main"
            >
              ⚠️ Overspending Categories
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {data.overspendingCategories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  sx={{
                    bgcolor: `${CATEGORY_COLORS[cat]}33`,
                    color: CATEGORY_COLORS[cat],
                    fontWeight: 600,
                    border: `1px solid ${CATEGORY_COLORS[cat]}`,
                  }}
                />
              ))}
            </Box>
            <Typography variant="body2" color="text.secondary" mt={1}>
              These categories are spending faster than their proportional share
              of your budget.
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ── Actionable Tips ── */}
      {data && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              💡 Smart Recommendations
            </Typography>
            <Divider sx={{ mb: 1.5 }} />
            {data.healthScore === "healthy" && (
              <Typography variant="body2">
                ✅ You are spending at a sustainable pace. Keep it up — you're
                projected to save {fmt(Math.abs(data.projectedSavings))}.
              </Typography>
            )}
            {data.healthScore === "warning" && (
              <Typography variant="body2">
                🔶 Your spend rate is slightly above expected. Try to limit
                daily spend to {fmt(data.expectedDailyBudget)} or less for the
                remaining {data.daysRemaining} days.
              </Typography>
            )}
            {data.healthScore === "critical" && (
              <Typography variant="body2" color="error">
                🚨 At your current pace you will exceed your budget by{" "}
                {fmt(data.budgetDrift)}. Cut daily spend to{" "}
                {fmt(data.remainingBudget / Math.max(data.daysRemaining, 1))}{" "}
                for the rest of the trip.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
