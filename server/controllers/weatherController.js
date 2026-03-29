const axios = require("axios");

// Get current weather for a location
exports.getCurrentWeather = async (req, res) => {
  try {
    const { location } = req.params;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`
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
    console.error(err.message);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ msg: "Location not found" });
    }
    res.status(500).send("Server error");
  }
};

// Get 5-day forecast for a location
exports.getForecast = async (req, res) => {
  try {
    const { location } = req.params;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`
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
    console.error(err.message);
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ msg: "Location not found" });
    }
    res.status(500).send("Server error");
  }
};
