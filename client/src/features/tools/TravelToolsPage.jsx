import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { translatorApi } from "../../services/api/translatorApi";
import { weatherApi } from "../../services/api/weatherApi";
import { getErrorMessage } from "../../services/api/client";
import SectionHeading from "../../components/SectionHeading";
import Button from "../../components/Button";
import FormField from "../../components/FormField";
import LoadingState from "../../components/LoadingState";
import {
  Languages,
  CloudSun,
  Coins,
  ArrowRightLeft,
  Copy,
  CheckCircle,
  Search,
  Wind,
  Droplets,
  Volume2,
} from "lucide-react";

export const TravelToolsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "translator";

  // ── TRANSLATOR STATE ──
  const [languages, setLanguages] = useState([]);
  const [sourceLang, setSourceLang] = useState("auto");
  const [targetLang, setTargetLang] = useState("hi");
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [detectedLang, setDetectedLang] = useState("");
  const [transLoading, setTransLoading] = useState(false);
  const [transError, setTransError] = useState("");
  const [copied, setCopied] = useState(false);

  // ── WEATHER STATE ──
  const [weatherQuery, setWeatherQuery] = useState("Jaipur");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState("");

  // ── CURRENCY CONVERTER STATE ──
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("INR");
  const [toCurrency, setToCurrency] = useState("USD");
  const [rates, setRates] = useState({});
  const [convertedResult, setConvertedResult] = useState(null);
  const [ratesLoading, setRatesLoading] = useState(false);

  // Load languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const res = await translatorApi.getLanguages();
        if (Array.isArray(res.data)) {
          setLanguages(res.data);
        }
      } catch (err) {
        console.warn("Failed to fetch languages list:", err);
      }
    };
    fetchLanguages();
  }, []);

  // Fetch initial weather
  useEffect(() => {
    fetchWeather("Jaipur");
  }, []);

  // Fetch Frankfurter Currency rates
  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      try {
        const res = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${fromCurrency}`,
        );
        const data = await res.json();
        if (data?.rates) {
          setRates({ ...data.rates, [fromCurrency]: 1 });
        }
      } catch (err) {
        console.warn("Currency rate fetch error:", err);
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
  }, [fromCurrency]);

  // Recalculate currency conversion
  useEffect(() => {
    const num = parseFloat(amount);
    if (!isNaN(num) && rates[toCurrency]) {
      setConvertedResult((num * rates[toCurrency]).toFixed(2));
    } else {
      setConvertedResult(null);
    }
  }, [amount, toCurrency, rates]);

  // Handle Translation
  const handleTranslate = async (e) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    setTransLoading(true);
    setTransError("");
    try {
      const res = await translatorApi.translate({
        text: inputText.trim(),
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      });
      setTranslatedText(res.data.translatedText);
      setDetectedLang(res.data.detectedLanguage);
    } catch (err) {
      setTransError(
        getErrorMessage(err, "Translation failed. Please try again."),
      );
    } finally {
      setTransLoading(false);
    }
  };

  const swapLanguages = () => {
    if (sourceLang === "auto") return;
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleCopyTranslation = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle Weather Lookup
  const fetchWeather = async (loc) => {
    if (!loc.trim()) return;
    setWeatherLoading(true);
    setWeatherError("");
    try {
      const [curRes, foreRes] = await Promise.all([
        weatherApi.getCurrent(loc.trim()),
        weatherApi.getForecast(loc.trim()),
      ]);
      setCurrentWeather(curRes.data);
      setForecast(foreRes.data?.forecast || []);
    } catch (err) {
      setWeatherError(
        getErrorMessage(
          err,
          `Could not load weather for "${loc}". Please verify city name or API configuration.`,
        ),
      );
      setCurrentWeather(null);
      setForecast([]);
    } finally {
      setWeatherLoading(false);
    }
  };

  const currencyOptions = [
    { code: "INR", name: "INR — Indian Rupee (₹)" },
    { code: "USD", name: "USD — US Dollar ($)" },
    { code: "EUR", name: "EUR — Euro (€)" },
    { code: "GBP", name: "GBP — British Pound (£)" },
    { code: "JPY", name: "JPY — Japanese Yen (¥)" },
    { code: "AUD", name: "AUD — Australian Dollar ($)" },
    { code: "CAD", name: "CAD — Canadian Dollar ($)" },
    { code: "SGD", name: "SGD — Singapore Dollar ($)" },
    { code: "AED", name: "AED — UAE Dirham (د.إ)" },
    { code: "THB", name: "THB — Thai Baht (฿)" },
  ];

  return (
    <div className="min-h-screen bg-[#FCF9F8] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6C2F00] mb-2 block">
            Field Utilities
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1C1B1B]">
            Travel Tools
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-[#54433A]">
            Essential utilities designed to navigate local conversations,
            atmospheric forecasts, and currency conversions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1 bg-[#F0EDED] rounded border border-[#DAC2B6]/60">
            <button
              type="button"
              onClick={() => setSearchParams({ tab: "translator" })}
              className={`flex items-center space-x-2 px-6 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                activeTab === "translator"
                  ? "bg-[#FFFFFF] text-[#6C2F00] shadow-sm"
                  : "text-[#54433A] hover:text-[#1C1B1B]"
              }`}
            >
              <Languages className="w-4 h-4" />
              <span>Translator</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: "weather" })}
              className={`flex items-center space-x-2 px-6 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                activeTab === "weather"
                  ? "bg-[#FFFFFF] text-[#6C2F00] shadow-sm"
                  : "text-[#54433A] hover:text-[#1C1B1B]"
              }`}
            >
              <CloudSun className="w-4 h-4" />
              <span>Weather</span>
            </button>

            <button
              type="button"
              onClick={() => setSearchParams({ tab: "currency" })}
              className={`flex items-center space-x-2 px-6 py-2 text-xs font-semibold uppercase tracking-wider rounded transition-all ${
                activeTab === "currency"
                  ? "bg-[#FFFFFF] text-[#6C2F00] shadow-sm"
                  : "text-[#54433A] hover:text-[#1C1B1B]"
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Currency</span>
            </button>
          </div>
        </div>

        {/* ── 1. TRANSLATOR TOOL ── */}
        {activeTab === "translator" && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-[#FFFFFF] border border-[#DAC2B6] rounded-md shadow-sm p-6 sm:p-8 space-y-6">
              {/* Language Selection Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-[#F0EDED]">
                <div className="w-full sm:w-5/12">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#877369] mb-1">
                    Source Language
                  </label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="w-full py-2 px-3 bg-[#F6F3F2] border border-[#DAC2B6] rounded text-xs font-semibold text-[#1C1B1B] focus:outline-none focus:border-[#6C2F00]"
                  >
                    <option value="auto">Auto Detect Language</option>
                    {languages
                      .filter((l) => l.code !== "auto")
                      .map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={swapLanguages}
                  disabled={sourceLang === "auto"}
                  className="p-2 rounded-full border border-[#DAC2B6] text-[#6C2F00] hover:bg-[#FFDBC9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="Swap languages"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                <div className="w-full sm:w-5/12">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#877369] mb-1">
                    Target Language
                  </label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="w-full py-2 px-3 bg-[#F6F3F2] border border-[#DAC2B6] rounded text-xs font-semibold text-[#1C1B1B] focus:outline-none focus:border-[#6C2F00]"
                  >
                    {languages
                      .filter((l) => l.code !== "auto")
                      .map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {transError && (
                <div className="p-3 bg-[#FFDAD6]/50 rounded text-xs text-[#BA1A1A]">
                  {transError}
                </div>
              )}

              {/* Dual Input/Output Pane */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Text Area */}
                <div className="flex flex-col space-y-2">
                  <textarea
                    rows={6}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text or phrases to translate (e.g., 'Where is the main palace entrance?' or 'How much is the ticket?')..."
                    className="w-full p-4 bg-[#FCF9F8] border border-[#DAC2B6] rounded text-sm text-[#1C1B1B] placeholder-[#877369]/70 focus:outline-none focus:border-[#6C2F00] resize-y"
                    maxLength={5000}
                  />
                  <div className="flex justify-between text-[11px] text-[#877369]">
                    {detectedLang && (
                      <span>Detected: {detectedLang.toUpperCase()}</span>
                    )}
                    <span className="ml-auto">
                      {inputText.length}/5000 chars
                    </span>
                  </div>
                </div>

                {/* Output Translated Area */}
                <div className="flex flex-col space-y-2 relative">
                  <div className="w-full p-4 bg-[#F6F3F2] border border-[#E5E2E1] rounded min-h-[160px] text-sm text-[#1C1B1B] font-serif leading-relaxed">
                    {translatedText ? (
                      translatedText
                    ) : (
                      <span className="text-[#877369] font-sans text-xs italic">
                        Translated translation will appear here...
                      </span>
                    )}
                  </div>
                  {translatedText && (
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleCopyTranslation}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-[#6C2F00] hover:underline"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Result</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Translate Trigger */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="terracotta"
                  size="md"
                  loading={transLoading}
                  onClick={handleTranslate}
                  disabled={!inputText.trim()}
                >
                  Translate Phrase
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ── 2. WEATHER TOOL ── */}
        {activeTab === "weather" && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Search Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchWeather(weatherQuery);
              }}
              className="bg-[#FFFFFF] p-4 border border-[#DAC2B6] rounded-md shadow-sm flex flex-col sm:flex-row gap-3"
            >
              <div className="relative flex-1 flex items-center px-2">
                <Search className="w-4 h-4 text-[#877369] mr-2" />
                <input
                  type="text"
                  value={weatherQuery}
                  onChange={(e) => setWeatherQuery(e.target.value)}
                  placeholder="Enter destination city (e.g. Udaipur, Agra, Munnar, Leh, Goa)..."
                  className="w-full text-sm text-[#1C1B1B] placeholder-[#877369] focus:outline-none bg-transparent"
                />
              </div>
              <Button type="submit" variant="primary" size="md">
                Get Forecast
              </Button>
            </form>

            {weatherLoading ? (
              <LoadingState
                message={`Observing atmosphere for ${weatherQuery}...`}
              />
            ) : weatherError ? (
              <div className="p-8 bg-[#FFDAD6]/30 border border-[#BA1A1A]/30 rounded text-center">
                <p className="text-xs font-semibold text-[#BA1A1A]">
                  {weatherError}
                </p>
              </div>
            ) : currentWeather ? (
              <div className="space-y-6">
                {/* Current Weather Card */}
                <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#DAC2B6] rounded-md shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-6">
                    {currentWeather.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`}
                        alt={currentWeather.description}
                        className="w-20 h-20 bg-[#FFDBC9]/30 rounded-full p-2"
                      />
                    )}
                    <div>
                      <span className="font-serif text-5xl font-extrabold text-[#1C1B1B]">
                        {Math.round(currentWeather.temperature)}°C
                      </span>
                      <p className="text-sm font-semibold capitalize text-[#6C2F00] mt-1">
                        {currentWeather.description}
                      </p>
                      <p className="text-xs text-[#877369]">
                        {currentWeather.location}
                        {currentWeather.country
                          ? `, ${currentWeather.country}`
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                    <div className="p-3.5 bg-[#F6F3F2] rounded border border-[#E5E2E1]">
                      <span className="text-[10px] uppercase text-[#877369] font-semibold">
                        Humidity
                      </span>
                      <p className="font-serif text-lg font-bold text-[#1C1B1B]">
                        {currentWeather.humidity}%
                      </p>
                    </div>
                    <div className="p-3.5 bg-[#F6F3F2] rounded border border-[#E5E2E1]">
                      <span className="text-[10px] uppercase text-[#877369] font-semibold">
                        Wind
                      </span>
                      <p className="font-serif text-lg font-bold text-[#1C1B1B]">
                        {currentWeather.windSpeed} m/s
                      </p>
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
                          className="p-4 bg-[#FFFFFF] border border-[#E5E2E1] rounded text-center space-y-1.5 shadow-xs"
                        >
                          <span className="text-[11px] font-semibold text-[#877369]">
                            {item.date
                              ? new Date(item.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    weekday: "short",
                                    hour: "2-digit",
                                  },
                                )
                              : "—"}
                          </span>
                          {item.icon && (
                            <img
                              src={`https://openweathermap.org/img/wn/${item.icon}.png`}
                              alt={item.description}
                              className="w-10 h-10 mx-auto"
                            />
                          )}
                          <div className="font-serif text-base font-bold text-[#1C1B1B]">
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
        )}

        {/* ── 3. CURRENCY CONVERTER TOOL ── */}
        {activeTab === "currency" && (
          <div className="max-w-xl mx-auto">
            <div className="bg-[#FFFFFF] p-8 sm:p-10 border border-[#DAC2B6] rounded-md shadow-sm space-y-6">
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6C2F00] block">
                Live Exchange Rates (Frankfurter)
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1C1B1B]">
                Currency Conversion Sanctuary
              </h3>

              <div className="space-y-4">
                <FormField
                  label="Amount"
                  name="amount"
                  type="number"
                  min="0.01"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="e.g. 5000"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5">
                      From Currency
                    </label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="py-2.5 px-2 bg-transparent border-b border-[#DAC2B6] text-xs font-semibold text-[#1C1B1B] focus:outline-none focus:border-[#6C2F00]"
                    >
                      {currencyOptions.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#54433A] mb-1.5">
                      To Currency
                    </label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="py-2.5 px-2 bg-transparent border-b border-[#DAC2B6] text-xs font-semibold text-[#1C1B1B] focus:outline-none focus:border-[#6C2F00]"
                    >
                      {currencyOptions.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Conversion Result Display */}
              <div className="pt-6 border-t border-[#F0EDED] bg-[#F6F3F2] p-6 rounded text-center">
                <span className="text-xs uppercase font-semibold text-[#877369]">
                  Converted Estimated Value
                </span>
                <p className="font-serif text-3xl sm:text-4xl font-extrabold text-[#6C2F00] mt-1">
                  {ratesLoading
                    ? "Calculating rates..."
                    : convertedResult
                      ? `${toCurrency} ${Number(convertedResult).toLocaleString()}`
                      : "—"}
                </p>
                <p className="text-[10px] text-[#877369] mt-2">
                  1 {fromCurrency} = {rates[toCurrency] || "—"} {toCurrency}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelToolsPage;
