import React from "react";
import { Box, Typography, Container } from "@mui/material";

const About = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom>
          About PackGo
        </Typography>

        <Typography variant="body1">
          PackGo is a smart travel planner designed to help users organize
          trips, manage expenses, explore destinations, and simplify travel
          planning with an intuitive user experience.
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
