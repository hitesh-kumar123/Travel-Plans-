import React, { useState, useEffect } from "react";
import { weatherApi } from "../../../services/api/weatherApi";
import { getErrorMessage } from "../../../services/api/client";
import LoadingState from "../../../components/LoadingState";
import Button from "../../../components/Button";
import { CloudSun, Wind, Droplets, Thermometer, Calendar } from "lucide-react";

export const TripWeatherTab = ({ trip }) => {
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    try {
      const [curRes, foreRes] = await Promise.all([
        weatherApi.getCurrent(trip.destination),
        weatherApi.getForecast(trip.destination),
      ]);
      setCurrent(curRes.data);
      setForecast(foreRes.data?.forecast || []);
    } catch (err) {
      console.warn("Weather fetch error:", err);
      setError(
        getErrorMessage(
          err,
          `Could not fetch live weather forecast for ${trip.destination}. Verify WEATHER_API_KEY in backend.`,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (trip.destination) fetchWeather();
  }, [trip.destination]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-4 border-b border-[#E5E2E1]">
        <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] block mb-1">
          Atmospheric Conditions
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
          Weather Forecast for {trip.destination}
        </h3>
        <p className="text-xs text-[#54433A] mt-1">
          Live meteorological reports from OpenWeather to help you pack
          accurately.
        </p>
      </div>

      {loading ? (
        <LoadingState
          message={`Observing atmospheric conditions in ${trip.destination}...`}
        />
      ) : error ? (
        <div className="p-8 bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded text-center">
          <p className="text-xs font-semibold text-[#BA1A1A]">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={fetchWeather}
          >
            Retry Weather Sync
          </Button>
        </div>
      ) : current ? (
        <div className="space-y-8">
          {/* Current Weather Card */}
          <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#DAC2B6] rounded-md shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center space-x-6">
              {current.icon ? (
                <img
                  src={`https://openweathermap.org/img/wn/${current.icon}@2x.png`}
                  alt={current.description}
                  className="w-20 h-20 bg-[#FFDBC9]/30 rounded-full p-2"
                />
              ) : (
                <CloudSun className="w-16 h-16 text-[#6C2F00]" />
              )}
              <div>
                <span className="font-serif text-5xl font-extrabold text-[#1C1B1B]">
                  {Math.round(current.temperature)}°C
                </span>
                <p className="text-sm font-semibold capitalize text-[#6C2F00] mt-1">
                  {current.description}
                </p>
                <p className="text-xs text-[#877369]">
                  {current.location}
                  {current.country ? `, ${current.country}` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto border-t md:border-t-0 md:border-l border-[#F0EDED] pt-4 md:pt-0 md:pl-8">
              <div className="p-3 bg-[#F6F3F2] rounded border border-[#E5E2E1] flex items-center space-x-3">
                <Droplets className="w-4 h-4 text-[#6C2F00]" />
                <div>
                  <span className="text-[10px] uppercase text-[#877369] font-semibold">
                    Humidity
                  </span>
                  <p className="font-serif text-sm font-bold text-[#1C1B1B]">
                    {current.humidity}%
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#F6F3F2] rounded border border-[#E5E2E1] flex items-center space-x-3">
                <Wind className="w-4 h-4 text-[#6C2F00]" />
                <div>
                  <span className="text-[10px] uppercase text-[#877369] font-semibold">
                    Wind Speed
                  </span>
                  <p className="font-serif text-sm font-bold text-[#1C1B1B]">
                    {current.windSpeed} m/s
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          {forecast.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-serif text-xl font-bold text-[#1C1B1B]">
                5-Day Forecast Intervals
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {forecast.slice(0, 10).map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#FFFFFF] border border-[#E5E2E1] rounded text-center space-y-2 shadow-xs"
                  >
                    <div className="text-[11px] font-semibold text-[#877369]">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-IN", {
                            weekday: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Interval"}
                    </div>

                    {item.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                        alt={item.description}
                        className="w-10 h-10 mx-auto"
                      />
                    )}

                    <div className="font-serif text-lg font-bold text-[#1C1B1B]">
                      {Math.round(item.temperature)}°C
                    </div>

                    <p className="text-[10px] capitalize text-[#54433A] truncate">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default TripWeatherTab;
