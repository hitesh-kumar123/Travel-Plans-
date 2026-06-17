import React, { useEffect, useState, useCallback } from "react";
import BudgetForm from "./BudgetForm";
import BudgetBreakdown from "./BudgetBreakdown";
import { calculateBudget } from "../../utils/budgetCalculator";
import { getCurrencyRates } from "../../services/api";
import "./budget.css";

const CURRENCY_SYMBOLS = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AED: "د.إ",
  SGD: "S$",
  AUD: "A$",
  CAD: "C$",
  THB: "฿",
};

const DEFAULT_FORM = {
  from: "",
  to: "",
  travelers: 1,
  days: 1,
  budgetType: "Budget",
  transport: "Bus",
  hotelType: "Low",
};

const BudgetEstimator = () => {
  const [formData, setFormData] = useState(() => {
    const saved = sessionStorage.getItem("budgetForm");
    return saved ? JSON.parse(saved) : DEFAULT_FORM;
  });

  const [budget, setBudget] = useState({});
  const [currency, setCurrency] = useState("INR");
  const [rates, setRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(false);
  const [ratesError, setRatesError] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      setRatesError("");
      try {
        const res = await getCurrencyRates("INR");
        setRates(res.data.rates);
      } catch (err) {
        setRatesError("Could not load live rates. Showing INR estimates.");
        setRates({});
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    sessionStorage.setItem("budgetForm", JSON.stringify(formData));
    setBudget(calculateBudget(formData));
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleReset = useCallback(() => {
    sessionStorage.removeItem("budgetForm");
    setFormData(DEFAULT_FORM);
    setCurrency("INR");
  }, []);

  const convertCurrency = useCallback(
    (amountInINR) => {
      if (currency === "INR" || !rates[currency]) return Math.round(amountInINR);
      return Math.round(amountInINR * rates[currency]);
    },
    [currency, rates]
  );

  return (
    <div className="budget-container">
      <h1>Trip Budget Estimator</h1>

      {ratesError && (
        <p style={{ color: "#e57373", textAlign: "center", marginBottom: 8 }}>
          ⚠️ {ratesError}
        </p>
      )}
      {ratesLoading && (
        <p style={{ textAlign: "center", marginBottom: 8, color: "#888" }}>
          Fetching live exchange rates…
        </p>
      )}

      <BudgetForm
        form={formData}
        currency={currency}
        handleChange={handleChange}
        setCurrency={setCurrency}
        handleReset={handleReset}
      />

      <BudgetBreakdown
        hotelCost={budget.hotelCost || 0}
        transportCost={budget.transportCost || 0}
        foodCost={budget.foodCost || 0}
        activitiesCost={budget.activitiesCost || 0}
        miscCost={budget.miscCost || 0}
        total={budget.total || 0}
        form={formData}
        currency={currency}
        currencySymbols={CURRENCY_SYMBOLS}
        convertCurrency={convertCurrency}
      />
    </div>
  );
};

export default BudgetEstimator;
