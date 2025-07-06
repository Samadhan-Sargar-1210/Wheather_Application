# Weather App with React

A beautiful, modern weather application built with React, featuring dynamic weather backgrounds, animated weather icons, and a comprehensive dark/light theme system.

## 🌟 Features

### Core Weather Features
- **Current Weather Display**: Real-time temperature, humidity, wind speed, pressure, and visibility
- **7-Day Forecast**: Horizontal scrollable forecast cards with daily weather predictions
- **Location-Based Weather**: Get weather for your current location using browser geolocation
- **City Search**: Search for weather in any city worldwide
- **Weather Icons**: Animated weather icons that change based on conditions

### Theme System
- **Dark/Light Mode Toggle**: Beautiful animated toggle button in the top-right corner
- **System Theme Detection**: Automatically detects and follows your system theme preference
- **Theme Persistence**: Remembers your theme choice across browser sessions
- **Smooth Transitions**: Elegant animations when switching between themes
- **Weather-Based Backgrounds**: Dynamic backgrounds that adapt to both weather conditions and theme

### UI/UX Features
- **Glassmorphism Design**: Modern glass-like interface with backdrop blur effects
- **Responsive Design**: Fully responsive across all device sizes
- **Loading States**: Beautiful animated spinners and loading indicators
- **Error Handling**: User-friendly error messages with helpful suggestions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Reduced Motion Support**: Respects user's motion preferences

### Weather Backgrounds
- **Dynamic Effects**: Animated sun, clouds, rain, snow, lightning, and fog effects
- **Theme-Aware**: Background effects adjust colors based on light/dark theme
- **Performance Optimized**: Smooth animations that don't impact performance

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Wheather-App-with-React
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎨 Theme System

The app features a comprehensive theme system with the following capabilities:

### Theme Toggle
- Located in the top-right corner of the screen
- Animated toggle with sun/moon icons
- Smooth transitions between themes

### Theme Features
- **Automatic Detection**: Detects your system's theme preference on first visit
- **Manual Override**: Click the toggle to manually switch themes
- **Persistent Storage**: Your theme choice is saved in localStorage
- **System Sync**: Automatically updates when your system theme changes (if no manual preference is set)

### Theme Variables
The app uses CSS custom properties for consistent theming:
- `--bg-primary`: Main background color
- `--text-primary`: Primary text color
- `--accent-color`: Accent color for highlights
- `--glass-bg`: Glassmorphism background
- And many more for comprehensive theming

## 📱 Usage

### Searching for Weather
1. Enter a city name in the search input
2. Press Enter or click the Search button
3. View current weather and 7-day forecast

### Using Location Weather
1. Click the "Get My Location Weather" button
2. Allow location access when prompted
3. View weather for your current location

### Switching Themes
1. Click the theme toggle button in the top-right corner
2. The app will smoothly transition between light and dark themes
3. Your preference is automatically saved

## 🛠️ Technical Details

### Built With
- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and development server
- **CSS3**: Custom CSS with CSS variables for theming
- **React Icons**: Beautiful weather icons from react-icons/wi
- **Context API**: Theme management with React Context

### Project Structure
```
src/
├── components/
│   ├── WeatherApp.jsx          # Main app component
│   ├── WeatherForecast.jsx     # 7-day forecast component
│   ├── WeatherIcon.jsx         # Weather icon component
│   ├── WeatherBackground.jsx   # Animated background component
│   ├── ThemeToggle.jsx         # Theme toggle button
│   └── *.css                   # Component styles
├── context/
│   └── ThemeContext.jsx        # Theme management context
├── services/
│   └── weatherService.js       # Weather API service
├── App.jsx                     # Root app component
├── main.jsx                    # App entry point
└── index.css                   # Global styles
```

### Theme Context
The theme system is powered by a React Context that provides:
- `isDarkMode`: Current theme state
- `toggleTheme`: Function to switch themes
- Automatic localStorage persistence
- System theme detection

## 🎯 Features in Detail

### Weather Data
Currently uses mock data for demonstration. To integrate with real weather APIs:
1. Sign up for a weather API service (OpenWeatherMap, WeatherAPI, etc.)
2. Update the `weatherService.js` file with your API endpoints
3. Replace mock data calls with actual API requests

### Responsive Design
- **Desktop**: Full-featured layout with all elements visible
- **Tablet**: Optimized layout with adjusted spacing
- **Mobile**: Stacked layout with touch-friendly buttons

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Reduced Motion**: Respects user's motion preferences

## 🔧 Customization

### Adding New Weather Types
1. Add new weather conditions to the `getWeatherClass()` function
2. Create corresponding CSS classes in `index.css`
3. Add weather effects in `WeatherBackground.jsx`

### Customizing Themes
1. Modify CSS variables in `index.css`
2. Add new theme variants in the `[data-theme="..."]` selectors
3. Update theme context for additional theme options

### Styling Components
All components use CSS variables for theming. Modify the variables in `index.css` to customize:
- Colors and backgrounds
- Typography and spacing
- Animations and transitions
- Glassmorphism effects

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub. 