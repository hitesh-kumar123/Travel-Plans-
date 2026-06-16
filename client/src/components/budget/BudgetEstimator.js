import React, { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import BudgetBreakdown from "./BudgetBreakdown";
import { calculateBudget } from "../../utils/budgetCalculator";
import "./budget.css";

const BudgetEstimator = () => {
  const [currency, setCurrency] = useState("INR");

  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("budgetForm");

    return saved
      ? JSON.parse(saved)
      : {
          from: "",
          to: "",
          travelers: 1,
          days: 1,
          budgetType: "Budget",
          transport: "Bus",
          hotelType: "Low",
        };
  });

  const [budget, setBudget] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "days" || name === "travelers") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, [name]: "" }));
        return;
      }

      if (Number(value) <= 0 || isNaN(Number(value))) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    const defaultData = {
      from: "",
      to: "",
      travelers: 1,
      days: 1,
      budgetType: "Budget",
      transport: "Bus",
      hotelType: "Low",
    };
    setFormData(defaultData);
    sessionStorage.setItem("budgetForm", JSON.stringify(defaultData));
  };

  useEffect(() => {
    sessionStorage.setItem("budgetForm", JSON.stringify(formData));

    setBudget(calculateBudget(formData));
  }, [formData]);

  return (
    <div className="budget-container">
      <h1>Trip Budget Estimator</h1>

      <BudgetForm
        form={formData}
        currency={currency}
        handleChange={handleChange}
        setCurrency={setCurrency}
        handleReset={handleReset}
      />

      <BudgetBreakdown budget={budget} />
    </div>
  );
};

export default BudgetEstimator;
