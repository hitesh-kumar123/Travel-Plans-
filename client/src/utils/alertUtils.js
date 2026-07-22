/**
 * Utility functions for generating smart weather alerts
 */

export const generateWeatherAlerts = (weatherData) => {
  if (!weatherData) return [];

  const {
    temperature,
    humidity,
    description = "",
    windSpeed = 0,
  } = weatherData;

  const alerts = [];
  const desc = description.toLowerCase();

  // Temperature alerts
  if (temperature >= 35) {
    alerts.push({
      id: "extreme-heat",
      title: "Extreme Heat Warning",
      description: `Temperature is ${Math.round(temperature)}°C. Avoid outdoor activities between 12 PM and 4 PM.`,
      severity: "high",
      color: "#f56565",
      icon: "🌡️",
      actions: [
        "Drink plenty of water",
        "Use sunscreen SPF 50+",
        "Stay in shade",
        "Wear light-colored clothing",
      ],
    });
  } else if (temperature >= 30) {
    alerts.push({
      id: "heat-warning",
      title: "Heat Advisory",
      description: `High temperature of ${Math.round(temperature)}°C expected. Take precautions when outdoors.`,
      severity: "medium",
      color: "#ed8936",
      icon: "☀️",
      actions: ["Stay hydrated", "Use sunscreen", "Take breaks in shade"],
    });
  }

  if (temperature <= 0) {
    alerts.push({
      id: "freeze-warning",
      title: "Freezing Temperature",
      description: `Temperature is ${Math.round(temperature)}°C. Risk of frostbite and hypothermia.`,
      severity: "high",
      color: "#4299e1",
      icon: "🥶",
      actions: [
        "Dress in multiple layers",
        "Cover exposed skin",
        "Limit outdoor exposure",
        "Stay dry and warm",
      ],
    });
  } else if (temperature <= 5) {
    alerts.push({
      id: "cold-warning",
      title: "Cold Weather Alert",
      description: `Very cold conditions at ${Math.round(temperature)}°C. Bundle up before going outside.`,
      severity: "medium",
      color: "#4299e1",
      icon: "🧥",
      actions: ["Wear warm layers", "Protect extremities", "Stay dry"],
    });
  }

  // Weather condition alerts
  if (desc.includes("thunder") || desc.includes("storm")) {
    alerts.push({
      id: "thunderstorm",
      title: "Thunderstorm Alert",
      description:
        "Thunderstorm conditions detected. Take shelter immediately.",
      severity: "high",
      color: "#805ad5",
      icon: "⛈️",
      actions: [
        "Stay indoors",
        "Avoid windows",
        "Unplug electronics",
        "Stay away from water",
      ],
    });
  }

  if (desc.includes("heavy rain") || desc.includes("downpour")) {
    alerts.push({
      id: "heavy-rain",
      title: "Heavy Rain Warning",
      description:
        "Heavy rainfall expected. Risk of flooding in low-lying areas.",
      severity: "high",
      color: "#4299e1",
      icon: "🌧️",
      actions: [
        "Avoid driving if possible",
        "Stay away from flooded roads",
        "Carry waterproof items",
        "Plan indoor activities",
      ],
    });
  } else if (
    desc.includes("rain") ||
    desc.includes("shower") ||
    desc.includes("drizzle")
  ) {
    alerts.push({
      id: "rain",
      title: "Rain Expected",
      description: "Rain is forecasted. Carry rain protection.",
      severity: "low",
      color: "#38b2ac",
      icon: "🌦️",
      actions: [
        "Carry umbrella",
        "Wear waterproof clothing",
        "Plan indoor backup activities",
      ],
    });
  }

  if (desc.includes("snow") || desc.includes("blizzard")) {
    const severity =
      desc.includes("heavy") || desc.includes("blizzard") ? "high" : "medium";
    alerts.push({
      id: "snow",
      title: desc.includes("blizzard") ? "Blizzard Warning" : "Snow Alert",
      description: desc.includes("blizzard")
        ? "Blizzard conditions with heavy snow and strong winds."
        : "Snow is expected. Travel may be affected.",
      severity,
      color: "#e2e8f0",
      icon: "❄️",
      actions: [
        "Avoid unnecessary travel",
        "Carry emergency supplies",
        "Drive slowly and carefully",
        "Clear walkways of ice",
      ],
    });
  }

  // Humidity alerts
  if (humidity >= 90) {
    alerts.push({
      id: "extreme-humidity",
      title: "Extreme Humidity",
      description: `Humidity at ${humidity}%. Very uncomfortable conditions.`,
      severity: "medium",
      color: "#38b2ac",
      icon: "💧",
      actions: [
        "Stay in air-conditioned spaces",
        "Wear breathable fabrics",
        "Take frequent breaks",
        "Stay hydrated",
      ],
    });
  }

  // Wind alerts
  if (windSpeed >= 20) {
    alerts.push({
      id: "high-wind",
      title: "High Wind Warning",
      description: `Strong winds at ${windSpeed} m/s. Secure loose objects.`,
      severity: "high",
      color: "#718096",
      icon: "💨",
      actions: [
        "Secure outdoor items",
        "Avoid driving high-profile vehicles",
        "Be cautious near trees",
        "Wear windproof clothing",
      ],
    });
  } else if (windSpeed >= 10) {
    alerts.push({
      id: "wind-advisory",
      title: "Windy Conditions",
      description: `Moderate winds at ${windSpeed} m/s expected.`,
      severity: "low",
      color: "#a0aec0",
      icon: "🌬️",
      actions: [
        "Secure light objects",
        "Be aware of wind chill",
        "Wear appropriate clothing",
      ],
    });
  }

  // Fog/visibility alerts
  if (desc.includes("fog") || desc.includes("mist")) {
    alerts.push({
      id: "low-visibility",
      title: "Low Visibility",
      description: "Fog or mist may reduce visibility. Drive with caution.",
      severity: "medium",
      color: "#a0aec0",
      icon: "🌫️",
      actions: [
        "Use fog lights when driving",
        "Reduce speed",
        "Increase following distance",
        "Allow extra travel time",
      ],
    });
  }

  return alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 };
    return severityOrder[b.severity] - severityOrder[a.severity];
  });
};

export const getAlertSeverityConfig = () => {
  return {
    high: {
      bgColor: "rgba(245, 101, 101, 0.1)",
      borderColor: "#f56565",
      textColor: "#c53030",
    },
    medium: {
      bgColor: "rgba(237, 137, 54, 0.1)",
      borderColor: "#ed8936",
      textColor: "#c05621",
    },
    low: {
      bgColor: "rgba(56, 178, 172, 0.1)",
      borderColor: "#38b2ac",
      textColor: "#285e61",
    },
  };
};
