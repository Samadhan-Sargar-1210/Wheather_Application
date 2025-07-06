import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherApp from '../WeatherApp';
import { useTheme } from '../../hooks/useTheme';
import { useTranslation } from 'react-i18next';

// Mock the hooks
jest.mock('../../hooks/useTheme');
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

// Mock the weather service
jest.mock('../../services/weatherService', () => ({
  getWeatherData: jest.fn(),
  getForecastData: jest.fn(),
  getAQIData: jest.fn(),
  getWeatherAlerts: jest.fn(),
}));

// Mock the speech hook
jest.mock('../../hooks/useSpeech', () => ({
  __esModule: true,
  default: () => ({
    speak: jest.fn(),
    stop: jest.fn(),
    isSpeaking: false,
    isSupported: true,
  }),
}));

// Mock the precautions utility
jest.mock('../../utils/precautions', () => ({
  getPrecautions: jest.fn(() => [
    'Stay hydrated during hot weather',
    'Wear appropriate clothing',
  ]),
}));

// Mock the AQI display component
jest.mock('../AQIDisplay', () => {
  return function MockAQIDisplay({ aqiData }) {
    return <div data-testid="aqi-display">{aqiData ? 'AQI Data' : 'No AQI'}</div>;
  };
});

// Mock the weather forecast component
jest.mock('../WeatherForecast', () => {
  return function MockWeatherForecast({ forecastData }) {
    return <div data-testid="weather-forecast">{forecastData ? 'Forecast Data' : 'No Forecast'}</div>;
  };
});

// Mock the weather alert component
jest.mock('../WeatherAlert', () => {
  return function MockWeatherAlert({ alerts }) {
    return <div data-testid="weather-alerts">{alerts?.length ? `${alerts.length} Alerts` : 'No Alerts'}</div>;
  };
});

// Mock the farmer calendar component
jest.mock('../FarmerCalendar', () => {
  return function MockFarmerCalendar() {
    return <div data-testid="farmer-calendar">Farmer Calendar</div>;
  };
});

// Mock the five day forecast chart component
jest.mock('../FiveDayForecastChart', () => {
  return function MockFiveDayForecastChart({ forecastData }) {
    return <div data-testid="five-day-chart">{forecastData ? 'Chart Data' : 'No Chart'}</div>;
  };
});

// Mock the theme toggle component
jest.mock('../ThemeToggle', () => {
  return function MockThemeToggle({ currentTheme, onThemeChange }) {
    return (
      <div data-testid="theme-toggle">
        <button onClick={() => onThemeChange('light')}>Light</button>
        <button onClick={() => onThemeChange('dark')}>Dark</button>
        <button onClick={() => onThemeChange('high-contrast')}>High Contrast</button>
      </div>
    );
  };
});

// Mock the weather background component
jest.mock('../WeatherBackground', () => {
  return function MockWeatherBackground({ weatherCondition }) {
    return <div data-testid="weather-background">{weatherCondition}</div>;
  };
});

// Mock the weather icon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ condition, size }) {
    return <div data-testid="weather-icon" data-condition={condition} data-size={size}>🌤️</div>;
  };
});

