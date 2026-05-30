import React, { useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

const AIRLINES = [
  { name: "Air India (Carry-on)", limit: 8 },
  { name: "Air India (Checked)", limit: 15 },
  { name: "IndiGo (Carry-on)", limit: 7 },
  { name: "IndiGo (Checked)", limit: 15 },
  { name: "Emirates (Carry-on)", limit: 7 },
  { name: "Emirates (Checked - Economy)", limit: 30 },
  { name: "Custom", limit: 0 },
];

const BaggageCalculator = ({ items }) => {
  const [selectedAirline, setSelectedAirline] = useState("IndiGo (Carry-on)");
  const [customLimit, setCustomLimit] = useState("");

  const calculateTotalWeight = () => {
    if (!items || items.length === 0) return 0;
    return items.reduce((sum, item) => sum + (Number(item.weight) || 0), 0);
  };

  const totalWeight = calculateTotalWeight();

  const currentLimit =
    selectedAirline === "Custom"
      ? Number(customLimit) || 0
      : AIRLINES.find((a) => a.name === selectedAirline)?.limit || 0;

  const progress = currentLimit > 0 ? (totalWeight / currentLimit) * 100 : 0;
  const isOverweight = currentLimit > 0 && totalWeight > currentLimit;

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={2} gap={1}>
        <FlightTakeoffIcon color="primary" />
        <Typography variant="subtitle1" fontWeight={600}>
          Baggage Weight Calculator
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 2, alignItems: "flex-start" }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Airline Allowance</InputLabel>
            <Select
              value={selectedAirline}
              label="Airline Allowance"
              onChange={(e) => setSelectedAirline(e.target.value)}
            >
              {AIRLINES.map((airline) => (
                <MenuItem key={airline.name} value={airline.name}>
                  {airline.name}{" "}
                  {airline.limit > 0 ? `(${airline.limit} kg)` : ""}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {selectedAirline === "Custom" && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              size="small"
              type="number"
              label="Custom Limit (kg)"
              value={customLimit}
              onChange={(e) => setCustomLimit(e.target.value)}
            />
          </Grid>
        )}
      </Grid>

      <Box>
        <Box display="flex" justifyContent="space-between" mb={0.5}>
          <Typography variant="body2" color="text.secondary">
            Total Weight: <strong>{totalWeight.toFixed(1)} kg</strong>
          </Typography>
          {currentLimit > 0 && (
            <Typography
              variant="body2"
              fontWeight={600}
              color={isOverweight ? "error.main" : "text.primary"}
            >
              Limit: {currentLimit} kg
            </Typography>
          )}
        </Box>
        {currentLimit > 0 && (
          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                backgroundColor: isOverweight ? "error.main" : "success.main",
              },
            }}
          />
        )}
        {isOverweight && (
          <Typography
            variant="caption"
            color="error.main"
            display="block"
            mt={0.5}
          >
            Exceeds allowance by {(totalWeight - currentLimit).toFixed(1)} kg!
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default BaggageCalculator;
