// client/src/pages/dashboard/DashboardHome.js
// ─── Updated to include <QuickCreateDropdown /> ────────────────────────────
//
// CHANGE SUMMARY (issue #959):
//   1. Import QuickCreateDropdown
//   2. Pass `trips` from Redux state as a prop
//   3. Render <QuickCreateDropdown /> at the bottom of the return block
//
// No other logic was altered.
//
// ─── Original file content begins below ──────────────────────────────────────

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  Button,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ScheduleIcon from "@mui/icons-material/Schedule";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchTrips } from "../../redux/actions/tripActions";
import { fetchExpenses } from "../../redux/actions/expenseActions";
import { useNavigate } from "react-router-dom";

// ─── NEW: import the Quick Create component ───────────────────────────────────
import QuickCreateDropdown from "../../components/QuickCreateDropdown";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trips = [] } = useSelector((state) => state.trips);
  const { expenses = [] } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchTrips());
    dispatch(fetchExpenses());
  }, [dispatch]);

  // ── Analytics helpers ──────────────────────────────────────────────────────
  const totalTrips = trips.length;
  const completedTrips = trips.filter((t) => t.status === "Completed").length;
  const plannedTrips = trips.filter((t) => t.status === "Planned").length;
  const totalBudget = trips.reduce((s, t) => s + (t.budget || 0), 0);
  const totalSpent = expenses.reduce((s, e) => s + (e.amount || 0), 0);

  const upcomingTrips = trips
    .filter((t) => t.status === "Planned")
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .slice(0, 3);

  // Monthly bar-chart data
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const label = d.toLocaleString("default", { month: "short" });
    const count = trips.filter((t) => {
      const td = new Date(t.startDate);
      return (
        td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear()
      );
    }).length;
    return { month: label, trips: count };
  });

  // ── Stat card helper ───────────────────────────────────────────────────────
  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color}15`,
              display: "flex",
              alignItems: "center",
            }}
          >
            {React.cloneElement(icon, { sx: { color, fontSize: 28 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: 3 }}>
      {/* Greeting */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Welcome back, {user?.name?.split(" ")[0] || "Traveller"} ✈️
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Here's an overview of your travel activity.
      </Typography>

      {/* Stat cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Trips"
            value={totalTrips}
            icon={<FlightTakeoffIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Completed"
            value={completedTrips}
            icon={<CheckCircleIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Planned"
            value={plannedTrips}
            icon={<ScheduleIcon />}
            color="#ed6c02"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Budget"
            value={`₹${totalBudget.toLocaleString()}`}
            icon={<AccountBalanceWalletIcon />}
            color="#9c27b0"
            subtitle={`Spent ₹${totalSpent.toLocaleString()}`}
          />
        </Grid>
      </Grid>

      {/* Budget utilisation */}
      {totalBudget > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={1}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Budget Utilisation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹{totalSpent.toLocaleString()} / ₹{totalBudget.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min((totalSpent / totalBudget) * 100, 100)}
              color={totalSpent > totalBudget ? "error" : "primary"}
              sx={{ height: 8, borderRadius: 4 }}
            />
            {totalSpent > totalBudget && (
              <Typography
                variant="caption"
                color="error"
                mt={0.5}
                display="block"
              >
                Over budget by ₹{(totalSpent - totalBudget).toLocaleString()}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Monthly chart */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUpIcon color="primary" />
                <Typography variant="subtitle1" fontWeight="bold">
                  Trips — Last 6 Months
                </Typography>
              </Box>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="trips" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming trips */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                Upcoming Trips
              </Typography>
              {upcomingTrips.length === 0 ? (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  py={4}
                  gap={1}
                >
                  <FlightTakeoffIcon
                    sx={{ fontSize: 40, color: "text.disabled" }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    No upcoming trips
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate("/dashboard/trips")}
                  >
                    Plan a trip
                  </Button>
                </Box>
              ) : (
                upcomingTrips.map((trip) => (
                  <Box
                    key={trip._id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      mb: 1,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.selected" },
                    }}
                    onClick={() => navigate(`/dashboard/trips/${trip._id}`)}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {trip.destination}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(trip.startDate).toLocaleDateString()} –{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Chip label={trip.status} size="small" color="warning" />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/*
       * ── NEW (issue #959): Quick Create floating action button ────────────────
       * Renders the Speed Dial in the bottom-right corner of the viewport.
       * `trips` is passed so the Expense modal can pre-populate the trip selector.
       */}
      <QuickCreateDropdown trips={trips} />
    </Box>
  );
};

export default DashboardHome;
