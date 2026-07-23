import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Skeleton,
  Alert,
  Tooltip,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  fetchNearbyDestinations,
  resetNearby,
} from "../redux/actions/nearbyActions";

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km >= 1000) return `${(km / 1000).toFixed(1)}k km`;
  return `${km.toFixed(0)} km`;
}

function budgetLabel(fee) {
  if (!fee || fee === 0) return "Free entry";
  if (fee <= 30) return `₹${fee} (Budget)`;
  if (fee <= 100) return `₹${fee}`;
  return `₹${fee} (Premium)`;
}

function DestinationCard({ destination, onPlanTrip }) {
  const image =
    destination.images?.[0] ||
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=600";

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={destination.name}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap>
          {destination.name}
        </Typography>

        {(destination.city || destination.state) && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}
          >
            <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography variant="caption" color="text.secondary" noWrap>
              {[destination.city, destination.state].filter(Boolean).join(", ")}
            </Typography>
          </Box>
        )}

        <Chip
          icon={<MyLocationIcon sx={{ fontSize: "14px !important" }} />}
          label={formatDistance(destination.distanceKm)}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mr: 0.5, mb: 0.5, fontWeight: 600, fontSize: "0.7rem" }}
        />

        {destination.rating && (
          <Chip
            icon={
              <StarIcon
                sx={{
                  fontSize: "14px !important",
                  color: "#f59e0b !important",
                }}
              />
            }
            label={destination.rating.toFixed(1)}
            size="small"
            variant="outlined"
            sx={{
              mr: 0.5,
              mb: 0.5,
              fontWeight: 600,
              fontSize: "0.7rem",
              borderColor: "#f59e0b",
              color: "#b45309",
            }}
          />
        )}

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={0.5}
        >
          <AttachMoneyIcon
            sx={{ fontSize: 12, verticalAlign: "middle", mr: 0.25 }}
          />
          {budgetLabel(destination.entrance_fee_inr)}
        </Typography>

        {destination.type && (
          <Chip
            label={destination.type}
            size="small"
            sx={{ mt: 0.5, fontSize: "0.65rem", height: 18 }}
          />
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 1.5 }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<FlightTakeoffIcon />}
          onClick={() => onPlanTrip(destination.name)}
          sx={{ borderRadius: 2, fontWeight: 600, fontSize: "0.75rem" }}
          fullWidth
        >
          Plan Trip
        </Button>
      </CardActions>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Skeleton
            variant="rectangular"
            height={140}
            sx={{ borderRadius: 2, mb: 1 }}
          />
          <Skeleton width="70%" height={20} />
          <Skeleton width="50%" height={16} />
          <Skeleton width="40%" height={16} />
        </Grid>
      ))}
    </Grid>
  );
}

function DestinationSection({ title, emoji, destinations, onPlanTrip }) {
  if (!destinations.length) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
        {emoji} {title}
      </Typography>
      <Grid container spacing={2}>
        {destinations.map((d) => (
          <Grid item xs={12} sm={6} md={3} key={d._id || d.name}>
            <DestinationCard destination={d} onPlanTrip={onPlanTrip} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

const NearbyDestinations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, destinations, denied, error, userLocation } = useSelector(
    (state) => state.nearby,
  );

  const hasResults = destinations.length > 0;

  const nearest = [...destinations]
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  const budgetFriendly = [...destinations]
    .filter((d) => !d.entrance_fee_inr || d.entrance_fee_inr <= 50)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 4);

  const topRated = [...destinations]
    .filter((d) => d.rating && d.rating >= 4.3)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const handleFind = () => {
    dispatch(fetchNearbyDestinations());
  };

  const handleReset = () => {
    dispatch(resetNearby());
  };

  const handlePlanTrip = (destinationName) => {
    navigate("/dashboard/trips", {
      state: { prefillDestination: destinationName },
    });
  };

  return (
    <Box>
      {hasResults && !loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {userLocation && (
            <Typography variant="caption" color="text.secondary">
              Showing results near your current location
            </Typography>
          )}
          <Tooltip title="Clear results">
            <Button
              size="small"
              startIcon={<RefreshIcon />}
              onClick={handleReset}
              color="inherit"
              variant="outlined"
              sx={{ borderRadius: 2, ml: "auto" }}
            >
              Reset
            </Button>
          </Tooltip>
        </Box>
      )}

      {loading && <SkeletonRow />}

      {(denied || error) && !loading && (
        <Alert
          severity={denied ? "warning" : "error"}
          action={
            <Button color="inherit" size="small" onClick={handleFind}>
              Retry
            </Button>
          }
          sx={{ borderRadius: 2 }}
        >
          {error ||
            "Location access was denied. Please allow location access and try again."}
        </Alert>
      )}

      {hasResults && !loading && (
        <>
          <DestinationSection
            title="Nearest Destinations"
            emoji="🗺️"
            destinations={nearest}
            onPlanTrip={handlePlanTrip}
          />
          <DestinationSection
            title="Budget-Friendly Nearby"
            emoji="💰"
            destinations={budgetFriendly}
            onPlanTrip={handlePlanTrip}
          />
          <DestinationSection
            title="Top-Rated Nearby"
            emoji="⭐"
            destinations={topRated}
            onPlanTrip={handlePlanTrip}
          />
        </>
      )}

      {!loading && !hasResults && !denied && !error && (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            border: "2px dashed",
            borderColor: "divider",
            bgcolor: "grey.50",
          }}
        >
          <MyLocationIcon
            sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }}
          />
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Discover travel destinations near you
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Allow location access to see the closest, most affordable, and
            top-rated places to visit.
          </Typography>
          <Button
            variant="contained"
            startIcon={<MyLocationIcon />}
            onClick={handleFind}
            sx={{ borderRadius: 3, fontWeight: 700, px: 3 }}
          >
            Find Nearby Destinations
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default NearbyDestinations;
