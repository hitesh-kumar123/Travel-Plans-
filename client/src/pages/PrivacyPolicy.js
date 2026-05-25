import React from "react";
import { Box, Typography, Container } from "@mui/material";

const PrivacyPolicy = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="body1">
          PackGo values user privacy and is committed to protecting personal
          information. User data is handled securely and used only for improving
          the application experience.
        </Typography>
      </Box>
    </Container>
  );
};

export default PrivacyPolicy;
