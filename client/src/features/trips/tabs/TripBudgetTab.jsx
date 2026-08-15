import React, { useState, useEffect } from "react";
import { expensesApi } from "../../../services/api/expensesApi";
import { getErrorMessage } from "../../../services/api/client";
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
  Calendar,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

export const TripBudgetTab = ({ trip }) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const [expRes, sumRes] = await Promise.all([
        expensesApi.getByTrip(trip._id),
        expensesApi.getSummary(trip._id),
      ]);
      setExpenses(expRes.data?.data || expRes.data || []);
      setSummary(sumRes.data || []);
    } catch (err) {
      console.error("Failed to load expenses:", err);
      setError("Unable to load budget records for this journey.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip._id) fetchExpensesData();
  }, [trip._id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setFormError("");

    const parsedAmount = parseFloat(formData.amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
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
    }
  };

  // Calculate totals
  const totalSpent = expenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0,
  );
  const plannedBudget = Number(trip.budget) || 0;
  const budgetRemaining = plannedBudget - totalSpent;
  const percentUsed =
    plannedBudget > 0
      ? Math.min(100, Math.round((totalSpent / plannedBudget) * 100))
      : 0;

  return (
    <div className="space-y-10">
      {/* Budget Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#877369]">
            Planned Budget
          </span>
          <p className="font-serif text-2xl font-bold text-[#1C1B1B] mt-1">
            ₹{plannedBudget.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#54433A] mt-1">Target allocated</p>
        </div>

        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#6C2F00]">
            Total Expended
          </span>
          <p className="font-serif text-2xl font-bold text-[#6C2F00] mt-1">
            ₹{totalSpent.toLocaleString("en-IN")}
          </p>
          <div className="w-full bg-[#F0EDED] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full ${
                percentUsed > 100 ? "bg-[#BA1A1A]" : "bg-[#6C2F00]"
              }`}
              style={{ width: `${Math.min(100, percentUsed)}%` }}
            />
          </div>
          <p className="text-[11px] text-[#54433A] mt-1.5">
            {percentUsed}% of budget utilized
          </p>
        </div>

        <div className="bg-[#FFFFFF] p-6 border border-[#E5E2E1] rounded shadow-xs">
          <span className="text-xs font-semibold uppercase text-[#877369]">
            Remaining Sanctuary Balance
          </span>
          <p
            className={`font-serif text-2xl font-bold mt-1 ${
              budgetRemaining < 0 ? "text-[#BA1A1A]" : "text-[#2E4632]"
            }`}
          >
            ₹{budgetRemaining.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-[#54433A] mt-1">
            {budgetRemaining < 0
              ? "Exceeded target budget"
              : "Within safety buffer"}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      {summary.length > 0 && (
        <div className="bg-[#FFFFFF] p-6 sm:p-8 border border-[#E5E2E1] rounded shadow-xs space-y-6">
          <h4 className="font-serif text-xl font-bold text-[#1C1B1B] flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#6C2F00]" />
            Expense Distribution by Category
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {summary.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 bg-[#F6F3F2] rounded border border-[#E5E2E1] flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#877369] truncate">
                  {item.category}
                </span>
                <span className="font-serif text-lg font-bold text-[#1C1B1B] mt-1">
                  ₹{(item.totalAmount || 0).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-[#54433A] mt-0.5">
                  {item.count} entry{item.count === 1 ? "" : "ies"}
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
              Itemized entries recorded for this expedition.
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
          <LoadingState message="Auditing journey expenses..." />
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
                        {Number(exp.amount).toLocaleString("en-IN")}
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
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
