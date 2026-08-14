const axios = require("axios");

// ========== DEBUG: Log API key status at module load ==========
const apiKeyStatus = process.env.WEATHER_API_KEY
  ? `Loaded (${process.env.WEATHER_API_KEY.substring(0, 4)}...${process.env.WEATHER_API_KEY.substring(process.env.WEATHER_API_KEY.length - 4)})`
  : "NOT LOADED";
console.log(
  `[WeatherController] WEATHER_API_KEY at module load: ${apiKeyStatus}`,
);
// ========== END DEBUG ==========

// Get current weather for a location
exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;

    // ========== DEBUG: Detailed API key check ==========
    console.log("\n" + "=".repeat(60));
    console.log("[getCurrentWeather] Request for:", location);
    console.log("=".repeat(60));

    const apiKey = process.env.WEATHER_API_KEY;
    console.log("API Key Status:");
    console.log("  Exists:", !!apiKey);
    console.log("  Type:", typeof apiKey);
    console.log("  Length:", apiKey?.length || 0);

    if (apiKey) {
      const masked = `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`;
      console.log("  Value (masked):", masked);
      console.log("  Has spaces:", apiKey.includes(" "));
      console.log(
        "  Has quotes:",
        apiKey.includes('"') || apiKey.includes("'"),
      );
      console.log(
        "  Has newlines:",
        apiKey.includes("\n") || apiKey.includes("\r"),
      );
    }
    console.log("=".repeat(60));
    // ========== END DEBUG ==========

    // Validate API key exists
    if (!apiKey || apiKey === "your_openweathermap_api_key") {
      console.error(
        "❌ WEATHER_API_KEY is not configured or using placeholder value",
      );
      return res.status(503).json({
        msg: "Weather service is not configured. Please contact administrator.",
      });
    }

    // Build API URL
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${apiKey}`;

    // Log URL with masked key
    const maskedUrl = apiUrl.replace(apiKey, "***API_KEY***");
    console.log("Request URL:", maskedUrl);
    console.log("Sending request...");

    const response = await axios.get(apiUrl);

    console.log("✅ Success! Status:", response.status);
    console.log("=".repeat(60) + "\n");

    const weatherData = {
      location: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      timestamp: response.data.dt,
      provider: "OpenWeather",
    };

    res.json(weatherData);
  } catch (err) {
    // Log detailed error for debugging
    console.error("\n❌ Weather API Error:");
    console.error("  Message:", err.message);
    console.error("  Status:", err.response?.status);
    console.error(
      "  Response data:",
      JSON.stringify(err.response?.data, null, 2),
    );
    console.error("  Location:", req.params.location);
    console.error("=".repeat(60) + "\n");

    // Handle specific error cases
    if (err.response) {
      const status = err.response.status;
      const apiMessage = err.response.data?.message || "";

      if (status === 404) {
        return res.status(404).json({
          msg: `Location "${req.params.location}" not found. Please check the spelling or try a nearby city.`,
        });
      }

      if (status === 401) {
        console.error("🔑 401 UNAUTHORIZED - Possible causes:");
        console.error("  1. API key is invalid");
        console.error("  2. API key not activated yet (wait 10-15 minutes)");
        console.error("  3. API key was revoked or expired");
        console.error("  4. Extra spaces/quotes in the API key");
        console.error("\nSolution:");
        console.error("  1. Go to: https://home.openweathermap.org/api_keys");
        console.error("  2. Check if key is active");
        console.error("  3. Generate new key if needed");
        console.error("  4. Update server/.env");
        console.error("  5. Restart server");

        return res.status(503).json({
          msg: "Weather service authentication failed. Please contact administrator.",
        });
      }

      if (status === 429) {
        return res.status(429).json({
          msg: "Weather service rate limit exceeded. Please try again later.",
        });
      }

      return res.status(status).json({
        msg: `Weather service error: ${apiMessage || "Unable to fetch weather data"}`,
      });
    }

    // Network or other errors
    res.status(500).json({
      msg: "Unable to connect to weather service. Please try again later.",
    });
  }
};

// Get 5-day forecast for a location
exports.getForecast = async (req, res) => {
  try {
    const { location } = req.params;

    // Validate API key exists
    if (
      !process.env.WEATHER_API_KEY ||
      process.env.WEATHER_API_KEY === "your_openweathermap_api_key"
    ) {
      console.error(
        "WEATHER_API_KEY is not configured or using placeholder value",
      );
      return res.status(503).json({
        msg: "Weather service is not configured. Please contact administrator.",
      });
    }

    // Log the request for debugging
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(location)}&units=metric&appid=${process.env.WEATHER_API_KEY}`;
    console.log(`Fetching forecast for: ${location}`);

    const response = await axios.get(apiUrl);

    // Process forecast data
    const forecastData = response.data.list.map((item) => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description,
      icon: item.weather[0].icon,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
    }));

    res.json({
      location: response.data.city.name,
      country: response.data.city.country,
      forecast: forecastData,
    });
  } catch (err) {
    // Log detailed error for debugging
    console.error("Forecast API Error:", {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      location: req.params.location,
    });

    // Handle specific error cases
    if (err.response) {
      const status = err.response.status;
      const apiMessage = err.response.data?.message || "";

      if (status === 404) {
        return res.status(404).json({
          msg: `Location "${req.params.location}" not found. Please check the spelling or try a nearby city.`,
        });
      }

      if (status === 401) {
        console.error("OpenWeatherMap API returned 401 - Invalid API key");
        return res.status(503).json({
          msg: "Weather service authentication failed. Please contact administrator.",
        });
      }

      if (status === 429) {
        return res.status(429).json({
          msg: "Weather service rate limit exceeded. Please try again later.",
        });
      }

      return res.status(status).json({
        msg: `Weather service error: ${apiMessage || "Unable to fetch forecast data"}`,
      });
    }

    // Network or other errors
    res.status(500).json({
      msg: "Unable to connect to weather service. Please try again later.",
    });
  }
};
