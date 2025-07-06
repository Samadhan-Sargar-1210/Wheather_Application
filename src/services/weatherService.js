// Weather API Service for Tomorrow.io
import { WEATHER_API_CONFIG } from '../config/weatherApi.js'

const API_ENDPOINTS = {
  CURRENT_WEATHER: '/weather/realtime',
  FORECAST: '/weather/forecast',
  GEOCODING: '/geocoding/v1/search'
}

// Enhanced API request function with better error handling
export const makeWeatherApiRequest = async (endpoint, params = {}) => {
  try {
    // Add API key and units to all requests
    const queryParams = new URLSearchParams({
      apikey: WEATHER_API_CONFIG.API_KEY,
      units: WEATHER_API_CONFIG.UNITS,
      ...params
    })

    const url = `${WEATHER_API_CONFIG.BASE_URL}${endpoint}?${queryParams}`
    console.log('Making Tomorrow.io API request to:', url)

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
    console.log('API Response status:', response.status)
    console.log('API Response headers:', response.headers)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Tomorrow.io API Error Response:', errorText)
      
      if (response.status === 404) {
        throw new Error('404: Location not found')
      } else if (response.status === 401) {
        throw new Error('401: Invalid API key')
      } else if (response.status === 429) {
        throw new Error('429: Rate limit exceeded')
      } else {
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('Tomorrow.io API Response data:', data)
    
    // Validate the response
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format from API')
    }
    
    return data
  } catch (error) {
    console.error('Tomorrow.io API Request failed:', error)
    
    // If it's a network error, provide a helpful message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection')
    }
    
    // Re-throw the error with context
    throw error
  }
}

// Enhanced geocoding function for Tomorrow.io
export const getCoordinates = async (cityName) => {
  try {
    console.log('Getting coordinates for:', cityName)
    
    // Try direct weather API call first (works for most cities)
    try {
      const weatherData = await makeWeatherApiRequest(API_ENDPOINTS.CURRENT_WEATHER, {
        location: cityName,
        fields: 'temperature'
      })
      
      // If we get weather data, extract location info
      if (weatherData.data && weatherData.data.location) {
        const location = weatherData.data.location
        console.log('Got location from weather API:', location)
        return {
          lat: location.lat,
          lon: location.lng,
          name: cityName,
          country: location.country || 'Unknown',
          state: location.state || '',
          fullName: `${cityName}, ${location.country || 'Unknown'}`
        }
      }
    } catch (weatherErr) {
      console.log('Direct weather API failed, trying geocoding...')
    }
    
    // Fallback: Try geocoding (may fail due to API limitations)
    try {
      let data = await makeWeatherApiRequest(API_ENDPOINTS.GEOCODING, {
        query: cityName,
        limit: 5
      })
      
      console.log('Geocoding response:', data)
      
      if (!data.results || data.results.length === 0) {
        // If no results, try with country code for better matching
        console.log('No results found, trying with country code...')
        data = await makeWeatherApiRequest(API_ENDPOINTS.GEOCODING, {
          query: `${cityName}, India`,
          limit: 5
        })
      }
      
      if (!data.results || data.results.length === 0) {
        // Try with different country codes
        const countries = ['US', 'UK', 'CA', 'AU', 'DE', 'FR', 'JP', 'CN']
        for (const country of countries) {
          try {
            console.log(`Trying with country code: ${country}`)
            data = await makeWeatherApiRequest(API_ENDPOINTS.GEOCODING, {
              query: `${cityName}, ${country}`,
              limit: 3
            })
            if (data.results && data.results.length > 0) {
              console.log(`Found results with country ${country}:`, data)
              break
            }
          } catch (err) {
            console.log(`No results for ${country}`)
            continue
          }
        }
      }
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`No coordinates found for "${cityName}". Try searching for a nearby larger city.`)
      }
      
      // Return the best match (usually the first one)
      const location = data.results[0]
      console.log('Selected location:', location)
      
      return {
        lat: location.location.lat,
        lon: location.location.lng,
        name: location.name,
        country: location.country,
        state: location.state,
        fullName: location.name + (location.state ? `, ${location.state}` : '') + `, ${location.country}`
      }
    } catch (geocodingErr) {
      console.log('Geocoding failed, using fallback coordinates for major cities')
      
      // Fallback coordinates for major cities
      const majorCities = {
        'mumbai': { lat: 19.0760, lon: 72.8777, country: 'India' },
        'delhi': { lat: 28.7041, lon: 77.1025, country: 'India' },
        'bangalore': { lat: 12.9716, lon: 77.5946, country: 'India' },
        'chennai': { lat: 13.0827, lon: 80.2707, country: 'India' },
        'kolkata': { lat: 22.5726, lon: 88.3639, country: 'India' },
        'hyderabad': { lat: 17.3850, lon: 78.4867, country: 'India' },
        'pune': { lat: 18.5204, lon: 73.8567, country: 'India' },
        'ahmedabad': { lat: 23.0225, lon: 72.5714, country: 'India' },
        'london': { lat: 51.5074, lon: -0.1278, country: 'UK' },
        'new york': { lat: 40.7128, lon: -74.0060, country: 'US' },
        'tokyo': { lat: 35.6762, lon: 139.6503, country: 'Japan' },
        'paris': { lat: 48.8566, lon: 2.3522, country: 'France' },
        'sydney': { lat: -33.8688, lon: 151.2093, country: 'Australia' }
      }
      
      const cityKey = cityName.toLowerCase()
      if (majorCities[cityKey]) {
        const city = majorCities[cityKey]
        return {
          lat: city.lat,
          lon: city.lon,
          name: cityName,
          country: city.country,
          state: '',
          fullName: `${cityName}, ${city.country}`
        }
      }
      
      throw new Error(`No coordinates found for "${cityName}". Try searching for a nearby larger city.`)
    }
  } catch (error) {
    console.error('Geocoding failed:', error)
    throw error
  }
}

