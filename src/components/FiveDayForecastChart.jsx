import React from 'react'
import { useTranslation } from 'react-i18next'
import './FiveDayForecastChart.css'

const FiveDayForecastChart = ({ forecastData }) => {
  const { t } = useTranslation()

  if (!forecastData || forecastData.length === 0) {
    return null
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const chartData = forecastData.slice(0, 5).map((day, index) => ({
    date: formatDate(day.dt),
    temperature: Math.round(day.main?.temp || 0),
    rainChance: Math.round((day.pop || 0) * 100),
    condition: Array.isArray(day.weather) && day.weather.length > 0 ? day.weather[0]?.main || 'Clear' : 'Clear'
  }))

  return (
    <div className="chart-container" data-testid="chart-container" aria-label={t('weather.forecast.chart.title')}>
      <div className="chart-title" data-testid="chart-title">
        <h3>{t('weather.forecast.chart.title')}</h3>
        <div className="chart-icon" data-testid="chart-icon">📊</div>
      </div>

      <div className="chart-wrapper" data-testid="chart-wrapper">
        <div className="composed-chart" data-testid="composed-chart">
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color temp-color"></span>
              <span>{t('weather.forecast.chart.temperature')}</span>
            </div>
            <div className="legend-item">
              <span className="legend-color rain-color"></span>
              <span>{t('weather.forecast.chart.rain_chance')}</span>
            </div>
          </div>
          
          <div className="chart-bars">
            {chartData.map((data, index) => (
              <div key={index} className="chart-bar-group">
                <div className="chart-bar" style={{ height: `${data.rainChance}%` }}></div>
                <div className="chart-temp">{data.temperature}°C</div>
                <div className="chart-date">{data.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FiveDayForecastChart 