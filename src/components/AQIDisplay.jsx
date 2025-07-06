import React from 'react'
import { useTranslation } from 'react-i18next'
import './AQIDisplay.css'

const AQIDisplay = ({ aqiData }) => {
  const { t } = useTranslation()
  
  if (!aqiData || !aqiData.list || aqiData.list.length === 0) {
    return null
  }

  const aqiInfo = aqiData.list[0]
  const aqiLevel = aqiInfo.main.aqi

  const getAQILevel = (aqi) => {
    if (aqi <= 1) return { level: 'good', text: t('weather.aqi.good'), health: t('weather.aqi.health.good') }
    if (aqi <= 2) return { level: 'fair', text: t('weather.aqi.fair'), health: t('weather.aqi.health.fair') }
    if (aqi <= 3) return { level: 'moderate', text: t('weather.aqi.moderate'), health: t('weather.aqi.health.moderate') }
    if (aqi <= 4) return { level: 'poor', text: t('weather.aqi.poor'), health: t('weather.aqi.health.poor') }
    return { level: 'very-poor', text: t('weather.aqi.very_poor'), health: t('weather.aqi.health.very_poor') }
  }

  const { level, text, health } = getAQILevel(aqiLevel)
  const components = aqiInfo.components || {}

  return (
    <div className="aqi-display" data-testid="aqi-display" aria-label={t('weather.aqi.title')}>
      <div className="aqi-header" data-testid="aqi-header">
        <h3>{t('weather.aqi.title')}</h3>
        <div className="aqi-icon" data-testid="aqi-icon">🌬️</div>
      </div>

      <div className={`aqi-level aqi-${level}`} data-testid="aqi-level">
        <span className="aqi-value">{aqiLevel}</span>
        <span className="aqi-text">{text}</span>
      </div>

      <div className="pollutant-breakdown" data-testid="pollutant-breakdown">
        <h4>{t('weather.aqi.pollutants.title')}</h4>
        <div className="pollutants-grid">
          {components.co && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">CO</span>
              <span className="pollutant-value">{Math.round(components.co)} μg/m³</span>
            </div>
          )}
          {components.no2 && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">NO₂</span>
              <span className="pollutant-value">{Math.round(components.no2)} μg/m³</span>
            </div>
          )}
          {components.o3 && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">O₃</span>
              <span className="pollutant-value">{Math.round(components.o3)} μg/m³</span>
            </div>
          )}
          {components.pm2_5 && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">PM2.5</span>
              <span className="pollutant-value">{Math.round(components.pm2_5)} μg/m³</span>
            </div>
          )}
          {components.pm10 && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">PM10</span>
              <span className="pollutant-value">{Math.round(components.pm10)} μg/m³</span>
            </div>
          )}
          {components.so2 && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">SO₂</span>
              <span className="pollutant-value">{Math.round(components.so2)} μg/m³</span>
            </div>
          )}
          {components.nh3 && (
            <div className="pollutant-item" data-testid="pollutant-item">
              <span className="pollutant-name">NH₃</span>
              <span className="pollutant-value">{Math.round(components.nh3)} μg/m³</span>
            </div>
          )}
        </div>
      </div>

      <div className="health-advisory" data-testid="health-advisory">
        <h4>{t('weather.aqi.health.title')}</h4>
        <p>{health}</p>
        <div className="recommendations">
          <h5>{t('weather.aqi.recommendations.title')}</h5>
          <ul>
            <li>{t('weather.aqi.recommendations.stay_indoors')}</li>
            <li>{t('weather.aqi.recommendations.avoid_exercise')}</li>
            <li>{t('weather.aqi.recommendations.use_mask')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AQIDisplay 