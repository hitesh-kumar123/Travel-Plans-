import { getTripCountdown } from "./tripCountdown";

const localDate = (year, monthIndex, day) => new Date(year, monthIndex, day);

describe("getTripCountdown", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
    jest.setSystemTime(localDate(2026, 5, 5));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns an upcoming countdown before the trip starts", () => {
    expect(
      getTripCountdown(localDate(2026, 5, 10), localDate(2026, 5, 15)),
    ).toEqual({
      type: "upcoming",
      label: "5 days to go",
    });
  });

  it("returns today when the trip starts on the current day", () => {
    const result = getTripCountdown(
      localDate(2026, 5, 5),
      localDate(2026, 5, 8),
    );

    expect(result.type).toBe("today");
    expect(result.label).toContain("Trip starts today");
  });

  it("returns ongoing after the trip starts and before it ends", () => {
    const result = getTripCountdown(
      localDate(2026, 5, 1),
      localDate(2026, 5, 8),
    );

    expect(result.type).toBe("ongoing");
    expect(result.label).toContain("Trip in progress");
  });

  it("returns completed after the trip end date has passed", () => {
    expect(
      getTripCountdown(localDate(2026, 4, 20), localDate(2026, 5, 4)),
    ).toEqual({
      type: "completed",
      label: "Completed",
    });
  });
});
