// OpenWeatherMap API configuration
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  throw new Error('API key is required');
}

// AQI API configuration (using OpenWeatherMap's air pollution API)
const AQI_BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Helper function to get AQI level and color
const getAQILevel = (aqi) => {
  if (aqi <= 50) return { level: 'Good', color: '#00E400', description: 'Air quality is satisfactory' }
  if (aqi <= 100) return { level: 'Moderate', color: '#FFFF00', description: 'Air quality is acceptable' }
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#FF7E00', description: 'Some pollutants may affect sensitive individuals' }
  if (aqi <= 200) return { level: 'Unhealthy', color: '#FF0000', description: 'Everyone may begin to experience health effects' }
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8F3F97', description: 'Health warnings of emergency conditions' }
  return { level: 'Hazardous', color: '#7E0023', description: 'Health alert: everyone may experience more serious health effects' }
}

// Helper function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => {
  return kelvin - 273.15
}

// Helper function to format date
const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toISOString().split('T')[0]
}

// Mock data for development
const mockWeatherData = {
  name: 'Mumbai',
  coord: { lat: 19.076, lon: 72.8777 },
  main: {
    temp: 30,
    feels_like: 32,
    humidity: 70,
    pressure: 1013,
  },
  weather: [
    {
      main: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
  ],
  wind: { speed: 5 },
  visibility: 10000,
  sys: { country: 'IN' },
};

const mockForecastData = [
  {
    dt: 1640995200,
    main: {
      temp: 25,
      feels_like: 27,
      humidity: 65,
      pressure: 1013,
    },
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d',
      },
    ],
    wind: { speed: 3 },
    pop: 0.1,
  },
  {
    dt: 1641081600,
    main: {
      temp: 28,
      feels_like: 30,
      humidity: 70,
      pressure: 1012,
    },
    weather: [
      {
        main: 'Clouds',
        description: 'scattered clouds',
        icon: '03d',
      },
    ],
    wind: { speed: 4 },
    pop: 0.3,
  },
];

const mockAQIData = {
  list: [
    {
      main: {
        aqi: 2,
      },
      components: {
        co: 200,
        no2: 20,
        o3: 30,
        pm2_5: 15,
        pm10: 25,
        so2: 5,
        nh3: 1,
      },
      dt: 1640995200,
    },
  ],
};

const mockAlerts = [
  {
    event: 'Heavy Rain',
    description: 'Heavy rainfall expected',
    severity: 'Moderate',
    start: 1640995200,
    end: 1641081600,
    tags: ['rain', 'flood'],
    safety_recommendations: [
      'Avoid low-lying areas',
      'Stay indoors during heavy rain',
    ],
  },
];

// Get current weather data by city name
export const getCurrentWeather = async (city) => {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  if (import.meta.env.DEV) {
    return mockWeatherData;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found');
      } else if (response.status === 401) {
        throw new Error('Invalid API key');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      } else {
        throw new Error('Failed to fetch weather data');
      }
    }

    const data = await response.json();
    
    return {
      city: data.name,
      temperature: kelvinToCelsius(data.main.temp),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      icon: data.weather[0].icon
    }
  } catch (error) {
    if (error.message.includes('City not found') || error.message.includes('Invalid API key')) {
      throw error;
    }
    throw new Error('Network error');
  }
}

// Get current weather data by coordinates
export const getCurrentWeatherByCoords = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid coordinates');
  }

  if (import.meta.env.DEV) {
    return mockWeatherData;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();
    
    return {
      city: data.name,
      temperature: kelvinToCelsius(data.main.temp),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      pressure: data.main.pressure,
      icon: data.weather[0].icon
    }
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
}

// Get 7-day forecast data by city name
export const getWeatherForecast = async (city) => {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  if (import.meta.env.DEV) {
    return mockForecastData;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    
    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const dailyData = {}
    
    data.list.forEach(item => {
      const date = formatDate(item.dt)
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: date,
          maxTemp: kelvinToCelsius(item.main.temp_max),
          minTemp: kelvinToCelsius(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }
      } else {
        // Update max/min temperatures for the day
        const currentMax = kelvinToCelsius(item.main.temp_max)
        const currentMin = kelvinToCelsius(item.main.temp_min)
        
        if (currentMax > dailyData[date].maxTemp) {
          dailyData[date].maxTemp = currentMax
        }
        if (currentMin < dailyData[date].minTemp) {
          dailyData[date].minTemp = currentMin
        }
      }
    })
    
    // Convert to array and take first 7 days
    Object.values(dailyData).slice(0, 7).forEach(day => {
      dailyForecasts.push(day)
    })
    
    return dailyForecasts
  } catch (error) {
    throw new Error('Failed to fetch forecast data');
  }
}

