import {
  accommodationRates,
  transportRates,
  foodRates,
  cityMultipliers,
} from "./pricingData";

export const calculateBudget = (form) => {
  const multiplier = cityMultipliers[form.to.trim().toLowerCase()] || 1;

  const hotelCost = Math.round(accommodationRates[form.hotelType] * multiplier);

  const transportCost = transportRates[form.transport];

  const foodCost = foodRates[form.budgetType];

  const activitiesCost = form.budgetType === "Luxury" ? 4000 : 1500;

  const miscCost = 1000;

  const total =
    (hotelCost + transportCost + foodCost + activitiesCost + miscCost) *
    form.days *
    form.travelers;

  const perDay = form.days > 0 ? Math.round(total / form.days) : 0;

  const perPersonCost = total / Math.max(form.travelers, 1);

  const budgetLevel =
    perPersonCost < 20000
      ? "Budget Trip"
      : perPersonCost < 50000
        ? "Standard Trip"
        : "Luxury Trip";

  return {
    hotelCost,
    transportCost,
    foodCost,
    activitiesCost,
    miscCost,
    total,
    perDay,
    budgetLevel,
  };
};
