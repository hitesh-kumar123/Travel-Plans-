import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const TripsIllustration = () => (
  <svg
    width="180"
    height="180"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ maxWidth: "100%", height: "auto" }}
  >
    <defs>
      <linearGradient
        id="globeGrad"
        x1="0"
        y1="0"
        x2="200"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#e0e7ff" />
        <stop offset="100%" stopColor="#c7d2fe" />
      </linearGradient>
      <linearGradient
        id="planeGrad"
        x1="50"
        y1="50"
        x2="150"
        y2="150"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#ff6e40" />
        <stop offset="100%" stopColor="#ff8a65" />
      </linearGradient>
      <linearGradient
        id="lineGrad"
        x1="0"
        y1="0"
        x2="200"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#3f51b5" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#00bcd4" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="110" r="70" fill="#f1f5f9" opacity="0.5" />
    <circle cx="100" cy="100" r="65" fill="url(#globeGrad)" />
    <ellipse
      cx="100"
      cy="100"
      rx="65"
      ry="25"
      stroke="#ffffff"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <ellipse
      cx="100"
      cy="100"
      rx="25"
      ry="65"
      stroke="#ffffff"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <line
      x1="35"
      y1="100"
      x2="165"
      y2="100"
      stroke="#ffffff"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <line
      x1="100"
      y1="35"
      x2="100"
      y2="165"
      stroke="#ffffff"
      strokeWidth="1.5"
      opacity="0.6"
    />
    <path
      d="M 40 140 C 20 60, 180 40, 160 120"
      stroke="url(#lineGrad)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="6,6"
    />
    <g transform="translate(130, 60) rotate(15)">
      <path d="M0 -15 L12 15 L0 8 L-12 15 Z" fill="url(#planeGrad)" />
    </g>
  </svg>
);

const ActivitiesIllustration = () => (
  <svg
    width="180"
    height="180"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ maxWidth: "100%", height: "auto" }}
  >
    <defs>
      <linearGradient
        id="skyGrad"
        x1="0"
        y1="0"
        x2="0"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#fff3e0" />
        <stop offset="100%" stopColor="#ffe0b2" />
      </linearGradient>
      <linearGradient
        id="mountainGrad"
        x1="100"
        y1="50"
        x2="100"
        y2="170"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#5c6bc0" />
        <stop offset="100%" stopColor="#3f51b5" />
      </linearGradient>
      <linearGradient
        id="mountainBackGrad"
        x1="100"
        y1="80"
        x2="100"
        y2="170"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#9fa8da" />
        <stop offset="100%" stopColor="#7986cb" />
      </linearGradient>
      <linearGradient
        id="sunGrad"
        x1="0"
        y1="0"
        x2="0"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#ffb74d" />
        <stop offset="100%" stopColor="#ff9800" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="70" fill="url(#skyGrad)" />
    <circle cx="100" cy="85" r="24" fill="url(#sunGrad)" />
    <polygon points="40,150 100,75 160,150" fill="url(#mountainBackGrad)" />
    <polygon
      points="70,160 130,85 190,160"
      fill="url(#mountainGrad)"
      opacity="0.9"
    />
    <polygon points="20,160 75,95 130,160" fill="url(#mountainGrad)" />
    <polygon points="50,160 42,145 58,145" fill="#2e7d32" />
    <polygon points="50,147 45,135 55,135" fill="#2e7d32" />
    <polygon points="150,160 140,142 160,142" fill="#1b5e20" />
    <polygon points="150,144 143,130 157,130" fill="#1b5e20" />
    <path
      d="M 60 160 Q 100 140 80 120"
      stroke="#ff6e40"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeDasharray="4,4"
    />
  </svg>
);

const GenericIllustration = () => (
  <svg
    width="180"
    height="180"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ maxWidth: "100%", height: "auto" }}
  >
    <defs>
      <linearGradient
        id="suitcaseGrad"
        x1="0"
        y1="0"
        x2="200"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#3f51b5" />
        <stop offset="100%" stopColor="#1a237e" />
      </linearGradient>
      <linearGradient
        id="tagGrad"
        x1="0"
        y1="0"
        x2="200"
        y2="200"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stopColor="#ff6e40" />
        <stop offset="100%" stopColor="#ff3d00" />
      </linearGradient>
    </defs>
    <ellipse cx="100" cy="155" rx="55" ry="8" fill="#e2e8f0" />
    <rect
      x="55"
      y="80"
      width="90"
      height="70"
      rx="10"
      fill="url(#suitcaseGrad)"
    />
    <rect x="70" y="80" width="8" height="70" fill="#1a237e" opacity="0.4" />
    <rect x="122" y="80" width="8" height="70" fill="#1a237e" opacity="0.4" />
    <path
      d="M 80 80 L 80 62 C 80 58, 120 58, 120 62 L 120 80"
      stroke="#78909c"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <rect x="55" y="80" width="16" height="16" rx="4" fill="#78909c" />
    <rect x="129" y="80" width="16" height="16" rx="4" fill="#78909c" />
    <rect x="55" y="134" width="16" height="16" rx="4" fill="#78909c" />
    <rect x="129" y="134" width="16" height="16" rx="4" fill="#78909c" />
    <g transform="translate(132, 105) rotate(25)">
      <rect x="0" y="0" width="14" height="24" rx="2" fill="url(#tagGrad)" />
      <circle cx="7" cy="5" r="2" fill="#ffffff" />
    </g>
    <rect
      x="42"
      y="65"
      width="22"
      height="32"
      rx="2"
      fill="#0d47a1"
      transform="rotate(-15, 42, 65)"
    />
    <rect
      x="46"
      y="69"
      width="14"
      height="6"
      fill="#ffd54f"
      transform="rotate(-15, 42, 65)"
    />
  </svg>
);

const EmptyState = ({
  type = "generic",
  title,
  description,
  ctaText,
  onCtaClick,
  ...buttonProps
}) => {
  const renderIllustration = () => {
    switch (type) {
      case "trips":
        return <TripsIllustration />;
      case "activities":
        return <ActivitiesIllustration />;
      default:
        return <GenericIllustration />;
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: 4,
        border: "2px dashed",
        borderColor: "divider",
        bgcolor: "background.paper",
        width: "100%",
        maxWidth: 680,
        mx: "auto",
        boxShadow: "0 10px 30px -15px rgba(0,0,0,0.03)",
        transition: "all 0.3s ease",
        "&:hover": {
          borderColor: "primary.light",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ mb: 3.5, display: "flex", justifyContent: "center" }}>
        {renderIllustration()}
      </Box>
      <Typography
        variant="h5"
        fontWeight={800}
        color="text.primary"
        gutterBottom
        sx={{
          letterSpacing: "-0.5px",
          fontFamily: '"Poppins", sans-serif',
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          maxWidth: 440,
          mb: 4,
          lineHeight: 1.6,
          fontSize: "0.95rem",
        }}
      >
        {description}
      </Typography>
      {ctaText && (
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={onCtaClick}
          {...buttonProps}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: "none",
            fontSize: "0.95rem",
            background: "linear-gradient(135deg, #3f51b5 0%, #002984 100%)",
            boxShadow: "0 8px 20px -6px rgba(63, 81, 181, 0.4)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              background: "linear-gradient(135deg, #002984 0%, #3f51b5 100%)",
              boxShadow: "0 10px 25px -4px rgba(63, 81, 181, 0.6)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {ctaText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
