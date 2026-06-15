// scripts/update_destinations.js
const fs = require("fs");
const path = require("path");
const https = require("https");

const DATA_PATH = path.join(
  __dirname,
  "..",
  "server",
  "data",
  "india_destinations.json",
);

// Premium high-quality Unsplash category image arrays
const unsplashCategoryImages = {
  temple: [
    "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1602631985686-2bb0686a6a5a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1590050752117-238cb0612b1b?auto=format&fit=crop&w=800&q=80",
  ],
  fort: [
    "https://images.unsplash.com/photo-1599661046227-4d1c87a5b9e1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1600100397561-39a48be17cca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80",
  ],
  palace: [
    "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1598977123418-45f04b615237?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1565552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80",
  ],
  beach: [
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
  ],
  nature: [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&q=80",
  ],
  museum: [
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1554907906-ac25268c8577?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566121318576-7edf17546c24?auto=format&fit=crop&w=800&q=80",
  ],
  market: [
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604928141064-207ec6696804?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1596422846543-75c6fc18a52b?auto=format&fit=crop&w=800&q=80",
  ],
  default: [
    "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506461883276-594a12b11db3?auto=format&fit=crop&w=800&q=80",
  ],
};

// Map destination fields to Unsplash categories
function getCategory(name = "", type = "") {
  const n = name.toLowerCase();
  const t = type.toLowerCase();

  if (
    t.includes("temple") ||
    t.includes("church") ||
    t.includes("mosque") ||
    t.includes("mandir") ||
    t.includes("dargah") ||
    t.includes("monastery") ||
    n.includes("temple") ||
    n.includes("mandir") ||
    n.includes("dargah") ||
    n.includes("monastery")
  ) {
    return "temple";
  }
  if (t.includes("fort") || n.includes("fort") || n.includes("kila")) {
    return "fort";
  }
  if (
    t.includes("palace") ||
    t.includes("mahal") ||
    n.includes("palace") ||
    n.includes("mahal")
  ) {
    return "palace";
  }
  if (
    t.includes("beach") ||
    n.includes("beach") ||
    t.includes("sea") ||
    n.includes("sea")
  ) {
    return "beach";
  }
  if (
    t.includes("lake") ||
    t.includes("waterfall") ||
    t.includes("valley") ||
    t.includes("park") ||
    t.includes("hill") ||
    t.includes("trek") ||
    t.includes("mountain") ||
    n.includes("lake") ||
    n.includes("waterfall") ||
    n.includes("valley") ||
    n.includes("park") ||
    n.includes("hill")
  ) {
    return "nature";
  }
  if (
    t.includes("museum") ||
    t.includes("gallery") ||
    n.includes("museum") ||
    n.includes("gallery")
  ) {
    return "museum";
  }
  if (
    t.includes("market") ||
    t.includes("mall") ||
    t.includes("bazaar") ||
    n.includes("market") ||
    n.includes("mall") ||
    n.includes("bazaar") ||
    n.includes("chowk")
  ) {
    return "market";
  }
  return "default";
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent": "PackGoTravelPlannerBot/1.0 (contact@packgo.org)",
        },
        timeout: 10000, // 10 seconds timeout
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      },
    );

    req.on("error", (err) => {
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out"));
    });
  });
}

// Search Wikipedia and return search results
async function searchWiki(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  const data = await getJSON(url);
  return data.query.search;
}

