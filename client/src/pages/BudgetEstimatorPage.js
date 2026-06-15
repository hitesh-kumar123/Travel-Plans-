import BudgetForm from "../components/budget/BudgetForm";
import BudgetBreakdown from "../components/budget/BudgetBreakdown";
import TripSummary from "../components/budget/TripSummary";
import { calculateBudget } from "../utils/budgetCalculator";
import { defaultForm } from "../utils/defaultFormData";
import { currencyRates, currencySymbols } from "../utils/currencyData";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

const BudgetEstimatorPage = () => {
  const [form, setForm] = useState(() => {
    try {
      const savedData = localStorage.getItem("budgetEstimator");

      return savedData ? JSON.parse(savedData) : defaultForm;
    } catch {
      return defaultForm;
    }
  });

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR",
  );
  useEffect(() => {
    localStorage.setItem("budgetEstimator", JSON.stringify(form));
  }, [form]);
  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "days" || name === "travelers") && Number(value) < 1) {
      return;
    }

    setForm({
      ...form,
      [name]: name === "days" || name === "travelers" ? Number(value) : value,
    });
  };

  // COST CALCULATION
  const {
    hotelCost,
    transportCost,
    foodCost,
    activitiesCost,
    miscCost,
    total,
    perDay,
    budgetLevel,
  } = calculateBudget(form);

  const isValid =
    form.from.trim() !== "" &&
    form.to.trim() !== "" &&
    form.days > 0 &&
    form.travelers > 0;

  const convertedTotal = Math.round(total * currencyRates[currency]);

  const convertedPerDay = Math.round(perDay * currencyRates[currency]);
  const convertCurrency = (amount) =>
    Math.round(amount * currencyRates[currency]);

  const handleReset = () => {
    setForm(defaultForm);

    setCurrency("INR");

    localStorage.removeItem("budgetEstimator");
    localStorage.removeItem("currency");
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          padding: "40px 20px",
        }}
      >
        {/* TITLE */}
        <Typography
          variant="h2"
          fontWeight="700"
          align="center"
          sx={{
            letterSpacing: "0.5px",
            color: "#0d47a1",
          }}
          mb={1}
        >
          Smart Trip Budget Estimator
        </Typography>

        <Typography
          align="center"
          color="text.secondary"
          mb={5}
          sx={{ fontSize: "16px" }}
        >
          Estimate accommodation, food, transport and activity costs instantly.
        </Typography>

        {/* FORMS */}
        <BudgetForm
          form={form}
          currency={currency}
          handleChange={handleChange}
          setCurrency={setCurrency}
          handleReset={handleReset}
        />
        {/* RESULT CARDS */}
        <BudgetBreakdown
          hotelCost={hotelCost}
          transportCost={transportCost}
          foodCost={foodCost}
          activitiesCost={activitiesCost}
          miscCost={miscCost}
          total={total}
          form={form}
          currency={currency}
          currencySymbols={currencySymbols}
          convertCurrency={convertCurrency}
        />

        {/* TRIP SUMMARY */}
        <TripSummary
          form={form}
          budgetLevel={budgetLevel}
          isValid={isValid}
          currency={currency}
          currencySymbols={currencySymbols}
          convertedTotal={convertedTotal}
          convertedPerDay={convertedPerDay}
        />
      </Box>
    </>
  );
};

export default BudgetEstimatorPage;
