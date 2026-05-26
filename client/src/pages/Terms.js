import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import GppGoodOutlinedIcon from "@mui/icons-material/GppGoodOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import TravelExploreOutlinedIcon from "@mui/icons-material/TravelExploreOutlined";
import CloudOutlinedIcon from "@mui/icons-material/CloudOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";

const sections = [
  {
    icon: GppGoodOutlinedIcon,
    title: "1. Introduction",
    body: 'Welcome to PackGo ("we", "our", "us"). By accessing or using our travel planning platform and related services, you agree to comply with these Terms and Conditions. If you do not agree, please discontinue use of the Platform.',
  },
  {
    icon: PersonOutlineOutlinedIcon,
    title: "2. Eligibility",
    body: "You must be at least 16 years old to use the Platform. By creating an account, you confirm that all information provided is accurate and complete.",
  },
  {
    icon: EditNoteOutlinedIcon,
    title: "3. Account Responsibility",
    body: "You are responsible for maintaining the confidentiality of your login details and for all activity that occurs under your account. Please update your password immediately if you suspect unauthorized access.",
  },
  {
    icon: TravelExploreOutlinedIcon,
    title: "4. Travel Information",
    body: "Trip details, destination information, booking examples, translations, and expense tools are provided for planning support. Always verify important travel details with official sources before making final decisions.",
  },
  {
    icon: CloudOutlinedIcon,
    title: "5. Third-Party Services",
    body: "Some features may depend on external services such as weather or translation providers. PackGo is not responsible for errors, delays, or changes made by those third-party services.",
  },
  {
    icon: BlockOutlinedIcon,
    title: "6. Prohibited Activities",
    body: "You agree not to misuse the Platform, attempt unauthorized access, interfere with service availability, or use PackGo for unlawful, harmful, or fraudulent purposes.",
  },
  {
    icon: UpdateOutlinedIcon,
    title: "7. Changes to Terms",
    body: "We may update these Terms and Conditions as the application changes. Continued use of PackGo after updates means you accept the revised terms.",
  },
];

const Terms = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #111a2d 0%, #08111f 42%, #070d18 100%)",
        color: "#f8fafc",
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Button
          component={RouterLink}
          to="/"
          startIcon={<ArrowBackIcon />}
          sx={{
            mb: 4,
            color: "#b8c7ff",
            "&:hover": {
              backgroundColor: "rgba(129, 140, 248, 0.12)",
            },
          }}
        >
          Back to Home
        </Button>

        <Box
          sx={{
            textAlign: "center",
            maxWidth: 760,
            mx: "auto",
            mb: { xs: 5, md: 8 },
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 0.8,
              mb: 3,
              borderRadius: 999,
              color: "#b9c3ff",
              backgroundColor: "rgba(99, 102, 241, 0.18)",
              border: "1px solid rgba(129, 140, 248, 0.2)",
              fontWeight: 700,
            }}
          >
            <GppGoodOutlinedIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontWeight: 700 }}>Legal & Policies</Typography>
          </Box>

          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.8rem", md: "4.7rem" },
              lineHeight: 1.05,
              mb: 3,
              color: "#ffffff",
              fontWeight: 800,
            }}
          >
            Terms & Conditions
          </Typography>
          <Typography
            sx={{
              color: "#a9b4c7",
              fontSize: { xs: "1.05rem", md: "1.35rem" },
              lineHeight: 1.6,
              mb: 3,
            }}
          >
            Please read these Terms carefully before using PackGo. By accessing
            our platform, you agree to comply with the following conditions and
            policies.
          </Typography>

          <Typography sx={{ color: "#68758d", fontWeight: 700 }}>
            Last updated: May 26, 2026
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gap: { xs: 3, md: 4 } }}>
          {sections.map((section) => (
            <Box
              key={section.title}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "56px 1fr" },
                gap: { xs: 2, sm: 3 },
                p: { xs: 3, md: 5 },
                borderRadius: 3,
                backgroundColor: "rgba(15, 23, 42, 0.82)",
                border: "1px solid rgba(148, 163, 184, 0.14)",
                boxShadow: "0 24px 80px rgba(0, 0, 0, 0.22)",
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  color: "#818cf8",
                  backgroundColor: "rgba(79, 70, 229, 0.18)",
                }}
              >
                {React.createElement(section.icon, { sx: { fontSize: 30 } })}
              </Box>

              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    mb: 2,
                    color: "#ffffff",
                    fontSize: { xs: "1.35rem", md: "1.55rem" },
                    fontWeight: 800,
                  }}
                >
                  {section.title}
                </Typography>
                <Typography
                  sx={{
                    color: "#b7bfce",
                    fontSize: { xs: "1rem", md: "1.12rem" },
                    lineHeight: 1.75,
                    fontWeight: 500,
                  }}
                >
                  {section.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Terms;
