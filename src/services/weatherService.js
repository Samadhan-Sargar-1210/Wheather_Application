// Weather API Service
import { API_KEY, API_BASE_URL } from '../config/weatherApi.js'

const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather',
  FORECAST: '/forecast',
  GEOCODING: '/geo/1.0/direct'
}

// Enhanced API request function with better error handling
export const makeWeatherApiRequest = async (endpoint, params = {}) => {
  try {
    // Add API key and units to all requests
    const queryParams = new URLSearchParams({
      appid: API_KEY,
      units: 'metric',
      ...params
    })

    const url = `${API_BASE_URL}${endpoint}?${queryParams}`
    console.log('Making API request to:', url)

    const response = await fetch(url)
    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      
      if (response.status === 404) {
        throw new Error('404: City not found')
      } else if (response.status === 401) {
        throw new Error('401: Invalid API key')
      } else if (response.status === 429) {
        throw new Error('429: Rate limit exceeded')
      } else {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('API Response data:', data)
    
    // Validate the response
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API')
    }
    
    return data
  } catch (error) {
    console.error('API Request failed:', error)
    
    // If it's a network error, provide a helpful message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection')
    }
    
    // Re-throw the error with context
    throw error
  }
}

// Enhanced geocoding function
export const getCoordinates = async (cityName) => {
  try {
    console.log('Getting coordinates for:', cityName)
    const data = await makeWeatherApiRequest(API_ENDPOINTS.GEOCODING, {
      q: cityName,
      limit: 1
    })
    
    console.log('Geocoding response:', data)
    
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`No coordinates found for "${cityName}"`)
    }
    
    const location = data[0]
    return {
      lat: location.lat,
      lon: location.lon,
      name: location.name,
      country: location.country
    }
  } catch (error) {
    console.error('Geocoding failed:', error)
    throw error
  }
}

// Enhanced weather condition mapping
export const getWeatherCondition = (main, description = '') => {
  const conditions = {
    'Clear': 'clear',
    'Clouds': description.toLowerCase().includes('scattered') ? 'partly-cloudy' : 'cloudy',
    'Rain': description.toLowerCase().includes('light') ? 'light-rain' : 'rain',
    'Drizzle': 'light-rain',
    'Thunderstorm': 'thunderstorm',
    'Snow': 'snow',
    'Mist': 'fog',
    'Smoke': 'fog',
    'Haze': 'fog',
    'Dust': 'fog',
    'Fog': 'fog',
    'Sand': 'fog',
    'Ash': 'fog',
    'Squall': 'windy',
    'Tornado': 'thunderstorm'
  }
  
  return conditions[main] || 'clear'
}

// Enhanced weather icon mapping
export const getWeatherIcon = (condition) => {
  const icons = {
    'clear': '☀️',
    'partly-cloudy': '⛅',
    'cloudy': '☁️',
    'light-rain': '🌦️',
    'rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'fog': '🌫️',
    'windy': '💨'
  }
  
  return icons[condition] || '☀️'
}

// Enhanced forecast data fetching
export const fetchForecastData = async (lat, lon) => {
  try {
    console.log('Fetching forecast for coordinates:', lat, lon)
    const data = await makeWeatherApiRequest(API_ENDPOINTS.FORECAST, { lat, lon })
    
    if (!data.list || !Array.isArray(data.list)) {
      throw new Error('Invalid forecast data received')
    }
    
    // Process forecast data
    const forecast = data.list
      .filter((item, index) => index % 8 === 0) // Get one reading per day
      .slice(0, 5) // Get 5 days
      .map(item => ({
        date: new Date(item.dt * 1000).toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        temp: Math.round(item.main.temp),
        condition: getWeatherCondition(item.weather[0].main, item.weather[0].description),
        icon: getWeatherIcon(getWeatherCondition(item.weather[0].main, item.weather[0].description)),
        description: item.weather[0].description
      }))
    
    console.log('Processed forecast data:', forecast)
    return forecast
  } catch (error) {
    console.error('Forecast fetch failed:', error)
    throw error
  }
}

// Mock data generators for features not available in free API
export const generateMockAQI = () => {
  const aqiLevels = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous']
  const randomLevel = aqiLevels[Math.floor(Math.random() * 3)] // Mostly good to moderate
  const aqiValue = randomLevel === 'Good' ? Math.floor(Math.random() * 50) + 1 : 
                   randomLevel === 'Moderate' ? Math.floor(Math.random() * 50) + 51 : 
                   Math.floor(Math.random() * 50) + 101
  
  return {
    value: aqiValue,
    level: randomLevel,
    color: randomLevel === 'Good' ? '#00E400' : 
           randomLevel === 'Moderate' ? '#FFFF00' : '#FF7E00'
  }
}

export const generateMockAlerts = () => {
  const possibleAlerts = [
    'Heat Advisory',
    'Air Quality Alert',
    'Flood Watch',
    'Severe Thunderstorm Watch',
    'Winter Weather Advisory'
  ]
  
  // 30% chance of having an alert
  if (Math.random() > 0.7) {
    const randomAlert = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)]
    return [{
      type: randomAlert,
      severity: 'Moderate',
      description: `Weather conditions may be hazardous. Please take necessary precautions.`
    }]
  }
  
  return []
}

// Main weather fetching function
export const getCurrentWeather = async (city) => {
  try {
    console.log('Getting current weather for:', city)
    const data = await makeWeatherApiRequest(API_ENDPOINTS.CURRENT_WEATHER, { q: city })
    
    if (!data || !data.main || !data.weather || !data.weather[0]) {
      throw new Error('Invalid weather data received')
    }
    
    return {
      city: data.name,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: getWeatherCondition(data.weather[0].main, data.weather[0].description),
      humidity: data.main.humidity,
      windSpeed: Math.round((data.wind?.speed || 0) * 3.6), // Convert m/s to km/h
      pressure: data.main.pressure,
      visibility: Math.round((data.visibility || 10000) / 1000), // Convert m to km
      uvIndex: 5, // OpenWeatherMap doesn't provide UV in free tier
      sunrise: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : '06:30 AM',
      sunset: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }) : '06:45 PM',
      description: data.weather[0].description,
      icon: getWeatherIcon(getWeatherCondition(data.weather[0].main, data.weather[0].description)),
      isDemo: false
    }
  } catch (error) {
    console.error('getCurrentWeather failed:', error)
    throw error
  }
}

// Get current location
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
} 