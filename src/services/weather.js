/**
 * Weather Service for Tailor
 * Integrates Open-Meteo Geocoding and Weather APIs with high-fidelity seasonal offline mocks.
 */

const MOCK_CITIES = [
  { name: "Paris", latitude: 48.8566, longitude: 2.3522, country: "France", timezone: "Europe/Paris" },
  { name: "New York", latitude: 40.7128, longitude: -74.0060, country: "United States", timezone: "America/New_York" },
  { name: "London", latitude: 51.5074, longitude: -0.1278, country: "United Kingdom", timezone: "Europe/London" },
  { name: "Tokyo", latitude: 35.6762, longitude: 139.6503, country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Sydney", latitude: -33.8688, longitude: 151.2093, country: "Australia", timezone: "Australia/Sydney" },
  { name: "Reykjavik", latitude: 64.1466, longitude: -21.9426, country: "Iceland", timezone: "Atlantic/Reykjavik" },
  { name: "Cairo", latitude: 30.0444, longitude: 31.2357, country: "Egypt", timezone: "Africa/Cairo" }
];

// Helper: Get mock weather based on city, month, and hour range
function getMockWeather(lat, lon, dateStr, startHour, endHour) {
  const date = new Date(dateStr);
  const month = date.getMonth(); // 0-11

  // Find closest city or default
  let city = MOCK_CITIES.find(c => Math.abs(c.latitude - lat) < 2 && Math.abs(c.longitude - lon) < 2);
  if (!city) {
    city = { name: "Custom Location", latitude: lat, longitude: lon };
  }

  // Base seasonal temperature profile
  let baseTemp = 15;
  let rainProb = 10;
  let windSpeed = 12;
  let code = 0; // Sunny

  // Season factor (Northern hemisphere)
  const isNorthern = lat >= 0;
  const isSummer = isNorthern ? (month >= 5 && month <= 8) : (month <= 1 || month >= 10);
  const isWinter = isNorthern ? (month <= 1 || month >= 10) : (month >= 5 && month <= 8);

  if (city.name === "Cairo") {
    baseTemp = isSummer ? 36 : 20;
    rainProb = 2;
    windSpeed = 15;
    code = 0;
  } else if (city.name === "Reykjavik") {
    baseTemp = isSummer ? 11 : -2;
    rainProb = isWinter ? 60 : 35;
    windSpeed = isWinter ? 28 : 16;
    code = isWinter ? 71 : 3; // Snow vs cloudy
  } else if (city.name === "Sydney") {
    baseTemp = isSummer ? 25 : 14;
    rainProb = 20;
    windSpeed = 18;
    code = Math.random() > 0.8 ? 51 : 1; // drizzle or clear
  } else {
    // Standard temperate zone (Paris, NY, London, Tokyo, Custom)
    if (isSummer) {
      baseTemp = 24;
      rainProb = 15;
      windSpeed = 10;
      code = 0; // Sunny
    } else if (isWinter) {
      baseTemp = 5;
      rainProb = 45;
      windSpeed = 22;
      code = 61; // Rain
    } else {
      // Spring/Autumn
      baseTemp = 14;
      rainProb = 25;
      windSpeed = 15;
      code = 3; // Cloudy
    }
  }

  // Adjust for time of day (colder at night/morning)
  const avgHour = (startHour + endHour) / 2;
  if (avgHour < 7 || avgHour > 21) {
    baseTemp -= 6; // Night cold
  } else if (avgHour >= 12 && avgHour <= 16) {
    baseTemp += 2; // Midday peak
  }

  // Generate hourly lists
  const hoursCount = endHour - startHour + 1;
  const hourlyTemps = [];
  const hourlyRain = [];
  const hourlyWind = [];
  const hourlyCodes = [];

  for (let i = 0; i < hoursCount; i++) {
    // Add small random variations
    hourlyTemps.push(baseTemp + (Math.sin(i) * 0.5));
    hourlyRain.push(Math.min(100, Math.max(0, rainProb + (Math.cos(i) * 10))));
    hourlyWind.push(Math.max(2, windSpeed + (Math.sin(i * 2) * 4)));
    hourlyCodes.push(code);
  }

  const avgTemp = hourlyTemps.reduce((a, b) => a + b, 0) / hoursCount;
  const maxRain = Math.max(...hourlyRain);
  const maxWind = Math.max(...hourlyWind);

  return {
    temperature: Math.round(avgTemp * 10) / 10,
    rainProbability: Math.round(maxRain),
    windSpeed: Math.round(maxWind * 10) / 10,
    weatherCode: code,
    isMock: true,
    locationName: city.name
  };
}

// Convert Open-Meteo weather codes to clean categories
export function getWeatherDescription(code) {
  if (code === 0) return { label: "Sunny", type: "sunny" };
  if (code === 1 || code === 2) return { label: "Mostly Clear", type: "sunny" };
  if (code === 3) return { label: "Cloudy", type: "cloudy" };
  if (code >= 45 && code <= 48) return { label: "Foggy", type: "cloudy" };
  if (code >= 51 && code <= 55) return { label: "Light Drizzle", type: "rainy" };
  if (code >= 56 && code <= 57) return { label: "Freezing Drizzle", type: "rainy" };
  if (code >= 61 && code <= 65) return { label: "Rainy", type: "rainy" };
  if (code >= 66 && code <= 67) return { label: "Freezing Rain", type: "rainy" };
  if (code >= 71 && code <= 77) return { label: "Snowy", type: "cloudy" }; // or snowy
  if (code >= 80 && code <= 82) return { label: "Rain Showers", type: "rainy" };
  if (code >= 85 && code <= 86) return { label: "Snow Showers", type: "cloudy" };
  if (code >= 95 && code <= 99) return { label: "Thunderstorm", type: "rainy" };
  return { label: "Overcast", type: "cloudy" };
}

export async function searchLocations(query) {
  if (!query || query.trim().length < 2) return [];

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Geocoding failed");

    const data = await response.json();
    if (!data.results) return [];

    return data.results.map(r => ({
      name: `${r.name}, ${r.admin1 ? r.admin1 + ', ' : ''}${r.country}`,
      latitude: r.latitude,
      longitude: r.longitude,
      timezone: r.timezone,
      country: r.country
    }));
  } catch (error) {
    console.warn("Geocoding API failed, falling back to mock search:", error);
    // Offline filter mock
    const q = query.toLowerCase();
    return MOCK_CITIES.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    ).map(c => ({
      name: `${c.name}, ${c.country}`,
      latitude: c.latitude,
      longitude: c.longitude,
      timezone: c.timezone,
      country: c.country
    }));
  }
}

