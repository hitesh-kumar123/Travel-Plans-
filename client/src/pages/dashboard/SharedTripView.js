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
  Button,
} from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import DateRangeIcon from "@mui/icons-material/DateRange";
import WalletIcon from "@mui/icons-material/Wallet";
import PrintIcon from "@mui/icons-material/Print";

const SharedTripView = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedTrip = async () => {
      try {
        const apiBase =
          process.env.REACT_APP_API_URL ||
          (process.env.NODE_ENV === "production"
            ? ""
            : "http://localhost:5000");
        const res = await axios.get(`${apiBase}/api/trips/share/${token}`);
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          "@media print": { display: "none" },
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block" }}
        >
          👁️ Shared Trip (Read-only)
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600 }}
        >
          🖨️ Export PDF / Print Itinerary
        </Button>
      </Box>
      <Box
        className="no-print"
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Button variant="contained" onClick={() => window.print()}>
          🖨️ Export PDF / Print Itinerary
        </Button>
      </Box>
      <Box
        sx={{
          position: "relative",
          borderRadius: 4,
          overflow: "hidden",
          mb: 3,
          height: { xs: 200, md: 300 },
          "@media print": {
            height: "auto",
            borderRadius: 0,
            pageBreakInside: "avoid",
          },
        }}
      >
        <Box
          component="img"
          src={tripImage}
          alt={trip.destination}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            "@media print": {
              maxHeight: "300px",
              borderRadius: "8px",
            },
          }}
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
            "@media print": {
              position: "relative",
              background: "none",
              color: "black",
              p: 0,
              mt: 2,
            },
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
            sx={{
              mt: 1,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "white",
              "@media print": {
                bgcolor: "grey.200",
                color: "black",
              },
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={2} sx={{ mb: 3 }} className="print-section">
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
            value: `₹${(trip.budget || 0).toLocaleString()}`,
            icon: <WalletIcon color="success" />,
          },
        ].map(({ label, value, icon }) => (
          <Grid xs={6} sm={4} key={label}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 3,
                textAlign: "center",
                border: "1px solid",
                borderColor: "divider",
                "@media print": {
                  border: "2px solid #eee",
                  pageBreakInside: "avoid",
                },
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
          className="print-section"
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            "@media print": {
              border: "none",
              p: 0,
              mt: 3,
              pageBreakInside: "avoid",
            },
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
