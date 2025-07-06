import React, { useState, useCallback, useEffect } from 'react'
import './WeatherApp.css'
import { useTranslation } from 'react-i18next'
import { 
  getCurrentWeather, 
  fetchForecastData, 
  getWeatherCondition, 
  getWeatherIcon,
  getCurrentLocation
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
      setLoading(true)
      setError('')

    try {
      console.log('Getting current location...')
      const location = await getCurrentLocation()
      console.log('Location obtained:', location)
      
      if (location) {
        setLocationData(location)
        await fetchWeatherData(location.name, location.lat, location.lon)
        setCity(location.name)
      }
    } catch (error) {
      console.error('Location error:', error)
      
      let errorMessage = 'Unable to get your location'
      
      if (error.code === 1) {
        errorMessage = t('errors.locationDenied')
      } else if (error.code === 2) {
        errorMessage = t('errors.locationUnavailable')
      } else if (error.code === 3) {
        errorMessage = t('errors.locationTimeout')
      } else if (error.message.includes('not supported')) {
        errorMessage = t('errors.geolocationNotSupported')
      } else {
        errorMessage = t('errors.locationFailed')
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [fetchWeatherData, t])

  // Mock data generation functions
  const generateMockAQI = () => {
    const aqi = Math.floor(Math.random() * 150) + 20
    return {
      aqi,
      level: getAqiLevel(aqi),
      color: getAqiColor(aqi),
      advice: getHealthAdvice(aqi),
      pollutants: {
        pm25: Math.floor(Math.random() * 50) + 10,
        pm10: Math.floor(Math.random() * 80) + 20,
        o3: Math.floor(Math.random() * 60) + 20,
        no2: Math.floor(Math.random() * 40) + 10
      }
    }
  }

  const generateMockAlerts = () => {
    const alertTypes = ['Heat Warning', 'Rain Alert', 'Wind Advisory', 'Fog Warning']
    const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
    
    return [{
      id: 1,
      type: randomAlert,
      severity: 'Moderate',
      description: `Weather alert for ${randomAlert.toLowerCase()}`,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    }]
  }

  const getBackgroundClass = () => {
    if (!weatherData) return 'weather-bg-default'
    
    const condition = weatherData.condition?.toLowerCase() || ''
    
    if (condition.includes('rain') || condition.includes('drizzle')) return 'weather-bg-rainy'
    if (condition.includes('snow') || condition.includes('ice')) return 'weather-bg-snowy'
    if (condition.includes('storm') || condition.includes('thunder')) return 'weather-bg-stormy'
    if (condition.includes('cloud') || condition.includes('fog')) return 'weather-bg-cloudy'
    if (condition.includes('clear') || condition.includes('sunny')) return 'weather-bg-sunny'
    
    return 'weather-bg-default'
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark-mode')
  }

  const speakWeather = () => {
    if (!weatherData || speaking) return
    
    setSpeaking(true)
    const text = `Current weather in ${weatherData.city}: ${weatherData.temperature} degrees Celsius, ${weatherData.condition}. Humidity is ${weatherData.humidity} percent.`
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      speechSynthesis.speak(utterance)
    } else {
      setSpeaking(false)
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getPrecautionsForCurrentGroup = () => {
    if (!weatherData) return []
    
    const precautions = weatherPrecautions[selectedUserGroup] || []
    return precautions.length > 0 ? precautions : [t('precautions.noAdvice')]
  }

  return (
    <div className={`weather-app ${getBackgroundClass()} ${darkMode ? 'dark-mode' : ''}`}>
      <div className="container">
        {/* Header */}
        <header className="header">
          <h1 className="app-title">🌤️ BhoomiWeather</h1>
          <p className="app-subtitle">Real-time Weather Information</p>
          
          <div className="language-selector">
              <select 
              value={selectedLanguage} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-select"
              >
              <option value="en">🇺🇸 English</option>
              <option value="hi">🇮🇳 हिंदी</option>
              <option value="mr">🇮🇳 मराठी</option>
              <option value="ta">🇮🇳 தமிழ்</option>
              </select>
            </div>
        </header>

        {/* Search Section */}
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    onKeyPress={handleKeyPress}
                    placeholder={t('search.placeholder')}
                    className="city-input"
                disabled={loading}
              />
              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="suggestion-item"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      📍 {suggestion}
                </div>
                  ))}
                </div>
              )}
            </div>
            
            <button type="submit" className="search-button" disabled={loading}>
              <div className="button-content">
                {loading ? '⏳' : '🔍'} {t('search.button')}
              </div>
            </button>

                <button 
              type="button" 
                  onClick={handleLocationWeather}
              className="search-button secondary" 
              disabled={loading}
            >
              <div className="button-content">
                📍 {t('location.button')}
              </div>
            </button>
          </form>
        </section>

        {/* Error Display */}
            {error && (
          <div className="error-message">
            ⚠️ {error}
              </div>
            )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">{t('loading.fetching')}</p>
                </div>
        )}

        {/* Weather Display */}
        {weatherData && !loading && (
          <div className="weather-grid">
            {/* Current Weather Card */}
            <div className="weather-card">
              <div className="card-header">
                <h3>
                  {getWeatherIcon(weatherData.condition)} {weatherData.city}
                </h3>
                <div className="temperature-display">
                  {Math.round(weatherData.temperature)}°C
                </div>
              </div>
              
              <div className="weather-info">
                <div className="weather-item">
                  <div className="weather-label">{t('feels_like')}</div>
                  <div className="weather-value">{Math.round(weatherData.feelsLike)}°C</div>
              </div>
                <div className="weather-item">
                  <div className="weather-label">{t('humidity')}</div>
                  <div className="weather-value">{weatherData.humidity}%</div>
              </div>
                <div className="weather-item">
                  <div className="weather-label">{t('wind_speed')}</div>
                  <div className="weather-value">{weatherData.windSpeed} km/h</div>
                </div>
                <div className="weather-item">
                  <div className="weather-label">{t('pressure')}</div>
                  <div className="weather-value">{weatherData.pressure} hPa</div>
                    </div>
                    </div>
                  </div>

            {/* Precautions Card */}
            <div className="weather-card">
              <div className="card-header">
                <h3>🛡️ {t('weather_precautions')}</h3>
                <div className="temperature-display">
                  {Math.round(weatherData.temperature)}°C
                </div>
              </div>
              
              <div className="precautions-content">
                <div className="user-group-selector">
                  <label htmlFor="user-group">{t('select_user_group')}</label>
                  <select
                    id="user-group"
                    value={selectedUserGroup}
                    onChange={(e) => setSelectedUserGroup(e.target.value)}
                    className="group-select"
                  >
                    <option value="city_residents">{t('city_residents')}</option>
                    <option value="farmers">{t('farmers')}</option>
                    <option value="small_children">{t('small_children')}</option>
                    <option value="animals_livestock">{t('animals_livestock')}</option>
                    <option value="commuters">{t('commuters')}</option>
                    <option value="elderly">{t('elderly')}</option>
                    <option value="athletes">{t('athletes')}</option>
                    <option value="outdoor_workers">{t('outdoor_workers')}</option>
                    <option value="drivers">{t('drivers')}</option>
                  </select>
                </div>
                
                <ul className="precautions-list">
                  {getPrecautionsForCurrentGroup().map((precaution, index) => (
                    <li key={index}>
                      <span className="precaution-icon">💡</span>
                      <span className="precaution-text">{precaution}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="precautions-summary">
                  <h4>{t('weather_summary')}</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">{t('temperature')}</span>
                      <span className="summary-value">{Math.round(weatherData.temperature)}°C</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('humidity')}</span>
                      <span className="summary-value">{weatherData.humidity}%</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('wind_speed')}</span>
                      <span className="summary-value">{weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">{t('condition')}</span>
                      <span className="summary-value">{weatherData.condition}</span>
              </div>
              </div>
                </div>
              </div>
                </div>
              </div>
            )}

        {/* Welcome Message */}
        {!weatherData && !loading && !error && (
          <div className="weather-card">
            <div className="card-header">
              <h3>🌤️ {t('appTitle')}</h3>
            </div>
            <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {t('welcome.message')}
            </p>
          </div>
        )}
        </div>
    </div>
  )
}

export default WeatherApp 