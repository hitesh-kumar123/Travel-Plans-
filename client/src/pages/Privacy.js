import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const sections = [
  {
    title: "Information We Store",
    body: "PackGo stores account details, trip plans, expenses, packing lists, and related travel information that you add to the app.",
  },
  {
    title: "How Information Is Used",
    body: "Your information is used to show your dashboard, protect your account, organize trip data, and provide app features like expense tracking and packing lists.",
  },
  {
    title: "Authentication Data",
    body: "Passwords are hashed before being saved. The app uses a login token on the frontend so you can access protected pages without entering your password on every request.",
  },
  {
    title: "Third-Party Services",
    body: "Some features may request information from external services, such as weather or translation providers, when you use those tools.",
  },
];

const Privacy = () => {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            Privacy Policy
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Last updated: May 25, 2026
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            This policy summarizes how PackGo handles the information used by
            the travel planner features.
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {sections.map((section) => (
            <Box key={section.title} sx={{ mb: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                {section.title}
              </Typography>
              <Typography color="text.secondary">{section.body}</Typography>
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default Privacy;
