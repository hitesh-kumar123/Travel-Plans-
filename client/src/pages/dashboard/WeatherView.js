import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Typography, Box, TextField, Button, Grid, Paper,
  InputAdornment, CircularProgress, Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import { getCurrentWeather, getForecast } from "../../redux/actions/weatherActions";

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

const WeatherView = () => {
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();
  const { currentWeather, forecast, loading, error } = useSelector((state) => state.weather);

  const forecastList = forecast?.forecast || [];

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      dispatch(getCurrentWeather(location.trim()));
      dispatch(getForecast(location.trim()));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={0.5}>Weather Forecast</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>Get real-time weather for your destinations</Typography>

      {/* Search */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 4, border: "1px solid", borderColor: "divider" }}>
        <Box component="form" onSubmit={handleSearch} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            fullWidth placeholder="Enter city name (e.g. Goa, Mumbai, London)"
            variant="outlined" value={location}
            onChange={(e) => setLocation(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>,
            }}
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}
            sx={{ height: 56, px: 4, borderRadius: 3, fontWeight: 700, whiteSpace: "nowrap" }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Search"}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: "error.light", borderRadius: 3 }}>
          <Typography color="error.dark">{error}</Typography>
        </Paper>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 4, borderRadius: 3, height: "100%",
                background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
                color: "white"
              }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.9 }}>
                    {currentWeather.location}, {currentWeather.country}
                  </Typography>
                  <Typography variant="h2" fontWeight={800} sx={{ my: 1 }}>
                    {Math.round(currentWeather.temperature)}°C
                  </Typography>
                  <Typography variant="subtitle1" sx={{ textTransform: "capitalize", opacity: 0.9 }}>
                    {currentWeather.description}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 72 }}>
                  {getWeatherIcon(currentWeather.description)}
                </Typography>
              </Box>
              <Divider sx={{ my: 2.5, borderColor: "rgba(255,255,255,0.3)" }} />
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <OpacityIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Humidity</Typography>
                      <Typography variant="body2" fontWeight={700}>{currentWeather.humidity}%</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AirIcon sx={{ fontSize: 18, opacity: 0.8 }} />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>Wind</Typography>
                      <Typography variant="body2" fontWeight={700}>{currentWeather.windSpeed} m/s</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Travel Tips */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider", height: "100%" }}>
              <Typography variant="h6" fontWeight={700} mb={2}>🧳 Travel Tip</Typography>
              <Typography color="text.secondary" mb={2}>
                {currentWeather.temperature > 30
                  ? "🌞 It's hot! Pack light cotton clothes, sunscreen, and stay hydrated."
                  : currentWeather.temperature > 20
                    ? "😊 Great weather for exploring! Comfortable clothes recommended."
                    : currentWeather.temperature > 10
                      ? "🧥 Pack a light jacket — it can get cool, especially in the evening."
                      : "🧣 It's cold! Carry warm layers, gloves, and a heavy jacket."}
              </Typography>
              {currentWeather.description?.toLowerCase().includes("rain") && (
                <Typography color="text.secondary">☔ Don't forget your umbrella!</Typography>
              )}
              <Box sx={{ mt: "auto", pt: 3 }}>
                <Typography variant="caption" color="text.disabled">
                  Last updated: {new Date().toLocaleTimeString()}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* 5-Day Forecast */}
      {forecastList.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2}>
            5-Day Forecast — {forecast?.location}
          </Typography>
          <Grid container spacing={2}>
            {forecastList.filter((_, idx) => idx % 8 === 0).slice(0, 5).map((day, idx) => (
              <Grid item xs={6} sm={4} md={2.4} key={idx}>
                <Paper elevation={0}
                  sx={{ p: 2.5, borderRadius: 3, textAlign: "center", border: "1px solid", borderColor: "divider", transition: "transform 0.2s", "&:hover": { transform: "translateY(-3px)", boxShadow: 3 } }}>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {new Date(day.date).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short" })}
                  </Typography>
                  <Typography sx={{ fontSize: 36, my: 1 }}>{getWeatherIcon(day.description)}</Typography>
                  <Typography variant="h6" fontWeight={700}>{Math.round(day.temperature)}°C</Typography>
                  <Typography variant="caption" sx={{ textTransform: "capitalize", color: "text.secondary" }}>
                    {day.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Empty state */}
      {!currentWeather && !loading && (
        <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "2px dashed", borderColor: "divider" }}>
          <Typography sx={{ fontSize: 64, mb: 2 }}>🌍</Typography>
          <Typography variant="h6" color="text.secondary">Search any city to get weather info</Typography>
          <Typography variant="body2" color="text.disabled" mt={1}>Try: Goa, Mumbai, Delhi, Manali...</Typography>
        </Paper>
      )}
    </Box>
  );
};

export default WeatherView;
