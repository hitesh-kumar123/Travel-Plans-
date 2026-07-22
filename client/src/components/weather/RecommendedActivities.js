import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  generateActivityRecommendations,
  getActivityCategories,
} from "../../utils/activityUtils";

const RecommendedActivities = ({ weatherData }) => {
  const activities = useMemo(() => {
    return generateActivityRecommendations(weatherData);
  }, [weatherData]);

  const categories = getActivityCategories();

  if (!weatherData) {
    return null;
  }

  const { recommended, avoid } = activities;

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
        🎯 AI Recommended Activities
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Personalized activity suggestions based on current weather in{" "}
        {weatherData?.location}
      </Typography>

      {/* Recommended Activities */}
      {recommended.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ThumbUpIcon
              sx={{ color: "success.main", mr: 1, fontSize: "1.2rem" }}
            />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ color: "success.main" }}
            >
              Recommended
            </Typography>
            <Chip
              label={recommended.length}
              size="small"
              color="success"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>

          <Grid container spacing={1.5}>
            {recommended.map((activity) => {
              const category = categories[activity.category];

              return (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid",
                      borderColor: "success.light",
                      backgroundColor: "rgba(72, 187, 120, 0.05)",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        borderColor: "success.main",
                        transform: "translateY(-1px)",
                        boxShadow: 2,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <Typography sx={{ fontSize: "1.5rem", mr: 1.5 }}>
                          {activity.icon}
                        </Typography>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            sx={{ color: "text.primary" }}
                          >
                            {activity.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1, lineHeight: 1.4 }}
                      >
                        {activity.reason}
                      </Typography>

                      {category && (
                        <Chip
                          label={category.name}
                          size="small"
                          sx={{
                            backgroundColor: category.color + "20",
                            color: category.color,
                            fontSize: "0.7rem",
                            height: 20,
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* Separator */}
      {recommended.length > 0 && avoid.length > 0 && <Divider sx={{ my: 3 }} />}

      {/* Activities to Avoid */}
      {avoid.length > 0 && (
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ThumbDownIcon
              sx={{ color: "error.main", mr: 1, fontSize: "1.2rem" }}
            />
            <Typography
              variant="subtitle2"
              fontWeight={600}
              sx={{ color: "error.main" }}
            >
              Better to Avoid
            </Typography>
            <Chip
              label={avoid.length}
              size="small"
              color="error"
              variant="outlined"
              sx={{ ml: 1 }}
            />
          </Box>

          <Grid container spacing={1.5}>
            {avoid.map((activity) => {
              const category = categories[activity.category];

              return (
                <Grid item xs={12} sm={6} md={4} key={activity.id}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid",
                      borderColor: "error.light",
                      backgroundColor: "rgba(245, 101, 101, 0.05)",
                      opacity: 0.8,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        opacity: 1,
                        borderColor: "error.main",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                      >
                        <Typography
                          sx={{
                            fontSize: "1.5rem",
                            mr: 1.5,
                            filter: "grayscale(50%)",
                          }}
                        >
                          {activity.icon}
                        </Typography>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            noWrap
                            sx={{ color: "text.secondary" }}
                          >
                            {activity.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mb: 1, lineHeight: 1.4 }}
                      >
                        {activity.reason}
                      </Typography>

                      {category && (
                        <Chip
                          label={category.name}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderColor: category.color + "40",
                            color: category.color,
                            fontSize: "0.7rem",
                            height: 20,
                            opacity: 0.7,
                          }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}

      {/* No activities message */}
      {recommended.length === 0 && avoid.length === 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            py: 4,
          }}
        >
          <Typography sx={{ fontSize: 48, mb: 2 }}>🎯</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Analyzing Activities...
          </Typography>
          <Typography variant="body2" color="text.disabled" textAlign="center">
            Unable to generate activity recommendations at this time.
          </Typography>
        </Box>
      )}

      {/* Weather context tip */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          backgroundColor: "primary.light",
          color: "primary.contrastText",
        }}
      >
        <Typography
          variant="caption"
          fontWeight={600}
          sx={{ display: "block", mb: 0.5 }}
        >
          🌤️ Weather Context
        </Typography>
        <Typography variant="caption">
          {weatherData?.temperature > 30
            ? "Hot weather favors indoor and water activities. Stay hydrated and seek shade."
            : weatherData?.temperature < 10
              ? "Cold weather is perfect for cozy indoor activities and warm beverages."
              : weatherData?.description?.toLowerCase().includes("rain")
                ? "Rainy conditions make indoor activities more appealing today."
                : "Pleasant weather offers great flexibility for both indoor and outdoor activities."}
        </Typography>
      </Box>
    </Paper>
  );
};

export default RecommendedActivities;
