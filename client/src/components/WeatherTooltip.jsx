import { useState, useEffect } from "react";
import axios from "axios";
import {
  WiDaySunny,
  WiCloud,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
  WiNa,
} from "react-icons/wi";
import "./WeatherTooltip.css";

// WMO weather codes -> icon + label
// Reference: https://open-meteo.com/en/docs (current_weather.weathercode)
const WEATHER_CODES = {
  0: { label: "Clear Sky", icon: WiDaySunny },
  1: { label: "Mainly Clear", icon: WiDaySunny },
  2: { label: "Partly Cloudy", icon: WiCloud },
  3: { label: "Overcast", icon: WiCloud },
  45: { label: "Foggy", icon: WiFog },
  48: { label: "Foggy", icon: WiFog },
  51: { label: "Light Drizzle", icon: WiRain },
  53: { label: "Drizzle", icon: WiRain },
  55: { label: "Heavy Drizzle", icon: WiRain },
  61: { label: "Light Rain", icon: WiRain },
  63: { label: "Rain", icon: WiRain },
  65: { label: "Heavy Rain", icon: WiRain },
  71: { label: "Light Snow", icon: WiSnow },
  73: { label: "Snow", icon: WiSnow },
  75: { label: "Heavy Snow", icon: WiSnow },
  80: { label: "Rain Showers", icon: WiRain },
  81: { label: "Rain Showers", icon: WiRain },
  82: { label: "Violent Showers", icon: WiRain },
  95: { label: "Thunderstorm", icon: WiThunderstorm },
};

function getWeatherInfo(code) {
  return WEATHER_CODES[code] || { label: "Weather N/A", icon: WiNa };
}

/**
 * WeatherTooltip
 * Small hover/tap icon shown on destination cards that reveals
 * current temperature + condition + "Best time to visit" in a popover.
 *
 * Props:
 *  - lat, lon: coordinates for the Open-Meteo lookup
 *  - bestTimeToVisit: string shown in the popover (falls back gracefully if absent)
 */
export default function WeatherTooltip({ lat, lon, bestTimeToVisit }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (lat == null || lon == null) {
      setLoading(false);
      setError(true);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    axios
      .get("https://api.open-meteo.com/v1/forecast", {
        params: { latitude: lat, longitude: lon, current_weather: true },
      })
      .then((res) => {
        if (!cancelled) {
          setWeather(res.data?.current_weather || null);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  if (error && !loading) return null;

  const { label, icon: Icon } = weather
    ? getWeatherInfo(weather.weathercode)
    : { label: "", icon: WiDaySunny };

  return (
    <div
      className="wander-weather-wrap"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={(e) => {
        // stop the card's own onClick (handleAddTrip) from firing
        e.stopPropagation();
        setOpen((o) => !o);
      }}
    >
      <button
        className="wander-weather-icon"
        aria-label="Show weather details"
        type="button"
      >
        {loading ? (
          <span className="wander-weather-dot" />
        ) : (
          <Icon size={20} />
        )}
      </button>

      {open && !loading && weather && (
        <div className="wander-weather-popover" role="tooltip">
          <div className="wander-weather-popover-temp">
            <Icon size={28} />
            <span>{Math.round(weather.temperature)}°C</span>
          </div>
          <div className="wander-weather-popover-label">{label}</div>
          {bestTimeToVisit && (
            <div className="wander-weather-popover-best">
              <strong>Best time to visit:</strong> {bestTimeToVisit}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
