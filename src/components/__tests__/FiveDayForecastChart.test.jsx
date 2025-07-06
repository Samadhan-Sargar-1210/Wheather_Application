import React from 'react';
import { render, screen } from '@testing-library/react';
import FiveDayForecastChart from '../FiveDayForecastChart';

describe('FiveDayForecastChart Component', () => {
  const mockForecastData = [
    {
      dt: 1640995200,
      main: { temp: 25 },
      weather: [{ main: 'Clear' }],
      pop: 0.1,
    },
    {
      dt: 1641081600,
      main: { temp: 28 },
      weather: [{ main: 'Clouds' }],
      pop: 0.3,
    },
    {
      dt: 1641168000,
      main: { temp: 22 },
      weather: [{ main: 'Rain' }],
      pop: 0.8,
    },
    {
      dt: 1641254400,
      main: { temp: 20 },
      weather: [{ main: 'Snow' }],
      pop: 0.6,
    },
    {
      dt: 1641340800,
      main: { temp: 18 },
      weather: [{ main: 'Thunderstorm' }],
      pop: 0.9,
    },
  ];

  test('renders main chart container and composed chart', () => {
    render(<FiveDayForecastChart forecastData={mockForecastData} />);
    expect(screen.getByTestId('chart-container')).toBeInTheDocument();
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  test('handles missing weather data gracefully', () => {
    const dataWithoutWeather = [
      {
        dt: 1640995200,
        main: { temp: 25 },
        pop: 0.1,
      },
    ];
    render(<FiveDayForecastChart forecastData={dataWithoutWeather} />);
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });

  test('handles malformed data gracefully', () => {
    const malformedData = [
      {
        dt: 'invalid-timestamp',
        main: null,
        weather: 'not-an-array',
        pop: 'not-a-number',
      },
    ];
    render(<FiveDayForecastChart forecastData={malformedData} />);
    expect(screen.getByTestId('composed-chart')).toBeInTheDocument();
  });
}); 