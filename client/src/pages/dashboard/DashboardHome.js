import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import WalletIcon from "@mui/icons-material/Wallet";
import CheckCircleIcon from "@mui/icons-material/TaskAlt";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ArrowForwardIcon from "@mui/icons-material/East";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import HotelIcon from "@mui/icons-material/Hotel";
import PrimaryButton from "../../components/PrimaryButton";
import { getTrips } from "../../redux/actions/tripActions";
import TripCountdownBadge from "../../components/TripCountdownBadge";
import { getAllUserExpenses } from "../../redux/actions/expenseActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const STATUS_COLORS = {
  planned: "primary",
  ongoing: "warning",
  completed: "success",
};

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

  const totalTrips = tripsArr.length;
  const completedTrips = tripsArr.filter(
    (t) => t.status === "completed",
  ).length;
  const plannedTrips = tripsArr.filter((t) => t.status === "planned").length;
  const ongoingTrips = tripsArr.filter((t) => t.status === "ongoing").length;

  const totalBudget = tripsArr.reduce((acc, t) => acc + (t.budget || 0), 0);
  const totalSpent = allExpenses
    ? allExpenses.reduce((acc, e) => acc + (e.amount || 0), 0)
    : 0;

  const today = new Date();
  const upcomingTrips = tripsArr
    .filter((t) => new Date(t.startDate) >= today)
    .slice(0, 3);

  const monthlyData = (() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = Array(12).fill(0);
    tripsArr.forEach((t) => {
      const m = new Date(t.startDate).getMonth();
      counts[m]++;
    });
    return months
      .map((m, i) => ({ month: m, trips: counts[i] }))
      .filter((d) => d.trips > 0);
  })();

  const quickActions = [
    {
      icon: <ExploreIcon />,
      label: "Plan New Trip",
      path: "/dashboard/trips",
      color: "primary.main",
      bg: "primary.light",
    },
    {
      icon: <WalletIcon />,
      label: "Track Expenses",
      path: "/dashboard/expenses",
      color: "success.main",
      bg: "success.light",
    },
    {
      icon: <WbSunnyIcon />,
      label: "Check Weather",
      path: "/dashboard/weather",
      color: "warning.main",
      bg: "warning.light",
    },
    {
      icon: <HotelIcon />,
      label: "Book a Hotel",
      path: "/dashboard/bookings",
      color: "info.main",
      bg: "info.light",
    },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      {/* Greeting */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 0.5,
            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
          }}
        >
          Welcome back, {userName}! 👋
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {totalTrips === 0
            ? "Start planning your first adventure!"
            : `You have ${plannedTrips} upcoming and ${ongoingTrips} ongoing trips.`}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {[
          {
            label: "Total Trips",
            value: totalTrips,
            icon: <FlightTakeoffIcon />,
            color: "primary",
            bg: "linear-gradient(135deg, #1976D2 0%, #1565C0 100%)",
          },
          {
            label: "Completed",
            value: completedTrips,
            icon: <CheckCircleIcon />,
            color: "success",
            bg: "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)",
          },
          {
            label: "Total Budget",
            value: `₹${totalBudget > 0 ? (totalBudget / 1000).toFixed(0) + "K" : "0"}`,
            icon: <WalletIcon />,
            color: "warning",
            bg: "linear-gradient(135deg, #FF9800 0%, #F57C00 100%)",
          },
          {
            label: "Total Spent",
            value: `₹${totalSpent > 0 ? (totalSpent / 1000).toFixed(0) + "K" : "0"}`,
            icon: <WalletIcon />,
            color: "info",
            bg: "linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)",
          },
        ].map((stat, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={i}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 2.5, md: 3 },
                borderRadius: 3,
                background: stat.bg,
                color: "white",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="body2"
                    noWrap
                    sx={{
                      opacity: 0.9,
                      fontWeight: 600,
                      fontSize: { xs: "0.75rem", sm: "0.8rem", md: "0.875rem" },
                      mb: 0.5,
                    }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                    }}
                  >
                    {stat.value}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    opacity: 0.85,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "50%",
                    p: { xs: 0.75, sm: 1, md: 1.25 },
                    ml: 1,
                    "& svg": {
                      fontSize: { xs: 20, sm: 24, md: 28 },
                    },
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              mb: { xs: 3, md: 0 },
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Quick Actions
            </Typography>
            <Grid container spacing={1.5}>
              {quickActions.map((action, i) => (
                <Grid size={{ xs: 6 }} key={i}>
                  <Paper
                    elevation={0}
                    component={Link}
                    to={action.path}
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      borderRadius: 3,
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "all 0.2s",
                      "&:hover": {
                        boxShadow: 3,
                        transform: "translateY(-4px)",
                        borderColor: "primary.main",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 40, sm: 48 },
                        height: { xs: 40, sm: 48 },
                        borderRadius: "50%",
                        bgcolor: action.bg,
                        color: action.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1.5,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography
                      variant="body2"
                      fontWeight={700}
                      color="text.primary"
                      sx={{
                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                      }}
                    >
                      {action.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Trip Chart */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>
              Trips by Month
            </Typography>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    style={{ fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    style={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e0e0e0",
                    }}
                    formatter={(v) => [v, "Trips"]}
                  />
                  <Bar dataKey="trips" fill="#1976D2" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 200,
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <ExploreIcon sx={{ fontSize: 48, color: "text.disabled" }} />
                <Typography color="text.secondary">
                  Create trips to see analytics
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Upcoming Trips */}
      <Box sx={{ mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2.5,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            {upcomingTrips.length > 0 ? "Upcoming Trips" : "Recent Trips"}
          </Typography>
          <Button
            component={Link}
            to="/dashboard/trips"
            endIcon={<ArrowForwardIcon />}
            color="primary"
          >
            View All
          </Button>
        </Box>

        {loading ? (
          <LinearProgress sx={{ borderRadius: 2 }} />
        ) : tripsArr.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: 3,
              border: "2px dashed",
              borderColor: "divider",
            }}
          >
            <FlightTakeoffIcon
              sx={{ fontSize: 56, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No trips yet
            </Typography>
            <PrimaryButton
              component={Link}
              to="/dashboard/trips"
              startIcon={<AddIcon />}
              sx={{ mt: 1 }}
            >
              Plan Your First Trip
            </PrimaryButton>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {(upcomingTrips.length > 0
              ? upcomingTrips
              : tripsArr.slice(0, 3)
            ).map((trip) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={trip._id}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to={`/dashboard/trips/${trip._id}`}
                  >
                    <Box sx={{ position: "relative", pt: "50%" }}>
                      <Box
                        component="img"
                        src={
                          trip.images?.[0] ||
                          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=600"
                        }
                        alt={trip.destination}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          alignItems: "flex-end",
                        }}
                      >
                        <Chip
                          label={
                            trip.status?.charAt(0).toUpperCase() +
                            trip.status?.slice(1)
                          }
                          color={STATUS_COLORS[trip.status] || "default"}
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                        <TripCountdownBadge
                          startDate={trip.startDate}
                          endDate={trip.endDate}
                        />
                      </Box>
                    </Box>
                    <CardContent>
                      <Typography variant="h6" fontWeight={700}>
                        {trip.destination}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        <DateRangeIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(trip.startDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                            },
                          )}{" "}
                          –{" "}
                          {new Date(trip.endDate).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
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
