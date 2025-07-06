import React, { useState, useCallback } from 'react'
import './WeatherApp.css'

const WeatherApp = () => {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [aqiData, setAqiData] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedUserGroup, setSelectedUserGroup] = useState('city_residents')

  const handleCityChange = useCallback((e) => {
    setCity(e.target.value)
    if (error) setError('')
  }, [error])

  const handleSearch = useCallback(async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeatherData(null)
    setForecastData(null)
    setAqiData(null)
    setAlerts([])

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock current weather data
      const mockWeatherData = {
        city: city,
        temperature: Math.floor(Math.random() * 30) + 10,
        feelsLike: Math.floor(Math.random() * 30) + 8,
        condition: 'Sunny',
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        pressure: Math.floor(Math.random() * 50) + 1000,
        visibility: Math.floor(Math.random() * 10) + 5,
        description: 'Clear sky with sunshine',
        icon: '01d'
      }
      
      // Mock forecast data
      const mockForecastData = Array.from({ length: 5 }, (_, i) => ({
        date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString(),
        temp: Math.floor(Math.random() * 30) + 10,
        condition: ['Sunny', 'Cloudy', 'Rainy', 'Partly Cloudy'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        rainChance: Math.floor(Math.random() * 100)
      }))

      // Mock AQI data
      const mockAqiData = {
        aqi: Math.floor(Math.random() * 200) + 50,
        level: ['Good', 'Moderate', 'Poor'][Math.floor(Math.random() * 3)],
        pollutants: {
          pm25: Math.floor(Math.random() * 50) + 10,
          pm10: Math.floor(Math.random() * 100) + 20,
          no2: Math.floor(Math.random() * 50) + 10,
          o3: Math.floor(Math.random() * 100) + 30
        }
      }

      // Mock alerts
      const mockAlerts = Math.random() > 0.7 ? [{
        id: 1,
        type: 'Weather Alert',
        title: 'Heavy Rain Expected',
        description: 'Heavy rainfall expected in the next 24 hours',
        severity: 'Moderate'
      }] : []

      setWeatherData(mockWeatherData)
      setForecastData(mockForecastData)
      setAqiData(mockAqiData)
      setAlerts(mockAlerts)
    } catch (err) {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }, [city])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }, [handleSearch])

  const getAqiColor = (aqi) => {
    if (aqi <= 50) return '#00e400'
    if (aqi <= 100) return '#ffff00'
    if (aqi <= 150) return '#ff7e00'
    if (aqi <= 200) return '#ff0000'
    return '#8f3f97'
  }

  const getAqiLevel = (aqi) => {
    if (aqi <= 50) return 'Good'
    if (aqi <= 100) return 'Moderate'
    if (aqi <= 150) return 'Poor'
    if (aqi <= 200) return 'Very Poor'
    return 'Hazardous'
  }

  return (
    <div className="weather-app">
      <div className="container">
        <header className="app-header">
          <h1>🌤️ Weather App</h1>
          <p>Get real-time weather information for any city</p>
        </header>

        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              value={city}
              onChange={handleCityChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter city name..."
              className="city-input"
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="weather-display">
          {weatherData && (
            <>
              {/* Current Weather */}
              <div className="weather-card">
                <h2>{weatherData.city}</h2>
                <div className="weather-main">
                  <div className="temperature">
                    {weatherData.temperature}°C
                  </div>
                  <div className="feels-like">
                    Feels like {weatherData.feelsLike}°C
                  </div>
                  <div className="condition">
                    {weatherData.condition}
                  </div>
                </div>
                <div className="weather-details">
                  <div className="detail">
                    <span>Humidity:</span> {weatherData.humidity}%
                  </div>
                  <div className="detail">
                    <span>Wind:</span> {weatherData.windSpeed} km/h
                  </div>
                  <div className="detail">
                    <span>Pressure:</span> {weatherData.pressure} hPa
                  </div>
                  <div className="detail">
                    <span>Visibility:</span> {weatherData.visibility} km
                  </div>
                  <div className="description">
                    {weatherData.description}
                  </div>
                </div>
              </div>

              {/* Air Quality Index */}
              {aqiData && (
                <div className="aqi-card">
                  <h3>🌬️ Air Quality Index</h3>
                  <div className="aqi-main">
                    <div 
                      className="aqi-value"
                      style={{ color: getAqiColor(aqiData.aqi) }}
                    >
                      {aqiData.aqi}
                    </div>
                    <div className="aqi-level">
                      {getAqiLevel(aqiData.aqi)}
                    </div>
                  </div>
                  <div className="aqi-details">
                    <div className="pollutant">
                      <span>PM2.5:</span> {aqiData.pollutants.pm25} µg/m³
                    </div>
                    <div className="pollutant">
                      <span>PM10:</span> {aqiData.pollutants.pm10} µg/m³
                    </div>
                    <div className="pollutant">
                      <span>NO₂:</span> {aqiData.pollutants.no2} µg/m³
                    </div>
                    <div className="pollutant">
                      <span>O₃:</span> {aqiData.pollutants.o3} µg/m³
                    </div>
                  </div>
                </div>
              )}

              {/* Weather Alerts */}
              {alerts.length > 0 && (
                <div className="alerts-card">
                  <h3>🚨 Weather Alerts</h3>
                  {alerts.map(alert => (
                    <div key={alert.id} className="alert-item">
                      <div className="alert-title">{alert.title}</div>
                      <div className="alert-description">{alert.description}</div>
                      <div className="alert-severity">Severity: {alert.severity}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 5-Day Forecast */}
              {forecastData && (
                <div className="forecast-card">
                  <h3>📅 5-Day Forecast</h3>
                  <div className="forecast-grid">
                    {forecastData.map((day, index) => (
                      <div key={index} className="forecast-day">
                        <div className="forecast-date">{day.date}</div>
                        <div className="forecast-temp">{day.temp}°C</div>
                        <div className="forecast-condition">{day.condition}</div>
                        <div className="forecast-details">
                          <div>Humidity: {day.humidity}%</div>
                          <div>Wind: {day.windSpeed} km/h</div>
                          <div>Rain: {day.rainChance}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weather Precautions */}
              <div className="precautions-card">
                <h3>💡 Weather Precautions</h3>
                <div className="user-group-selector">
                  <label>Select your group:</label>
                  <select 
                    value={selectedUserGroup} 
                    onChange={(e) => setSelectedUserGroup(e.target.value)}
                  >
                    <option value="city_residents">City Residents</option>
                    <option value="children">Children</option>
                    <option value="farmers">Farmers</option>
                    <option value="animals">Animals</option>
                  </select>
                </div>
                <div className="precautions-list">
                  <div className="precaution-item">• Stay hydrated and avoid prolonged sun exposure</div>
                  <div className="precaution-item">• Wear appropriate clothing for the weather conditions</div>
                  <div className="precaution-item">• Check local weather updates regularly</div>
                  <div className="precaution-item">• Follow safety guidelines during extreme weather</div>
                </div>
              </div>
            </>
          )}

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading weather data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default WeatherApp 