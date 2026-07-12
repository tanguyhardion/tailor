import { getOutfitRecommendations } from './recommender.js';

console.log("--------------------------------------------------");
console.log("RUNNING RECOMENDER ENGINE TESTS...");
console.log("--------------------------------------------------");

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// Scenario 1: Hot Summer Day
const summerWeather = {
  temperature: 32.0,
  rainProbability: 0,
  windSpeed: 5.0,
  weatherCode: 0 // Sunny
};

const summerOutfits = getOutfitRecommendations(summerWeather, "casual", 12, 16);

assert(summerOutfits.length >= 3, "Should return at least 3 outfits for hot weather.");
assert(
  summerOutfits.every(o => o.layer === null),
  "Hot summer outfits (32°C) must not include layers."
);
assert(
  summerOutfits.some(o => o.top.name.includes("linen") || o.top.name.includes("T-shirt")),
  "Hot weather should recommend linen or T-shirts."
);

// Scenario 2: Freezing Rain
const freezingRainWeather = {
  temperature: 4.0,
  rainProbability: 90,
  windSpeed: 25.0,
  weatherCode: 61 // Rain
};

const rainOutfits = getOutfitRecommendations(freezingRainWeather, "date", 18, 22);

assert(rainOutfits.length >= 3, "Should return outfits for cold rainy weather.");
assert(
  rainOutfits.every(o => o.shoes.material.name !== "suede"),
  "Rainy weather must not recommend suede shoes."
);
assert(
  rainOutfits.every(o => o.layer !== null),
  "Cold weather (4°C) must include a layer."
);
assert(
  rainOutfits.every(o => o.watch.type === "Dive Watch"),
  "Freezing rain with high rain probability should recommend a Dive Watch."
);

// Scenario 3: Formal Work Look
const mildWeather = {
  temperature: 16.0,
  rainProbability: 10,
  windSpeed: 8.0,
  weatherCode: 3 // Cloudy
};

const workOutfits = getOutfitRecommendations(mildWeather, "work", 9, 17);

assert(
  workOutfits.every(o => o.top.categoryName !== "t-shirt"),
  "Work outfits should not contain t-shirts."
);
assert(
  workOutfits.every(o => o.bottom.name !== "light wash relaxed-fit jeans"),
  "Work outfits should not contain relaxed distressed light wash jeans."
);
assert(
  workOutfits.some(o => o.watch.type === "Everyday Watch" || o.watch.type === "Dress Watch"),
  "Work outfits should recommend Everyday or Dress watches."
);

console.log("--------------------------------------------------");
console.log(`TEST RUN COMPLETED. Passed: ${passCount}, Failed: ${failCount}`);
console.log("--------------------------------------------------");

if (failCount > 0) {
  process.exit(1);
} else {
  console.log("All recommendations verified successfully!");
  process.exit(0);
}
