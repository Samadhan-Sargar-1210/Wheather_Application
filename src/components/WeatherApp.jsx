import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import WeatherForecast from './WeatherForecast'
import WeatherIcon from './WeatherIcon'
import WeatherBackground from './WeatherBackground'
import AQIDisplay from './AQIDisplay'
import WeatherAlert from './WeatherAlert'
import { 
  getMockCurrentWeather, 
  getMockWeatherForecast,
  getCurrentLocation,
  getMockCurrentWeatherByCoords,
  getMockWeatherForecastByCoords,
  getMockAQIByCity,
  getMockAQIByCoords
} from '../services/weatherService'
import { 
  getMockWeatherAlerts,
  getMockWeatherAlertsByCoords
} from '../services/weatherAlerts'
import { 
  HumidityIcon, 
  WindIcon, 
  PressureIcon, 
  ThermometerIcon,
  FeelsLikeIcon 
} from './WeatherIcon'
import './WeatherApp.css'

import { getPrecautions, getUserGroupsForCondition } from '../utils/precautions'
import { validateCityName, validateUserGroup, validateWeatherCondition, rateLimiter } from '../utils/validation'
import useSpeechSynthesis from '../hooks/useSpeechSynthesis'
import { useTheme } from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'
import FiveDayForecastChart from './FiveDayForecastChart'
import FarmerCalendar from './FarmerCalendar'

