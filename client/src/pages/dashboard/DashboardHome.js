import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Typography, Box, Button, Grid, Paper, Card, CardContent,
  CardActionArea, Chip, LinearProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import WbSunnyIcon from "@mui/icons-material/WbSunny";

import HotelIcon from "@mui/icons-material/Hotel";
import { getTrips } from "../../redux/actions/tripActions";
import { getAllUserExpenses } from "../../redux/actions/expenseActions";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const STATUS_COLORS = { planned: "primary", ongoing: "warning", completed: "success" };

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { trips, loading } = useSelector((state) => state.trips);
  const { allExpenses } = useSelector((state) => state.expenses);

  useEffect(() => {
    dispatch(getTrips());
    dispatch(getAllUserExpenses());
  }, [dispatch]);

  const tripsArr = trips || [];
  const userName = user?.name?.split(" ")[0] || "Traveler";

  // Stats
  const totalTrips = tripsArr.length;
  const completedTrips = tripsArr.filter(t => t.status === "completed").length;
  const plannedTrips = tripsArr.filter(t => t.status === "planned").length;
  const ongoingTrips = tripsArr.filter(t => t.status === "ongoing").length;

  const totalBudget = tripsArr.reduce((acc, t) => acc + (t.budget || 0), 0);
  const totalSpent = allExpenses ? allExpenses.reduce((acc, e) => acc + (e.amount || 0), 0) : 0;

  // Upcoming trips
  const today = new Date();
  const upcomingTrips = tripsArr.filter(t => new Date(t.startDate) >= today).slice(0, 3);

  // Monthly trip chart data from trips
  const monthlyData = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = Array(12).fill(0);
    tripsArr.forEach(t => {
      const m = new Date(t.startDate).getMonth();
      counts[m]++;
    });
    return months.map((m, i) => ({ month: m, trips: counts[i] })).filter(d => d.trips > 0);
  })();

  const quickActions = [
    { icon: <ExploreIcon />, label: "Plan New Trip", path: "/dashboard/trips", color: "primary.main", bg: "primary.light" },
    { icon: <AccountBalanceWalletIcon />, label: "Track Expenses", path: "/dashboard/expenses", color: "success.main", bg: "success.light" },
    { icon: <WbSunnyIcon />, label: "Check Weather", path: "/dashboard/weather", color: "warning.main", bg: "warning.light" },
    { icon: <HotelIcon />, label: "Book a Hotel", path: "/dashboard/bookings", color: "info.main", bg: "info.light" },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Greeting */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Welcome back, {userName}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {totalTrips === 0
            ? "Start planning your first adventure!"
            : `You have ${plannedTrips} upcoming and ${ongoingTrips} ongoing trips.`}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          { label: "Total Trips", value: totalTrips, icon: <FlightTakeoffIcon />, color: "primary", bg: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)" },
          { label: "Completed", value: completedTrips, icon: <CheckCircleIcon />, color: "success", bg: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)" },
          { label: "Total Budget", value: `₹${totalBudget > 0 ? (totalBudget / 1000).toFixed(0) + "K" : "0"}`, icon: <AccountBalanceWalletIcon />, color: "warning", bg: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)" },
          { label: "Total Spent", value: `₹${totalSpent > 0 ? (totalSpent / 1000).toFixed(0) + "K" : "0"}`, icon: <AccountBalanceWalletIcon />, color: "info", bg: "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)" },
        ].map((stat, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper elevation={0} sx={{
              p: 3, borderRadius: 3, background: stat.bg, color: "white",
              transition: "transform 0.2s", "&:hover": { transform: "translateY(-2px)" }
            }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>{stat.label}</Typography>
                  <Typography variant="h4" fontWeight={800}>{stat.value}</Typography>
                </Box>
                <Box sx={{ opacity: 0.7, "& svg": { fontSize: 32 } }}>{stat.icon}</Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", mb: { xs: 3, md: 0 } }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Quick Actions</Typography>
            <Grid container spacing={1.5}>
              {quickActions.map((action, i) => (
                <Grid item xs={6} key={i}>
                  <Paper
                    elevation={0}
                    component={Link}
                    to={action.path}
                    sx={{
                      p: 2.5, borderRadius: 3, textDecoration: "none", display: "block",
                      border: "1px solid", borderColor: "divider",
                      transition: "all 0.2s", "&:hover": { boxShadow: 4, transform: "translateY(-2px)" }
                    }}>
                    <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: action.bg, color: action.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 1.5 }}>
                      {action.icon}
                    </Box>
                    <Typography variant="body2" fontWeight={700} color="text.primary">{action.label}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Trip Chart */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Trips by Month</Typography>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} style={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} style={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e0e0e0" }}
                    formatter={(v) => [v, "Trips"]}
                  />
                  <Bar dataKey="trips" fill="#1976D2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 200, flexDirection: "column", gap: 1 }}>
                <ExploreIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography color="text.secondary">Create trips to see analytics</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Upcoming Trips */}
      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
          <Typography variant="h6" fontWeight={700}>
            {upcomingTrips.length > 0 ? "Upcoming Trips" : "Recent Trips"}
          </Typography>
          <Button component={Link} to="/dashboard/trips" endIcon={<ArrowForwardIcon />} color="primary">
            View All
          </Button>
        </Box>

        {loading ? (
          <LinearProgress sx={{ borderRadius: 2 }} />
        ) : tripsArr.length === 0 ? (
          <Paper elevation={0} sx={{ p: 5, textAlign: "center", borderRadius: 3, border: "2px dashed", borderColor: "divider" }}>
            <FlightTakeoffIcon sx={{ fontSize: 56, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>No trips yet</Typography>
            <Button component={Link} to="/dashboard/trips" variant="contained" startIcon={<AddIcon />} sx={{ mt: 1 }}>
              Plan Your First Trip
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {(upcomingTrips.length > 0 ? upcomingTrips : tripsArr.slice(0, 3)).map((trip) => (
              <Grid item xs={12} md={6} lg={4} key={trip._id}>
                <Card elevation={0}
                  sx={{ borderRadius: 3, border: "1px solid", borderColor: "divider", transition: "transform 0.2s, box-shadow 0.2s", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}>
                  <CardActionArea component={Link} to={`/dashboard/trips/${trip._id}`}>
                    <Box sx={{ position: "relative", pt: "50%" }}>
                      <Box
                        component="img"
                        src={trip.images?.[0] || "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=600"}
                        alt={trip.destination}
                        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
                        <Chip label={trip.status?.charAt(0).toUpperCase() + trip.status?.slice(1)}
                          color={STATUS_COLORS[trip.status] || "default"} size="small" sx={{ fontWeight: 700 }} />
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>{trip.destination}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                        <DateRangeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(trip.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })} –{" "}
                          {new Date(trip.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default DashboardHome;
