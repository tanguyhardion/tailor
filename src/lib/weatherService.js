// Weather Service - integrates with OpenWeatherMap API
// For development, we'll use mock data. Replace with actual API calls in production.

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo'

// Mock weather data for demo purposes
const mockWeatherData = {
  'New York': {
    temperature: 18,
    feelsLike: 16,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    rainChance: 30,
  },
  'London': {
    temperature: 12,
    feelsLike: 10,
    condition: 'Rainy',
    humidity: 80,
    windSpeed: 20,
    rainChance: 85,
  },
  'Tokyo': {
    temperature: 22,
    feelsLike: 20,
    condition: 'Clear',
    humidity: 55,
    windSpeed: 8,
    rainChance: 10,
  },
  'Paris': {
    temperature: 15,
    feelsLike: 13,
    condition: 'Cloudy',
    humidity: 70,
    windSpeed: 15,
    rainChance: 40,
  },
  'default': {
    temperature: 20,
    feelsLike: 18,
    condition: 'Clear',
    humidity: 60,
    windSpeed: 10,
    rainChance: 20,
  }
}

export async function getWeather(location, date, time) {
  try {
    // In production, you would call the OpenWeatherMap API
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHER_API_KEY}`)
    // const data = await response.json()
    
    // For now, return mock data based on location
    const mockData = mockWeatherData[location] || mockWeatherData.default
    
    return {
      location,
      date,
      time,
      ...mockData,
    }
  } catch (error) {
    console.error('Error fetching weather:', error)
    throw new Error('Could not fetch weather data. Please check your location.')
  }
}

// Helper function to get temperature range for time of day
export function getTimeOfDayTemperatureAdjustment(time) {
  const hour = parseInt(time.split(':')[0])
  
  if (hour >= 5 && hour < 12) {
    return -2 // Morning is typically cooler
  } else if (hour >= 12 && hour < 18) {
    return 3 // Afternoon is typically warmer
  } else if (hour >= 18 && hour < 21) {
    return 0 // Evening is moderate
  } else {
    return -3 // Night is cooler
  }
}
