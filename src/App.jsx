import React, { Suspense, lazy } from 'react'
import './App.css'

// Lazy load the main weather app component for better performance
const WeatherApp = lazy(() => import('./components/WeatherApp'))

// Loading component for better UX
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading BhoomiWeather...</p>
    </div>
  </div>
)

function App() {
  return (
    <div className="App">
      <Suspense fallback={<LoadingSpinner />}>
        <WeatherApp />
      </Suspense>
    </div>
  )
}

export default App 