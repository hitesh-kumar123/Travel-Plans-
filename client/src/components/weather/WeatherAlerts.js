import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Alert,
  AlertTitle,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import {
  generateWeatherAlerts,
  getAlertSeverityConfig,
} from "../../utils/alertUtils";

const WeatherAlerts = ({ weatherData }) => {
  const alerts = useMemo(() => {
    return generateWeatherAlerts(weatherData);
  }, [weatherData]);

  const severityConfig = getAlertSeverityConfig();

  if (alerts.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          height: "100%",
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
          🛡️ Weather Alerts
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            py: 4,
          }}
        >
          <Typography sx={{ fontSize: 48, mb: 2 }}>✅</Typography>
          <Typography
            variant="h6"
            color="success.main"
            fontWeight={600}
            sx={{ mb: 1 }}
          >
            All Clear!
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            No weather alerts for {weatherData?.location}. Conditions look great
            for your trip!
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
          🛡️ Weather Alerts
        </Typography>
        <Chip
          label={`${alerts.length} alert${alerts.length > 1 ? "s" : ""}`}
          size="small"
          color={
            alerts.some((a) => a.severity === "high") ? "error" : "warning"
          }
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Stay safe with these weather-based recommendations for{" "}
        {weatherData?.location}
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];

          return (
            <Alert
              key={alert.id}
              severity={
                alert.severity === "high"
                  ? "error"
                  : alert.severity === "medium"
                    ? "warning"
                    : "info"
              }
              sx={{
                borderRadius: 2,
                "& .MuiAlert-icon": {
                  fontSize: "1.2rem",
                },
              }}
            >
              <AlertTitle
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                <Typography component="span" sx={{ fontSize: "1rem" }}>
                  {alert.icon}
                </Typography>
                <Typography variant="subtitle2" fontWeight={600}>
                  {alert.title}
                </Typography>
                <Chip
                  label={alert.severity.toUpperCase()}
                  size="small"
                  color={
                    alert.severity === "high"
                      ? "error"
                      : alert.severity === "medium"
                        ? "warning"
                        : "info"
                  }
                  sx={{ ml: "auto", fontSize: "0.7rem", height: 20 }}
                />
              </AlertTitle>

              <Typography variant="body2" sx={{ mb: 2 }}>
                {alert.description}
              </Typography>

              {alert.actions && alert.actions.length > 0 && (
                <Box>
                  <Typography
                    variant="caption"
                    fontWeight={600}
                    sx={{ display: "block", mb: 1 }}
                  >
                    Recommended Actions:
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {alert.actions.map((action, index) => (
                      <ListItem key={index} sx={{ py: 0.25, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 20 }}>
                          <CheckIcon
                            sx={{ fontSize: "0.8rem", color: "text.secondary" }}
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={action}
                          primaryTypographyProps={{
                            variant: "caption",
                            color: "text.secondary",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Alert>
          );
        })}
      </Box>

      {/* Summary tip */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: alerts.some((a) => a.severity === "high")
            ? "error.light"
            : "warning.light",
          color: alerts.some((a) => a.severity === "high")
            ? "error.contrastText"
            : "warning.contrastText",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: "block", mb: 0.5 }}
        >
          💡 Safety Reminder
        </Typography>
        <Typography variant="caption">
          {alerts.some((a) => a.severity === "high")
            ? "High-severity alerts detected. Consider postponing outdoor activities or taking extra precautions."
            : "Monitor weather conditions and follow recommended safety measures for a safe trip."}
        </Typography>
      </Box>
    </Paper>
  );
};

export default WeatherAlerts;
