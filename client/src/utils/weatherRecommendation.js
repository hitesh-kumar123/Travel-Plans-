/**
 * Utility functions for generating outdoor time recommendations
 */

export const generateOutdoorRecommendation = (weatherData) => {
  if (!weatherData) return {};

  const {
    temperature,
    humidity,
    description = "",
    windSpeed = 0,
  } = weatherData;

  const desc = description.toLowerCase();
  const timeSlots = {};

  // Morning (6 AM - 12 PM)
  timeSlots.morning = evaluateTimeSlot({
    temperature,
    humidity,
    description: desc,
    windSpeed,
    timeOfDay: "morning",
  });

  // Afternoon (12 PM - 6 PM)
  timeSlots.afternoon = evaluateTimeSlot({
    temperature: temperature + 2, // Usually warmer in afternoon
    humidity,
    description: desc,
    windSpeed,
    timeOfDay: "afternoon",
  });

  // Evening (6 PM - 10 PM)
  timeSlots.evening = evaluateTimeSlot({
    temperature: temperature - 3, // Usually cooler in evening
    humidity,
    description: desc,
    windSpeed,
    timeOfDay: "evening",
  });

  // Night (10 PM - 6 AM)
  timeSlots.night = evaluateTimeSlot({
    temperature: temperature - 5, // Usually much cooler at night
    humidity,
    description: desc,
    windSpeed,
    timeOfDay: "night",
  });

  return timeSlots;
};

const evaluateTimeSlot = ({
  temperature,
  humidity,
  description,
  windSpeed,
  timeOfDay,
}) => {
  let score = 100; // Start with perfect score
  let reasons = [];
  let status = "great";
  let icon = "✅";

  // Temperature evaluation
  if (temperature >= 35) {
    score -= 40;
    reasons.push("Extreme heat");
    if (timeOfDay === "afternoon") {
      score -= 20; // Extra penalty for afternoon heat
      reasons.push("Peak sun hours");
    }
  } else if (temperature >= 30) {
    score -= 20;
    reasons.push("Very hot weather");
    if (timeOfDay === "afternoon") {
      score -= 15;
      reasons.push("High UV exposure");
    }
  } else if (temperature <= 0) {
    score -= 35;
    reasons.push("Freezing temperature");
  } else if (temperature <= 5) {
    score -= 25;
    reasons.push("Very cold");
  } else if (temperature >= 20 && temperature <= 28) {
    score += 10; // Bonus for ideal temperature
    reasons.push("Perfect temperature");
  }

  // Weather condition evaluation
  if (description.includes("thunder") || description.includes("storm")) {
    score -= 50;
    reasons.push("Thunderstorm conditions");
  } else if (description.includes("heavy rain")) {
    score -= 40;
    reasons.push("Heavy rainfall");
  } else if (description.includes("rain") || description.includes("shower")) {
    score -= 25;
    reasons.push("Rainy weather");
  } else if (description.includes("snow")) {
    score -= 30;
    reasons.push("Snow conditions");
  } else if (description.includes("fog") || description.includes("mist")) {
    score -= 15;
    reasons.push("Poor visibility");
  } else if (description.includes("clear") || description.includes("sunny")) {
    score += 15; // Bonus for clear weather
    reasons.push("Clear skies");
  }

  // Humidity evaluation
  if (humidity >= 90) {
    score -= 20;
    reasons.push("Extremely humid");
  } else if (humidity >= 80) {
    score -= 10;
    reasons.push("Very humid");
  } else if (humidity <= 30) {
    score -= 5;
    reasons.push("Very dry air");
  }

  // Wind evaluation
  if (windSpeed >= 20) {
    score -= 25;
    reasons.push("Strong winds");
  } else if (windSpeed >= 10) {
    score -= 10;
    reasons.push("Windy conditions");
  } else if (windSpeed >= 2 && windSpeed <= 8) {
    score += 5; // Light breeze is pleasant
    reasons.push("Pleasant breeze");
  }

  // Time of day specific adjustments
  if (timeOfDay === "morning") {
    score += 5; // Morning is generally pleasant
    if (temperature >= 20 && temperature <= 25) {
      reasons.push("Cool morning air");
    }
  } else if (timeOfDay === "afternoon") {
    if (temperature >= 25) {
      score -= 10; // Afternoon heat penalty
    }
  } else if (timeOfDay === "evening") {
    score += 10; // Evening is generally nice
    reasons.push("Pleasant evening time");
  } else if (timeOfDay === "night") {
    score -= 15; // Night activities are limited
    reasons.push("Limited visibility");
  }

  // Determine final status and icon
  if (score >= 80) {
    status = "great";
    icon = "✅";
  } else if (score >= 60) {
    status = "good";
    icon = "👍";
  } else if (score >= 40) {
    status = "okay";
    icon = "⚠️";
  } else {
    status = "avoid";
    icon = "❌";
  }

  // Clean up reasons - remove duplicates and negative reasons if score is high
  const uniqueReasons = [...new Set(reasons)];
  const finalReasons =
    score >= 60
      ? uniqueReasons.filter(
          (r) =>
            ![
              "Extreme heat",
              "Very cold",
              "Thunderstorm conditions",
              "Heavy rainfall",
            ].includes(r),
        )
      : uniqueReasons;

  return {
    status,
    icon,
    score: Math.max(0, Math.min(100, score)),
    reasons: finalReasons.length > 0 ? finalReasons : ["Standard conditions"],
    timeOfDay,
    recommendation: getRecommendationText(status, timeOfDay, temperature),
  };
};

const getRecommendationText = (status, timeOfDay, temperature) => {
  const timeTexts = {
    morning: "Morning",
    afternoon: "Afternoon",
    evening: "Evening",
    night: "Night",
  };

  const timeLabel = timeTexts[timeOfDay];

  switch (status) {
    case "great":
      return `${timeLabel} - Perfect for outdoor activities`;
    case "good":
      return `${timeLabel} - Good time to be outside`;
    case "okay":
      return `${timeLabel} - Okay with precautions`;
    case "avoid":
      return `${timeLabel} - Better to stay indoors`;
    default:
      return `${timeLabel} - Conditions unknown`;
  }
};

export const getTimeSlotConfig = () => {
  return {
    great: {
      color: "#48bb78",
      bgColor: "rgba(72, 187, 120, 0.1)",
      label: "Great",
    },
    good: {
      color: "#4299e1",
      bgColor: "rgba(66, 153, 225, 0.1)",
      label: "Good",
    },
    okay: {
      color: "#ed8936",
      bgColor: "rgba(237, 137, 54, 0.1)",
      label: "Okay",
    },
    avoid: {
      color: "#f56565",
      bgColor: "rgba(245, 101, 101, 0.1)",
      label: "Avoid",
    },
  };
};
