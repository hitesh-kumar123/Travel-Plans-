import React from "react";
import { Box, Typography, Rating, LinearProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const RatingSummary = ({ averageRating, totalCount, ratingDistribution }) => {
  const dist = ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 3,
        bgcolor: "background.paper",
        boxShadow: 1,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        alignItems: { xs: "flex-start", sm: "center" },
      }}
    >
      {/* Left: big number */}
      <Box sx={{ textAlign: "center", minWidth: 100 }}>
        <Typography
          variant="h2"
          fontWeight={800}
          color="primary.main"
          sx={{ lineHeight: 1 }}
        >
          {averageRating?.toFixed(1) || "0.0"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 0.5 }}>
          <Rating
            value={averageRating || 0}
            readOnly
            precision={0.1}
            icon={<StarIcon fontSize="inherit" />}
            size="small"
          />
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          mt={0.5}
          display="block"
        >
          {totalCount?.toLocaleString() || 0} reviews
        </Typography>
      </Box>

      {/* Right: bar chart */}
      <Box sx={{ flex: 1, width: "100%" }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = dist[star] || 0;
          const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
          return (
            <Box
              key={star}
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 14, textAlign: "right", fontWeight: 600 }}
              >
                {star}
              </Typography>
              <StarIcon
                sx={{ fontSize: 13, color: "#FFB300", flexShrink: 0 }}
              />
              <LinearProgress
                variant="determinate"
                value={pct}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: "grey.100",
                  "& .MuiLinearProgress-bar": { borderRadius: 4 },
                }}
              />
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ minWidth: 28, textAlign: "right" }}
              >
                {count}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default RatingSummary;
