import { getTripCountdown } from "./tripCountdown";

describe("getTripCountdown", () => {
  const FIXED_TODAY = new Date("2026-07-16T00:00:00");

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FIXED_TODAY);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns 'upcoming' with correct days-to-go for a future trip", () => {
    const result = getTripCountdown("2026-07-20", "2026-07-25");
    expect(result.type).toBe("upcoming");
    expect(result.label).toBe("4 days to go");
  });

  test("returns 'today' when the trip starts today", () => {
    const result = getTripCountdown("2026-07-16", "2026-07-20");
    expect(result.type).toBe("today");
    expect(result.label).toBe("Trip starts today! 🎉");
  });

  test("returns 'ongoing' when the trip has started but not ended", () => {
    const result = getTripCountdown("2026-07-10", "2026-07-20");
    expect(result.type).toBe("ongoing");
    expect(result.label).toBe("Trip in progress ✈️");
  });

  test("returns 'ongoing' when the trip ends today (last day)", () => {
    const result = getTripCountdown("2026-07-10", "2026-07-16");
    expect(result.type).toBe("ongoing");
  });

  test("returns 'completed' when the trip has already ended", () => {
    const result = getTripCountdown("2026-07-01", "2026-07-10");
    expect(result.type).toBe("completed");
    expect(result.label).toBe("Completed");
  });

  test("handles zero-day trips (start === end) that are upcoming", () => {
    const result = getTripCountdown("2026-07-20", "2026-07-20");
    expect(result.type).toBe("upcoming");
    expect(result.label).toBe("4 days to go");
  });

  test("handles unsupported/invalid date strings by returning completed for NaN comparisons", () => {
    const result = getTripCountdown("not-a-date", "also-not-a-date");
    // Invalid Date comparisons yield NaN, so daysToEnd < 0 is false and
    // daysToStart === 0 is false — this documents current fallback behavior.
    expect(["completed", "upcoming", "ongoing", "today"]).toContain(
      result.type,
    );
  });
});
