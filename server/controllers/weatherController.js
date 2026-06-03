const axios = require("axios");

const getMockWeatherData = (location) => ({
  location: location.charAt(0).toUpperCase() + location.slice(1),
  country: "MockLand",
  temperature: 22.5,
  description: "clear sky (mocked)",
  icon: "01d",
  humidity: 55,
  windSpeed: 3.5,
  timestamp: Math.floor(Date.now() / 1000),
});

const getMockForecastData = (location) => {
  const list = [];
  const baseTime = Date.now();
  for (let i = 0; i < 5; i++) {
    const d = new Date(baseTime + i * 24 * 60 * 60 * 1000);
    list.push({
      date: d.toISOString().replace('T', ' ').substring(0, 19),
      temperature: 20 + i,
      description: "mocked weather forecast",
      icon: "02d",
      humidity: 60,
      windSpeed: 4.0,
    });
  }
  return {
    location: location.charAt(0).toUpperCase() + location.slice(1),
    country: "MockLand",
    forecast: list,
  };
};

// Get current weather for a location
exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;

    if (!process.env.WEATHER_API_KEY || process.env.WEATHER_API_KEY === "your_api_key_here") {
      return res.json(getMockWeatherData(location));
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    );

    const weatherData = {
      location: response.data.name,
      country: response.data.sys.country,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      timestamp: response.data.dt,
    };

    res.json(weatherData);
  } catch (err) {
    console.error("OpenWeatherMap Error:", err.message);
    const { location } = req.params;
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ msg: "Location not found" });
    }
    if (!process.env.WEATHER_API_KEY || (err.response && err.response.status === 401)) {
      return res.json(getMockWeatherData(location));
    }
    res.status(500).send("Server error");
  }
};

// Get 5-day forecast for a location
exports.getForecast = async (req, res) => {
  try {
    const { location } = req.params;

    if (!process.env.WEATHER_API_KEY || process.env.WEATHER_API_KEY === "your_api_key_here") {
      return res.json(getMockForecastData(location));
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    );

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
    console.error("OpenWeatherMap Error:", err.message);
    const { location } = req.params;
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ msg: "Location not found" });
    }
    if (!process.env.WEATHER_API_KEY || (err.response && err.response.status === 401)) {
      return res.json(getMockForecastData(location));
    }
    res.status(500).send("Server error");
  }
};
