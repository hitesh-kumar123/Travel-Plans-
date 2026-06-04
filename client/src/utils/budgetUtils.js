import {
  ACCOMMODATION_MULTIPLIERS,
  TRANSPORT_OPTIONS,
  ACTIVITY_OPTIONS,
  BUFFER_PERCENT,
  TIER_MULTIPLIERS,
} from "../constants/budgetConstants";

/**
 * calculateBudget
 * Pure function — no side effects, easy to unit test.
 *
 * @param {Object} inputs
 * @param {number} inputs.days
 * @param {number} inputs.travelers
 * @param {string} inputs.accommodationType  – key from ACCOMMODATION_MULTIPLIERS
 * @param {string} inputs.transportType      – key from TRANSPORT_OPTIONS
 * @param {number} inputs.foodPerPersonPerDay
 * @param {string} inputs.activityType       – key from ACTIVITY_OPTIONS
 * @param {number} inputs.baseAccomRate      – pulled from DESTINATION_BASE_RATES
 *
 * @returns {{ stay, travel, food, activities, buffer, total, perDay, perPerson, ranges }}
 */
export function calculateBudget({
  days,
  travelers,
  accommodationType,
  transportType,
  foodPerPersonPerDay,
  activityType,
  baseAccomRate,
}) {
  const accomConfig =
    ACCOMMODATION_MULTIPLIERS[accommodationType] ||
    ACCOMMODATION_MULTIPLIERS.standard;
  const transportConf =
    TRANSPORT_OPTIONS.find((t) => t.key === transportType) ||
    TRANSPORT_OPTIONS[0];
  const activityConf =
    ACTIVITY_OPTIONS.find((a) => a.key === activityType) || ACTIVITY_OPTIONS[0];

  const stay = Math.round(
    baseAccomRate * accomConfig.multiplier * days * travelers,
  );
  const travel = Math.round(transportConf.costPerPerson * travelers * 2); // return trip
  const food = Math.round(foodPerPersonPerDay * days * travelers);
  const activities = Math.round(
    activityConf.costPerPersonPerDay * days * travelers,
  );

  const subtotal = stay + travel + food + activities;
  const buffer = Math.round(subtotal * BUFFER_PERCENT);
  const total = subtotal + buffer;

  const perDay = days > 0 ? Math.round(total / days) : 0;
  const perPerson = travelers > 0 ? Math.round(total / travelers) : 0;

  // Quick range estimate (budget / standard / luxury)
  const ranges = {
    budget: Math.round(total * TIER_MULTIPLIERS.budget),
    standard: total,
    luxury: Math.round(total * TIER_MULTIPLIERS.luxury),
  };

  return {
    stay,
    travel,
    food,
    activities,
    buffer,
    total,
    perDay,
    perPerson,
    ranges,
  };
}

/** Format a number as INR currency string */
export function formatINR(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Return percentage width string capped at 100 */
export function pct(value, total) {
  if (!total) return "0%";
  return Math.min(100, Math.round((value / total) * 100)) + "%";
}
