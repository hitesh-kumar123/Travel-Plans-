import "./ExpenseAnalytics.css";
import React from "react";
import { useSelector } from "react-redux";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F97316",
  "#EF4444",
  "#a855f7",
  "#ff6e40",
];

export default function ExpenseAnalytics({ activeTrip: propActiveTrip }) {
  const expenseState = useSelector((state) => state.expenses);
  const { exchangeRates, baseCurrency } = Array.isArray(expenseState)
    ? {}
    : expenseState || {};
  const { trips, currentTrip } = useSelector((state) => state.trips) || {};

  // Determine the active trip context
  const activeTrip =
    propActiveTrip ||
    currentTrip ||
    (trips && trips.length > 0 ? trips[0] : null);

  // Converts any amount from its stored currency to the baseCurrency.
  const toBase = (amount, currency) => {
    if (!amount) return 0;
    if (currency === baseCurrency) return amount;
    if (!exchangeRates || Object.keys(exchangeRates).length === 0)
      return amount;

    let amountInINR;
    if (currency === "INR") {
      amountInINR = amount;
    } else {
      const rateToINR = exchangeRates[currency];
      if (!rateToINR) return amount;
      amountInINR = amount / rateToINR;
    }

    if (baseCurrency === "INR") return parseFloat(amountInINR.toFixed(2));
    const rateToBase = exchangeRates[baseCurrency];
    if (!rateToBase) return amount;
    return parseFloat((amountInINR * rateToBase).toFixed(2));
  };

  const currencySymbol =
    {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      AED: "د.إ",
      SGD: "S$",
      AUD: "A$",
    }[baseCurrency] || baseCurrency;

  // Process data from raw expenses
  const expensesList =
    expenseState?.expenses || expenseState?.data || expenseState || [];

  const totalSpent = expensesList.reduce(
    (acc, e) => acc + parseFloat(toBase(e.amount, e.currency)),
    0,
  );

  const rawBudget = activeTrip?.budget || 0;
  const budget = rawBudget > 0 ? parseFloat(toBase(rawBudget, "INR")) : 0;
  const remaining = budget > 0 ? budget - totalSpent : null;
  const progressPercent =
    budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;

  // 1. Group by category
  const categoryMap = {};
  expensesList.forEach((e) => {
    let cat = e.category || "Other";
    // Normalize casing to match standard options
    if (cat.toLowerCase() === "transport") cat = "Transportation";
    else if (cat.toLowerCase() === "accommodation") cat = "Accommodation";
    else if (cat.toLowerCase() === "food") cat = "Food";
    else if (cat.toLowerCase() === "activities") cat = "Activities";
    else if (cat.toLowerCase() === "shopping") cat = "Shopping";
    else if (cat.toLowerCase() === "other") cat = "Other";
    else {
      cat = cat.charAt(0).toUpperCase() + cat.slice(1);
    }
    const convertedAmount = toBase(e.amount, e.currency);
    categoryMap[cat] = (categoryMap[cat] || 0) + parseFloat(convertedAmount);
  });

  const categoryData = Object.keys(categoryMap).map((key) => ({
    name: key,
    value: parseFloat(categoryMap[key].toFixed(2)),
  }));

  // 2. Group by daily date and sort chronologically
  const rawTrendMap = {};
  expensesList.forEach((e) => {
    if (!e.date) return;
    const dateStr = e.date.split("T")[0]; // YYYY-MM-DD
    const convertedAmount = toBase(e.amount, e.currency);
    rawTrendMap[dateStr] =
      (rawTrendMap[dateStr] || 0) + parseFloat(convertedAmount);
  });

  const sortedDates = Object.keys(rawTrendMap).sort(
    (a, b) => new Date(a) - new Date(b),
  );

  const trendData = sortedDates.map((dateStr) => {
    let formattedDate = dateStr;
    try {
      formattedDate = new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      console.error(err);
    }
    return {
      date: formattedDate,
      amount: parseFloat(rawTrendMap[dateStr].toFixed(2)),
    };
  });

  // 3. Comparison data
  const comparisonData = [
    { name: "Budget", value: parseFloat(budget.toFixed(2)) },
    { name: "Actual", value: parseFloat(totalSpent.toFixed(2)) },
  ];

  return (
    <div className="analytics-wrapper">
      <h2>Budget Analytics Dashboard</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Budget</h3>
          <h1>
            {budget > 0
              ? `${currencySymbol}${budget.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : "—"}
          </h1>
        </div>

        <div className="stat-card">
          <h3>Total Spent</h3>
          <h1>
            {currencySymbol}
            {totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </h1>
        </div>

        <div className="stat-card">
          <h3>Remaining</h3>
          <h1
            style={{
              color:
                remaining !== null && remaining < 0 ? "#EF4444" : "inherit",
            }}
          >
            {remaining !== null
              ? `${remaining < 0 ? "-" : ""}${currencySymbol}${Math.abs(remaining).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
              : "—"}
          </h1>
        </div>
      </div>

      {budget > 0 && (
        <div
          className="progress-container"
          style={{
            height: "10px",
            backgroundColor: "#E2E8F0",
            borderRadius: "5px",
            overflow: "hidden",
            margin: "1.5rem 0",
          }}
        >
          <div
            className="progress-fill"
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              backgroundColor:
                remaining !== null && remaining < 0 ? "#EF4444" : "#22C55E",
              transition: "width 0.4s ease-in-out",
            }}
          />
        </div>
      )}

      {expensesList.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
          <h3>No expense records found for this trip.</h3>
          <p>Add some expenses above to visualize your spending trends!</p>
        </div>
      ) : (
        <div className="charts-grid">
          <div className="chart-card">
            <h3>Expense Categories ({currencySymbol})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${currencySymbol}${value}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Daily Spending Trend ({currencySymbol})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${currencySymbol}${value}`} />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366F1"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Budget vs Actual ({currencySymbol})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `${currencySymbol}${value}`} />
                <Bar dataKey="value" fill="#6366F1">
                  {comparisonData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        entry.name === "Budget"
                          ? "#6366F1"
                          : remaining !== null && remaining < 0
                            ? "#EF4444"
                            : "#22C55E"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
