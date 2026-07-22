import { calculateBudget, formatINR, pct } from "./budgetUtils";

describe("calculateBudget", () => {
  const baseInputs = {
    days: 3,
    travelers: 2,
    accommodationType: "standard",
    transportType: "bus",
    foodPerPersonPerDay: 700,
    activityType: "sightseeing",
    baseAccomRate: 1800,
  };

  test("calculates itemized costs correctly for standard inputs", () => {
    const result = calculateBudget(baseInputs);

    expect(result.stay).toBe(10800); // 1800 * 1.0 * 3 * 2
    expect(result.travel).toBe(3200); // 800 * 2 * 2 (return trip)
    expect(result.food).toBe(4200); // 700 * 3 * 2
    expect(result.activities).toBe(1800); // 300 * 3 * 2
  });

  test("calculates buffer as 10% of subtotal and adds it to total", () => {
    const result = calculateBudget(baseInputs);

    expect(result.buffer).toBe(2000); // 10% of 20000
    expect(result.total).toBe(22000);
  });

  test("calculates per-day cost", () => {
    const result = calculateBudget(baseInputs);
    expect(result.perDay).toBe(7333); // round(22000 / 3)
  });

  test("calculates per-person cost", () => {
    const result = calculateBudget(baseInputs);
    expect(result.perPerson).toBe(11000); // 22000 / 2
  });

  test("calculates budget/standard/luxury ranges", () => {
    const result = calculateBudget(baseInputs);

    expect(result.ranges.budget).toBe(12100); // 22000 * 0.55
    expect(result.ranges.standard).toBe(22000);
    expect(result.ranges.luxury).toBe(70400); // 22000 * 3.2
  });

  test("applies accommodation multiplier for luxury stays", () => {
    const result = calculateBudget({
      ...baseInputs,
      accommodationType: "luxury",
    });
    // 1800 * 3.5 * 3 * 2 = 37800
    expect(result.stay).toBe(37800);
  });

  test("applies accommodation multiplier for hostel stays", () => {
    const result = calculateBudget({
      ...baseInputs,
      accommodationType: "hostel",
    });
    // 1800 * 0.4 * 3 * 2 = 4320
    expect(result.stay).toBe(4320);
  });

  test("falls back to standard accommodation for an unknown type", () => {
    const known = calculateBudget(baseInputs);
    const unknown = calculateBudget({
      ...baseInputs,
      accommodationType: "does-not-exist",
    });
    expect(unknown.stay).toBe(known.stay);
  });

  test("falls back to the first transport option for an unknown type", () => {
    const known = calculateBudget({ ...baseInputs, transportType: "bus" });
    const unknown = calculateBudget({
      ...baseInputs,
      transportType: "does-not-exist",
    });
    expect(unknown.travel).toBe(known.travel);
  });

  test("falls back to the first activity option for an unknown type", () => {
    const known = calculateBudget({
      ...baseInputs,
      activityType: "sightseeing",
    });
    const unknown = calculateBudget({
      ...baseInputs,
      activityType: "does-not-exist",
    });
    expect(unknown.activities).toBe(known.activities);
  });

  test("handles zero days without dividing by zero", () => {
    const result = calculateBudget({ ...baseInputs, days: 0 });
    expect(result.perDay).toBe(0);
  });

  test("handles zero travelers without dividing by zero", () => {
    const result = calculateBudget({ ...baseInputs, travelers: 0 });
    expect(result.perPerson).toBe(0);
    expect(result.stay).toBe(0);
    expect(result.travel).toBe(0);
  });
});

describe("formatINR", () => {
  test("formats a whole number as INR currency", () => {
    expect(formatINR(1000)).toBe("₹1,000");
  });

  test("uses Indian digit grouping for large numbers", () => {
    expect(formatINR(1234567)).toBe("₹12,34,567");
  });

  test("formats zero correctly", () => {
    expect(formatINR(0)).toBe("₹0");
  });

  test("rounds off fractional amounts (no decimals shown)", () => {
    expect(formatINR(999.6)).toBe("₹1,000");
  });
});

describe("pct", () => {
  test("calculates a basic percentage", () => {
    expect(pct(50, 200)).toBe("25%");
  });

  test("returns 0% when value is 0", () => {
    expect(pct(0, 100)).toBe("0%");
  });

  test("caps at 100% when value exceeds total", () => {
    expect(pct(150, 100)).toBe("100%");
  });

  test("returns 0% when total is 0 (avoids division by zero)", () => {
    expect(pct(50, 0)).toBe("0%");
  });

  test("returns 0% when total is undefined/falsy", () => {
    expect(pct(50, null)).toBe("0%");
  });
});
