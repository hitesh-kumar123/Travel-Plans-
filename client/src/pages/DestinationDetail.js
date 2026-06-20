import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Button,
  Rating,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceIcon from "@mui/icons-material/Place";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InfoIcon from "@mui/icons-material/Info";
import api from "../services/api";
import { useDispatch, useSelector } from "react-redux";
import { addTrip } from "../redux/actions/tripActions";
import { addRecentlyViewed } from "../utils/recentlyViewed";

// --- one-time fix, lives outside the component ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [destination, setDestination] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  const handlePlanTrip = () => {
    if (!destination) return;
    addRecentlyViewed(destination);

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const today = new Date();
    const next = new Date();
    next.setDate(today.getDate() + 7);

    dispatch(
      addTrip({
        destination: destination.name,
        startDate: today.toISOString().split("T")[0],
        endDate: next.toISOString().split("T")[0],
        description: `Trip to ${destination.city || destination.name}`,
      }),
    );
    navigate("/dashboard/trips");
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`/destinations/${id}`)
      .then((res) => {
        setDestination(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setActiveImage(res.data.images[0]);
        }
      })
      .catch((err) => console.error("Error fetching destination details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch weather after destination data is loaded
  useEffect(() => {
    if (destination) {
      const location = destination.city || destination.name;
      api
        .get(`/weather/current/${encodeURIComponent(location)}`)
        .then((res) => {
          setWeather(res.data);
        })
        .catch((err) => {
          console.warn(
            "Could not load current weather (requires login/valid API key):",
            err,
          );
        });
    }
  }, [destination]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  if (!destination) {
    return (
      <Container sx={{ mt: 8, textAlign: "center" }}>
        <Typography variant="h5" color="error" gutterBottom>
          Destination not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  const { lat, lon } = destination.coordinates || {};
  const hasCoords = typeof lat === "number" && typeof lon === "number";

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        variant="text"
        color="inherit"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Back
      </Button>

      <Grid container spacing={4}>
        {/* Left Column: Title, Gallery, Description, Map */}
        <Grid item xs={12} md={8}>
          {/* Header Info */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h3"
              fontWeight={800}
              gutterBottom
              sx={{ letterSpacing: "-1px" }}
            >
              {destination.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                }}
              >
                <PlaceIcon sx={{ mr: 0.5, fontSize: "1.2rem" }} />
                <Typography variant="subtitle1" fontWeight={500}>
                  {[destination.city, destination.state]
                    .filter(Boolean)
                    .join(", ")}
                </Typography>
              </Box>
              {destination.rating && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Rating
                    value={destination.rating}
                    readOnly
                    precision={0.1}
                    size="small"
                  />
                  <Typography variant="body2" fontWeight={700}>
                    {destination.rating}
                  </Typography>
                </Box>
              )}
              {destination.type && (
                <Chip
                  label={destination.type}
                  color="primary"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Box>
          </Box>

          {/* Main Gallery Showcase */}
          <Paper
            elevation={3}
            sx={{
              position: "relative",
              borderRadius: 4,
              overflow: "hidden",
              height: { xs: 260, md: 450 },
              mb: 2,
              background: "#eaeaea",
            }}
          >
            <Box
              component="img"
              src={
                activeImage ||
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=1200"
              }
              alt={destination.name}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Paper>

          {/* Gallery Thumbnails */}
          {destination.images && destination.images.length > 1 && (
            <Box
              sx={{
                display: "flex",
                gap: 1.5,
                mb: 4,
                overflowX: "auto",
                py: 1,
                "&::-webkit-scrollbar": { height: 6 },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: "rgba(0,0,0,0.15)",
                  borderRadius: 3,
                },
              }}
            >
              {destination.images.map((img, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={img}
                  alt={`${destination.name} thumbnail ${idx + 1}`}
                  onClick={() => setActiveImage(img)}
                  sx={{
                    width: 90,
                    height: 65,
                    borderRadius: 2,
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "2px solid",
                    borderColor:
                      activeImage === img ? "primary.main" : "transparent",
                    transition: "all 0.2s ease",
                    opacity: activeImage === img ? 1 : 0.7,
                    boxShadow:
                      activeImage === img
                        ? "0 4px 8px rgba(25, 118, 210, 0.2)"
                        : "none",
                    "&:hover": {
                      opacity: 1,
                      transform: "scale(1.04)",
                    },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Description / Significance */}
          {destination.significance && (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                mb: 4,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                gutterBottom
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <InfoIcon color="primary" /> About
              </Typography>
              <Typography color="text.secondary" lineHeight={1.6}>
                {destination.significance}
              </Typography>
            </Paper>
          )}

          {/* Map Location Section */}
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 2 }}>
            Location & Map
          </Typography>
          <Box sx={{ mb: 4 }}>
            {hasCoords ? (
              <Box
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <MapContainer
                  center={[lat, lon]}
                  zoom={12}
                  scrollWheelZoom={false}
                  style={{ height: "350px", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lon]}>
                    <Popup>
                      <Typography fontWeight={700}>
                        {destination.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {[destination.city, destination.state]
                          .filter(Boolean)
                          .join(", ")}
                      </Typography>
                    </Popup>
                  </Marker>
                </MapContainer>
              </Box>
            ) : (
              <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
                <Typography color="text.secondary">
                  Map location not available for this destination.
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>

        {/* Right Column: Destination Stats & Weather */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3} sx={{ position: "sticky", top: 24 }}>
            {/* Quick Facts Card */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ mb: 2.5 }}
                  >
                    Quick Facts
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {/* Best Time to Visit */}
                    {destination.best_time_to_visit && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <CalendarTodayIcon color="primary" sx={{ mt: 0.2 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Best Time to Visit
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.best_time_to_visit}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Time Needed */}
                    {destination.time_needed_hrs && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <AccessTimeIcon color="primary" sx={{ mt: 0.2 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Time Needed
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.time_needed_hrs} hours
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Entrance Fee */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                      }}
                    >
                      <CurrencyRupeeIcon color="primary" sx={{ mt: 0.2 }} />
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={500}
                        >
                          Entrance Fee
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {destination.entrance_fee_inr === 0
                            ? "Free Entry"
                            : destination.entrance_fee_inr
                              ? `₹${destination.entrance_fee_inr}`
                              : "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    {/* DSLR Allowed */}
                    {destination.dslr_allowed && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <CameraAltIcon color="primary" sx={{ mt: 0.2 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            DSLR Allowed
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {destination.dslr_allowed}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Weekly Off */}
                    {destination.weekly_off && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <CalendarTodayIcon color="primary" sx={{ mt: 0.2 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Weekly Off
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {destination.weekly_off}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Establishment Year */}
                    {destination.establishment_year && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                        }}
                      >
                        <CalendarTodayIcon color="primary" sx={{ mt: 0.2 }} />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            Established
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.establishment_year}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                      mt: 3,
                      borderRadius: 2,
                      fontWeight: 700,
                      textTransform: "none",
                    }}
                    onClick={handlePlanTrip}
                  >
                    Plan Trip to {destination.name} ✈️
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            {/* Current Weather Card */}
            {weather && (
              <Grid item xs={12}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(to right bottom, #e3f2fd, #ffffff)",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" fontWeight={700}>
                        Current Weather
                      </Typography>
                      <WbSunnyIcon color="warning" />
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Typography variant="h4" fontWeight={800}>
                        {Math.round(weather.main?.temp || weather.temp || 27)}°C
                      </Typography>
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ textTransform: "capitalize" }}
                        >
                          {weather.weather?.[0]?.description ||
                            weather.description ||
                            "Clear Sky"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Feels like{" "}
                          {Math.round(
                            weather.main?.feels_like ||
                              weather.feels_like ||
                              28,
                          )}
                          °C
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 2,
                        pt: 2,
                        borderTop: "1px solid rgba(0,0,0,0.06)",
                      }}
                    >
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Humidity
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {weather.main?.humidity || weather.humidity || 60}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          Wind Speed
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {weather.wind?.speed || weather.wind_speed || 4.2} m/s
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DestinationDetail;
