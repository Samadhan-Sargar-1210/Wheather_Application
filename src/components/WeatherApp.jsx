import React, { useState, useCallback } from 'react'
import './WeatherApp.css'

const WeatherApp = () => {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockWeatherData = {
        city: city,
        temperature: Math.floor(Math.random() * 30) + 10,
        condition: 'Sunny',
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
        description: 'Clear sky with sunshine'
      }
      
      setWeatherData(mockWeatherData)
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
            <div className="weather-card">
              <h2>{weatherData.city}</h2>
              <div className="weather-main">
                <div className="temperature">
                  {weatherData.temperature}°C
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
                <div className="description">
                  {weatherData.description}
                </div>
              </div>
            </div>
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