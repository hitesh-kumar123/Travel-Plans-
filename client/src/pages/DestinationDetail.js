import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import InfoIcon from "@mui/icons-material/Info";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";

// Import Leaflet icons statically to avoid Webpack hashing issues in CI
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Import services and actions
import api from "../services/api";
import { addTrip } from "../redux/actions/tripActions";
import { addRecentlyViewed } from "../utils/recentlyViewed";
import {
  getCurrentWeather,
  getForecast,
} from "../redux/actions/weatherActions";

// Reconfigure Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const getWeatherIcon = (desc) => {
  if (!desc) return "☀️";
  const d = desc.toLowerCase();
  if (d.includes("rain")) return "🌧️";
  if (d.includes("cloud")) return "☁️";
  if (d.includes("thunder")) return "⛈️";
  if (d.includes("snow")) return "❄️";
  if (d.includes("clear")) return "☀️";
  if (d.includes("mist") || d.includes("fog")) return "🌫️";
  return "🌤️";
};

const DestinationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentWeather, forecast } = useSelector((state) => state.weather);

  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [nearby, setNearby] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);

  // Fetch destination details
  useEffect(() => {
    setLoading(true);
    api
      .get(`/destinations/${id}`)
      .then((res) => {
        setDestination(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setActiveImage(res.data.images[0]);
        }
        // Save to recently viewed
        addRecentlyViewed(res.data);
      })
      .catch((err) => {
        console.error("Error fetching destination details:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch weather when destination city is available
  useEffect(() => {
    if (destination?.city) {
      dispatch(getCurrentWeather(destination.city));
      dispatch(getForecast(destination.city));
    }
  }, [destination?.city, dispatch]);

  // Fetch nearby destinations
  useEffect(() => {
    if (!destination) return;
    setNearbyLoading(true);

    const queryCity = destination.city ? `city=${destination.city}` : "";
    const queryState = destination.state ? `state=${destination.state}` : "";
    const query = queryCity || queryState;

    if (!query) {
      setNearby([]);
      setNearbyLoading(false);
      return;
    }

    api
      .get(`/destinations?${query}`)
      .then((res) => {
        const filtered = (res.data || [])
          .filter((d) => d._id !== destination._id)
          .slice(0, 4);
        setNearby(filtered);
      })
      .catch((err) => {
        console.error("Error fetching nearby attractions:", err);
      })
      .finally(() => {
        setNearbyLoading(false);
      });
  }, [destination]);

  const handlePlanTrip = () => {
    if (!destination) return;

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
        <CircularProgress color="primary" size={60} />
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

  // Calculate 3-day forecast strip
  const forecastList = forecast?.forecast || [];
  const threeDayForecast = forecastList
    .filter((_, idx) => idx % 8 === 0)
    .slice(0, 3);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        variant="text"
        color="inherit"
        sx={{ mb: 3, fontWeight: 600 }}
      >
        Back to Home
      </Button>

      <Grid container spacing={4}>
        {/* Left Column: Title, Gallery, Description, Best Time to Visit, Map */}
        <Grid item xs={12} md={8}>
          {/* Header Info */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h3"
              fontWeight={800}
              gutterBottom
              sx={{ color: "var(--ocean)", letterSpacing: "-1px" }}
            >
              {destination.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Chip
                icon={<PlaceIcon />}
                label={[destination.city, destination.state]
                  .filter(Boolean)
                  .join(", ")}
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
              {destination.type && (
                <Chip
                  label={destination.type}
                  color="primary"
                  variant="contained"
                  sx={{ textTransform: "capitalize", fontWeight: 500 }}
                />
              )}
              {destination.rating && (
                <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
                  <Rating
                    value={destination.rating}
                    readOnly
                    precision={0.1}
                    size="small"
                  />
                  <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
                    {destination.rating}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Interactive Image Gallery */}
          <Paper
            elevation={0}
            sx={{ borderRadius: 4, overflow: "hidden", mb: 4 }}
          >
            {/* Main Showcase Image */}
            <Box
              sx={{
                width: "100%",
                height: 450,
                backgroundColor: "#e0e0e0",
                position: "relative",
              }}
            >
              <img
                src={
                  activeImage ||
                  "https://images.unsplash.com/photo-1506461883276-594a12b11db3?auto=format&fit=crop&w=800&q=80"
                }
                alt={destination.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "all 0.3s ease",
                }}
              />
            </Box>

            {/* Thumbnail Row */}
            {destination.images && destination.images.length > 1 && (
              <Box
                sx={{
                  display: "flex",
                  gap: 1.5,
                  p: 2,
                  backgroundColor: "rgba(0,0,0,0.02)",
                  overflowX: "auto",
                  whiteSpace: "nowrap",
                }}
              >
                {destination.images.map((img, idx) => (
                  <Box
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    sx={{
                      width: 80,
                      height: 60,
                      borderRadius: 2,
                      overflow: "hidden",
                      cursor: "pointer",
                      border:
                        activeImage === img
                          ? "3px solid var(--coral)"
                          : "2px solid transparent",
                      transition: "all 0.2s ease",
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img}
                      alt={`${destination.name} thumbnail ${idx + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Description */}
          <Typography
            variant="h5"
            fontWeight={700}
            gutterBottom
            sx={{ color: "var(--ocean)" }}
          >
            About this Place
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{ lineHeight: 1.7, mb: 4 }}
          >
            {destination.description ||
              "Explore the history, architecture, and scenic views of this incredible tourist attraction. Perfect for travelers looking to experience the local cultural heritage."}
          </Typography>

          {/* Best Time to Visit (Labeled Section) */}
          {destination.best_time_to_visit && (
            <Card
              variant="outlined"
              sx={{
                mb: 4,
                borderRadius: 3,
                borderColor: "rgba(232, 115, 90, 0.25)",
                background:
                  "linear-gradient(135deg, rgba(253, 250, 245, 0.4) 0%, rgba(232, 115, 90, 0.04) 100%)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 1,
                  }}
                >
                  <WbSunnyIcon sx={{ color: "var(--coral)" }} />
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{ color: "var(--ocean)" }}
                  >
                    Best Time to Visit
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ fontWeight: 500 }}
                >
                  {destination.best_time_to_visit}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  We recommend planning your visit during these hours/season to
                  enjoy the best experience and pleasant weather conditions.
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Map Section */}
          {hasCoords && (
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                gutterBottom
                sx={{ color: "var(--ocean)", mb: 2 }}
              >
                Location Map
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  height: 350,
                  width: "100%",
                  borderRadius: 4,
                  overflow: "hidden",
                  border: "1px solid rgba(0,0,0,0.1)",
                  zIndex: 1,
                  position: "relative",
                }}
              >
                <MapContainer
                  center={[lat, lon]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[lat, lon]}>
                    <Popup>
                      <strong>{destination.name}</strong>
                      <br />
                      {[destination.city, destination.state]
                        .filter(Boolean)
                        .join(", ")}
                    </Popup>
                  </Marker>
                </MapContainer>
              </Paper>
            </Box>
          )}
        </Grid>

        {/* Right Column: Weather, Quick Facts, CTA button */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Weather widget (Compact Widget: current temp + icon + 3-day strip) */}
            {currentWeather && (
              <Grid item xs={12}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(to right bottom, #e3f2fd, #ffffff)",
                    borderColor: "rgba(25, 118, 210, 0.15)",
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
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="primary.dark"
                      >
                        Weather Info
                      </Typography>
                      <Chip
                        size="small"
                        label="Live updates"
                        color="success"
                        variant="outlined"
                        sx={{ fontSize: "0.68rem", height: 20 }}
                      />
                    </Box>

                    {/* Current Weather summary */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                      >
                        <Typography sx={{ fontSize: 44, lineHeight: 1 }}>
                          {getWeatherIcon(currentWeather.description)}
                        </Typography>
                        <Box>
                          <Typography
                            variant="h4"
                            fontWeight={800}
                            color="text.primary"
                          >
                            {Math.round(currentWeather.temperature)}°C
                          </Typography>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            color="text.secondary"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {currentWeather.description || "Clear Sky"}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    {/* Wind and Humidity info */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 1,
                        px: 1.5,
                        mb: 2,
                        borderRadius: 2,
                        backgroundColor: "rgba(25, 118, 210, 0.05)",
                      }}
                    >
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <OpacityIcon
                          sx={{ fontSize: 16, color: "primary.main" }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Humidity: <strong>{currentWeather.humidity}%</strong>
                        </Typography>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <AirIcon sx={{ fontSize: 16, color: "primary.main" }} />
                        <Typography variant="caption" color="text.secondary">
                          Wind: <strong>{currentWeather.windSpeed} m/s</strong>
                        </Typography>
                      </Box>
                    </Box>

                    {/* 3-day strip forecast */}
                    {threeDayForecast.length > 0 && (
                      <Box>
                        <Divider sx={{ my: 1.5 }} />
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          color="text.secondary"
                          display="block"
                          mb={1}
                        >
                          3-DAY FORECAST
                        </Typography>
                        <Grid container spacing={1}>
                          {threeDayForecast.map((day, idx) => (
                            <Grid item xs={4} key={idx}>
                              <Paper
                                elevation={0}
                                sx={{
                                  p: 1,
                                  textAlign: "center",
                                  backgroundColor: "rgba(0,0,0,0.02)",
                                  borderRadius: 2,
                                  border: "1px solid rgba(0,0,0,0.04)",
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  fontWeight={600}
                                  color="text.secondary"
                                  display="block"
                                >
                                  {new Date(day.date).toLocaleDateString(
                                    "en-IN",
                                    {
                                      weekday: "short",
                                    },
                                  )}
                                </Typography>
                                <Typography sx={{ fontSize: 22, my: 0.5 }}>
                                  {getWeatherIcon(day.description)}
                                </Typography>
                                <Typography variant="body2" fontWeight={700}>
                                  {Math.round(day.temperature)}°C
                                </Typography>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Quick Facts Sidebar Card */}
            <Grid item xs={12}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    gutterBottom
                    sx={{ color: "var(--ocean)" }}
                  >
                    Quick Facts
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    {destination.entrance_fee_inr !== undefined && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CurrencyRupeeIcon color="action" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Entrance Fee
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.entrance_fee_inr === 0
                              ? "Free Entry"
                              : `₹${destination.entrance_fee_inr}`}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {destination.time_needed_hrs && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <AccessTimeIcon color="action" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Time Needed
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.time_needed_hrs} Hours
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {destination.dslr_allowed && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CameraAltIcon color="action" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            DSLR Camera Allowed
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.dslr_allowed}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {destination.establishment_year && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <CalendarTodayIcon color="action" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Established In
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.establishment_year} AD
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {destination.weekly_off && (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <InfoIcon color="action" />
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            Weekly Closed Day
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {destination.weekly_off}
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handlePlanTrip}
                    sx={{
                      mt: 4,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, #e8735a 0%, #d95d42 100%)",
                      textTransform: "none",
                      fontSize: "1rem",
                      boxShadow: "0 8px 20px rgba(232, 115, 90, 0.25)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #ef8269, #d95d42)",
                      },
                    }}
                  >
                    Plan Trip here ✈️
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Nearby Attractions */}
      {(nearbyLoading || nearby.length > 0) && (
        <Box sx={{ mt: 8, mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            gutterBottom
            sx={{
              color: "var(--ocean)",
              fontFamily: "Playfair Display, serif",
            }}
          >
            Nearby Attractions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover other points of interest in{" "}
            {destination.city || destination.state}
          </Typography>

          {nearbyLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {nearby.map((dest) => (
                <Grid item xs={12} sm={6} md={3} key={dest._id}>
                  {/* Reuse wander-dest-card class from Home.js markup/styling */}
                  <div
                    className="wander-dest-card"
                    style={{ height: 230, position: "relative" }}
                    onClick={() => {
                      navigate(`/destination/${dest._id}`);
                      window.scrollTo(0, 0);
                    }}
                  >
                    <div
                      className="wander-dest-card-img"
                      style={{ height: "100%" }}
                    >
                      <img
                        src={
                          dest.images?.[0] ||
                          "https://images.unsplash.com/photo-1506461883276-594a12b11db3?auto=format&fit=crop&w=800&q=80"
                        }
                        alt={dest.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div className="wander-dest-overlay" />
                      <div className="wander-dest-info">
                        <div
                          className="wander-dest-name"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {dest.name}
                        </div>
                        <div className="wander-dest-country">
                          {[dest.city, dest.state].filter(Boolean).join(", ")}
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
};

export default DestinationDetail;
