/**
 * Utility functions for calculating trip readiness score
 */

export const calculateReadinessScore = (
  weatherData,
  hasPackingList = false,
  hasAlerts = false,
) => {
  if (!weatherData) return { score: 0, checklist: [], status: "Not Ready" };

  const conditions = [];

  // Weather Checked (always true if we have weather data)
  conditions.push({
    id: "weather-checked",
    label: "Weather Checked",
    completed: true,
    icon: "🌤️",
    weight: 20,
  });

  // Packing Suggested (true if we have weather data to generate suggestions)
  conditions.push({
    id: "packing-suggested",
    label: "Packing Suggested",
    completed: hasPackingList,
    icon: "🎒",
    weight: 20,
  });

  // Safety Tips Generated
  const hasWeatherAlerts = hasAlerts || hasWeatherConcerns(weatherData);
  conditions.push({
    id: "safety-tips",
    label: "Safety Tips Generated",
    completed: hasWeatherAlerts,
    icon: "⚠️",
    weight: 15,
  });

  // Weather Alerts Reviewed
  conditions.push({
    id: "alerts-reviewed",
    label: "Weather Alerts Reviewed",
    completed: hasWeatherAlerts,
    icon: "📋",
    weight: 15,
  });

  // Rain Preparation (if applicable)
  const needsRainPrep = needsRainPreparation(weatherData);
  const rainPrepComplete = needsRainPrep ? hasRainItems(weatherData) : true;
  conditions.push({
    id: "rain-preparation",
    label: "Rain Preparation Complete",
    completed: rainPrepComplete,
    icon: "☂️",
    weight: needsRainPrep ? 15 : 0,
    applicable: needsRainPrep,
  });

  // Temperature Preparation
  const tempPrepComplete = hasTemperaturePreparation(weatherData);
  conditions.push({
    id: "temperature-prep",
    label: "Temperature Preparation",
    completed: tempPrepComplete,
    icon: "🌡️",
    weight: 15,
  });

  // Calculate weighted score
  const applicableConditions = conditions.filter((c) => c.applicable !== false);
  const totalWeight = applicableConditions.reduce(
    (sum, condition) => sum + condition.weight,
    0,
  );
  const completedWeight = applicableConditions
    .filter((condition) => condition.completed)
    .reduce((sum, condition) => sum + condition.weight, 0);

  const score =
    totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;

  // Determine status
  let status = "Not Ready";
  let statusColor = "#f56565";

  if (score >= 90) {
    status = "Ready To Go!";
    statusColor = "#48bb78";
  } else if (score >= 70) {
    status = "Almost Ready";
    statusColor = "#4299e1";
  } else if (score >= 50) {
    status = "Getting There";
    statusColor = "#ed8936";
  }

  return {
    score,
    status,
    statusColor,
    checklist: applicableConditions,
    completedItems: applicableConditions.filter((c) => c.completed).length,
    totalItems: applicableConditions.length,
  };
};

const hasWeatherConcerns = (weatherData) => {
  const { temperature, description = "", windSpeed = 0 } = weatherData;
  const desc = description.toLowerCase();

  return (
    temperature >= 30 ||
    temperature <= 5 ||
    desc.includes("rain") ||
    desc.includes("storm") ||
    desc.includes("snow") ||
    windSpeed >= 10
  );
};

const needsRainPreparation = (weatherData) => {
  const { description = "" } = weatherData;
  const desc = description.toLowerCase();

  return (
    desc.includes("rain") ||
    desc.includes("shower") ||
    desc.includes("drizzle") ||
    desc.includes("storm")
  );
};

const hasRainItems = (weatherData) => {
  // In a real app, this would check if user has packed rain items
  // For now, we'll assume they need to be reminded
  return needsRainPreparation(weatherData);
};

const hasTemperaturePreparation = (weatherData) => {
  const { temperature } = weatherData;

  // Assume preparation is adequate for moderate temperatures
  if (temperature >= 15 && temperature <= 30) {
    return true;
  }

  // For extreme temperatures, assume user needs specific preparation
  return false;
};

export const getReadinessLevels = () => {
  return {
    90: {
      label: "Ready To Go!",
      color: "#48bb78",
      description: "You're all set for your trip!",
    },
    70: {
      label: "Almost Ready",
      color: "#4299e1",
      description: "Just a few more items to check",
    },
    50: {
      label: "Getting There",
      color: "#ed8936",
      description: "Making good progress",
    },
    0: {
      label: "Not Ready",
      color: "#f56565",
      description: "Several items need attention",
    },
  };
};

export const getScoreColor = (score) => {
  if (score >= 90) return "#48bb78";
  if (score >= 70) return "#4299e1";
  if (score >= 50) return "#ed8936";
  return "#f56565";
};
