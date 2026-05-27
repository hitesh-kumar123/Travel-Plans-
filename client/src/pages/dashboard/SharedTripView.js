import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Chip,
  CircularProgress,
  Grid,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WalletIcon from "@mui/icons-material/Wallet";
import VisibilityIcon from "@mui/icons-material/Visibility";

const SharedTripView = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000"}/api/trips/share/${token}`,
        );
        setTrip(res.data);
      } catch {
        setError("This shared trip link is invalid or has been disabled.");
      } finally {
        setLoading(false);
      }
    };
    fetchSharedTrip();
  }, [token]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );

  const tripImage =
    trip?.images?.[0] ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=1200";
  const daysCount =
    trip.startDate && trip.endDate
      ? Math.ceil(
          (new Date(trip.endDate) - new Date(trip.startDate)) /
            (1000 * 60 * 60 * 24),
        )
      : 0;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          mb: 2,
          p: { xs: 1.5, sm: 2 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "info.light",
          bgcolor: "rgba(2, 136, 209, 0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(2, 136, 209, 0.14)",
              color: "info.main",
              flexShrink: 0,
            }}
          >
            <VisibilityIcon fontSize="small" />
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              color="info.dark"
              sx={{ lineHeight: 1.2 }}
            >
              Shared Trip Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You are viewing a read-only version of this trip.
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          mb: 3,
          height: { xs: 200, md: 300 },
        }}
      >
        <Box
          component="img"
          src={tripImage}
          alt={trip.destination}
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 3,
            background: "linear-gradient(transparent, rgba(0,0,0,0.75))",
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceIcon />
            <Typography variant="h4" fontWeight={700}>
              {trip.destination}
            </Typography>
          </Box>
          <Chip
            label={`${daysCount} days`}
            size="small"
            sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "white" }}
          />
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          {
            label: "Start Date",
            value: new Date(trip.startDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            icon: <DateRangeIcon color="primary" />,
          },
          {
            label: "End Date",
            value: new Date(trip.endDate).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }),
            icon: <DateRangeIcon color="secondary" />,
          },
          {
            label: "Budget",
            value: `\u20B9${(trip.budget || 0).toLocaleString()}`,
            icon: <WalletIcon color="success" />,
          },
        ].map(({ label, value, icon }) => (
          <Grid item xs={6} sm={4} key={label}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              {icon}
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
                mt={0.5}
              >
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {trip.description && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" fontWeight={700} mb={1}>
            About this Trip
          </Typography>
          <Typography color="text.secondary">{trip.description}</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default SharedTripView;