// Get 7-day forecast data by coordinates
export const getWeatherForecastByCoords = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid coordinates');
  }

  if (import.meta.env.DEV) {
    return mockForecastData;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch forecast data');
    }

    const data = await response.json();
    
    // Process forecast data to get daily forecasts
    const dailyForecasts = []
    const dailyData = {}
    
    data.list.forEach(item => {
      const date = formatDate(item.dt)
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date: date,
          maxTemp: kelvinToCelsius(item.main.temp_max),
          minTemp: kelvinToCelsius(item.main.temp_min),
          description: item.weather[0].description,
          icon: item.weather[0].icon
        }
      } else {
        // Update max/min temperatures for the day
        const currentMax = kelvinToCelsius(item.main.temp_max)
        const currentMin = kelvinToCelsius(item.main.temp_min)
        
        if (currentMax > dailyData[date].maxTemp) {
          dailyData[date].maxTemp = currentMax
        }
        if (currentMin < dailyData[date].minTemp) {
          dailyData[date].minTemp = currentMin
        }
      }
    })
    
    // Convert to array and take first 7 days
    Object.values(dailyData).slice(0, 7).forEach(day => {
      dailyForecasts.push(day)
    })
    
    return dailyForecasts
  } catch (error) {
    throw new Error('Failed to fetch forecast data');
  }
}

// Get AQI data by city name
export const getAQIByCity = async (city) => {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  if (import.meta.env.DEV) {
    return mockAQIData;
  }

  try {
    const response = await fetch(
      `${AQI_BASE_URL}/air_pollution?q=${encodeURIComponent(city)}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('CITY_NOT_FOUND')
      } else if (response.status === 401) {
        throw new Error('API_KEY_INVALID')
      } else {
        throw new Error('API_ERROR')
      }
    }
    
    const data = await response.json()
    const aqi = data.list[0].main.aqi
    const aqiInfo = getAQILevel(aqi)
    
    return {
      aqi: aqi,
      level: aqiInfo.level,
      color: aqiInfo.color,
      description: aqiInfo.description,
      components: data.list[0].components
    }
  } catch (error) {
    throw error
  }
}

// Get AQI data by coordinates
export const getAQIByCoords = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid coordinates');
  }

  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    throw new Error('Coordinates out of range');
  }

  if (import.meta.env.DEV) {
    return mockAQIData;
  }

  try {
    const response = await fetch(
      `${AQI_BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('API_KEY_INVALID')
      } else {
        throw new Error('API_ERROR')
      }
    }
    
    const data = await response.json()
    const aqi = data.list[0].main.aqi
    const aqiInfo = getAQILevel(aqi)
    
    return {
      aqi: aqi,
      level: aqiInfo.level,
      color: aqiInfo.color,
      description: aqiInfo.description,
      components: data.list[0].components
    }
  } catch (error) {
    throw error
  }
}

// Get user's current location
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
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error('Location access denied. Please enable location services.'))
            break
          case error.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable.'))
            break
          case error.TIMEOUT:
            reject(new Error('Location request timed out.'))
            break
          default:
            reject(new Error('An unknown error occurred while getting location.'))
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

// Mock data for development (when API key is not set)
export const getMockCurrentWeather = async (city) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const weatherDescriptions = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
    'Heavy Rain', 'Thunderstorm', 'Snow', 'Foggy', 'Clear'
  ]
  
  return {
    city: city,
    temperature: Math.floor(Math.random() * 30) + 10,
    feelsLike: Math.floor(Math.random() * 30) + 8,
    description: weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)],
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    pressure: Math.floor(Math.random() * 50) + 1000,
    icon: '01d'
  }
}

export const getMockWeatherForecast = async (city) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const weatherDescriptions = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
    'Heavy Rain', 'Thunderstorm', 'Snow', 'Foggy', 'Clear'
  ]
  
  const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d']
  
  const forecast = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      maxTemp: Math.floor(Math.random() * 25) + 15,
      minTemp: Math.floor(Math.random() * 15) + 5,
      description: weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      rainChance: Math.round(Math.random() * 100)
    })
  }
  
  return forecast
}