// Get Wikipedia details (coordinates, original image) for a specific title
async function getPageDetails(title) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=coordinates|pageimages&piprop=original|thumbnail&pithumbsize=800&titles=${encodeURIComponent(title)}&format=json&origin=*`;
  const data = await getJSON(url);
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  return pages[pageId];
}

// Nominatim Geocoding as a fallback
async function getCoordinatesNominatim(name, city, state) {
  try {
    let query = `${name}`;
    if (city) query += `, ${city}`;
    if (state) query += `, ${state}`;
    query += `, India`;

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const data = await getJSON(url);
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    // Suppress error and return null
  }
  return null;
}

async function main() {
  console.log("Starting destinations data cleanup...");

  // Read data
  const rawData = fs.readFileSync(DATA_PATH, "utf-8");
  const destinations = JSON.parse(rawData);

  console.log(`Total destinations to process: ${destinations.length}`);

  let updatedCount = 0;
  let coordsAdded = 0;
  let imagesCleaned = 0;

  for (let i = 0; i < destinations.length; i++) {
    const dest = destinations[i];
    const category = getCategory(dest.name, dest.type || "");
    const secondaryImages = unsplashCategoryImages[category];

    let wikiResolved = false;
    let resolvedImage = null;
    let resolvedCoords = null;

    // Check if coordinates or images are missing/placeholder
    const needsCoords =
      !dest.coordinates ||
      dest.coordinates.lat === null ||
      dest.coordinates.lon === null;
    const firstImage = dest.images?.[0] || "";
    const needsImage =
      !firstImage ||
      firstImage.includes("loremflickr.com") ||
      firstImage.includes("placeholder");

    if (needsCoords || needsImage) {
      console.log(
        `\n[${i + 1}/${destinations.length}] Processing: "${dest.name}" in ${dest.city || "N/A"}, ${dest.state || "N/A"}`,
      );

      // Try Wikipedia
      try {
        // Strategy A: Try searching by Name
        let searchResults = await searchWiki(dest.name);

        // Filter out irrelevant matching titles
        let bestMatchTitle = null;
        if (searchResults && searchResults.length > 0) {
          bestMatchTitle = searchResults[0].title;

          // If name is extremely common, verify or try more specific search
          if (
            dest.city &&
            (bestMatchTitle.toLowerCase() === "sunset point" ||
              bestMatchTitle.toLowerCase() === "sunrise point")
          ) {
            const refinedResults = await searchWiki(
              `${dest.name} ${dest.city}`,
            );
            if (refinedResults && refinedResults.length > 0) {
              bestMatchTitle = refinedResults[0].title;
            }
          }
        }

        if (bestMatchTitle) {
          console.log(`  -> Wikipedia matched page: "${bestMatchTitle}"`);
          const details = await getPageDetails(bestMatchTitle);

          if (details.coordinates) {
            resolvedCoords = {
              lat: parseFloat(details.coordinates[0].lat.toFixed(6)),
              lon: parseFloat(details.coordinates[0].lon.toFixed(6)),
            };
            console.log(
              `  -> Coords found on Wikipedia: [${resolvedCoords.lat}, ${resolvedCoords.lon}]`,
            );
          }

          if (details.original) {
            resolvedImage = details.original.source;
            console.log(
              `  -> Real photograph found: ${resolvedImage.substring(0, 70)}...`,
            );
          } else if (details.thumbnail) {
            resolvedImage = details.thumbnail.source;
            console.log(
              `  -> Real photo (thumbnail) found: ${resolvedImage.substring(0, 70)}...`,
            );
          }

          wikiResolved = true;
        }
      } catch (err) {
        console.log(`  -> Wikipedia lookup failed: ${err.message}`);
      }

      // Fallback 1: Coords Nominatim Geocoding
      if (needsCoords && !resolvedCoords) {
        console.log(`  -> Coords missing, calling Nominatim geocoder...`);
        resolvedCoords = await getCoordinatesNominatim(
          dest.name,
          dest.city,
          dest.state,
        );
        if (resolvedCoords) {
          console.log(
            `  -> Coords resolved via Nominatim: [${resolvedCoords.lat}, ${resolvedCoords.lon}]`,
          );
        } else {
          // Absolute last resort center fallbacks
          let center = { lat: 20.5937, lon: 78.9629 }; // Center of India
          if (dest.city === "Jaipur") center = { lat: 26.9124, lon: 75.7873 };
          else if (dest.city === "Delhi")
            center = { lat: 28.6139, lon: 77.209 };
          else if (dest.city === "Mumbai")
            center = { lat: 19.076, lon: 72.8777 };
          else if (dest.city === "Bangalore")
            center = { lat: 12.9716, lon: 77.5946 };
          else if (dest.city === "Kolkata")
            center = { lat: 22.5726, lon: 88.3639 };
          else if (dest.city === "Goa") center = { lat: 15.2993, lon: 74.124 };
          else if (dest.city === "Hyderabad")
            center = { lat: 17.385, lon: 78.4867 };

          resolvedCoords = {
            lat: parseFloat(
              (center.lat + (Math.random() - 0.5) * 0.01).toFixed(6),
            ),
            lon: parseFloat(
              (center.lon + (Math.random() - 0.5) * 0.01).toFixed(6),
            ),
          };
          console.log(
            `  -> Fallback city/state coords applied: [${resolvedCoords.lat}, ${resolvedCoords.lon}]`,
          );
        }
        // Throttling for Nominatim Geocoding
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Update Destination values
      let changed = false;

      if (needsCoords && resolvedCoords) {
        dest.coordinates = resolvedCoords;
        coordsAdded++;
        changed = true;
      }

      if (needsImage) {
        const finalMainImg = resolvedImage || secondaryImages[0];
        // Populate exactly 4 distinct beautiful images
        dest.images = [
          finalMainImg,
          secondaryImages[1] || secondaryImages[0],
          secondaryImages[2] || secondaryImages[0],
          unsplashCategoryImages.default[
            updatedCount % unsplashCategoryImages.default.length
          ],
        ];
        imagesCleaned++;
        changed = true;
      }

      if (changed) {
        updatedCount++;
      }

      // Throttling for Wikipedia API
      await new Promise((r) => setTimeout(r, 250));
    } else {
      // Ensure it has exactly 4 beautiful non-dummy images anyway
      const needsSecondaryImageClean = dest.images.some((img) =>
        img.includes("loremflickr.com"),
      );
      if (needsSecondaryImageClean) {
        const mainImg = dest.images[0];
        dest.images = [
          mainImg,
          secondaryImages[1] || secondaryImages[0],
          secondaryImages[2] || secondaryImages[0],
          unsplashCategoryImages.default[
            i % unsplashCategoryImages.default.length
          ],
        ];
        imagesCleaned++;
        updatedCount++;
      }
    }

    // Auto-save progress incrementally every 10 items to prevent data loss
    if (i > 0 && i % 10 === 0) {
      fs.writeFileSync(
        DATA_PATH,
        JSON.stringify(destinations, null, 2),
        "utf-8",
      );
      console.log(
        `[Incremental Save] Successfully saved progress at item ${i}...`,
      );
    }
  }

  // Final Write
  fs.writeFileSync(DATA_PATH, JSON.stringify(destinations, null, 2), "utf-8");

  console.log("\n==========================================");
  console.log("Database Seed File Cleanup Complete!");
  console.log(`Total Destinations Processed: ${destinations.length}`);
  console.log(`Coordinates Added/Updated: ${coordsAdded}`);
  console.log(`Images Cleaned/Updated: ${imagesCleaned}`);
  console.log(`Total Updated Destinations: ${updatedCount}`);
  console.log("==========================================\n");
}

main().catch((err) => {
  console.error("Fatal execution error:", err);
  process.exit(1);
});
