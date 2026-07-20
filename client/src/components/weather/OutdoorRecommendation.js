import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  generateOutdoorRecommendation,
  getTimeSlotConfig,
} from "../../utils/weatherRecommendation";

const OutdoorRecommendation = ({ weatherData }) => {
  const timeRecommendations = useMemo(() => {
    return generateOutdoorRecommendation(weatherData);
  }, [weatherData]);

  const timeSlotConfig = getTimeSlotConfig();

  if (!weatherData || Object.keys(timeRecommendations).length === 0) {
    return null;
  }

  const timeSlots = [
    { key: "morning", label: "Morning", time: "6 AM - 12 PM", icon: "🌅" },
    { key: "afternoon", label: "Afternoon", time: "12 PM - 6 PM", icon: "☀️" },
    { key: "evening", label: "Evening", time: "6 PM - 10 PM", icon: "🌇" },
    { key: "night", label: "Night", time: "10 PM - 6 AM", icon: "🌙" },
  ];

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
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        ⏰ Best Time To Go Outside
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Optimal outdoor times based on weather conditions in{" "}
        {weatherData?.location}
      </Typography>

      <Grid container spacing={2}>
        {timeSlots.map((slot) => {
          const recommendation = timeRecommendations[slot.key];
          const config =
            timeSlotConfig[recommendation?.status] || timeSlotConfig.avoid;

          return (
            <Grid item xs={12} sm={6} key={slot.key}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: config.color + "40",
                  backgroundColor: config.bgColor,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    borderColor: config.color,
                    transform: "translateY(-2px)",
                  },
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography sx={{ fontSize: "1.5rem", mr: 1.5 }}>
                      {slot.icon}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {slot.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {slot.time}
                      </Typography>
                    </Box>
                    <Chip
                      label={config.label}
                      size="small"
                      sx={{
                        backgroundColor: config.color + "20",
                        color: config.color,
                        fontWeight: 600,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      sx={{ color: config.color, mb: 0.5 }}
                    >
                      {recommendation?.recommendation || "Conditions unknown"}
                    </Typography>

                    {recommendation?.reasons &&
                      recommendation.reasons.length > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          {recommendation.reasons.slice(0, 2).join(", ")}
                        </Typography>
                      )}
                  </Box>

                  {/* Score indicator */}
                  {recommendation?.score !== undefined && (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        pt: 1,
                        borderTop: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Comfort Score
                      </Typography>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Box
                          sx={{
                            width: 40,
                            height: 4,
                            backgroundColor: "action.hover",
                            borderRadius: 2,
                            overflow: "hidden",
                          }}
                        >
                          <Box
                            sx={{
                              width: `${recommendation.score}%`,
                              height: "100%",
                              backgroundColor: config.color,
                              transition: "width 0.3s ease",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="caption"
                          fontWeight={500}
                          sx={{ color: config.color }}
                        >
                          {Math.round(recommendation.score)}%
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Overall recommendation */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: "info.light",
          color: "info.contrastText",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: "block", mb: 0.5 }}
        >
          💡 Today's Best Time
        </Typography>
        <Typography variant="caption">
          {(() => {
            const bestSlot = timeSlots
              .map((slot) => ({ ...slot, ...timeRecommendations[slot.key] }))
              .sort((a, b) => (b.score || 0) - (a.score || 0))[0];

            return `${bestSlot?.label || "Unknown"} appears to be the best time for outdoor activities today.`;
          })()}
        </Typography>
      </Box>
    </Paper>
  );
};

export default OutdoorRecommendation;
