import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const NotFound = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.05,
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 3, md: 6 },
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: 1,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "6rem", md: "10rem" },
              fontWeight: 800,
              color: theme.palette.primary.main,
              lineHeight: 1,
              mb: 2,
            }}
          >
            404
          </Typography>

          <SentimentDissatisfiedIcon
            sx={{ fontSize: 60, color: "text.secondary", mb: 2 }}
          />

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Oops! Page Not Found
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 500,
              mx: "auto",
            }}
          >
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable. Let's get you back on track!
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
              size="large"
              startIcon={<HomeIcon />}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
              }}
            >
              Back to Home
            </Button>

            <Button
              component={RouterLink}
              to="/contact"
              variant="outlined"
              size="large"
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1.5,
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Box>

        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} PackGo. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