const WeatherApp = () => {
  const { t, i18n } = useTranslation()
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [forecastLoading, setForecastLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUserGroup, setSelectedUserGroup] = useState('city_residents')
  const [aqiData, setAqiData] = useState(null)
  const [aqiLoading, setAqiLoading] = useState(false)
  const [weatherAlerts, setWeatherAlerts] = useState([])
  const [alertsLoading, setAlertsLoading] = useState(false)
  const { speak, stop, speaking } = useSpeechSynthesis()
  const { theme, isHighContrast, toggleTheme, toggleHighContrast, THEMES } = useTheme()

  const handleLanguageChange = (language) => {
    try {
      // Validate language code
      if (!['en', 'hi', 'mr', 'ta'].includes(language)) {
        throw new Error('Invalid language code');
      }
      i18n.changeLanguage(language)
    } catch (err) {
      console.error('Language change error:', err);
      setError(t('errors.invalidLanguage'));
    }
  }

  // Secure city input handling
  const handleCityChange = (e) => {
    try {
      const input = e.target.value;
      // Basic sanitization before validation
      const sanitized = input.replace(/[<>\"'&]/g, '').substring(0, 50);
      setCity(sanitized);
      
      // Clear error when user starts typing
      if (error) {
        setError('');
      }
    } catch (err) {
      console.error('City input error:', err);
      setError(t('errors.invalidInput'));
    }
  }

  const handleSearch = async () => {
    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed('search')) {
        setError(t('errors.rateLimitExceeded'));
        return;
      }

      // Validate city name
      const validatedCity = validateCityName(city);
      
      if (!validatedCity) {
        setError(t('errors.enterCity'))
        return
      }

      setLoading(true)
      setForecastLoading(true)
      setAqiLoading(true)
      setError('')
      setWeatherData(null)
      setForecastData(null)
      setAqiData(null)

      // Simulate different scenarios
      const cityLower = validatedCity.toLowerCase().trim()
      
      // Simulate "city not found" error for certain cities
      if (cityLower === 'invalidcity' || cityLower === 'nonexistent') {
        throw new Error('CITY_NOT_FOUND')
      }
      
      // Simulate network error for certain cities
      if (cityLower === 'networkerror') {
        throw new Error('NETWORK_ERROR')
      }
      
      // Fetch current weather, forecast, AQI, and alerts data
      const [currentWeather, forecast, aqi, alerts] = await Promise.all([
        getMockCurrentWeather(validatedCity),
        getMockWeatherForecast(validatedCity),
        getMockAQIByCity(validatedCity),
        getMockWeatherAlerts(validatedCity)
      ])
      
      setWeatherData(currentWeather)
      setForecastData(forecast)
      setAqiData(aqi)
      setWeatherAlerts(alerts)
    } catch (err) {
      if (err.message === 'CITY_NOT_FOUND') {
        setError(t('errors.cityNotFound', { city }))
      } else if (err.message === 'NETWORK_ERROR') {
        setError(t('errors.networkError'))
      } else if (err.message.includes('Invalid city name')) {
        setError(t('errors.invalidCityName'))
      } else if (err.message.includes('rate limit')) {
        setError(t('errors.rateLimitExceeded'))
      } else {
        setError(t('errors.general'))
      }
    } finally {
      setLoading(false)
      setForecastLoading(false)
      setAqiLoading(false)
      setAlertsLoading(false)
    }
  }

  const handleLocationWeather = async () => {
    try {
      // Rate limiting check
      if (!rateLimiter.isAllowed('location')) {
        setError(t('errors.rateLimitExceeded'));
        return;
      }

      setLocationLoading(true)
      setLoading(true)
      setForecastLoading(true)
      setAqiLoading(true)
      setError('')
      setWeatherData(null)
      setForecastData(null)
      setAqiData(null)
      setCity('')

      // Get user's current location
      const location = await getCurrentLocation()
      
      // Validate coordinates
      const { lat, lon } = location;
      if (typeof lat !== 'number' || typeof lon !== 'number' || 
          lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error('Invalid coordinates received');
      }
      
      // Fetch weather, AQI, and alerts data for the current location
      const [currentWeather, forecast, aqi, alerts] = await Promise.all([
        getMockCurrentWeatherByCoords(lat, lon),
        getMockWeatherForecastByCoords(lat, lon),
        getMockAQIByCoords(lat, lon),
        getMockWeatherAlertsByCoords(lat, lon)
      ])
      
      setWeatherData(currentWeather)
      setForecastData(forecast)
      setAqiData(aqi)
      setWeatherAlerts(alerts)
    } catch (err) {
      if (err.message.includes('Location access denied')) {
        setError(t('errors.locationDenied'))
      } else if (err.message.includes('Location information is unavailable')) {
        setError(t('errors.locationUnavailable'))
      } else if (err.message.includes('Location request timed out')) {
        setError(t('errors.locationTimeout'))
      } else if (err.message.includes('Geolocation is not supported')) {
        setError(t('errors.geolocationNotSupported'))
      } else if (err.message.includes('Invalid coordinates')) {
        setError(t('errors.invalidCoordinates'))
      } else {
        setError(t('errors.locationFailed'))
      }
    } finally {
      setLocationLoading(false)
      setLoading(false)
      setForecastLoading(false)
      setAqiLoading(false)
      setAlertsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setCity('')
      setError('')
    }
  }

  // Secure user group selection
  const handleUserGroupChange = (e) => {
    try {
      const group = e.target.value;
      const validatedGroup = validateUserGroup(group);
      setSelectedUserGroup(validatedGroup);
    } catch (err) {
      console.error('User group validation error:', err);
      setError(t('errors.invalidUserGroup'));
    }
  }

  useEffect(() => {
    // Clear error when city input changes
    if (error && city) {
      setError('')
    }
  }, [city, error])

  const getWeatherClass = () => {
    if (!weatherData) return 'weather-bg-default'
    const icon = weatherData.icon.toLowerCase()
    if (icon.includes('sun') || icon.includes('clear')) return 'weather-bg-sunny'
    if (icon.includes('cloud')) return 'weather-bg-cloudy'
    if (icon.includes('rain') || icon.includes('drizzle')) return 'weather-bg-rainy'
    if (icon.includes('snow')) return 'weather-bg-snow'
    if (icon.includes('storm') || icon.includes('thunder')) return 'weather-bg-storm'
    if (icon.includes('fog') || icon.includes('mist')) return 'weather-bg-foggy'
    return 'weather-bg-default'
  }

  // Determine the main weather condition for advice
  const getPrecautionWeatherKey = () => {
    if (!weatherData) return null
    const icon = weatherData.icon.toLowerCase()
    if (icon.includes('rain')) return 'rain'
    if (icon.includes('sun') || icon.includes('clear')) return 'sunny'
    if (icon.includes('cloud')) return 'rain' // treat cloudy as possible rain for advice
    if (icon.includes('snow')) return 'snow'
    if (icon.includes('storm') || icon.includes('thunder')) return 'storm'
    if (icon.includes('fog') || icon.includes('mist')) return 'fog'
    if (icon.includes('cold')) return 'cold'
    return null
  }

  const weatherKey = getPrecautionWeatherKey()
  const userGroups = weatherKey ? getUserGroupsForCondition(weatherKey) : []
  const precautions = weatherKey ? getPrecautions(weatherKey, selectedUserGroup) : []

  // Helper to build the speech text
  const getSpeechText = () => {
    if (!weatherData) return ''
    let text = `${t('app.title')}. `
    text += `${weatherData.city}. `
    text += `${t('weather.temperature')}: ${Math.round(weatherData.temperature)}°C. `
    text += `${t('weather.feelsLike', { temp: Math.round(weatherData.feelsLike) })}. `
    text += `${t('weather.humidity')}: ${weatherData.humidity}%. `
    text += `${t('weather.windSpeed')}: ${weatherData.windSpeed} km/h. `
    text += `${t('weather.pressure')}: ${weatherData.pressure} hPa. `
    if (precautions.length > 0) {
      text += `${t('precautions.title')}: `
      text += precautions.join('. ') + '.'
    }
    return text
  }

  return (
    <div className={`weather-app ${getWeatherClass()}`}>
      <WeatherBackground weatherType={weatherData?.icon || 'default'}>
        <div className="weather-app page-transition">
          <div className="weather-content">
            {/* Theme Toggle */}
            <ThemeToggle 
              theme={theme}
              isHighContrast={isHighContrast}
              toggleTheme={toggleTheme}
              toggleHighContrast={toggleHighContrast}
              THEMES={THEMES}
            />
            
            {/* Language Switcher */}
            <div className="language-switcher">
              <label htmlFor="language-select" className="sr-only">
                {t('language.selectLabel', 'Select language')}
              </label>
              <select 
                id="language-select"
                value={i18n.language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-select"
                aria-label={t('language.selectLabel', 'Select language')}
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="mr">मराठी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </div>
            
            <h1 className="weather-title">
              <span className="title-icon" role="img" aria-label="weather">🌤️</span>
              {t('app.title')}
            </h1>
            
            <div className="search-section">
              <div className="search-container">
                <div className="input-wrapper">
                  <label htmlFor="city-input" className="sr-only">
                    {t('search.inputLabel', 'Enter city name')}
                  </label>
                  <input
                    id="city-input"
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    onKeyPress={handleKeyPress}
                    placeholder={t('search.placeholder')}
                    className="city-input"
                    disabled={loading || locationLoading}
                    aria-describedby="search-help"
                    maxLength="50"
                    autoComplete="off"
                    spellCheck="false"
                  />
                  <div className="input-icon" role="img" aria-label="city">🏙️</div>
                </div>
                <div id="search-help" className="sr-only">
                  {t('search.helpText', 'Enter a city name to get weather information')}
                </div>
                <button 
                  onClick={handleSearch}
                  className="search-button"
                  disabled={loading || locationLoading || !city.trim()}
                  aria-label={t('search.button')}
                >
                  {loading ? (
                    <span className="button-content">
                      <div className="spinner-small" aria-hidden="true"></div>
                      <span>Searching...</span>
                    </span>
                  ) : (
                    <span className="button-content">
                      <span role="img" aria-label="search">🔍</span>
                      <span>{t('search.button')}</span>
                    </span>
                  )}
                </button>
              </div>

              <div className="location-container">
                <button 
                  onClick={handleLocationWeather}
                  className="location-button"
                  disabled={loading || locationLoading}
                  aria-label={t('location.button')}
                >
                  {locationLoading ? (
                    <span className="button-content">
                      <div className="spinner-small" aria-hidden="true"></div>
                      <span>Getting Location...</span>
                    </span>
                  ) : (
                    <span className="button-content">
                      <span role="img" aria-label="location">📍</span>
                      <span>{t('location.button')}</span>
                    </span>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="error-message" role="alert" aria-live="polite">
                <div className="error-icon" role="img" aria-label="warning">⚠️</div>
                <div className="error-text">{error}</div>
              </div>
            )}

            {/* Weather Alerts Section */}
            {weatherAlerts.length > 0 && (
              <div className="weather-alerts-section">
                <div className="alerts-header">
                  <span className="alerts-icon" role="img" aria-label="alert">🚨</span>
                  <span className="alerts-title">{t('alerts.title', 'Weather Alerts')}</span>
                  <span className="alerts-count">({weatherAlerts.length})</span>
                </div>
                <div className="alerts-container">
                  {weatherAlerts.map((alert) => (
                    <WeatherAlert
                      key={alert.id}
                      alert={alert}
                      onClose={() => setWeatherAlerts(prev => prev.filter(a => a.id !== alert.id))}
                    />
                  ))}
                </div>
              </div>
            )}

            {alertsLoading && (
              <div className="alerts-loading">
                <div className="spinner-small" aria-hidden="true"></div>
                <span>{t('alerts.loading', 'Checking for weather alerts...')}</span>
              </div>
            )}

            {loading && (
              <div className="loading-container">
                <div className="loading-spinner" aria-hidden="true"></div>
                <div className="loading-text">{t('loading.fetching')}</div>
              </div>
            )}

            {weatherData && (
              <div className="weather-container">
                <div className="weather-header">
                  <h2 className="city-name">{weatherData.city}</h2>
                  <div className="weather-icon-large">
                    <WeatherIcon 
                      iconCode={weatherData.icon} 
                      size="xlarge" 
                      animated={true}
                    />
                  </div>
                </div>
                <div className="weather-info">
                  <div className="temperature-section">
                    <div className="temperature">
                      {Math.round(weatherData.temperature)}°C
                    </div>
                    <div className="feels-like">
                      <FeelsLikeIcon size="small" />
                      <span>{t('weather.feelsLike', { temp: Math.round(weatherData.feelsLike) })}</span>
                    </div>
                  </div>
                  <div className="description">
                    {weatherData.description}
                  </div>
                  <div className="details">
                    <div className="detail-item">
                      <HumidityIcon size="medium" />
                      <span className="label">{t('weather.humidity')}</span>
                      <span className="value">{weatherData.humidity}%</span>
                    </div>
                    <div className="detail-item">
                      <WindIcon size="medium" />
                      <span className="label">{t('weather.windSpeed')}</span>
                      <span className="value">{weatherData.windSpeed} km/h</span>
                    </div>
                    <div className="detail-item">
                      <PressureIcon size="medium" />
                      <span className="label">{t('weather.pressure')}</span>
                      <span className="value">{weatherData.pressure} hPa</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Air Quality Index Section */}
            <AQIDisplay 
              aqiData={aqiData} 
              loading={aqiLoading} 
            />

            {weatherData && forecastData && (
              <FiveDayForecastChart forecastData={forecastData} loading={forecastLoading} />
            )}

            <WeatherForecast 
              forecastData={forecastData} 
              loading={forecastLoading} 
            />

            {/* Precautions Section */}
            {weatherKey && userGroups.length > 0 && (
              <div className="precautions-section">
                <div className="precautions-header">
                  <span role="img" aria-label="advice">💡</span>
                  <span className="precautions-title">{t('precautions.title')}</span>
                  <label htmlFor="user-group-select" className="sr-only">
                    {t('precautions.selectUserGroup', 'Select user group')}
                  </label>
                  <select
                    id="user-group-select"
                    className="precautions-usergroup-select"
                    value={selectedUserGroup}
                    onChange={handleUserGroupChange}
                    aria-label={t('precautions.selectUserGroup', 'Select user group')}
                  >
                    {userGroups.map(group => (
                      <option key={group} value={group}>
                        {group.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </option>
                    ))}
                  </select>
                </div>
                <ul className="precautions-list">
                  {precautions.length > 0 ? precautions.map((msg, i) => (
                    <li key={i} className="precaution-item">{msg}</li>
                  )) : (
                    <li className="precaution-item">{t('precautions.noAdvice')}</li>
                  )}
                </ul>
              </div>
            )}
            {selectedUserGroup === 'farmers' && (
              <FarmerCalendar />
            )}

            {/* Speak Button */}
            {weatherData && (
              <div className="voice-assistant-section">
                <button
                  className="speak-button"
                  onClick={() => speak(getSpeechText(), i18n.language)}
                  disabled={speaking}
                  aria-label={t('voice.speakButton')}
                >
                  <span role="img" aria-label="speaker">🔊</span> {t('voice.speakButton', 'Speak')}
                </button>
                {speaking && (
                  <button className="stop-speak-button" onClick={stop} aria-label={t('voice.stopButton')}>
                    {t('voice.stopButton', 'Stop')}
                  </button>
                )}
              </div>
            )}

            {!loading && !locationLoading && !weatherData && !error && (
              <div className="welcome-message">
                <div className="welcome-icon" role="img" aria-label="welcome">🌤️</div>
                <div className="welcome-text">
                  {t('welcome.message')}
                </div>
              </div>
            )}
          </div>
        </div>
      </WeatherBackground>
    </div>
  )
}

export default WeatherApp 