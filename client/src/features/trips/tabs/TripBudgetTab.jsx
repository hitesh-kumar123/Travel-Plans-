
import React, { useState, useEffect } from "react";
import { expensesApi } from "../../../services/api/expensesApi";
import { getErrorMessage } from "../../../services/api/client";
import { getRateToINR } from "../../../services/currencyConverter";
import Button from "../../../components/Button";
import FormField from "../../../components/FormField";
import Modal from "../../../components/Modal";
import Badge from "../../../components/Badge";
import LoadingState from "../../../components/LoadingState";
import EmptyState from "../../../components/EmptyState";
import {
  DollarSign,
  Plus,
  Trash2,
  PieChart,
  AlertCircle,
} from "lucide-react";

export const TripBudgetTab = ({ trip }) => {
  const [expenses, setExpenses] = useState([]);
  const [convertedExpenses, setConvertedExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversionLoading, setConversionLoading] = useState(false);
  const [conversionError, setConversionError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState({
    amount: "",
    currency: "INR",
    category: "Food",
    description: "",
    date: trip.startDate
      ? trip.startDate.split("T")[0]
      : new Date().toISOString().split("T")[0],
  });

  const categories = [
    "Accommodation",
    "Transportation",
    "Food",
    "Activities",
    "Shopping",
    "Other",
  ];

  const fetchExpensesData = async () => {
    setLoading(true);
    setError(null);

    try {
      const expRes = await expensesApi.getByTrip(trip._id);
      const data = expRes.data?.data || expRes.data || [];
      setExpenses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Unable to load budget records for this journey.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip._id) {
      fetchExpensesData();
    }
  }, [trip._id]);

  useEffect(() => {
    let cancelled = false;

    const convertExpenses = async () => {
      if (expenses.length === 0) {
        setConvertedExpenses([]);
        setConversionError("");
        setConversionLoading(false);
        return;
      }

      setConversionLoading(true);
      setConversionError("");

      try {
        const currencies = [
          ...new Set(
            expenses.map((expense) =>
              String(expense.currency || "INR").toUpperCase(),
            ),
          ),
        ];

        const rates = {};

        await Promise.all(
          currencies.map(async (currency) => {
            rates[currency] = await getRateToINR(currency);
          }),
        );

        const converted = expenses.map((expense) => {
          const currency = String(
            expense.currency || "INR",
          ).toUpperCase();
          const amount = Number(expense.amount);

          if (!Number.isFinite(amount) || amount < 0) {
            throw new Error("An expense has an invalid amount.");
          }

          return {
            ...expense,
            amountINR: amount * rates[currency].rate,
            exchangeRate: rates[currency].rate,
            rateDate: rates[currency].date,
          };
        });

        if (!cancelled) {
          setConvertedExpenses(converted);
        }
      } catch (err) {
        console.error("Currency conversion failed:", err);

        if (!cancelled) {
          setConvertedExpenses([]);
          setConversionError(
            "Unable to retrieve exchange rates. Please try again later.",
          );
        }
      } finally {
        if (!cancelled) {
          setConversionLoading(false);
        }
      }
    };

    convertExpenses();

    return () => {
      cancelled = true;
    };
  }, [expenses]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError("");

    const parsedAmount = parseFloat(formData.amount);

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Amount must be a positive number.");
      return;
    }

    setFormLoading(true);

    try {
      await expensesApi.create({
        trip: trip._id,
        amount: parsedAmount,
        currency: formData.currency,
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      });

      setIsAddModalOpen(false);
      setFormData({
        amount: "",
        currency: "INR",
        category: "Food",
        description: "",
        date: trip.startDate
          ? trip.startDate.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });

      await fetchExpensesData();
    } catch (err) {
      setFormError(getErrorMessage(err, "Failed to record expense."));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await expensesApi.delete(id);
      await fetchExpensesData();
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setError("Failed to delete the expense. Please try again.");
    }
  };

  // All budget calculations use INR.
  const totalSpent = convertedExpenses.reduce(
    (sum, item) => sum + item.amountINR,
    0,
  );

  const plannedBudget = Number(trip.budget) || 0;
  const budgetRemaining = plannedBudget - totalSpent;

  const percentUsed =
    plannedBudget > 0
      ? Math.round((totalSpent / plannedBudget) * 100)
      : 0;

  // Aggregate category totals after currency conversion.
  const categorySummary = Object.values(
    convertedExpenses.reduce((groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = {
          category: item.category,
          totalAmount: 0,
          count: 0,
        };
      }

      groups[item.category].totalAmount += item.amountINR;
      groups[item.category].count += 1;

      return groups;
    }, {}),
  );

  const formatINR = (amount) =>
    `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const totalsUnavailable = conversionLoading || Boolean(conversionError);

  return (
    <div className="space-y-10">
      {error && (
        <div className="flex items-start gap-2 p-3 rounded bg-[#FFDAD6]/50 text-sm text-[#BA1A1A]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {conversionLoading && (
        <p className="text-xs text-[#54433A]">
          Converting expenses to INR using the latest available exchange rates...
        </p>
      )}

      {conversionError && (
        <div className="flex items-start gap-2 p-3 rounded bg-[#FFDAD6]/50 text-sm text-[#BA1A1A]">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div>
            <p>{conversionError}</p>
            <button
              type="button"
              className="mt-2 underline"
              onClick={() => setExpenses((current) => [...current])}
            >
              Retry conversion
            </button>
          </div>
        </div>
      )}

      {/* Budget Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#877369]">
            Planned Budget (INR)
          </span>
          <p className="font-serif text-2xl font-bold text-[#1C1B1B] mt-1">
            {formatINR(plannedBudget)}
          </p>
          <p className="text-[11px] text-[#54433A] mt-1">
            Target allocated
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#6C2F00]">
            Total Spent (INR)
          </span>
          <p className="font-serif text-2xl font-bold text-[#6C2F00] mt-1">
            {totalsUnavailable ? "—" : formatINR(totalSpent)}
          </p>

          <div className="w-full bg-[#F0EDED] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${
                percentUsed > 100 ? "bg-[#BA1A1A]" : "bg-[#6C2F00]"
              }`}
              style={{
                width: `${
                  totalsUnavailable
                    ? 0
                    : Math.min(100, Math.max(0, percentUsed))
                }%`,
              }}
            />
          </div>

          <p className="text-[11px] text-[#54433A] mt-1.5">
            {totalsUnavailable
              ? "Awaiting currency conversion"
              : `${percentUsed}% of budget utilized`}
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#877369]">
            Remaining Budget (INR)
          </span>
          <p
            className={`font-serif text-2xl font-bold mt-1 ${
              !totalsUnavailable && budgetRemaining < 0
                ? "text-[#BA1A1A]"
                : "text-[#2E4632]"
            }`}
          >
            {totalsUnavailable ? "—" : formatINR(budgetRemaining)}
          </p>
          <p className="text-[11px] text-[#54433A] mt-1">
            {totalsUnavailable
              ? "Awaiting currency conversion"
              : budgetRemaining < 0
                ? "Exceeded target budget"
                : "Within budget"}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {!totalsUnavailable && categorySummary.length > 0 && (
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E2E1] rounded shadow-xs space-y-6">
          <h4 className="font-serif text-xl font-bold text-[#1C1B1B] flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#6C2F00]" />
            Expense Distribution by Category (INR)
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categorySummary.map((item) => (
              <div
                key={item.category}
                className="p-3.5 bg-[#F6F3F2] rounded border border-[#E5E2E1] flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#877369] truncate">
                  {item.category}
                </span>
                <span className="font-serif text-lg font-bold text-[#1C1B1B] mt-1">
                  {formatINR(item.totalAmount)}
                </span>
                <span className="text-[10px] text-[#54433A] mt-0.5">
                  {item.count} {item.count === 1 ? "entry" : "entries"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logged Expenses Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E2E1]">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
              Expense Log
            </h3>
            <p className="text-xs text-[#54433A]">
              Original amounts are shown in their recorded currencies.
            </p>
          </div>

          <Button
            variant="terracotta"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Record Expense
          </Button>
        </div>

        {loading ? (
          <LoadingState message="Loading journey expenses..." />
        ) : expenses.length > 0 ? (
          <div className="bg-[#FFFFFF] border border-[#E5E2E1] rounded overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-[#F6F3F2] border-b border-[#E5E2E1] text-[#877369] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-6">Date</th>
                    <th className="py-3.5 px-6">Category</th>
                    <th className="py-3.5 px-6">Description</th>
                    <th className="py-3.5 px-6 text-right">Amount</th>
                    <th className="py-3.5 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0EDED]">
                  {expenses.map((exp) => (
                    <tr
                      key={exp._id}
                      className="hover:bg-[#FCF9F8] transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-[#1C1B1B] whitespace-nowrap">
                        {exp.date
                          ? new Date(exp.date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="terracotta" size="xs">
                          {exp.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-[#54433A] max-w-xs truncate">
                        {exp.description || "—"}
                      </td>
                      <td className="py-4 px-6 text-right font-serif font-bold text-[#1C1B1B] whitespace-nowrap text-sm">
                        {exp.currency || "INR"}{" "}
                        {Number(exp.amount).toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(exp._id)}
                          className="text-[#877369] hover:text-[#BA1A1A] transition-colors p-1"
                          title="Delete entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={DollarSign}
            title="No Expenses Logged"
            description="Keep control of your travel budget by recording hotel stays, meals, souvenirs, and transit tickets."
            actionLabel="Record First Expense"
            onAction={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* Record Expense Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Record Journey Expense"
          subtitle={`Log an itemized expenditure for ${trip.destination}`}
        >
          {formError && (
            <div className="mb-4 p-3 bg-[#FFDAD6]/50 text-xs text-[#BA1A1A] rounded">
              {formError}
            </div>
          )}

          <form onSubmit={handleAddExpense} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                label="Amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                placeholder="e.g. 1500"
                required
              />

              <div className="flex flex-col">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="py-2.5 px-2 bg-transparent border-b border-[#DAC2B6] text-xs font-semibold uppercase text-[#1C1B1B] focus:outline-none focus:border-[#6C2F00]"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="py-2.5 px-2 bg-transparent border-b border-[#DAC2B6] text-xs font-semibold text-[#1C1B1B] focus:outline-none focus:border-[#6C2F00]"
                  required
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <FormField
                label="Date of Expense"
                name="date"
                type="date"
                min={trip.startDate ? trip.startDate.split("T")[0] : undefined}
                max={trip.endDate ? trip.endDate.split("T")[0] : undefined}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                helperText="Must be between trip departure and return dates"
                required
              />
            </div>

            <FormField
              label="Description / Purpose"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g. Traditional Rajasthani dinner at Ambrai"
            />

            <div className="pt-4 border-t border-[#E5E2E1] flex justify-end space-x-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsAddModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="terracotta"
                size="md"
                loading={formLoading}
              >
                Save Expense
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default TripBudgetTab;
