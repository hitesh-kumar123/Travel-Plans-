const Trip = require("../models/Trip");
const Expense = require("../models/Expense");

exports.getBudgetForecast = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user._id;

    // Verify trip belongs to user
    const trip = await Trip.findOne({ _id: tripId, user: userId });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const expenses = await Expense.find({ trip: tripId, user: userId }).sort({
      date: 1,
    });

    const budget = trip.budget || 0;
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const today = new Date();

    // Time calculations
    const tripDays = Math.max(1, Math.ceil((endDate - startDate) / 86400000));
    const daysElapsed = Math.max(
      1,
      Math.min(Math.ceil((today - startDate) / 86400000), tripDays),
    );
    const daysRemaining = Math.max(0, tripDays - daysElapsed);

    // Spend metrics
    const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
    const remainingBudget = budget - totalSpent;
    const dailySpendRate = totalSpent / daysElapsed;
    const forecastedTotal = dailySpendRate * tripDays;
    const budgetDrift = forecastedTotal - budget;
    const driftPercentage =
      budget > 0 ? +((budgetDrift / budget) * 100).toFixed(1) : 0;
    const expectedDailyBudget = budget / tripDays;
    const projectedSavings = +(budget - forecastedTotal).toFixed(2);

    // Health score  (compares pace of spending vs pace of time)
    const spentPct = budget > 0 ? (totalSpent / budget) * 100 : 0;
    const timePct = (daysElapsed / tripDays) * 100;
    const paceDrift = spentPct - timePct;
    let healthScore;
    if (paceDrift > 20 || forecastedTotal > budget * 1.2)
      healthScore = "critical";
    else if (paceDrift > 10 || forecastedTotal > budget * 1.05)
      healthScore = "warning";
    else healthScore = "healthy";

    // Category breakdown
    const categoryMap = {};
    expenses.forEach((e) => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + e.amount;
    });
    const categoryBreakdown = Object.entries(categoryMap)
      .map(([category, spent]) => ({
        category,
        spent: +spent.toFixed(2),
        percentage:
          totalSpent > 0 ? +((spent / totalSpent) * 100).toFixed(1) : 0,
      }))
      .sort((a, b) => b.spent - a.spent);

    // Flag categories spending faster than proportional budget share
    const categories = [
      "food",
      "transport",
      "accommodation",
      "activities",
      "shopping",
      "other",
    ];
    const expectedPerCategory = budget / categories.length;
    const overspendingCategories = categoryBreakdown
      .filter((c) => c.spent > expectedPerCategory)
      .map((c) => c.category);

    // Daily spending trend (for chart)
    const trendMap = {};
    expenses.forEach((e) => {
      const day = new Date(e.date).toISOString().split("T")[0];
      trendMap[day] = (trendMap[day] || 0) + e.amount;
    });
    let cumulative = 0;
    const spendingTrend = Object.entries(trendMap)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, dailySpend]) => {
        cumulative += dailySpend;
        return {
          date,
          dailySpend: +dailySpend.toFixed(2),
          cumulativeSpend: +cumulative.toFixed(2),
          budgetLine: +(
            expectedDailyBudget *
            (Object.keys(trendMap).indexOf(date) + 1)
          ).toFixed(2),
        };
      });

    res.json({
      tripId,
      tripName: trip.destination,
      budget,
      totalSpent: +totalSpent.toFixed(2),
      remainingBudget: +remainingBudget.toFixed(2),
      tripDays,
      daysElapsed,
      daysRemaining,
      dailySpendRate: +dailySpendRate.toFixed(2),
      forecastedTotal: +forecastedTotal.toFixed(2),
      budgetDrift: +budgetDrift.toFixed(2),
      driftPercentage,
      healthScore,
      categoryBreakdown,
      overspendingCategories,
      spendingTrend,
      expectedDailyBudget: +expectedDailyBudget.toFixed(2),
      projectedSavings,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
