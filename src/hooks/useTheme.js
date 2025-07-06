import { useState, useEffect } from 'react'

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  HIGH_CONTRAST: 'high-contrast'
}

export function useTheme() {
  const [theme, setThemeState] = useState('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && ['light', 'dark', 'high-contrast'].includes(savedTheme)) {
      setThemeState(savedTheme)
    }
  }, [])

  const setTheme = (newTheme) => {
    if (['light', 'dark', 'high-contrast'].includes(newTheme)) {
      setThemeState(newTheme)
      try {
        localStorage.setItem('theme', newTheme)
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'high-contrast']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const isHighContrast = theme === THEMES.HIGH_CONTRAST

  const toggleHighContrast = () => {
    setTheme(prev => {
      if (prev === THEMES.LIGHT) return THEMES.DARK
      if (prev === THEMES.DARK) return THEMES.LIGHT
      return THEMES.LIGHT
    })
  }

  const setThemeMode = (newTheme) => {
    setTheme(newTheme)
  }

  return {
    theme,
    isHighContrast,
    toggleTheme,
    toggleHighContrast,
    setThemeMode,
    THEMES,
    setTheme
  }
} 