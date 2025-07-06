import React, { useState, useCallback, useEffect } from 'react'
import './WeatherApp.css'
import { useTranslation } from 'react-i18next'
import { 
  getCurrentWeather, 
  fetchForecastData, 
  getWeatherCondition, 
  getWeatherIcon
} from '../services/weatherService'

const WeatherApp = () => {
  const { t, i18n } = useTranslation()
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [suggestions, setSuggestions] = useState([])

  // Basic city suggestions
  const COMMON_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad']
  const getSuggestions = useCallback((searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) return []
    const term = searchTerm.toLowerCase()
    return COMMON_CITIES.filter(city => city.toLowerCase().includes(term)).slice(0, 5)
  }, [])

  const handleCityChange = useCallback((e) => {
    const value = e.target.value
    setCity(value)
    setError('')
    setSuggestions(getSuggestions(value))
  }, [getSuggestions])

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion)
    setSuggestions([])
    fetchWeatherData(suggestion)
  }

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language)
    i18n.changeLanguage(language)
  }

  const fetchWeatherData = useCallback(async (cityName) => {
    setLoading(true)
    setError('')
    setWeatherData(null)
    setForecastData(null)
    try {
      const weather = await getCurrentWeather(cityName)
      setWeatherData(weather)
      if (weather && weather.lat && weather.lon) {
        try {
          const forecast = await fetchForecastData(weather.lat, weather.lon)
          setForecastData(forecast)
        } catch {}
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = useCallback(async (e) => {
    e.preventDefault()
    if (!city.trim()) return
    await fetchWeatherData(city.trim())
  }, [city, fetchWeatherData])

  return (
    <div className="weather-app">
      <div className="container">
        <header className="header">
          <h1 className="app-title">🌤️ {t('appTitle')}</h1>
          <p className="app-subtitle">{t('appSubtitle')}</p>
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
        <section className="search-section">
          <form onSubmit={handleSearch} className="search-container">
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                value={city}
                onChange={handleCityChange}
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
          </form>
        </section>
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">{t('loading.fetching')}</p>
          </div>
        )}
        {weatherData && !loading && (
          <div className="weather-grid">
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
              </div>
            </div>
            {forecastData && forecastData.length > 0 && (
              <div className="weather-card">
                <div className="card-header">
                  <h3>{t('forecast_title')}</h3>
                </div>
                <div className="weather-info">
                  {forecastData.map((day, idx) => (
                    <div key={idx} className="weather-item">
                      <div className="weather-label">{day.date.toLocaleDateString()}</div>
                      <div className="weather-value">{day.temp}°C {getWeatherIcon(day.condition)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WeatherApp 