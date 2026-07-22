import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Grid,
  Paper,
  Divider,
  Skeleton,
  IconButton,
  Tooltip,
} from "@mui/material";
import AirIcon from "@mui/icons-material/Air";
import OpacityIcon from "@mui/icons-material/Opacity";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../services/api";

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

/**
 * WeatherWidget
 *
 * Self-contained weather card for a given destination. Used inside
 * TripDetail so users don't have to leave the page to check conditions.
 *
 * Deliberately uses LOCAL state (not the global `weather` Redux slice
 * that WeatherView.js relies on) so multiple instances of this widget,
 * or this widget + the standalone WeatherView page, never overwrite
 * each other's data.
 */
const WeatherWidget = ({ destination }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchWeather = useCallback(async () => {
    if (!destination) return;
    setLoading(true);
    setError(null);
    try {
      const [currentRes, forecastRes] = await Promise.all([
        api.get(`/weather/current/${destination}`),
        api.get(`/weather/forecast/${destination}`),
      ]);
      setCurrentWeather(currentRes.data);
      setForecastList(forecastRes.data?.forecast || []);
      setFetchedAt(new Date());
    } catch (err) {
      const msg =
        err.response?.data?.msg || "Unable to load weather for this trip";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [destination]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // Loading skeleton — shown on first load
  if (loading && !currentWeather) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          mb: 3,
        }}
      >
        <Skeleton variant="text" width={160} height={28} />
        <Skeleton variant="text" width={100} height={60} sx={{ my: 1 }} />
        <Skeleton variant="text" width={140} />
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: "flex", gap: 3 }}>
          <Skeleton variant="rectangular" width={80} height={20} />
          <Skeleton variant="rectangular" width={80} height={20} />
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rounded" width={90} height={120} />
          ))}
        </Box>
      </Paper>
    );
  }

  // Quiet failure — don't block trip details if weather API has issues
  if (error && !currentWeather) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
          border: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          🌍 Weather unavailable for "{destination}" right now.
        </Typography>
        <Tooltip title="Retry">
          <IconButton size="small" onClick={fetchWeather}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }

  if (!currentWeather) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 3,
          background: "linear-gradient(135deg, #1976D2 0%, #00BCD4 100%)",
          color: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography variant="subtitle2" sx={{ opacity: 0.85 }}>
              Weather in {currentWeather.location}
              {currentWeather.country ? `, ${currentWeather.country}` : ""}
            </Typography>
            <Typography variant="h3" fontWeight={800} sx={{ my: 0.5 }}>
              {Math.round(currentWeather.temperature)}°C
            </Typography>
            <Typography
              variant="body1"
              sx={{ textTransform: "capitalize", opacity: 0.9 }}
            >
              {currentWeather.description}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography sx={{ fontSize: 56 }}>
              {getWeatherIcon(currentWeather.description)}
            </Typography>
            <Tooltip title="Refresh">
              <IconButton
                size="small"
                onClick={fetchWeather}
                disabled={loading}
                sx={{ color: "white", opacity: 0.85 }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.3)" }} />

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <OpacityIcon sx={{ fontSize: 18, opacity: 0.85 }} />
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Humidity
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {currentWeather.humidity}%
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <AirIcon sx={{ fontSize: 18, opacity: 0.85 }} />
            <Box>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Wind
              </Typography>
              <Typography variant="body2" fontWeight={700}>
                {currentWeather.windSpeed} m/s
              </Typography>
            </Box>
          </Box>
          {fetchedAt && (
            <Box sx={{ marginLeft: "auto", textAlign: "right" }}>
              <Typography variant="caption" sx={{ opacity: 0.75 }}>
                Updated {fetchedAt.toLocaleTimeString()}
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* 5-Day Forecast — horizontal, responsive grid */}
      {forecastList.length > 0 && (
        <Box sx={{ mt: 2.5 }}>
          <Typography
            variant="subtitle2"
            fontWeight={700}
            mb={1.5}
            color="text.secondary"
          >
            5-Day Forecast
          </Typography>
          <Grid
            container
            spacing={1.5}
            wrap="nowrap"
            sx={{ overflowX: "auto", pb: 1 }}
          >
            {forecastList
              .filter((_, idx) => idx % 8 === 0)
              .slice(0, 5)
              .map((day, idx) => (
                <Grid key={idx} sx={{ flex: "1 0 110px", minWidth: 110 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.75,
                      textAlign: "center",
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {new Date(day.date).toLocaleDateString("en-IN", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                      })}
                    </Typography>
                    <Typography sx={{ fontSize: 30, my: 0.5 }}>
                      {getWeatherIcon(day.description)}
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {Math.round(day.temperature)}°C
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: "capitalize",
                        color: "text.secondary",
                      }}
                    >
                      {day.description}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default WeatherWidget;
