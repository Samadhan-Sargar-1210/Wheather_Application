import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Simple test component to see if React is working
const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1>🌤️ Weather App</h1>
      <p>Your weather application is loading...</p>
      <p>If you can see this, React is working!</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>,
) 