import React, { useMemo } from "react";
import {
  Paper,
  Typography,
  Box,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import {
  generatePackingChecklist,
  getPackingCategories,
} from "../../utils/packingUtils";

const PackingChecklist = ({ weatherData }) => {
  const packingItems = useMemo(() => {
    return generatePackingChecklist(weatherData);
  }, [weatherData]);

  const categories = getPackingCategories();

  // Group items by category
  const groupedItems = useMemo(() => {
    const grouped = {};
    packingItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [packingItems]);

  if (packingItems.length === 0) {
    return null;
  }

  const essentialItems = packingItems.filter((item) => item.essential);
  const totalItems = packingItems.length;

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
          🎒 AI Packing Checklist
        </Typography>
        <Chip
          label={`${totalItems} items`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Smart recommendations based on weather conditions in{" "}
        {weatherData?.location}
      </Typography>

      {/* Essential Items - Always show first */}
      {essentialItems.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mb: 2, color: "error.main" }}
          >
            ✨ Essential Items
          </Typography>
          <Grid container spacing={1}>
            {essentialItems.map((item) => (
              <Grid item xs={12} sm={6} key={item.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "error.light",
                    backgroundColor: "rgba(245, 101, 101, 0.05)",
                  }}
                >
                  <Typography sx={{ fontSize: "1.2rem", mr: 1.5 }}>
                    {item.icon}
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {item.item}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Categorized Items */}
      <Box>
        {Object.entries(groupedItems).map(([categoryKey, items]) => {
          const category = categories[categoryKey];
          const nonEssentialItems = items.filter((item) => !item.essential);

          if (nonEssentialItems.length === 0) return null;

          return (
            <Accordion
              key={categoryKey}
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "8px !important",
                mb: 1,
                "&:before": { display: "none" },
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{ display: "flex", alignItems: "center", width: "100%" }}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      backgroundColor: category?.color || "#718096",
                      mr: 1.5,
                    }}
                  />
                  <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    sx={{ flexGrow: 1 }}
                  >
                    {category?.name || categoryKey}
                  </Typography>
                  <Chip
                    label={nonEssentialItems.length}
                    size="small"
                    sx={{
                      backgroundColor: category?.color + "20",
                      color: category?.color,
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0 }}>
                <List dense>
                  {nonEssentialItems.map((item) => (
                    <ListItem
                      key={item.id}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        "&:hover": {
                          backgroundColor: "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Typography sx={{ fontSize: "1.1rem" }}>
                          {item.icon}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={item.item}
                        secondary={item.reason}
                        primaryTypographyProps={{
                          variant: "body2",
                          fontWeight: 500,
                        }}
                        secondaryTypographyProps={{
                          variant: "caption",
                          color: "text.secondary",
                        }}
                      />
                      <CheckCircleOutlinedIcon
                        sx={{
                          color: "action.disabled",
                          cursor: "pointer",
                          "&:hover": {
                            color: "success.main",
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>

      {/* Weather-based tip */}
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
          💡 Weather Tip
        </Typography>
        <Typography variant="caption">
          {weatherData?.temperature > 30
            ? "Pack light, breathable fabrics and sun protection for hot weather."
            : weatherData?.temperature < 10
              ? "Layer clothing for warmth and pack weather-resistant items."
              : "Great weather! Pack comfortable clothes for outdoor activities."}
        </Typography>
      </Box>
    </Paper>
  );
};

export default PackingChecklist;
