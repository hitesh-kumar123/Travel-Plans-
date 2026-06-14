import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";

const TripSummary = ({
  form,
  budgetLevel,
  isValid,
  currency,
  currencySymbols,
  convertedTotal,
  convertedPerDay,
}) => {
  return (
    <Box mt={5} mb={3}>
      <Card
        sx={{
          borderRadius: "28px",
          backgroundColor: "#fff",
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h5" fontWeight="bold" color="#1A365D" mb={2}>
            Trip Summary
          </Typography>

          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Based on destination, hotel, transport and travel preferences.
          </Typography>

          <Typography>From: {form.from || "-"}</Typography>

          <Typography>To: {form.to || "-"}</Typography>

          <Typography>Travelers: {form.travelers}</Typography>

          <Typography>Days: {form.days}</Typography>

          <Typography sx={{ mt: 2 }}>
            <strong>Trip Category:</strong>
          </Typography>

          <Typography color="secondary" fontWeight="bold">
            {budgetLevel}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <strong>Total Trip Cost:</strong>
          </Typography>

          <Typography variant="h5" color="primary" fontWeight="bold">
            {isValid
              ? `${currencySymbols[currency]}${convertedTotal.toLocaleString()}`
              : "Fill all fields"}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            <strong>Per Day Cost:</strong>
          </Typography>

          <Typography variant="h6" color="success.main" fontWeight="bold">
            {currencySymbols[currency]}
            {convertedPerDay.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TripSummary;
