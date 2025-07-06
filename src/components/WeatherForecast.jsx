import React from 'react'
import { useTranslation } from 'react-i18next'
import WeatherIcon from './WeatherIcon'
import FiveDayForecastChart from './FiveDayForecastChart'
import './WeatherForecast.css'

const WeatherForecast = ({ forecastData }) => {
  const { t } = useTranslation()

  if (!forecastData || forecastData.length === 0) {
    return null
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const formatTemperature = (temp) => {
    return Math.round(temp)
  }

  const formatRainChance = (pop) => {
    return Math.round(pop * 100)
  }

  return (
    <div className="weather-forecast" data-testid="weather-forecast">
      <div className="forecast-header">
        <div className="forecast-title">
          <h3>{t('weather.forecast.title')}</h3>
          <span className="forecast-subtitle">{forecastData.length} days</span>
        </div>
        <div className="forecast-icon" data-testid="forecast-icon">
          📅
        </div>
      </div>

      <div className="forecast-cards">
        {forecastData.slice(0, 5).map((day, index) => {
          const { day: dayName, date } = formatDate(day.dt)
          return (
            <div key={index} className="forecast-card" data-testid="forecast-card">
              <div className="forecast-date">
                <div className="forecast-day">{dayName}</div>
                <div className="forecast-date-num">{date}</div>
              </div>
              
              <div className="forecast-weather">
                <WeatherIcon condition={day.weather[0]?.main} size="medium" />
                <div className="forecast-temp">{formatTemperature(day.main?.temp)}°C</div>
                <div className="forecast-desc">{day.weather[0]?.description}</div>
              </div>
              
              <div className="forecast-details">
                <div className="forecast-humidity">{day.main?.humidity}%</div>
                <div className="forecast-wind">{day.wind?.speed} m/s</div>
                <div className="forecast-rain">{formatRainChance(day.pop)}%</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="chart-container" data-testid="chart-container">
        <FiveDayForecastChart forecastData={forecastData} />
      </div>
    </div>
  )
}

export default WeatherForecast 