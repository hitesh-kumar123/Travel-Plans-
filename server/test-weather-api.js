/**
 * Standalone Weather API Test Script
 * This will help diagnose the 401 error
 */

const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

console.log("=".repeat(60));
console.log("WEATHER API DIAGNOSTIC TEST");
console.log("=".repeat(60));
console.log();

// Step 1: Load environment variables (same way as server.js)
console.log("Step 1: Loading environment variables...");
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config({ path: path.resolve(__dirname, "./.env") });

// Step 2: Check if WEATHER_API_KEY is loaded
console.log("Step 2: Checking WEATHER_API_KEY...");
const apiKey = process.env.WEATHER_API_KEY;

if (!apiKey) {
  console.error("❌ WEATHER_API_KEY is NOT loaded!");
  console.log("Checked locations:");
  console.log("  - " + path.resolve(__dirname, "../.env"));
  console.log("  - " + path.resolve(__dirname, "./.env"));
  process.exit(1);
}

// Mask the API key for security (show first 4 and last 4 chars)
const maskedKey =
  apiKey.length > 8
    ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
    : "****";

console.log(`✅ WEATHER_API_KEY loaded: ${maskedKey}`);
console.log(`   Length: ${apiKey.length} characters`);

// Step 3: Check for common issues
console.log("\nStep 3: Checking for common issues...");

const issues = [];

if (apiKey.includes(" ")) {
  issues.push("⚠️  API key contains spaces");
}

if (apiKey.startsWith('"') || apiKey.startsWith("'")) {
  issues.push("⚠️  API key starts with a quote");
}

if (apiKey.endsWith('"') || apiKey.endsWith("'")) {
  issues.push("⚠️  API key ends with a quote");
}

if (apiKey.includes("\n") || apiKey.includes("\r")) {
  issues.push("⚠️  API key contains newline characters");
}

if (apiKey === "your_openweathermap_api_key") {
  issues.push("❌ API key is still the placeholder value!");
}

if (apiKey.length !== 32) {
  issues.push(`⚠️  API key length is ${apiKey.length}, expected 32`);
}

if (issues.length > 0) {
  console.log("Issues found:");
  issues.forEach((issue) => console.log("  " + issue));
} else {
  console.log("✅ No obvious issues with API key format");
}

// Step 4: Test with OpenWeatherMap API
console.log("\nStep 4: Testing API key with OpenWeatherMap...");
console.log("Test city: Mumbai");

const testCity = "Mumbai";
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${testCity}&units=metric&appid=${apiKey}`;

// Log URL with masked key
const maskedUrl = apiUrl.replace(apiKey, maskedKey);
console.log(`Request URL: ${maskedUrl}`);
console.log();

(async () => {
  try {
    console.log("Sending request...");
    const startTime = Date.now();

    const response = await axios.get(apiUrl);

    const duration = Date.now() - startTime;

    console.log("=".repeat(60));
    console.log("✅ SUCCESS! API KEY IS VALID");
    console.log("=".repeat(60));
    console.log();
    console.log(`Response time: ${duration}ms`);
    console.log(`Status code: ${response.status}`);
    console.log();
    console.log("Weather data received:");
    console.log(
      `  Location: ${response.data.name}, ${response.data.sys.country}`,
    );
    console.log(`  Temperature: ${response.data.main.temp}°C`);
    console.log(`  Weather: ${response.data.weather[0].description}`);
    console.log(`  Humidity: ${response.data.main.humidity}%`);
    console.log(`  Wind Speed: ${response.data.wind.speed} m/s`);
    console.log();
    console.log("=".repeat(60));
    console.log("DIAGNOSIS: Your API key is working correctly!");
    console.log("The issue must be in how the key is loaded in your server.");
    console.log("=".repeat(60));
  } catch (error) {
    console.log("=".repeat(60));
    console.log("❌ API REQUEST FAILED");
    console.log("=".repeat(60));
    console.log();

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      console.log(`HTTP Status: ${status}`);
      console.log(`Error message: ${data.message || "No message"}`);
      console.log();

      if (status === 401) {
        console.log("DIAGNOSIS: 401 Unauthorized");
        console.log("=".repeat(60));
        console.log();
        console.log("Possible causes:");
        console.log("1. API key is invalid or expired");
        console.log(
          "2. API key hasn't been activated yet (wait 10-15 minutes)",
        );
        console.log("3. API key was regenerated and old key was revoked");
        console.log("4. Your OpenWeatherMap account is suspended");
        console.log();
        console.log("Solutions:");
        console.log("1. Go to: https://home.openweathermap.org/api_keys");
        console.log("2. Check if your key is active");
        console.log("3. If new, wait 15 minutes for activation");
        console.log("4. Generate a new API key if needed");
        console.log("5. Update server/.env with the new key");
        console.log("6. Restart your server");
      } else if (status === 404) {
        console.log("DIAGNOSIS: 404 Not Found");
        console.log(
          "The city name was not found (but API key is being accepted)",
        );
      } else if (status === 429) {
        console.log("DIAGNOSIS: 429 Too Many Requests");
        console.log("You've exceeded the API rate limit");
        console.log("Free tier: 60 calls/minute, 1000 calls/day");
      }
    } else if (error.request) {
      console.log("DIAGNOSIS: Network Error");
      console.log("No response received from OpenWeatherMap");
      console.log("Check your internet connection");
    } else {
      console.log("DIAGNOSIS: Unknown Error");
      console.log(error.message);
    }

    console.log();
    console.log("=".repeat(60));
    console.log("Full error details:");
    console.log(JSON.stringify(error.response?.data || error.message, null, 2));
    console.log("=".repeat(60));
  }
})();

console.log();
console.log("Waiting for response...");
console.log();
