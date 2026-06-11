import React from "react";
import { Grid, TextField, MenuItem, Box, Button, Card } from "@mui/material";

const BudgetForm = ({
  form,
  currency,
  handleChange,
  setCurrency,
  handleReset,
}) => {
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "15px",
      backgroundColor: "#ffffff",
    },
  };

  return (
    <Card
      sx={{
        p: 4,
        border: "1px solid #e0e0e0",
        borderRadius: "25px",
        background: "rgb(247, 247, 247)",
        backdropFilter: "blur(10px)",
        boxShadow: 3,
        mb: 5,
      }}
    >
      <Grid container spacing={4}>
        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="From"
            name="from"
            value={form.from}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <TextField
            fullWidth
            label="To"
            name="to"
            value={form.to}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Number of Days"
            name="days"
            value={form.days}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 1 }}
            sx={inputStyle}
          />
        </Grid>

        <Grid xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Number of Travelers"
            name="travelers"
            value={form.travelers}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 1 }}
            sx={inputStyle}
          />
        </Grid>

        <Grid xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Budget Type"
            name="budgetType"
            value={form.budgetType}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          >
            <MenuItem value="Budget">Budget</MenuItem>
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Luxury">Luxury</MenuItem>
          </TextField>
        </Grid>

        <Grid xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Transport Type"
            name="transport"
            value={form.transport}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          >
            <MenuItem value="Bus">Bus</MenuItem>
            <MenuItem value="Train">Train</MenuItem>
            <MenuItem value="Flight">Flight</MenuItem>
          </TextField>
        </Grid>

        <Grid xs={12} md={4}>
          <TextField
            select
            fullWidth
            label="Hotel Type"
            name="hotelType"
            value={form.hotelType}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          >
            <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Luxury">Luxury</MenuItem>
          </TextField>
        </Grid>

        <Grid xs={12} md={6}>
          <TextField
            select
            fullWidth
            label="Currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          >
            <MenuItem value="INR">₹ INR</MenuItem>
            <MenuItem value="USD">$ USD</MenuItem>
            <MenuItem value="EUR">€ EUR</MenuItem>
            <MenuItem value="GBP">£ GBP</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Box
        sx={{
          mt: 3,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          color="error"
          onClick={handleReset}
          sx={{
            borderRadius: "12px",
            px: 4,
          }}
        >
          Reset Form
        </Button>
      </Box>
    </Card>
  );
};

export default BudgetForm;
