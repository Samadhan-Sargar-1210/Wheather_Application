import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import './ThemeToggle.css'

const ThemeToggle = ({ currentTheme = 'light', onThemeChange }) => {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(null)
  const [focused, setFocused] = useState(null)

  const themes = [
    { key: 'light', labelKey: 'weather.theme.light.label', icon: '☀️', testid: 'md-light-mode', aria: 'weather.theme.light' },
    { key: 'dark', labelKey: 'weather.theme.dark.label', icon: '🌙', testid: 'md-dark-mode', aria: 'weather.theme.dark' },
    { key: 'high-contrast', labelKey: 'weather.theme.high-contrast.label', icon: '♿', testid: 'md-accessibility', aria: 'weather.theme.high_contrast' }
  ]

  return (
    <div className="theme-toggle" data-testid="theme-toggle" role="group" aria-label={"weather.theme.selector"}>
      {themes.map((theme) => (
        <button
          key={theme.key}
          onClick={() => onThemeChange?.(theme.key)}
          className={`theme-button ${theme.key} ${currentTheme === theme.key ? 'active' : ''} ${hovered === theme.key ? 'hover' : ''} ${focused === theme.key ? 'focus-visible' : ''}`}
          aria-label={theme.aria}
          aria-pressed={currentTheme === theme.key}
          onMouseEnter={() => setHovered(theme.key)}
          onMouseLeave={() => setHovered(null)}
          onFocus={() => setFocused(theme.key)}
          onBlur={() => setFocused(null)}
        >
          <span className="theme-icon" data-testid={theme.testid}>{theme.icon}</span>
          <span className="theme-label">{t(theme.labelKey)}</span>
        </button>
      ))}
    </div>
  )
}

export default ThemeToggle 