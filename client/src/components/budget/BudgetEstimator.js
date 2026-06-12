import React, { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import BudgetBreakdown from "./BudgetBreakdown";
import { calculateBudget } from "../../utils/budgetCalculator";
import "./budget.css";

const BudgetEstimator = () => {
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("budgetForm");

    return saved
      ? JSON.parse(saved)
      : {
          destination: "",
          travelers: 1,
          days: 1,
          accommodation: "budget",
          transport: "bus",
          food: "medium",
        };
  });

  const [budget, setBudget] = useState({});

  useEffect(() => {
    sessionStorage.setItem("budgetForm", JSON.stringify(formData));

    setBudget(calculateBudget(formData));
  }, [formData]);

  return (
    <div className="budget-container">
      <h1>Trip Budget Estimator</h1>

      <BudgetForm formData={formData} setFormData={setFormData} />

      <BudgetBreakdown budget={budget} />
    </div>
  );
};

export default BudgetEstimator;