// Enhanced weather condition mapping for Tomorrow.io
export const getWeatherCondition = (weatherCode) => {
  const conditions = {
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
  
  return conditions[weatherCode] || 'Partly Cloudy'
}

// Enhanced weather icon mapping
export const getWeatherIcon = (condition) => {
  const icons = {
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
  
  return icons[condition] || '🌤️'
}

// Enhanced forecast data fetching for Tomorrow.io
export const fetchForecastData = async (lat, lon) => {
  try {
    console.log('Fetching forecast for coordinates:', lat, lon)
    const data = await makeWeatherApiRequest(API_ENDPOINTS.FORECAST, { 
      location: `${lat},${lon}`,
      timesteps: '1d',
      fields: 'temperature,weatherCode,humidity,windSpeed,precipitationProbability'
    })
    
    if (!data.data || !data.data.timelines || !data.data.timelines[0]) {
      throw new Error('Invalid forecast data received')
    }
    
    // Process forecast data
    const forecast = data.data.timelines[0].intervals
      .slice(0, 7) // Get 7 days
      .map(interval => ({
        date: new Date(interval.startTime),
        temp: Math.round(interval.values.temperature),
        tempMin: Math.round(interval.values.temperature),
        tempMax: Math.round(interval.values.temperature),
        condition: getWeatherCondition(interval.values.weatherCode),
        humidity: Math.round(interval.values.humidity),
        windSpeed: Math.round(interval.values.windSpeed * 3.6), // Convert m/s to km/h
        rainChance: Math.round(interval.values.precipitationProbability * 100),
        icon: getWeatherIcon(getWeatherCondition(interval.values.weatherCode))
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
           randomLevel === 'Moderate' ? '#FFFF00' : '#FF7E00',
    pollutants: {
      pm25: Math.floor(Math.random() * 50) + 5,
      pm10: Math.floor(Math.random() * 100) + 10,
      no2: Math.floor(Math.random() * 40) + 5,
      o3: Math.floor(Math.random() * 60) + 10
    },
    healthAdvice: randomLevel === 'Good' ? 'Air quality is good. Enjoy outdoor activities.' :
                  randomLevel === 'Moderate' ? 'Air quality is acceptable. Sensitive individuals may experience symptoms.' :
                  'Air quality is moderate. Limit outdoor activities.'
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
      id: Date.now(),
      title: randomAlert,
      severity: 'Moderate',
      description: `Weather conditions may be hazardous. Please take necessary precautions.`,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
    }]
  }
  
  return []
}

// Main weather fetching function for Tomorrow.io
export const getCurrentWeather = async (city) => {
  try {
    console.log('Getting current weather for:', city)
    
    // Try direct weather API call first (works for most cities)
    let data
    let coords = null
    
    try {
      // Try direct weather API call
      data = await makeWeatherApiRequest(API_ENDPOINTS.CURRENT_WEATHER, { 
        location: city,
        fields: 'temperature,temperatureApparent,humidity,windSpeed,pressureSeaLevel,visibility,uvIndex,weatherCode,cloudCover,precipitationProbability'
      })
      
      console.log('Direct weather API response:', data)
      
      // Extract location info if available
      if (data.data && data.data.location) {
        coords = {
          lat: data.data.location.lat,
          lon: data.data.location.lng,
          name: city,
          country: data.data.location.country || 'Unknown',
          state: data.data.location.state || '',
          fullName: `${city}, ${data.data.location.country || 'Unknown'}`
        }
      }
    } catch (directError) {
      console.log('Direct weather API failed, trying with coordinates...')
      
      // Fallback: Get coordinates first, then weather
      try {
        coords = await getCoordinates(city)
        console.log('Got coordinates:', coords)
        
        // Use coordinates to get weather
        data = await makeWeatherApiRequest(API_ENDPOINTS.CURRENT_WEATHER, { 
          location: `${coords.lat},${coords.lon}`,
          fields: 'temperature,temperatureApparent,humidity,windSpeed,pressureSeaLevel,visibility,uvIndex,weatherCode,cloudCover,precipitationProbability'
        })
      } catch (coordError) {
        console.log('Coordinate-based weather API failed:', coordError)
        throw coordError
      }
    }
    
    if (!data.data || !data.data.values) {
      throw new Error('Invalid weather data received')
    }
    
    const values = data.data.values
    
    return {
      city: coords ? coords.fullName : city,
      temperature: Math.round(values.temperature),
      feelsLike: Math.round(values.temperatureApparent),
      condition: getWeatherCondition(values.weatherCode),
      humidity: Math.round(values.humidity),
      windSpeed: Math.round(values.windSpeed * 3.6), // Convert m/s to km/h
      pressure: Math.round(values.pressureSeaLevel),
      visibility: Math.round(values.visibility), // Already in km
      uvIndex: values.uvIndex,
      sunrise: '06:30 AM', // Tomorrow.io doesn't provide sunrise/sunset in free tier
      sunset: '06:45 PM',
      description: getWeatherCondition(values.weatherCode),
      icon: getWeatherIcon(getWeatherCondition(values.weatherCode)),
      isDemo: false,
      lat: coords ? coords.lat : null,
      lon: coords ? coords.lon : null
    }
  } catch (error) {
    console.error('getCurrentWeather failed:', error)
    
    // Provide helpful error message for villages
    if (error.message.includes('No coordinates found')) {
      throw new Error(`Weather data not available for "${city}". Try searching for a nearby larger city or town.`)
    }
    
    throw error
  }
}

// Get current location with city name
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords
          console.log('Got coordinates:', lat, lon)
          
          // Try to get city name using reverse geocoding
          try {
            const weatherData = await makeWeatherApiRequest(API_ENDPOINTS.CURRENT_WEATHER, {
              location: `${lat},${lon}`,
              fields: 'temperature'
            })
            
            if (weatherData.data && weatherData.data.location) {
              const location = weatherData.data.location
              resolve({
                lat,
                lon,
                name: location.name || 'Your Location',
                country: location.country || 'Unknown',
                state: location.state || '',
                fullName: location.name ? `${location.name}, ${location.country || 'Unknown'}` : 'Your Location'
              })
            } else {
              // Fallback if no location name available
              resolve({
                lat,
                lon,
                name: 'Your Location',
                country: 'Unknown',
                state: '',
                fullName: 'Your Location'
              })
            }
          } catch (reverseError) {
            console.log('Reverse geocoding failed, using fallback:', reverseError)
            // Fallback if reverse geocoding fails
            resolve({
              lat,
              lon,
              name: 'Your Location',
              country: 'Unknown',
              state: '',
              fullName: 'Your Location'
            })
          }
        } catch (error) {
          reject(error)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        
        // Provide specific error messages based on error code
        let errorMessage = 'Unable to get your location'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services in your browser settings.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out. Please try again.'
            break
          default:
            errorMessage = `Location error: ${error.message}`
        }
        
        const enhancedError = new Error(errorMessage)
        enhancedError.code = error.code
        reject(enhancedError)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 300000 // 5 minutes
      }
    )
  })
} 