// Mock location-based weather (for development)
export const getMockCurrentWeatherByCoords = async (lat, lon) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const weatherDescriptions = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
    'Heavy Rain', 'Thunderstorm', 'Snow', 'Foggy', 'Clear'
  ]
  
  // Generate a city name based on coordinates for mock data
  const cityNames = ['Your Location', 'Current Location', 'Nearby City', 'Local Area']
  const randomCity = cityNames[Math.floor(Math.random() * cityNames.length)]
  
  return {
    city: randomCity,
    temperature: Math.floor(Math.random() * 30) + 10,
    feelsLike: Math.floor(Math.random() * 30) + 8,
    description: weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)],
    humidity: Math.floor(Math.random() * 40) + 40,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    pressure: Math.floor(Math.random() * 50) + 1000,
    icon: '01d',
    rainChance: Math.round(Math.random() * 100)
  }
}

export const getMockWeatherForecastByCoords = async (lat, lon) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const weatherDescriptions = [
    'Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
    'Heavy Rain', 'Thunderstorm', 'Snow', 'Foggy', 'Clear'
  ]
  
  const icons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d']
  
  const forecast = []
  const today = new Date()
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    
    forecast.push({
      date: date.toISOString().split('T')[0],
      maxTemp: Math.floor(Math.random() * 25) + 15,
      minTemp: Math.floor(Math.random() * 15) + 5,
      description: weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      rainChance: Math.round(Math.random() * 100)
    })
  }
  
  return forecast
}

// Mock AQI data for development
export const getMockAQIByCity = async (city) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate random AQI values for different cities
  const aqiValues = [25, 45, 75, 120, 180, 250, 320]
  const randomAQI = aqiValues[Math.floor(Math.random() * aqiValues.length)]
  const aqiInfo = getAQILevel(randomAQI)
  
  return {
    aqi: randomAQI,
    level: aqiInfo.level,
    color: aqiInfo.color,
    description: aqiInfo.description,
    components: {
      co: Math.random() * 2000 + 200,
      no2: Math.random() * 50 + 10,
      o3: Math.random() * 100 + 20,
      pm2_5: Math.random() * 50 + 5,
      pm10: Math.random() * 100 + 10,
      so2: Math.random() * 20 + 2
    }
  }
}

export const getMockAQIByCoords = async (lat, lon) => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  // Generate random AQI values
  const aqiValues = [30, 55, 85, 140, 200, 280, 350]
  const randomAQI = aqiValues[Math.floor(Math.random() * aqiValues.length)]
  const aqiInfo = getAQILevel(randomAQI)
  
  return {
    aqi: randomAQI,
    level: aqiInfo.level,
    color: aqiInfo.color,
    description: aqiInfo.description,
    components: {
      co: Math.random() * 2000 + 200,
      no2: Math.random() * 50 + 10,
      o3: Math.random() * 100 + 20,
      pm2_5: Math.random() * 50 + 5,
      pm10: Math.random() * 100 + 10,
      so2: Math.random() * 20 + 2
    }
  }
}

// When generating daily forecast, add rainChance (0-100%)
function getMockForecast(city) {
  const today = new Date()
  const daily = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    return {
      date: date.toISOString().slice(0, 10),
      temp: Math.round(20 + Math.random() * 15),
      icon: ['01d', '02d', '03d', '09d', '10d', '11d', '13d'][Math.floor(Math.random() * 7)],
      description: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rain', 'Thunderstorm', 'Snow', 'Fog'][Math.floor(Math.random() * 7)],
      rainChance: Math.round(Math.random() * 100)
    }
  })
  return { daily }
}

export const getWeatherAlerts = async (city) => {
  if (!city || !city.trim()) {
    throw new Error('City name is required');
  }

  if (import.meta.env.DEV) {
    return mockAlerts;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?q=${encodeURIComponent(city)}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather alerts');
    }

    const data = await response.json();
    return data.alerts || [];
  } catch (error) {
    throw new Error('Failed to fetch weather alerts');
  }
}

export const getWeatherByLocation = async (lat, lon) => {
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    throw new Error('Invalid coordinates');
  }

  if (import.meta.env.DEV) {
    return mockWeatherData;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch weather data');
  }
} 