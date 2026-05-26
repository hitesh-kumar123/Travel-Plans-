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
    title: "Use of PackGo",
    body: "PackGo helps you organize trips, packing lists, expenses, weather details, translations, and booking plans. You agree to use the app only for lawful personal travel planning purposes.",
  },
  {
    title: "Account Responsibility",
    body: "You are responsible for keeping your login details secure and for the activity that happens under your account. If you believe your account has been accessed without permission, update your password as soon as possible.",
  },
  {
    title: "Travel Information",
    body: "Trip details, weather results, translations, and booking examples are provided to support planning. Always verify important travel details with official providers before making decisions.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these terms as the app changes. Continued use of PackGo after updates means you accept the revised terms.",
  },
];

const Terms = () => {
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
            Terms of Service
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Last updated: May 25, 2026
          </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            These terms explain the basic rules for using PackGo. They are
            written to be simple and practical for this travel planning app.
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

export default Terms;
