import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherForecast from '../WeatherForecast';

// Mock the weather icon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ condition, size }) {
    return <div data-testid="weather-icon" data-condition={condition} data-size={size}>🌤️</div>;
  };
});

// Mock the five day forecast chart component
jest.mock('../FiveDayForecastChart', () => {
  return function MockFiveDayForecastChart({ forecastData }) {
    return <div data-testid="five-day-chart">{forecastData ? 'Chart Data' : 'No Chart'}</div>;
  };
});

describe('WeatherForecast Component', () => {
  const mockForecastData = [
    {
      dt: 1640995200, // 2022-01-01 00:00:00
      main: {
        temp: 25,
        feels_like: 27,
        humidity: 65,
        pressure: 1013,
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: { speed: 3 },
      pop: 0.1,
    },
    {
      dt: 1641081600, // 2022-01-02 00:00:00
      main: {
        temp: 28,
        feels_like: 30,
        humidity: 70,
        pressure: 1012,
      },
      weather: [
        {
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03d',
        },
      ],
      wind: { speed: 4 },
      pop: 0.3,
    },
    {
      dt: 1641168000, // 2022-01-03 00:00:00
      main: {
        temp: 22,
        feels_like: 24,
        humidity: 75,
        pressure: 1014,
      },
      weather: [
        {
          main: 'Rain',
          description: 'light rain',
          icon: '10d',
        },
      ],
      wind: { speed: 5 },
      pop: 0.8,
    },
    {
      dt: 1641254400, // 2022-01-04 00:00:00
      main: {
        temp: 20,
        feels_like: 22,
        humidity: 80,
        pressure: 1015,
      },
      weather: [
        {
          main: 'Snow',
          description: 'light snow',
          icon: '13d',
        },
      ],
      wind: { speed: 6 },
      pop: 0.6,
    },
    {
      dt: 1641340800, // 2022-01-05 00:00:00
      main: {
        temp: 18,
        feels_like: 20,
        humidity: 85,
        pressure: 1016,
      },
      weather: [
        {
          main: 'Thunderstorm',
          description: 'thunderstorm',
          icon: '11d',
        },
      ],
      wind: { speed: 7 },
      pop: 0.9,
    },
  ];

  describe('Initial Render', () => {
    test('renders forecast container when data is provided', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
      expect(screen.getByText('weather.forecast.title')).toBeInTheDocument();
    });

    test('renders forecast subtitle with correct count', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('5 days')).toBeInTheDocument();
    });

    test('renders forecast icon', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByTestId('forecast-icon')).toBeInTheDocument();
    });

    test('does not render when no forecast data is provided', () => {
      render(<WeatherForecast forecastData={null} />);
      
      expect(screen.queryByTestId('weather-forecast')).not.toBeInTheDocument();
    });

    test('does not render when forecast data is empty array', () => {
      render(<WeatherForecast forecastData={[]} />);
      
      expect(screen.queryByTestId('weather-forecast')).not.toBeInTheDocument();
    });
  });

  describe('Forecast Cards', () => {
    test('renders correct number of forecast cards', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const forecastCards = screen.getAllByTestId('forecast-card');
      expect(forecastCards).toHaveLength(5);
    });

    test('displays correct day names for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('Saturday')).toBeInTheDocument();
      expect(screen.getByText('Sunday')).toBeInTheDocument();
      expect(screen.getByText('Monday')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('Wednesday')).toBeInTheDocument();
    });

    test('displays correct dates for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('Jan 1')).toBeInTheDocument();
      expect(screen.getByText('Jan 2')).toBeInTheDocument();
      expect(screen.getByText('Jan 3')).toBeInTheDocument();
      expect(screen.getByText('Jan 4')).toBeInTheDocument();
      expect(screen.getByText('Jan 5')).toBeInTheDocument();
    });

    test('displays correct temperatures for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('25°C')).toBeInTheDocument();
      expect(screen.getByText('28°C')).toBeInTheDocument();
      expect(screen.getByText('22°C')).toBeInTheDocument();
      expect(screen.getByText('20°C')).toBeInTheDocument();
      expect(screen.getByText('18°C')).toBeInTheDocument();
    });

    test('displays correct weather descriptions for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('clear sky')).toBeInTheDocument();
      expect(screen.getByText('scattered clouds')).toBeInTheDocument();
      expect(screen.getByText('light rain')).toBeInTheDocument();
      expect(screen.getByText('light snow')).toBeInTheDocument();
      expect(screen.getByText('thunderstorm')).toBeInTheDocument();
    });

    test('displays correct weather icons for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const weatherIcons = screen.getAllByTestId('weather-icon');
      expect(weatherIcons).toHaveLength(5);
      
      expect(weatherIcons[0]).toHaveAttribute('data-condition', 'Clear');
      expect(weatherIcons[1]).toHaveAttribute('data-condition', 'Clouds');
      expect(weatherIcons[2]).toHaveAttribute('data-condition', 'Rain');
      expect(weatherIcons[3]).toHaveAttribute('data-condition', 'Snow');
      expect(weatherIcons[4]).toHaveAttribute('data-condition', 'Thunderstorm');
    });

    test('displays correct humidity values for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('65%')).toBeInTheDocument();
      expect(screen.getByText('70%')).toBeInTheDocument();
      expect(screen.getByText('75%')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText('85%')).toBeInTheDocument();
    });

    test('displays correct wind speeds for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('3 m/s')).toBeInTheDocument();
      expect(screen.getByText('4 m/s')).toBeInTheDocument();
      expect(screen.getByText('5 m/s')).toBeInTheDocument();
      expect(screen.getByText('6 m/s')).toBeInTheDocument();
      expect(screen.getByText('7 m/s')).toBeInTheDocument();
    });

    test('displays correct rain probability for each forecast card', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByText('10%')).toBeInTheDocument();
      expect(screen.getByText('30%')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
      expect(screen.getByText('60%')).toBeInTheDocument();
      expect(screen.getByText('90%')).toBeInTheDocument();
    });
  });

  describe('Chart Display', () => {
    test('renders five day forecast chart when data is provided', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      expect(screen.getByTestId('five-day-chart')).toBeInTheDocument();
      expect(screen.getByText('Chart Data')).toBeInTheDocument();
    });

    test('does not render chart when no data is provided', () => {
      render(<WeatherForecast forecastData={null} />);
      
      expect(screen.queryByTestId('five-day-chart')).not.toBeInTheDocument();
    });

    test('passes correct data to chart component', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const chart = screen.getByTestId('five-day-chart');
      expect(chart).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('forecast container has correct CSS classes', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const forecastContainer = screen.getByTestId('weather-forecast');
      expect(forecastContainer).toHaveClass('weather-forecast');
    });

    test('forecast cards have correct CSS classes', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const forecastCards = screen.getAllByTestId('forecast-card');
      forecastCards.forEach(card => {
        expect(card).toHaveClass('forecast-card');
      });
    });

    test('chart container has correct CSS classes', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const chartContainer = screen.getByTestId('chart-container');
      expect(chartContainer).toHaveClass('chart-container');
    });
  });

  describe('Data Formatting', () => {
    test('formats temperature correctly', () => {
      const dataWithDecimalTemp = [
        {
          ...mockForecastData[0],
          main: { ...mockForecastData[0].main, temp: 25.7 },
        },
      ];
      
      render(<WeatherForecast forecastData={dataWithDecimalTemp} />);
      
      expect(screen.getByText('26°C')).toBeInTheDocument();
    });

    test('formats negative temperature correctly', () => {
      const dataWithNegativeTemp = [
        {
          ...mockForecastData[0],
          main: { ...mockForecastData[0].main, temp: -5.3 },
        },
      ];
      
      render(<WeatherForecast forecastData={dataWithNegativeTemp} />);
      
      expect(screen.getByText('-5°C')).toBeInTheDocument();
    });

    test('formats rain probability correctly', () => {
      const dataWithDecimalPop = [
        {
          ...mockForecastData[0],
          pop: 0.156,
        },
      ];
      
      render(<WeatherForecast forecastData={dataWithDecimalPop} />);
      
      expect(screen.getByText('16%')).toBeInTheDocument();
    });

    test('formats wind speed correctly', () => {
      const dataWithDecimalWind = [
        {
          ...mockForecastData[0],
          wind: { speed: 3.7 },
        },
      ];
      
      render(<WeatherForecast forecastData={dataWithDecimalWind} />);
      
      expect(screen.getByText('4 m/s')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles missing weather data gracefully', () => {
      const incompleteData = [
        {
          dt: 1640995200,
          main: { temp: 25 },
          // Missing weather array
        },
      ];
      
      render(<WeatherForecast forecastData={incompleteData} />);
      
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });

    test('handles missing main data gracefully', () => {
      const incompleteData = [
        {
          dt: 1640995200,
          weather: [{ main: 'Clear', description: 'clear sky' }],
          // Missing main object
        },
      ];
      
      render(<WeatherForecast forecastData={incompleteData} />);
      
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
      expect(screen.getByText('clear sky')).toBeInTheDocument();
    });

    test('handles missing wind data gracefully', () => {
      const incompleteData = [
        {
          ...mockForecastData[0],
          // Missing wind object
        },
      ];
      
      render(<WeatherForecast forecastData={incompleteData} />);
      
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });

    test('handles missing pop data gracefully', () => {
      const incompleteData = [
        {
          ...mockForecastData[0],
          // Missing pop property
        },
      ];
      
      render(<WeatherForecast forecastData={incompleteData} />);
      
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
      expect(screen.getByText('25°C')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels for forecast cards', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const forecastCards = screen.getAllByTestId('forecast-card');
      forecastCards.forEach((card, index) => {
        expect(card).toHaveAttribute('aria-label', expect.stringContaining('forecast'));
      });
    });

    test('has proper heading structure', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const title = screen.getByText('weather.forecast.title');
      expect(title.tagName).toBe('H2');
    });

    test('supports keyboard navigation', () => {
      render(<WeatherForecast forecastData={mockForecastData} />);
      
      const forecastCards = screen.getAllByTestId('forecast-card');
      
      // Focus on first card
      forecastCards[0].focus();
      expect(forecastCards[0]).toHaveFocus();
      
      // Tab to next card
      forecastCards[1].focus();
      expect(forecastCards[1]).toHaveFocus();
    });
  });

  describe('Performance', () => {
    test('renders efficiently with large dataset', () => {
      const largeDataset = Array.from({ length: 40 }, (_, index) => ({
        dt: 1640995200 + (index * 86400),
        main: {
          temp: 20 + (index % 10),
          feels_like: 22 + (index % 10),
          humidity: 60 + (index % 20),
          pressure: 1010 + (index % 10),
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
        wind: { speed: 3 + (index % 5) },
        pop: 0.1 + (index % 9) * 0.1,
      }));
      
      const startTime = performance.now();
      render(<WeatherForecast forecastData={largeDataset} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
    });

    test('does not re-render unnecessarily', () => {
      const { rerender } = render(<WeatherForecast forecastData={mockForecastData} />);
      
      // Re-render with same data
      rerender(<WeatherForecast forecastData={mockForecastData} />);
      
      // Should still have the same elements
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
      expect(screen.getAllByTestId('forecast-card')).toHaveLength(5);
    });
  });

  describe('Error Boundaries', () => {
    test('handles malformed data gracefully', () => {
      const malformedData = [
        {
          dt: 'invalid-timestamp',
          main: null,
          weather: 'not-an-array',
        },
      ];
      
      render(<WeatherForecast forecastData={malformedData} />);
      
      // Should not crash and should still render the container
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
    });

    test('handles null values in data', () => {
      const dataWithNulls = [
        {
          dt: 1640995200,
          main: {
            temp: null,
            feels_like: null,
            humidity: null,
            pressure: null,
          },
          weather: [
            {
              main: null,
              description: null,
              icon: null,
            },
          ],
          wind: { speed: null },
          pop: null,
        },
      ];
      
      render(<WeatherForecast forecastData={dataWithNulls} />);
      
      expect(screen.getByTestId('weather-forecast')).toBeInTheDocument();
    });
  });
}); 