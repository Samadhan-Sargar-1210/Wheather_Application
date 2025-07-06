import React from 'react'
import './App.css'
import WeatherApp from './components/WeatherApp'
import ErrorBoundary from './components/ErrorBoundary'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <div className="App">
          <ThemeToggle />
          <WeatherApp />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App 