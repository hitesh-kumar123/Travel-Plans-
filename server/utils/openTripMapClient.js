const axios = require("axios");

const BASE_URL =
  process.env.OPENTRIPMAP_BASE_URL || "https://api.opentripmap.com/0.1";
const LANG = process.env.OPENTRIPMAP_LANG || "en";
const REQUEST_TIMEOUT_MS = 10000;

/**
 * A typed error so callers can tell configuration problems, "not found"
 * responses, and real upstream/network failures apart instead of every
 * failure collapsing into the same generic message.
 */
class OpenTripMapError extends Error {
  constructor(message, { code, status, cause } = {}) {
    super(message);
    this.name = "OpenTripMapError";
    this.code = code; // "CONFIG" | "UPSTREAM" | "NETWORK"
    this.status = status;
    this.cause = cause;
  }
}

function getApiKey() {
  const apiKey = process.env.OPENTRIPMAP_API_KEY;
  if (!apiKey) {
    throw new OpenTripMapError(
      "OpenTripMap API key is not configured (set OPENTRIPMAP_API_KEY in server/.env)",
      { code: "CONFIG" },
    );
  }
  return apiKey;
}

async function openTripMapGet(path, query = {}) {
  const apiKey = getApiKey();

  try {
    const { data } = await axios.get(`${BASE_URL}/${LANG}${path}`, {
      params: { ...query, apikey: apiKey },
      timeout: REQUEST_TIMEOUT_MS,
    });

    return data;
  } catch (err) {
    if (err.response) {
      // Upstream responded with a non-2xx status. The body isn't always
      // JSON (some error responses are plain text/HTML), so don't assume
      // err.response.data.error exists.
      const upstreamMsg =
        (typeof err.response.data === "object" && err.response.data?.error) ||
        (typeof err.response.data === "string" &&
          err.response.data.slice(0, 200)) ||
        `OpenTripMap request failed with status ${err.response.status}`;

      throw new OpenTripMapError(upstreamMsg, {
        code: "UPSTREAM",
        status: err.response.status,
        cause: err,
      });
    }

    if (err.code === "ECONNABORTED") {
      throw new OpenTripMapError("OpenTripMap request timed out", {
        code: "NETWORK",
        cause: err,
      });
    }

    // Network-level failure (DNS, connection refused, etc.) or the
    // "missing API key" OpenTripMapError re-thrown from getApiKey above.
    if (err instanceof OpenTripMapError) throw err;

    throw new OpenTripMapError(
      err.message || "Could not reach the OpenTripMap service",
      { code: "NETWORK", cause: err },
    );
  }
}

async function geocodeCity(keyword) {
  const data = await openTripMapGet("/places/geoname", {
    name: (keyword || "").trim(),
  });

  if (!data || data.status === "ERROR" || data.lat === undefined) {
    return null;
  }

  return {
    name: data.name,
    countryCode: data.country,
    latitude: data.lat,
    longitude: data.lon,
  };
}

/**
 *
 * @param {Object} opts
 * @param {number} opts.latitude
 * @param {number} opts.longitude
 * @param {number} [opts.radius]
 * @param {string[]} [opts.kinds]
 */
async function searchPointsOfInterest({
  latitude,
  longitude,
  radius = 20,
  kinds = [],
}) {
  const query = {
    lat: latitude,
    lon: longitude,
    radius: radius * 1000,
    limit: 50,
    rate: 1,
    format: "json",
  };

  if (kinds.length > 0) {
    query.kinds = kinds.join(",");
  }

  const data = await openTripMapGet("/places/radius", query);
  return Array.isArray(data) ? data : [];
}

async function getPlaceDetails(xid) {
  try {
    const data = await openTripMapGet(`/places/xid/${xid}`);
    return data;
  } catch (err) {
    return null;
  }
}

module.exports = {
  geocodeCity,
  searchPointsOfInterest,
  getPlaceDetails,
  OpenTripMapError,
};
