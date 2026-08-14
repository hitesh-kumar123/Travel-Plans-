import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { calculateReadinessScore } from "../../utils/readinessUtils";

const TripReadiness = ({
  weatherData,
  hasPackingList = true,
  hasAlerts = true,
}) => {
  const readinessData = useMemo(() => {
    return calculateReadinessScore(weatherData, hasPackingList, hasAlerts);
  }, [weatherData, hasPackingList, hasAlerts]);

  if (!weatherData) {
    return null;
  }

  const { score, status, statusColor, checklist, completedItems, totalItems } =
    readinessData;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
        📊 Trip Readiness Score
      </Typography>

      {/* Circular Progress */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 4,
        }}
      >
        <Box sx={{ position: "relative", display: "inline-flex" }}>
          <CircularProgress
            variant="determinate"
            value={100}
            size={120}
            thickness={4}
            sx={{
              color: "#e0e0e0",
              position: "absolute",
            }}
          />
          <CircularProgress
            variant="determinate"
            value={score}
            size={120}
            thickness={4}
            sx={{
              color: statusColor,
              transform: "rotate(-90deg) !important",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: "absolute",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Typography
              variant="h4"
              component="div"
              fontWeight={800}
              sx={{ color: statusColor }}
            >
              {score}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Status */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{ color: statusColor, mb: 0.5 }}
        >
          {status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {completedItems} of {totalItems} items completed
        </Typography>
      </Box>

      {/* Checklist */}
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
          Preparation Checklist
        </Typography>
        <List dense>
          {checklist.map((item) => (
            <ListItem
              key={item.id}
              sx={{
                px: 0,
                borderRadius: 2,
                mb: 0.5,
                backgroundColor: item.completed
                  ? "success.light"
                  : "action.hover",
                transition: "all 0.2s ease",
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.completed ? (
                  <CheckCircleIcon sx={{ color: "success.main" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ color: "action.disabled" }} />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: "0.9rem" }}>
                      {item.icon}
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{
                        textDecoration: item.completed
                          ? "line-through"
                          : "none",
                        color: item.completed
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      {item.label}
                    </Typography>
                  </Box>
                }
              />
              {item.applicable === false && (
                <Chip
                  label="N/A"
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem", height: 20 }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Progress Summary */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor:
            score >= 80
              ? "success.light"
              : score >= 50
                ? "warning.light"
                : "error.light",
          color:
            score >= 80
              ? "success.contrastText"
              : score >= 50
                ? "warning.contrastText"
                : "error.contrastText",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: "block", mb: 0.5 }}
        >
          {score >= 80
            ? "🎉 Excellent!"
            : score >= 50
              ? "⚠️ Almost there"
              : "📝 Needs attention"}
        </Typography>
        <Typography variant="caption">
          {score >= 80
            ? "You're well-prepared for your trip. Have a great journey!"
            : score >= 50
              ? "Complete the remaining items for optimal preparation."
              : "Several important items need your attention before traveling."}
        </Typography>
      </Box>
    </Paper>
  );
};

export default TripReadiness;
