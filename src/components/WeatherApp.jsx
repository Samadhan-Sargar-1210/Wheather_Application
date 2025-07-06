import React from 'react'
import './WeatherApp.css'

const WeatherApp = () => {
  return (
    <div className="weather-app">
      <div className="container">
        <header className="header">
          <h1 className="app-title">🌤️ BhoomiWeather</h1>
          <p className="app-subtitle">Real-time Weather Information</p>
        </header>
        <section className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter city name..."
              className="city-input"
            />
            <button className="search-button">
              <div className="button-content">
                🔍 Search
              </div>
            </button>
          </div>
        </section>
        <div className="weather-card">
          <div className="card-header">
            <h3>🌤️ Test Weather</h3>
            <div className="temperature-display">
              25°C
            </div>
          </div>
          <div className="weather-info">
            <div className="weather-item">
              <div className="weather-label">Feels Like</div>
              <div className="weather-value">27°C</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Humidity</div>
              <div className="weather-value">65%</div>
            </div>
            <div className="weather-item">
              <div className="weather-label">Wind Speed</div>
              <div className="weather-value">12 km/h</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherApp 