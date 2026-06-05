import { calculateBudget, formatINR, pct } from "./budgetUtils";

describe("calculateBudget", () => {
  it("calculates itemized totals, buffer, per-day, per-person, and ranges", () => {
    const result = calculateBudget({
      days: 5,
      travelers: 2,
      accommodationType: "standard",
      transportType: "bus",
      foodPerPersonPerDay: 600,
      activityType: "sightseeing",
      baseAccomRate: 1800,
    });

    expect(result).toEqual({
      stay: 18000,
      travel: 3200,
      food: 6000,
      activities: 3000,
      buffer: 3020,
      total: 33220,
      perDay: 6644,
      perPerson: 16610,
      ranges: {
        budget: 18271,
        standard: 33220,
        luxury: 106304,
      },
    });
  });

  it("falls back to standard accommodation and default options for unknown keys", () => {
    const result = calculateBudget({
      days: 1,
      travelers: 1,
      accommodationType: "unknown",
      transportType: "unknown",
      foodPerPersonPerDay: 500,
      activityType: "unknown",
      baseAccomRate: 1000,
    });

    expect(result.stay).toBe(1000);
    expect(result.travel).toBe(1600);
    expect(result.activities).toBe(300);
    expect(result.total).toBe(3740);
  });

  it("returns zero per-day and per-person values for zero days or travelers", () => {
    const result = calculateBudget({
      days: 0,
      travelers: 0,
      accommodationType: "standard",
      transportType: "bus",
      foodPerPersonPerDay: 600,
      activityType: "sightseeing",
      baseAccomRate: 1800,
    });

    expect(result.perDay).toBe(0);
    expect(result.perPerson).toBe(0);
  });
});

describe("formatINR", () => {
  it("formats whole-number INR amounts without decimal digits", () => {
    expect(formatINR(33220)).toBe("₹33,220");
  });
});

describe("pct", () => {
  it("returns a rounded percentage string", () => {
    expect(pct(25, 200)).toBe("13%");
  });

  it("caps percentages at 100", () => {
    expect(pct(250, 200)).toBe("100%");
  });

  it("returns 0% when total is missing or zero", () => {
    expect(pct(50, 0)).toBe("0%");
  });
});
