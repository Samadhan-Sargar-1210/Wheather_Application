// Tomorrow.io Weather API Configuration
// Get your free API key from: https://www.tomorrow.io/weather-api/

export const WEATHER_API_CONFIG = {
  // Tomorrow.io API key for live weather data
  API_KEY: 'EHm9pdsGjbqpY1wbUN1SegZ1P5BJdhXZ',
  BASE_URL: 'https://api.tomorrow.io/v4',
  UNITS: 'metric', // metric, imperial
  LANGUAGE: 'en' // en, hi, mr, ta
}

// API Endpoints
export const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather/realtime',
  FORECAST: '/weather/forecast',
  GEOCODING: '/geocoding/v1/search'
}

// Weather condition mappings for Tomorrow.io weather codes
export const WEATHER_CONDITIONS = {
  1000: 'Clear',
  1001: 'Cloudy',
  1100: 'Mostly Clear',
  1101: 'Partly Cloudy',
  1102: 'Mostly Cloudy',
  2000: 'Fog',
  2100: 'Light Fog',
  4000: 'Drizzle',
  4001: 'Rain',
  4200: 'Light Rain',
  4201: 'Heavy Rain',
  5000: 'Snow',
  5001: 'Flurries',
  5100: 'Light Snow',
  5101: 'Heavy Snow',
  6000: 'Freezing Drizzle',
  6001: 'Freezing Rain',
  6200: 'Light Freezing Rain',
  6201: 'Heavy Freezing Rain',
  7000: 'Ice Pellets',
  7101: 'Heavy Ice Pellets',
  7102: 'Light Ice Pellets',
  8000: 'Thunderstorm'
}

// Weather icons mapping
export const WEATHER_ICONS = {
  'Clear': '☀️',
  'Partly Cloudy': '⛅',
  'Mostly Clear': '🌤️',
  'Mostly Cloudy': '☁️',
  'Cloudy': '☁️',
  'Fog': '🌫️',
  'Light Fog': '🌫️',
  'Drizzle': '🌦️',
  'Rain': '🌧️',
  'Light Rain': '🌦️',
  'Heavy Rain': '🌧️',
  'Snow': '❄️',
  'Flurries': '🌨️',
  'Light Snow': '🌨️',
  'Heavy Snow': '❄️',
  'Freezing Drizzle': '🌨️',
  'Freezing Rain': '🌨️',
  'Light Freezing Rain': '🌨️',
  'Heavy Freezing Rain': '🌨️',
  'Ice Pellets': '🧊',
  'Heavy Ice Pellets': '🧊',
  'Light Ice Pellets': '🧊',
  'Thunderstorm': '⛈️'
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
export const getWeatherCondition = (weatherCode) => {
  return WEATHER_CONDITIONS[weatherCode] || 'Partly Cloudy'
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

// API request helper for Tomorrow.io
export const makeWeatherApiRequest = async (endpoint, params = {}) => {
  const url = new URL(`${WEATHER_API_CONFIG.BASE_URL}${endpoint}`)
  
  // Add default parameters
  const defaultParams = {
    apikey: WEATHER_API_CONFIG.API_KEY,
    units: WEATHER_API_CONFIG.UNITS,
    ...params
  }
  
  // Add parameters to URL
  Object.entries(defaultParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })
  
  console.log('Making Tomorrow.io API request to:', url.toString())
  
  const response = await fetch(url.toString())
  
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Tomorrow.io API Error Response:', errorText)
    throw new Error(`Tomorrow.io API error: ${response.status} ${response.statusText}`)
  }
  
  const data = await response.json()
  console.log('Tomorrow.io API Success Response:', data)
  return data
} 