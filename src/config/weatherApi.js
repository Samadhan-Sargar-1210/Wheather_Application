// Weather API Configuration
// Get your free API key from: https://openweathermap.org/api

export const WEATHER_API_CONFIG = {
  // Real OpenWeatherMap API key for live weather data
  API_KEY: '5492382f8d23faf84ae5b0e65269b5ea',
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  UNITS: 'metric', // metric, imperial, kelvin
  LANGUAGE: 'en' // en, hi, mr, ta
}

// API Endpoints
export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
  AIR_POLLUTION: '/air_pollution' // Requires paid plan
}

// Weather condition mappings
export const WEATHER_CONDITIONS = {
  'Clear': 'Sunny',
  'Clouds': 'Partly Cloudy',
  'Rain': 'Rainy',
  'Snow': 'Snowy',
  'Thunderstorm': 'Stormy',
  'Drizzle': 'Rainy',
  'Mist': 'Foggy',
  'Fog': 'Foggy',
  'Haze': 'Foggy',
  'Smoke': 'Foggy',
  'Dust': 'Foggy',
  'Sand': 'Foggy',
  'Ash': 'Foggy',
  'Squall': 'Stormy',
  'Tornado': 'Stormy'
}

// Weather icons mapping
export const WEATHER_ICONS = {
  'Sunny': '☀️',
  'Partly Cloudy': '⛅',
  'Cloudy': '☁️',
  'Rainy': '🌧️',
  'Snowy': '❄️',
  'Stormy': '⛈️',
  'Foggy': '🌫️'
}

// AQI levels and colors
export const AQI_LEVELS = {
  GOOD: { min: 0, max: 50, color: '#00e400', label: 'Good' },
  MODERATE: { min: 51, max: 100, color: '#ffff00', label: 'Moderate' },
  POOR: { min: 101, max: 150, color: '#ff7e00', label: 'Poor' },
  VERY_POOR: { min: 151, max: 200, color: '#ff0000', label: 'Very Poor' },
  HAZARDOUS: { min: 201, max: 300, color: '#8f3f97', label: 'Hazardous' }
}

// Health advice based on AQI
export const AQI_HEALTH_ADVICE = {
  GOOD: 'Air quality is good. Enjoy outdoor activities.',
  MODERATE: 'Air quality is acceptable. Sensitive individuals may experience symptoms.',
  POOR: 'Air quality is moderate. Limit outdoor activities.',
  VERY_POOR: 'Air quality is poor. Avoid outdoor activities.',
  HAZARDOUS: 'Air quality is very poor. Stay indoors.'
}

// Helper functions
export const getWeatherCondition = (main, description) => {
  if (main === 'Clouds') {
    return description.includes('few') || description.includes('scattered') ? 'Partly Cloudy' : 'Cloudy'
  }
  return WEATHER_CONDITIONS[main] || 'Partly Cloudy'
}

export const getWeatherIcon = (condition) => {
  return WEATHER_ICONS[condition] || '🌤️'
}

export const getAqiLevel = (aqi) => {
  for (const [level, range] of Object.entries(AQI_LEVELS)) {
    if (aqi >= range.min && aqi <= range.max) {
      return range.label
    }
  }
  return 'Hazardous'
}

export const getAqiColor = (aqi) => {
  for (const [level, range] of Object.entries(AQI_LEVELS)) {
    if (aqi >= range.min && aqi <= range.max) {
      return range.color
    }
  }
  return '#8f3f97'
}

export const getHealthAdvice = (aqi) => {
  for (const [level, range] of Object.entries(AQI_LEVELS)) {
    if (aqi >= range.min && aqi <= range.max) {
      return AQI_HEALTH_ADVICE[level]
    }
  }
  return AQI_HEALTH_ADVICE.HAZARDOUS
}

// API request helper
export const makeWeatherApiRequest = async (endpoint, params = {}) => {
  const url = new URL(`${WEATHER_API_CONFIG.BASE_URL}${endpoint}`)
  
  // Add default parameters
  const defaultParams = {
    appid: WEATHER_API_CONFIG.API_KEY,
    units: WEATHER_API_CONFIG.UNITS,
    lang: WEATHER_API_CONFIG.LANGUAGE,
    ...params
  }
  
  // Add parameters to URL
  Object.entries(defaultParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  
  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
} 