import React from "react";
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  Stack,
  Grid,
  Chip,
  Grow,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ExploreIcon from "@mui/icons-material/Explore";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import EventIcon from "@mui/icons-material/Event";

const DashboardHero = ({
  user,
  totalTrips,
  plannedTrips,
  ongoingTrips,
  totalBudget,
  totalSpent,
  upcomingTrips,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const hour = new Date().getHours();

  let greeting = "Good Evening";
  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";

  const name = user?.name?.split(" ")[0] || "Traveler";
  const remaining = Math.max(totalBudget - totalSpent, 0);
  const progress = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const nextTrip = upcomingTrips?.[0];

  // TODO: swap for TripCountdownBadge if it exposes a reusable
  // days-remaining calculation/component — keeps countdown logic
  // consistent with the rest of the app.
  const daysRemaining = nextTrip?.startDate
    ? Math.max(
        Math.ceil(
          (new Date(nextTrip.startDate) - new Date()) / (1000 * 60 * 60 * 24),
        ),
        0,
      )
    : null;

  return (
    <Grow in timeout={500}>
      <Box
        sx={{
          mb: 4,
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background:
            "linear-gradient(135deg, #1976D2 0%, #00BCD4 60%, #26C6DA 100%)",
          color: "white",
          boxShadow: "0 8px 32px rgba(25, 118, 210, 0.35)",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -60,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          },
        }}
      >
        {/* Greeting */}
        <Typography variant="h4" fontWeight={800}>
          {greeting}, {name}! 👋
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 1.5, flexWrap: "wrap" }}>
          <Chip
            size="small"
            label={`${plannedTrips} upcoming`}
            sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white" }}
          />
          <Chip
            size="small"
            label={`${ongoingTrips} ongoing`}
            sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white" }}
          />
          <Chip
            size="small"
            label={`${totalTrips} total trips`}
            sx={{ bgcolor: "rgba(255,255,255,0.18)", color: "white" }}
          />
        </Stack>

        {/* Info Grid: Next Trip / Budget */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FlightTakeoffIcon fontSize="small" />
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Next Trip
              </Typography>
            </Stack>

            {nextTrip ? (
              <>
                <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
                  {nextTrip.destination}
                </Typography>
                {daysRemaining !== null && (
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {daysRemaining === 0
                      ? "Today!"
                      : `${daysRemaining} days left`}
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2" sx={{ mt: 0.5, opacity: 0.9 }}>
                No upcoming trips. Start planning your next adventure!
              </Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccountBalanceWalletIcon fontSize="small" />
              <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Budget Remaining
              </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>
              ₹{remaining.toLocaleString()}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                mt: 1,
                height: 8,
                borderRadius: 5,
                bgcolor: "rgba(255,255,255,0.25)",
                "& .MuiLinearProgress-bar": {
                  bgcolor: "white",
                },
              }}
            />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/dashboard/trips")}
            sx={{
              bgcolor: "white",
              color: theme.palette.primary.main,
              fontWeight: 600,
              "&:hover": { bgcolor: "rgba(255,255,255,0.85)" },
            }}
          >
            New Trip
          </Button>
          <Button
            variant="outlined"
            startIcon={<ExploreIcon />}
            onClick={() => navigate("/dashboard/trips")}
            sx={{
              color: "white",
              borderColor: "rgba(255,255,255,0.6)",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Explore
          </Button>
          {nextTrip && (
            <Button
              variant="outlined"
              startIcon={<EventIcon />}
              onClick={() =>
                navigate(
                  nextTrip._id
                    ? `/dashboard/trips/${nextTrip._id}`
                    : "/dashboard/trips",
                )
              }
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.6)",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              View Itinerary
            </Button>
          )}
        </Stack>
      </Box>
    </Grow>
  );
};

export default DashboardHero;