describe('WeatherApp Component', () => {
  const mockUseTheme = {
    theme: 'light',
    setTheme: jest.fn(),
    toggleTheme: jest.fn(),
  };

  const mockUseTranslation = {
    t: jest.fn((key) => key),
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  };

  const mockWeatherData = {
    name: 'Mumbai',
    main: {
      temp: 30,
      feels_like: 32,
      humidity: 70,
      pressure: 1013,
    },
    weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
    wind: { speed: 5 },
    visibility: 10000,
    sys: { country: 'IN' },
  };

  const mockForecastData = [
    {
      dt: Date.now() / 1000,
      main: { temp: 30, humidity: 70 },
      weather: [{ main: 'Clear', description: 'clear sky' }],
      pop: 0.1,
    },
  ];

  const mockAQIData = {
    list: [{
      main: { aqi: 2 },
      components: {
        co: 200,
        no2: 20,
        o3: 30,
        pm2_5: 15,
        pm10: 25,
      },
    }],
  };

  beforeEach(() => {
    useTheme.mockReturnValue(mockUseTheme);
    useTranslation.mockReturnValue(mockUseTranslation);
    
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock successful API responses
    const { getWeatherData, getForecastData, getAQIData, getWeatherAlerts } = require('../../services/weatherService');
    getWeatherData.mockResolvedValue(mockWeatherData);
    getForecastData.mockResolvedValue(mockForecastData);
    getAQIData.mockResolvedValue(mockAQIData);
    getWeatherAlerts.mockResolvedValue([]);
  });

  describe('Initial Render', () => {
    test('renders welcome message when no weather data is available', () => {
      render(<WeatherApp />);
      
      expect(screen.getByText('weather.title')).toBeInTheDocument();
      expect(screen.getByText('weather.welcome.message')).toBeInTheDocument();
      expect(screen.getByTestId('weather-background')).toBeInTheDocument();
    });

    test('renders search input and buttons', () => {
      render(<WeatherApp />);
      
      expect(screen.getByPlaceholderText('weather.search.placeholder')).toBeInTheDocument();
      expect(screen.getByText('weather.search.button')).toBeInTheDocument();
      expect(screen.getByText('weather.location.button')).toBeInTheDocument();
    });

    test('renders language switcher', () => {
      render(<WeatherApp />);
      
      expect(screen.getByDisplayValue('en')).toBeInTheDocument();
    });

    test('renders theme toggle', () => {
      render(<WeatherApp />);
      
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });
  });

  describe('City Weather Search', () => {
    test('searches for weather when city is entered and search button is clicked', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Mumbai')).toBeInTheDocument();
        expect(screen.getByText('30°C')).toBeInTheDocument();
        expect(screen.getByText('clear sky')).toBeInTheDocument();
      });
    });

    test('searches for weather when Enter key is pressed', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      
      await user.type(searchInput, 'Mumbai{enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Mumbai')).toBeInTheDocument();
      });
    });

    test('displays loading state during search', async () => {
      const user = userEvent.setup();
      const { getWeatherData } = require('../../services/weatherService');
      
      // Mock delayed response
      getWeatherData.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockWeatherData), 100)));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      expect(screen.getByText('weather.loading.text')).toBeInTheDocument();
    });

    test('displays error message for invalid city', async () => {
      const user = userEvent.setup();
      const { getWeatherData } = require('../../services/weatherService');
      
      getWeatherData.mockRejectedValue(new Error('City not found'));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'InvalidCity');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.city_not_found')).toBeInTheDocument();
      });
    });

    test('displays error message for API failure', async () => {
      const user = userEvent.setup();
      const { getWeatherData } = require('../../services/weatherService');
      
      getWeatherData.mockRejectedValue(new Error('Network error'));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.network')).toBeInTheDocument();
      });
    });
  });

  describe('Geolocation Weather', () => {
    test('gets weather for current location when location button is clicked', async () => {
      const user = userEvent.setup();
      
      // Mock successful geolocation
      const mockPosition = {
        coords: { latitude: 19.076, longitude: 72.8777 },
      };
      
      navigator.geolocation.getCurrentPosition.mockImplementation((success) => {
        success(mockPosition);
      });
      
      render(<WeatherApp />);
      
      const locationButton = screen.getByText('weather.location.button');
      await user.click(locationButton);
      
      await waitFor(() => {
        expect(screen.getByText('Mumbai')).toBeInTheDocument();
      });
    });

    test('displays error when geolocation is denied', async () => {
      const user = userEvent.setup();
      
      navigator.geolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });
      
      render(<WeatherApp />);
      
      const locationButton = screen.getByText('weather.location.button');
      await user.click(locationButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.location_denied')).toBeInTheDocument();
      });
    });

    test('displays error when geolocation is unavailable', async () => {
      const user = userEvent.setup();
      
      navigator.geolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 2, message: 'Position unavailable' });
      });
      
      render(<WeatherApp />);
      
      const locationButton = screen.getByText('weather.location.button');
      await user.click(locationButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.location_unavailable')).toBeInTheDocument();
      });
    });
  });

  describe('Weather Data Display', () => {
    test('displays all weather information correctly', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('Mumbai')).toBeInTheDocument();
        expect(screen.getByText('30°C')).toBeInTheDocument();
        expect(screen.getByText('32°C')).toBeInTheDocument(); // feels like
        expect(screen.getByText('clear sky')).toBeInTheDocument();
        expect(screen.getByText('70%')).toBeInTheDocument(); // humidity
        expect(screen.getByText('5 m/s')).toBeInTheDocument(); // wind speed
        expect(screen.getByText('1013 hPa')).toBeInTheDocument(); // pressure
        expect(screen.getByText('10 km')).toBeInTheDocument(); // visibility
      });
    });

    test('displays weather icon with correct condition', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        const weatherIcon = screen.getByTestId('weather-icon');
        expect(weatherIcon).toBeInTheDocument();
        expect(weatherIcon).toHaveAttribute('data-condition', 'Clear');
        expect(weatherIcon).toHaveAttribute('data-size', 'large');
      });
    });
  });

  describe('Forecast Display', () => {
    test('displays 5-day forecast when weather data is loaded', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
        expect(screen.getByTestId('five-day-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Air Quality Index', () => {
    test('displays AQI information when available', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
        expect(screen.getByText('AQI Data')).toBeInTheDocument();
      });
    });

    test('handles AQI data errors gracefully', async () => {
      const user = userEvent.setup();
      const { getAQIData } = require('../../services/weatherService');
      
      getAQIData.mockRejectedValue(new Error('AQI API error'));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
        expect(screen.getByText('No AQI')).toBeInTheDocument();
      });
    });
  });

  describe('Precautions System', () => {
    test('displays precautions for different user groups', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.precautions.title')).toBeInTheDocument();
        expect(screen.getByText('Stay hydrated during hot weather')).toBeInTheDocument();
        expect(screen.getByText('Wear appropriate clothing')).toBeInTheDocument();
      });
    });

    test('changes precautions when user group is selected', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        const userGroupSelect = screen.getByDisplayValue('city_residents');
        expect(userGroupSelect).toBeInTheDocument();
      });
      
      // Change user group
      const userGroupSelect = screen.getByDisplayValue('city_residents');
      await user.selectOptions(userGroupSelect, 'farmers');
      
      await waitFor(() => {
        expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
      });
    });
  });

  describe('Language Switching', () => {
    test('changes language when language selector is used', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const languageSelect = screen.getByDisplayValue('en');
      await user.selectOptions(languageSelect, 'hi');
      
      expect(mockUseTranslation.i18n.changeLanguage).toHaveBeenCalledWith('hi');
    });

    test('displays translated content after language change', async () => {
      const user = userEvent.setup();
      const mockT = jest.fn((key) => {
        const translations = {
          'weather.title': 'मौसम ऐप',
          'weather.search.placeholder': 'शहर का नाम दर्ज करें',
          'weather.search.button': 'खोजें',
        };
        return translations[key] || key;
      });
      
      useTranslation.mockReturnValue({
        ...mockUseTranslation,
        t: mockT,
      });
      
      render(<WeatherApp />);
      
      expect(screen.getByText('मौसम ऐप')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('शहर का नाम दर्ज करें')).toBeInTheDocument();
      expect(screen.getByText('खोजें')).toBeInTheDocument();
    });
  });

  describe('Weather Alerts', () => {
    test('displays weather alerts when available', async () => {
      const user = userEvent.setup();
      const { getWeatherAlerts } = require('../../services/weatherService');
      
      const mockAlerts = [
        {
          event: 'Heavy Rain',
          description: 'Heavy rainfall expected',
          severity: 'Moderate',
        },
      ];
      
      getWeatherAlerts.mockResolvedValue(mockAlerts);
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
        expect(screen.getByText('1 Alerts')).toBeInTheDocument();
      });
    });

    test('handles no alerts gracefully', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
        expect(screen.getByText('No Alerts')).toBeInTheDocument();
      });
    });
  });

  describe('Voice Assistant', () => {
    test('renders voice assistant buttons', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.voice.speak')).toBeInTheDocument();
      });
    });

    test('speak button is disabled when no weather data', () => {
      render(<WeatherApp />);
      
      const speakButton = screen.getByText('weather.voice.speak');
      expect(speakButton).toBeDisabled();
    });

    test('speak button is enabled when weather data is available', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        const speakButton = screen.getByText('weather.voice.speak');
        expect(speakButton).not.toBeDisabled();
      });
    });
  });

  describe('Theme Toggle', () => {
    test('changes theme when theme buttons are clicked', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      const darkButton = themeToggle.querySelector('button:nth-child(2)');
      
      await user.click(darkButton);
      
      expect(mockUseTheme.setTheme).toHaveBeenCalledWith('dark');
    });

    test('applies correct theme class to app container', () => {
      useTheme.mockReturnValue({
        ...mockUseTheme,
        theme: 'dark',
      });
      
      render(<WeatherApp />);
      
      const appContainer = screen.getByTestId('weather-app');
      expect(appContainer).toHaveClass('weather-app');
    });
  });

  describe('Error Handling', () => {
    test('handles network errors gracefully', async () => {
      const user = userEvent.setup();
      const { getWeatherData } = require('../../services/weatherService');
      
      getWeatherData.mockRejectedValue(new Error('Network error'));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.network')).toBeInTheDocument();
      });
    });

    test('handles API rate limiting', async () => {
      const user = userEvent.setup();
      const { getWeatherData } = require('../../services/weatherService');
      
      getWeatherData.mockRejectedValue(new Error('Rate limit exceeded'));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.rate_limit')).toBeInTheDocument();
      });
    });

    test('handles invalid API key', async () => {
      const user = userEvent.setup();
      const { getWeatherData } = require('../../services/weatherService');
      
      getWeatherData.mockRejectedValue(new Error('Invalid API key'));
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      await user.type(searchInput, 'Mumbai');
      await user.click(searchButton);
      
      await waitFor(() => {
        expect(screen.getByText('weather.error.api_key')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      expect(searchInput).toHaveAttribute('aria-label', 'weather.search.placeholder');
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      
      // Focus on search input
      searchInput.focus();
      expect(searchInput).toHaveFocus();
      
      // Type and press Enter
      await user.type(searchInput, 'Mumbai{enter}');
      
      await waitFor(() => {
        expect(screen.getByText('Mumbai')).toBeInTheDocument();
      });
    });

    test('has proper focus management', () => {
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      const searchButton = screen.getByText('weather.search.button');
      
      // Tab through elements
      searchInput.focus();
      expect(searchInput).toHaveFocus();
      
      searchButton.focus();
      expect(searchButton).toHaveFocus();
    });
  });

  describe('Performance', () => {
    test('debounces search input', async () => {
      jest.useFakeTimers();
      const user = userEvent.setup({ delay: null });
      
      render(<WeatherApp />);
      
      const searchInput = screen.getByPlaceholderText('weather.search.placeholder');
      
      await user.type(searchInput, 'M');
      await user.type(searchInput, 'u');
      await user.type(searchInput, 'm');
      await user.type(searchInput, 'b');
      await user.type(searchInput, 'a');
      await user.type(searchInput, 'i');
      
      // Fast-forward timers
      act(() => {
        jest.runAllTimers();
      });
      
      const { getWeatherData } = require('../../services/weatherService');
      expect(getWeatherData).toHaveBeenCalledTimes(1);
      
      jest.useRealTimers();
    });
  });
}); 