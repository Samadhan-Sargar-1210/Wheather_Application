import React from 'react'
import './WeatherIcon.css'

const WeatherIcon = ({ condition, size = 'medium' }) => {
  const getWeatherEmoji = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return '☀️';
      case 'clouds':
        return '☁️';
      case 'rain':
        return '🌧️';
      case 'drizzle':
        return '🌦️';
      case 'thunderstorm':
        return '⛈️';
      case 'snow':
        return '❄️';
      case 'mist':
      case 'fog':
        return '🌫️';
      case 'smoke':
        return '💨';
      case 'haze':
        return '🌫️';
      case 'dust':
      case 'sand':
        return '🌪️';
      case 'ash':
        return '🌋';
      case 'squall':
        return '💨';
      case 'tornado':
        return '🌪️';
      default:
        return '🌤️';
    }
  };

  const sizeClass = `weather-icon-${size}`;

  return (
    <div className={`weather-icon ${sizeClass}`} data-testid="weather-icon">
      {getWeatherEmoji(condition)}
    </div>
  );
};

// Individual icon components
const HumidityIcon = ({ size = 'medium' }) => (
  <div className={`weather-icon weather-icon-${size}`} data-testid="humidity-icon">
    💧
  </div>
);

const WindIcon = ({ size = 'medium' }) => (
  <div className={`weather-icon weather-icon-${size}`} data-testid="wind-icon">
    💨
  </div>
);

const PressureIcon = ({ size = 'medium' }) => (
  <div className={`weather-icon weather-icon-${size}`} data-testid="pressure-icon">
    📊
  </div>
);

const ThermometerIcon = ({ size = 'medium' }) => (
  <div className={`weather-icon weather-icon-${size}`} data-testid="thermometer-icon">
    🌡️
  </div>
);

const FeelsLikeIcon = ({ size = 'medium' }) => (
  <div className={`weather-icon weather-icon-${size}`} data-testid="feels-like-icon">
    🌡️
  </div>
);

export default WeatherIcon;
export { HumidityIcon, WindIcon, PressureIcon, ThermometerIcon, FeelsLikeIcon }; 