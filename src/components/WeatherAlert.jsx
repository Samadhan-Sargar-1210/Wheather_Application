import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './WeatherAlert.css'

const WeatherAlert = ({ alerts, isLoading = false }) => {
  const { t } = useTranslation()
  const [expandedAlerts, setExpandedAlerts] = useState(new Set())

  if (isLoading) {
    return (
      <div className="weather-alerts-section" data-testid="weather-alerts">
        <div className="alerts-loading" data-testid="alerts-loading">
          <div className="loading-spinner"></div>
          <p>{t('weather.alerts.loading')}</p>
        </div>
      </div>
    )
  }

  if (!alerts || alerts.length === 0) {
    return null
  }

  const toggleAlert = (index) => {
    const newExpanded = new Set(expandedAlerts)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedAlerts(newExpanded)
  }

  const getSeverityClass = (severity) => {
    if (typeof severity !== 'string') return 'alert-moderate'
    switch (severity.toLowerCase()) {
      case 'minor': return 'alert-minor'
      case 'moderate': return 'alert-moderate'
      case 'severe': return 'alert-severe'
      case 'extreme': return 'alert-extreme'
      default: return 'alert-moderate'
    }
  }

  return (
    <div className="weather-alerts-section" data-testid="weather-alerts" aria-label={t('weather.alerts.title')}>
      <div className="alerts-header" data-testid="alerts-header">
        <h3>{t('weather.alerts.title')}</h3>
        <div className="alerts-icon" data-testid="alerts-icon">⚠️</div>
        <span className="alerts-count">{alerts.length}</span>
      </div>

      <div className="alerts-container" data-testid="alerts-container">
        {alerts.map((alert, index) => (
          <div 
            key={index} 
            className={`alert-banner ${getSeverityClass(alert.severity)}`} 
            data-testid="alert-banner"
          >
            <div className="alert-header">
              <h4 className="alert-event">{typeof alert.event === 'string' ? alert.event : 'Unknown Event'}</h4>
              <span className="alert-severity">{typeof alert.severity === 'string' ? alert.severity : 'Unknown'}</span>
            </div>
            
            <p className="alert-description">{typeof alert.description === 'string' ? alert.description : 'No description available'}</p>
            
            <div className="alert-tags">
              {Array.isArray(alert.tags) && alert.tags.map((tag, tagIndex) => (
                <span key={tagIndex} className="alert-tag">{typeof tag === 'string' ? tag : 'Unknown'}</span>
              ))}
            </div>
            
            <div className="alert-timing">
              <span>{t('weather.alerts.active_until')}</span>
              <span className="alert-date">{typeof alert.end === 'number' ? new Date(alert.end * 1000).toLocaleDateString() : 'Unknown'}</span>
            </div>
            
            <button 
              onClick={() => toggleAlert(index)}
              className="alert-toggle"
              aria-expanded={expandedAlerts.has(index)}
              data-testid={`expand-alert-btn-${index}`}
            >
              {t('weather.alerts.view_details')}
            </button>
            
            {expandedAlerts.has(index) && (
              <div className="alert-details">
                <h5>{t('weather.alerts.safety_recommendations')}</h5>
                <ul>
                  {Array.isArray(alert.safety_recommendations) && alert.safety_recommendations.map((rec, recIndex) => (
                    <li key={recIndex}>{typeof rec === 'string' ? rec : 'Unknown recommendation'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default WeatherAlert 