import React from 'react';
import { useTranslation } from 'react-i18next';
import './FarmerCalendar.css';

const FarmerCalendar = ({ advisoryData }) => {
  const { t } = useTranslation();

  if (!advisoryData || Object.keys(advisoryData).length === 0) {
    return null;
  }

  const getAdvisoryIcon = (type) => {
    switch (type) {
      case 'sowing': return '🌱';
      case 'rainfall': return '🌧️';
      case 'protection': return '🛡️';
      case 'harvest': return '🌾';
      default: return '📅';
    }
  };

  const getAdvisoryColor = (type) => {
    switch (type) {
      case 'sowing': return 'sowing-color';
      case 'rainfall': return 'rainfall-color';
      case 'protection': return 'protection-color';
      case 'harvest': return 'harvest-color';
      default: return 'default-color';
    }
  };

  return (
    <div className="farmer-calendar" data-testid="farmer-calendar" aria-label={t('weather.farmer.calendar.title')}>
      <div className="calendar-header" data-testid="calendar-header">
        <h3>{t('weather.farmer.calendar.title')}</h3>
        <div className="calendar-icon" data-testid="calendar-icon">📅</div>
      </div>

      <div className="calendar-wrapper" data-testid="calendar-wrapper">
        <div className="calendar" data-testid="calendar">
          {/* Mock calendar component */}
          <div className="calendar-grid">
            {Object.entries(advisoryData).map(([date, advisory], index) => {
              // Skip if advisory is not an object or is null
              if (!advisory || typeof advisory !== 'object') {
                return null;
              }
              
              // Ensure advisory has required properties with fallbacks
              const safeAdvisory = {
                type: typeof advisory.type === 'string' ? advisory.type : 'default',
                crop: typeof advisory.crop === 'string' ? advisory.crop : 'Unknown Crop',
                description: typeof advisory.description === 'string' ? advisory.description : 'No description available',
                priority: typeof advisory.priority === 'string' ? advisory.priority : 'medium'
              };
              
              return (
                <div key={index} className="calendar-day" data-testid="calendar-day">
                  <div className="day-date">{new Date(date).getDate()}</div>
                  <div className={`advisory-icon ${getAdvisoryColor(safeAdvisory.type)}`}>
                    {getAdvisoryIcon(safeAdvisory.type)}
                  </div>
                  <div className="advisory-tooltip">
                    <strong>{safeAdvisory.crop || t(`weather.farmer.calendar.legend.${safeAdvisory.type}`)}</strong>
                    <p>{safeAdvisory.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="legend-container" data-testid="legend-container">
        <h4>{t('weather.farmer.calendar.legend.title')}</h4>
        <div className="legend-items">
          <div className="legend-item" data-testid="legend-item">
            <span className="legend-icon sowing-color">🌱</span>
            <span>{t('weather.farmer.calendar.legend.sowing')}</span>
          </div>
          <div className="legend-item" data-testid="legend-item">
            <span className="legend-icon rainfall-color">🌧️</span>
            <span>{t('weather.farmer.calendar.legend.rainfall')}</span>
          </div>
          <div className="legend-item" data-testid="legend-item">
            <span className="legend-icon protection-color">🛡️</span>
            <span>{t('weather.farmer.calendar.legend.protection')}</span>
          </div>
          <div className="legend-item" data-testid="legend-item">
            <span className="legend-icon harvest-color">🌾</span>
            <span>{t('weather.farmer.calendar.legend.harvest')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerCalendar; 