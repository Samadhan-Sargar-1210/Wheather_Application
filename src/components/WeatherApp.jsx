import React, { useState, useCallback, useEffect } from 'react'
import './WeatherApp.css'
import { 
  WEATHER_API_CONFIG, 
  API_ENDPOINTS, 
  getWeatherCondition, 
  getWeatherIcon, 
  getAqiLevel, 
  getAqiColor, 
  getHealthAdvice,
  makeWeatherApiRequest 
} from '../config/weatherApi'

const WeatherApp = () => {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUserGroup, setSelectedUserGroup] = useState('city_residents')
  const [darkMode, setDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [locationData, setLocationData] = useState(null)
  const [speaking, setSpeaking] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleCityChange = useCallback((e) => {
    setCity(e.target.value)
    if (error) setError('')
  }, [error])

  const fetchWeatherData = useCallback(async (cityName, lat = null, lon = null) => {
    setLoading(true)
    setError('')
    setWeatherData(null)
    setForecastData(null)
    setAqiData(null)
    setAlerts([])

    try {
      let params = {}
      if (lat && lon) {
        params = { lat, lon }
      } else {
        params = { q: cityName }
      }

      const data = await makeWeatherApiRequest(API_ENDPOINTS.CURRENT_WEATHER, params)
      
      // Transform API data to our format
      const transformedWeatherData = {
        city: data.name,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        condition: getWeatherCondition(data.weather[0].main, data.weather[0].description),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        pressure: data.main.pressure,
        visibility: Math.round(data.visibility / 1000), // Convert m to km
        uvIndex: 5, // OpenWeatherMap doesn't provide UV in free tier
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        description: data.weather[0].description,
        icon: getWeatherIcon(getWeatherCondition(data.weather[0].main, data.weather[0].description)),
        isDemo: false
      }

      setWeatherData(transformedWeatherData)

      // Fetch forecast data
      await fetchForecastData(lat || data.coord.lat, lon || data.coord.lon)
      
      // Fetch AQI data (using mock data for now as OpenWeatherMap AQI requires paid plan)
      setAqiData(generateMockAQI())
      
      // Generate mock alerts
      setAlerts(generateMockAlerts())

    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchForecastData = useCallback(async (lat, lon) => {
    try {
      const data = await makeWeatherApiRequest(API_ENDPOINTS.FORECAST, { lat, lon })
      
      // Group forecast by day and get daily data
      const dailyData = data.list.filter((item, index) => index % 8 === 0) // Every 24 hours (8 * 3 hour intervals)
      
      const transformedForecastData = dailyData.slice(0, 7).map(day => ({
        date: new Date(day.dt * 1000),
        temp: Math.round(day.main.temp),
        tempMin: Math.round(day.main.temp_min),
        tempMax: Math.round(day.main.temp_max),
        condition: getWeatherCondition(day.weather[0].main, day.weather[0].description),
        humidity: day.main.humidity,
        windSpeed: Math.round(day.wind.speed * 3.6),
        rainChance: Math.round(day.pop * 100), // Probability of precipitation
        uvIndex: 5
      }))

      setForecastData(transformedForecastData)
    } catch (err) {
      console.error('Forecast fetch error:', err)
    }
  }, [])

  const handleSearch = useCallback(async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    await fetchWeatherData(city)
  }, [city, fetchWeatherData])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  const handleLocationWeather = useCallback(async () => {
    if (navigator.geolocation) {
      setLoading(true)
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 10000,
            enableHighAccuracy: true
          })
        })
        
        setLocationData({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
        
        setCity('Your Location')
        await fetchWeatherData('Your Location', position.coords.latitude, position.coords.longitude)
      } catch (err) {
        setError('Unable to get your location. Please try searching for a city.')
      } finally {
        setLoading(false)
      }
    } else {
      setError('Geolocation is not supported by your browser.')
    }
  }, [fetchWeatherData])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev)
  }, [])

  const handleSpeak = useCallback(() => {
    if (!weatherData) return
    
    setSpeaking(true)
    const text = `Current weather in ${weatherData.city} is ${weatherData.temperature} degrees Celsius with ${weatherData.condition.toLowerCase()} conditions.`
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setSpeaking(false)
      speechSynthesis.speak(utterance)
    } else {
      setSpeaking(false)
    }
  }, [weatherData])

  // Helper functions
  const getWeatherCondition = (main, description) => {
    const conditions = {
      'Clear': 'Sunny',
      'Clouds': description.includes('few') || description.includes('scattered') ? 'Partly Cloudy' : 'Cloudy',
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
    return conditions[main] || 'Partly Cloudy'
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Snowy': '❄️',
      'Stormy': '⛈️',
      'Foggy': '🌫️'
    }
    return icons[condition] || '🌤️'
  }

  const generateMockAQI = () => {
    const aqi = Math.floor(Math.random() * 150) + 30 // More realistic AQI range
    return {
      aqi: aqi,
      level: getAqiLevel(aqi),
      pollutants: {
        pm25: Math.floor(Math.random() * 30) + 5,
        pm10: Math.floor(Math.random() * 60) + 10,
        no2: Math.floor(Math.random() * 30) + 5,
        o3: Math.floor(Math.random() * 60) + 20,
        co: Math.floor(Math.random() * 3) + 0.5,
        so2: Math.floor(Math.random() * 15) + 2
      },
      healthAdvice: getHealthAdvice(aqi)
    }
  }

  const generateMockAlerts = () => {
    // Only show alerts for severe weather conditions
    const conditions = ['Stormy', 'Snowy']
    if (weatherData && conditions.includes(weatherData.condition)) {
      return [{
        id: 1,
        type: 'Weather Alert',
        title: `${weatherData.condition} Weather Warning`,
        description: `Severe ${weatherData.condition.toLowerCase()} conditions expected. Please take necessary precautions.`,
        severity: 'Moderate',
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }]
    }
    return []
  }

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Poor'
    if (aqi <= 200) return 'Very Poor'
    return 'Hazardous'
  }

  const getHealthAdvice = (aqi) => {
    if (aqi <= 50) return 'Air quality is good. Enjoy outdoor activities.'
    if (aqi <= 100) return 'Air quality is acceptable. Sensitive individuals may experience symptoms.'
    if (aqi <= 150) return 'Air quality is moderate. Limit outdoor activities.'
    if (aqi <= 200) return 'Air quality is poor. Avoid outdoor activities.'
    return 'Air quality is very poor. Stay indoors.'
  }

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return '#00e400'
    if (aqi <= 100) return '#ffff00'
    if (aqi <= 150) return '#ff7e00'
    if (aqi <= 200) return '#ff0000'
    return '#8f3f97'
  }

  const getBackgroundClass = () => {
    if (!weatherData) return 'bg-default'
    const condition = weatherData.condition.toLowerCase()
    if (condition.includes('sunny') || condition.includes('clear')) return 'bg-sunny'
    if (condition.includes('rainy') || condition.includes('rain')) return 'bg-rainy'
    if (condition.includes('snowy') || condition.includes('snow')) return 'bg-snowy'
    if (condition.includes('stormy') || condition.includes('storm')) return 'bg-stormy'
    if (condition.includes('cloudy') || condition.includes('cloud')) return 'bg-cloudy'
    if (condition.includes('foggy') || condition.includes('fog')) return 'bg-foggy'
    return 'bg-default'
  }

  return (
    <div className={`weather-app ${darkMode ? 'dark-mode' : ''} ${getBackgroundClass()}`}>
      <div className="app-container">
        {/* Header with Controls */}
        <header className="app-header">
          <div className="header-content">
            <div className="logo-section">
              <h1 className="app-title">
                <span className="logo-icon">🌤️</span>
                Weather Pro
              </h1>
              <p className="app-subtitle">Professional Weather Intelligence</p>
            </div>
            
            <div className="header-controls">
              <div className="time-display">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </div>
              
              <select 
                className="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="en">🇺🇸 English</option>
                <option value="hi">🇮🇳 हिंदी</option>
                <option value="mr">🇮🇳 मराठी</option>
                <option value="ta">🇮🇳 தமிழ்</option>
              </select>
              
              <button 
                className={`theme-toggle ${darkMode ? 'dark' : 'light'}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* Search Section */}
        <section className="search-section">
          <div className="search-container">
            <div className="search-box">
              <div className="input-group">
                <span className="input-icon">🏙️</span>
                <input
                  type="text"
                  value={city}
                  onChange={handleCityChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter city name..."
                  className="city-input"
                  disabled={loading}
                />
              </div>
              
              <div className="search-buttons">
                <button 
                  onClick={handleSearch}
                  disabled={loading || !city.trim()}
                  className="search-button primary"
                >
                  {loading ? (
                    <span className="button-content">
                      <div className="spinner-small"></div>
                      <span>Searching...</span>
                    </span>
                  ) : (
                    <span className="button-content">
                      <span>🔍</span>
                      <span>Search</span>
                    </span>
                  )}
                </button>
                
                <button 
                  onClick={handleLocationWeather}
                  disabled={loading}
                  className="search-button secondary"
                  title="Use my location"
                >
                  📍
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-message" role="alert">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        )}

        {/* Main Content */}
        <main className="main-content">
          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Fetching weather data...</p>
            </div>
          )}

          {weatherData && (
            <div className="weather-dashboard">
              {/* Current Weather Card */}
              <div className="weather-card current-weather">
                <div className="card-header">
                  <h2 className="city-name">{weatherData.city}</h2>
                  <div className="weather-icon-large">
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                </div>
                
                <div className="weather-main">
                  <div className="temperature-section">
                    <div className="temperature">
                      {weatherData.temperature}°C
                    </div>
                    <div className="feels-like">
                      Feels like {weatherData.feelsLike}°C
                    </div>
                  </div>
                  
                  <div className="weather-info">
                    <div className="condition">{weatherData.condition}</div>
                    <div className="description">{weatherData.description}</div>
                  </div>
                </div>
                
                <div className="weather-details-grid">
                  <div className="detail-item">
                    <span className="detail-icon">💧</span>
                    <div className="detail-content">
                      <span className="detail-label">Humidity</span>
                      <span className="detail-value">{weatherData.humidity}%</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">💨</span>
                    <div className="detail-content">
                      <span className="detail-label">Wind</span>
                      <span className="detail-value">{weatherData.windSpeed} km/h</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">📊</span>
                    <div className="detail-content">
                      <span className="detail-label">Pressure</span>
                      <span className="detail-value">{weatherData.pressure} hPa</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">👁️</span>
                    <div className="detail-content">
                      <span className="detail-label">Visibility</span>
                      <span className="detail-value">{weatherData.visibility} km</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">☀️</span>
                    <div className="detail-content">
                      <span className="detail-label">UV Index</span>
                      <span className="detail-value">{weatherData.uvIndex}</span>
                    </div>
                  </div>
                  
                  <div className="detail-item">
                    <span className="detail-icon">🌅</span>
                    <div className="detail-content">
                      <span className="detail-label">Sunrise/Sunset</span>
                      <span className="detail-value">{weatherData.sunrise} / {weatherData.sunset}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button 
                    onClick={handleSpeak}
                    disabled={speaking}
                    className="action-button"
                  >
                    {speaking ? '🔇 Stop' : '🔊 Speak'}
                  </button>
                </div>
              </div>

              {/* Air Quality Card */}
              {aqiData && (
                <div className="weather-card aqi-card">
                  <div className="card-header">
                    <h3>🌬️ Air Quality Index</h3>
                  </div>
                  
                  <div className="aqi-main">
                    <div 
                      className="aqi-value"
                      style={{ color: getAqiColor(aqiData.aqi) }}
                    >
                      {aqiData.aqi}
                    </div>
                    <div className="aqi-level">{aqiData.level}</div>
                  </div>
                  
                  <div className="aqi-details">
                    <div className="pollutant-grid">
                      <div className="pollutant-item">
                        <span className="pollutant-label">PM2.5</span>
                        <span className="pollutant-value">{aqiData.pollutants.pm25} µg/m³</span>
                      </div>
                      <div className="pollutant-item">
                        <span className="pollutant-label">PM10</span>
                        <span className="pollutant-value">{aqiData.pollutants.pm10} µg/m³</span>
                      </div>
                      <div className="pollutant-item">
                        <span className="pollutant-label">NO₂</span>
                        <span className="pollutant-value">{aqiData.pollutants.no2} µg/m³</span>
                      </div>
                      <div className="pollutant-item">
                        <span className="pollutant-label">O₃</span>
                        <span className="pollutant-value">{aqiData.pollutants.o3} µg/m³</span>
                      </div>
                    </div>
                    
                    <div className="health-advice">
                      <h4>💡 Health Advice</h4>
                      <p>{aqiData.healthAdvice}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Alerts */}
              {alerts.length > 0 && (
                <div className="weather-card alerts-card">
                  <div className="card-header">
                    <h3>🚨 Weather Alerts</h3>
                    <span className="alert-count">({alerts.length})</span>
                  </div>
                  
                  <div className="alerts-list">
                    {alerts.map(alert => (
                      <div key={alert.id} className="alert-item">
                        <div className="alert-header">
                          <div className="alert-title">{alert.title}</div>
                          <div className="alert-severity">{alert.severity}</div>
                        </div>
                        <div className="alert-description">{alert.description}</div>
                        <div className="alert-expires">
                          Expires: {alert.expires.toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7-Day Forecast */}
              {forecastData && (
                <div className="weather-card forecast-card">
                  <div className="card-header">
                    <h3>📅 7-Day Forecast</h3>
                  </div>
                  
                  <div className="forecast-grid">
                    {forecastData.map((day, index) => (
                      <div key={index} className="forecast-day">
                        <div className="forecast-date">
                          {day.date.toLocaleDateString('en-US', { 
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        
                        <div className="forecast-icon">
                          {getWeatherIcon(day.condition)}
                        </div>
                        
                        <div className="forecast-temps">
                          <span className="temp-max">{day.tempMax}°</span>
                          <span className="temp-min">{day.tempMin}°</span>
                        </div>
                        
                        <div className="forecast-condition">
                          {day.condition}
                        </div>
                        
                        <div className="forecast-details">
                          <div className="forecast-detail">
                            <span>💧</span> {day.humidity}%
                          </div>
                          <div className="forecast-detail">
                            <span>💨</span> {day.windSpeed} km/h
                          </div>
                          <div className="forecast-detail">
                            <span>🌧️</span> {day.rainChance}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Precautions */}
              <div className="weather-card precautions-card">
                <div className="card-header">
                  <h3>💡 Weather Precautions</h3>
                </div>
                
                <div className="precautions-content">
                  <div className="user-group-selector">
                    <label htmlFor="user-group">Select your group:</label>
                    <select 
                      id="user-group"
                      value={selectedUserGroup} 
                      onChange={(e) => setSelectedUserGroup(e.target.value)}
                      className="group-select"
                    >
                      <option value="city_residents">🏙️ City Residents</option>
                      <option value="children">👶 Children</option>
                      <option value="farmers">👨‍🌾 Farmers</option>
                      <option value="animals">🐾 Animals</option>
                    </select>
                  </div>
                  
                  <div className="precautions-list">
                    <div className="precaution-item">
                      <span className="precaution-icon">💧</span>
                      <span>Stay hydrated and avoid prolonged sun exposure</span>
                    </div>
                    <div className="precaution-item">
                      <span className="precaution-icon">👕</span>
                      <span>Wear appropriate clothing for the weather conditions</span>
                    </div>
                    <div className="precaution-item">
                      <span className="precaution-icon">📱</span>
                      <span>Check local weather updates regularly</span>
                    </div>
                    <div className="precaution-item">
                      <span className="precaution-icon">⚠️</span>
                      <span>Follow safety guidelines during extreme weather</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default WeatherApp 