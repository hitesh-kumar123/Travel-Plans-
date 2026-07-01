import React from "react";
import { Box, Typography } from "@mui/material";
import NearbyDestinations from "../../components/NearbyDestinations";

const NearbyView = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          Nearby Destinations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Find places to visit based on your current location
        </Typography>
      </Box>

      <NearbyDestinations />
    </Box>
  );
};

export default NearbyView;
