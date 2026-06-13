import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Typography, Button, Container, useTheme } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { keyframes } from "@mui/system";

// Modern micro-animation matching the PackGo design specification
const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

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
      {/* Dynamic Background Grid Pattern */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          opacity: 0.06,
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 6 },
            borderRadius: 6,
            backgroundColor: "background.paper",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.04)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Animated Travel Visual */}
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              mb: 3,
              animation: `${floatAnimation} 4s ease-in-out infinite`,
            }}
          >
            <MapIcon sx={{ fontSize: { xs: 100, md: 130 }, color: theme.palette.primary.main }} />
            <Typography
              variant="h3"
              component="span"
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                color: theme.palette.secondary.main || "#00a699",
                fontWeight: 800,
              }}
            >
              ?
            </Typography>
          </Box>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "5rem", md: "7.5rem" },
              fontWeight: 800,
              color: "text.primary",
              lineHeight: 1,
              mb: 1,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            404
          </Typography>

          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 2,
              color: "text.primary",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            Oops! Dead end!
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 520,
              mx: "auto",
              fontSize: "1.05rem",
              lineHeight: 1.6,
            }}
          >
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track!
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
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: `0 4px 14px ${theme.palette.primary.main}40`,
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 20px ${theme.palette.primary.main}60`,
                },
              }}
            >
              Back to Home
            </Button>

            <Button
              component={RouterLink}
              to="/contact"
              variant="outlined"
              size="large"
              startIcon={<ContactSupportIcon />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: "none",
                transition: "all 0.2s ease-in-out",
                "&:hover": {
                  transform: "translateY(-2px)",
                  backgroundColor: "action.hover",
                },
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