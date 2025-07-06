import React from 'react'
import './WeatherBackground.css'

const WeatherBackground = ({ weatherCondition }) => {
  const getBackgroundClass = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'clear':
        return 'bg-clear'
      case 'clouds':
        return 'bg-clouds'
      case 'rain':
        return 'bg-rain'
      case 'drizzle':
        return 'bg-drizzle'
      case 'thunderstorm':
        return 'bg-thunderstorm'
      case 'snow':
        return 'bg-snow'
      case 'mist':
      case 'fog':
        return 'bg-fog'
      default:
        return 'bg-default'
    }
  }

  return (
    <div 
      className={`weather-background ${getBackgroundClass(weatherCondition)}`}
      data-testid="weather-background"
      aria-hidden="true"
    />
  )
}

export default WeatherBackground 