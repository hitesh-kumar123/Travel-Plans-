import React from "react";
import { Box, Typography, Container } from "@mui/material";

const TermsConditions = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom>
          Terms & Conditions
        </Typography>

        <Typography variant="body1">
          By using PackGo, users agree to follow the platform guidelines and
          terms of service. The application is intended for lawful and
          responsible use only.
        </Typography>
      </Box>
    </Container>
  );
};

export default TermsConditions;