export async function fetchWeather(lat, lon, dateStr, startHour, endHour) {
  try {
    // Open-Meteo only provides detailed forecasts for ~7-14 days. 
    // If the date is too far in the future or past, we must use mock seasonal data.
    const targetDate = new Date(dateStr);
    const today = new Date();
    const diffTime = Math.abs(targetDate - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      console.log(`Date is ${diffDays} days away. Using seasonal climatology fallback.`);
      return getMockWeather(lat, lon, dateStr, startHour, endHour);
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Weather API failed");

    const data = await response.json();
    if (!data.hourly) throw new Error("Invalid response format");

    // Match the target date and hours in hourly timeline
    const hourly = data.hourly;
    const targetDayStr = targetDate.toISOString().split("T")[0]; // YYYY-MM-DD

    const indices = [];
    hourly.time.forEach((timeStr, idx) => {
      // timeStr is like "2026-07-12T00:00"
      const [day, hourMin] = timeStr.split("T");
      const hour = parseInt(hourMin.split(":")[0]);
      if (day === targetDayStr && hour >= startHour && hour <= endHour) {
        indices.push(idx);
      }
    });

    // Fallback if no matching indices in the timeline (should not happen for recent dates)
    if (indices.length === 0) {
      return getMockWeather(lat, lon, dateStr, startHour, endHour);
    }

    // Aggregate values
    const temps = indices.map(i => hourly.temperature_2m[i]);
    const rainProbs = indices.map(i => hourly.precipitation_probability[i]);
    const windSpeeds = indices.map(i => hourly.wind_speed_10m[i]);
    const codes = indices.map(i => hourly.weather_code[i]);

    const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;
    const maxRain = Math.max(...rainProbs);
    const maxWind = Math.max(...windSpeeds);

    // Mode of weather codes (most frequent)
    const codeCounts = {};
    let modeCode = codes[0];
    let maxCount = 0;
    codes.forEach(c => {
      codeCounts[c] = (codeCounts[c] || 0) + 1;
      if (codeCounts[c] > maxCount) {
        maxCount = codeCounts[c];
        modeCode = c;
      }
    });

    return {
      temperature: Math.round(avgTemp * 10) / 10,
      rainProbability: Math.round(maxRain),
      windSpeed: Math.round(maxWind * 10) / 10,
      weatherCode: modeCode,
      isMock: false
    };
  } catch (error) {
    console.warn("Weather API fetch failed, falling back to mock generator:", error);
    return getMockWeather(lat, lon, dateStr, startHour, endHour);
  }
}
