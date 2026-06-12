import React from "react";
import { Card, CardContent, CardActions, Skeleton, Box } from "@mui/material";

const TripSkeleton = () => {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        overflow: "hidden",
      }}
    >
      <Skeleton variant="rectangular" height={160} />
      <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1, px: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={1}
        >
          <Skeleton variant="text" width="60%" height={32} />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="80%" height={24} />
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, justifyContent: "space-between" }}>
        <Skeleton variant="text" width="30%" height={24} />
        <Skeleton
          variant="rectangular"
          width={80}
          height={32}
          sx={{ borderRadius: 1 }}
        />
      </CardActions>
    </Card>
  );
};

export default TripSkeleton;
