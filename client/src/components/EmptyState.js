import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

const EmptyState = ({ icon, title, description, buttonText, onClick }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: "2px dashed #d1d5db",
        borderRadius: "24px",
        padding: 4,
        textAlign: "center",
        maxWidth: 380,
        width: "100%",
        backgroundColor: "#fafafa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        minHeight: 300,
        transition: "0.3s ease",
        "&:hover": {
          borderColor: "#4f46e5",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box
        sx={{
          fontSize: 70,
          color: "#9ca3af",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: "#111827",
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#6b7280",
          maxWidth: 280,
          lineHeight: 1.6,
        }}
      >
        {description}
      </Typography>

      {buttonText && (
        <Button
          variant="contained"
          onClick={onClick}
          sx={{
            mt: 1,
            borderRadius: "12px",
            paddingX: 3,
            paddingY: 1.2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {buttonText}
        </Button>
      )}
    </Paper>
  );
};

export default EmptyState;
