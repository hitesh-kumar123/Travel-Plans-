import React from "react";
import { Box } from "@mui/material";
import BudgetEstimator from "../../components/budget/BudgetEstimator";

const BudgetView = () => {
  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <BudgetEstimator />
    </Box>
  );
};

export default BudgetView;
