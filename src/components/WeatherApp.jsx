import React, { useState, useCallback, useEffect } from 'react'
import './WeatherApp.css'
import { useTranslation } from 'react-i18next'
import { 
  getCurrentWeather, 
  fetchForecastData, 
  getWeatherCondition, 
  getWeatherIcon
} from '../services/weatherService'
import { 
  getAqiLevel, 
  getAqiColor, 
  getHealthAdvice
} from '../config/weatherApi'
import { generateDynamicPrecautions, getPrecautionsForGroup } from '../utils/precautions'

const WeatherApp = () => {
  const { t, i18n } = useTranslation()
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
  const [searchHistory, setSearchHistory] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [weatherPrecautions, setWeatherPrecautions] = useState({})

  // Common nearby cities for different regions
  const nearbyCities = {
    'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Kolhapur', 'Solapur'],
    'karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga'],
    'tamil nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Vellore'],
    'kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'],
    'andhra pradesh': ['Hyderabad', 'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool'],
    'telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nizamabad', 'Adilabad', 'Khammam'],
    'gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'],
    'rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer'],
    'madhya pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'],
    'uttar pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Prayagraj', 'Ghaziabad']
  }

  // Get suggestions based on the search term
  const getSuggestions = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return []
    
    const term = searchTerm.toLowerCase()
    const suggestions = []
    
    // Check if it matches any state/region
    for (const [region, cities] of Object.entries(nearbyCities)) {
      if (region.includes(term) || term.includes(region)) {
        suggestions.push(...cities.slice(0, 3))
      }
    }
    
    // Add some common large cities
    const commonCities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
    commonCities.forEach(city => {
      if (city.toLowerCase().includes(term) && !suggestions.includes(city)) {
        suggestions.push(city)
      }
    })
    
    return suggestions.slice(0, 5)
  }

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleCityChange = useCallback((e) => {
    const value = e.target.value
    setCity(value)
    if (error) setError('')
    
    // Show suggestions as user types
    const newSuggestions = getSuggestions(value)
    setSuggestions(newSuggestions)
  }, [error])

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion)
    setSuggestions([])
    // Auto-search for the suggestion
    fetchWeatherData(suggestion)
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    i18n.changeLanguage(language)
    console.log('Language changed to:', language)
  }

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
        params = { location: `${lat},${lon}` }
        console.log('Fetching weather by coordinates:', lat, lon)
      } else {
        console.log('Fetching weather for city/village:', cityName)
      }

      console.log('API Parameters:', params)
      
      // Get weather data using robust service function
      const weather = await getCurrentWeather(cityName)
      setWeatherData(weather)

      // Generate dynamic precautions based on weather data
      const dynamicPrecautions = generateDynamicPrecautions(weather)
      setWeatherPrecautions(dynamicPrecautions)
      console.log('Generated precautions:', dynamicPrecautions)

      // Fetch forecast data if coordinates are available
      if (weather && weather.city && weather.lat && weather.lon) {
        try {
          await fetchForecastData(weather.lat, weather.lon)
        } catch (forecastErr) {
          console.error('Forecast fetch failed:', forecastErr)
          // Don't fail the whole request if forecast fails
        }
      }
      
      // Generate AQI and alerts
      setAqiData(generateMockAQI())
      setAlerts(generateMockAlerts())

    } catch (err) {
      console.error('Weather fetch error:', err)
      
      // Provide more specific error messages for villages
      let errorMessage = 'Failed to fetch weather data'
      
      if (err.message.includes('404')) {
        errorMessage = `"${cityName}" not found. Try searching for a nearby larger city or town.`
      } else if (err.message.includes('No coordinates found')) {
        errorMessage = `Weather data not available for "${cityName}". Try searching for a nearby larger city or town.`
      } else if (err.message.includes('Weather data not available')) {
        errorMessage = err.message
      } else if (err.message.includes('401')) {
        errorMessage = 'API key error. Please check the configuration.'
      } else if (err.message.includes('429')) {
        errorMessage = 'Too many requests. Please wait a moment and try again.'
      } else if (err.message.includes('Invalid weather data')) {
        errorMessage = 'Invalid data received from weather service.'
      } else {
        errorMessage = err.message || 'Failed to fetch weather data'
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!city.trim()) return

    const cityName = city.trim()
    console.log('Searching for city:', cityName)
    
    try {
      await fetchWeatherData(cityName)
      setSearchHistory(prev => {
        const newHistory = [cityName, ...prev.filter(c => c !== cityName)].slice(0, 5)
        return newHistory
      })
    } catch (error) {
      console.error('Search failed:', error)
      setError(error.message)
    }
  }

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
        
        console.log('Using location:', position.coords.latitude, position.coords.longitude)
        setCity('Your Location')
        await fetchWeatherData('Your Location', position.coords.latitude, position.coords.longitude)
      } catch (err) {
        console.error('Location error:', err)
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
                onChange={(e) => handleLanguageChange(e.target.value)}
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
                    placeholder={t('weather.search.placeholder')}
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
                      <span>{t('weather.search.button')}</span>
                    </span>
                  )}
                </button>

                <button 
                  onClick={handleLocationWeather}
                  disabled={loading}
                  className="search-button secondary"
                  title={t('weather.location.button')}
                >
                  📍
                </button>
              </div>
            </div>
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="suggestions-container">
                <div className="suggestions-list">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <span className="suggestion-icon">🏙️</span>
                      <span className="suggestion-text">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                <p className="loading-text">{t('weather.loading.text')}</p>
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
                  <h3>💡 {t('weather.precautions.title')}</h3>
                  <span className="temperature-display">{weatherData.temperature}°C</span>
                </div>
                
                <div className="precautions-content">
                  <div className="user-group-selector">
                    <label htmlFor="user-group">{t('select_user_group')}:</label>
                    <select 
                      id="user-group"
                      value={selectedUserGroup} 
                      onChange={(e) => setSelectedUserGroup(e.target.value)}
                      className="group-select"
                    >
                      <option value="city_residents">🏙️ {t('city_residents')}</option>
                      <option value="small_children">👶 {t('small_children')}</option>
                      <option value="elderly">👴 {t('elderly')}</option>
                      <option value="farmers">👨‍🌾 {t('farmers')}</option>
                      <option value="athletes">🏃 {t('athletes')}</option>
                      <option value="commuters">🚗 {t('commuters')}</option>
                      <option value="animals_livestock">🐾 {t('animals_livestock')}</option>
                      <option value="outdoor_workers">👷 {t('outdoor_workers')}</option>
                      <option value="drivers">🚘 {t('drivers')}</option>
                    </select>
                  </div>
                  
                  <div className="precautions-list">
                    {weatherPrecautions[selectedUserGroup] ? (
                      weatherPrecautions[selectedUserGroup].map((precaution, index) => (
                        <div key={index} className="precaution-item">
                          <span className="precaution-icon">💡</span>
                          <span className="precaution-text">{precaution}</span>
                        </div>
                      ))
                    ) : (
                      <div className="no-precautions">
                        <span className="precaution-icon">✅</span>
                        <span className="precaution-text">{t('precautions.noAdvice')}</span>
                      </div>
                    )}
                  </div>
                  
                  {Object.keys(weatherPrecautions).length > 0 && (
                    <div className="precautions-summary">
                      <h4>📊 {t('weather_summary')}</h4>
                      <div className="summary-grid">
                        <div className="summary-item">
                          <span className="summary-label">{t('temperature')}:</span>
                          <span className="summary-value">{weatherData.temperature}°C</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">{t('condition')}:</span>
                          <span className="summary-value">{weatherData.condition}</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">{t('humidity')}:</span>
                          <span className="summary-value">{weatherData.humidity}%</span>
                        </div>
                        <div className="summary-item">
                          <span className="summary-label">{t('wind_speed')}:</span>
                          <span className="summary-value">{weatherData.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                  )}
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