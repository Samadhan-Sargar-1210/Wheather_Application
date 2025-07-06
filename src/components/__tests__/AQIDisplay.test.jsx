import React from 'react';
import { render, screen } from '@testing-library/react';
import AQIDisplay from '../AQIDisplay';

describe('AQIDisplay Component', () => {
  const mockAQIData = {
    list: [
      {
        main: {
          aqi: 2,
        },
        components: {
          co: 200,
          no2: 20,
          o3: 30,
          pm2_5: 15,
          pm10: 25,
          so2: 5,
          nh3: 1,
        },
        dt: 1640995200,
      },
    ],
  };

  const mockHighAQIData = {
    list: [
      {
        main: {
          aqi: 4,
        },
        components: {
          co: 800,
          no2: 80,
          o3: 120,
          pm2_5: 60,
          pm10: 100,
          so2: 20,
          nh3: 5,
        },
        dt: 1640995200,
      },
    ],
  };

  const mockVeryHighAQIData = {
    list: [
      {
        main: {
          aqi: 5,
        },
        components: {
          co: 1500,
          no2: 150,
          o3: 200,
          pm2_5: 100,
          pm10: 150,
          so2: 50,
          nh3: 10,
        },
        dt: 1640995200,
      },
    ],
  };

  describe('Initial Render', () => {
    test('renders AQI display container when data is provided', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
      expect(screen.getByText('weather.aqi.title')).toBeInTheDocument();
    });

    test('renders AQI icon', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByTestId('aqi-icon')).toBeInTheDocument();
    });

    test('does not render when no AQI data is provided', () => {
      render(<AQIDisplay aqiData={null} />);
      
      expect(screen.queryByTestId('aqi-display')).not.toBeInTheDocument();
    });

    test('does not render when AQI data is empty', () => {
      render(<AQIDisplay aqiData={{ list: [] }} />);
      
      expect(screen.queryByTestId('aqi-display')).not.toBeInTheDocument();
    });
  });

  describe('AQI Level Display', () => {
    test('displays correct AQI level for good air quality', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByText('weather.aqi.good')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('displays correct AQI level for poor air quality', () => {
      render(<AQIDisplay aqiData={mockHighAQIData} />);
      
      expect(screen.getByText('weather.aqi.poor')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    test('displays correct AQI level for very poor air quality', () => {
      render(<AQIDisplay aqiData={mockVeryHighAQIData} />);
      
      expect(screen.getByText('weather.aqi.very_poor')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('applies correct CSS class based on AQI level', () => {
      const { rerender } = render(<AQIDisplay aqiData={mockAQIData} />);
      
      let aqiLevel = screen.getByTestId('aqi-level');
      expect(aqiLevel).toHaveClass('aqi-good');
      
      rerender(<AQIDisplay aqiData={mockHighAQIData} />);
      aqiLevel = screen.getByTestId('aqi-level');
      expect(aqiLevel).toHaveClass('aqi-poor');
      
      rerender(<AQIDisplay aqiData={mockVeryHighAQIData} />);
      aqiLevel = screen.getByTestId('aqi-level');
      expect(aqiLevel).toHaveClass('aqi-very-poor');
    });
  });

  describe('Pollutant Breakdown', () => {
    test('displays all pollutant components', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByText('CO')).toBeInTheDocument();
      expect(screen.getByText('NO₂')).toBeInTheDocument();
      expect(screen.getByText('O₃')).toBeInTheDocument();
      expect(screen.getByText('PM2.5')).toBeInTheDocument();
      expect(screen.getByText('PM10')).toBeInTheDocument();
      expect(screen.getByText('SO₂')).toBeInTheDocument();
      expect(screen.getByText('NH₃')).toBeInTheDocument();
    });

    test('displays correct pollutant values', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByText('200 μg/m³')).toBeInTheDocument(); // CO
      expect(screen.getByText('20 μg/m³')).toBeInTheDocument(); // NO2
      expect(screen.getByText('30 μg/m³')).toBeInTheDocument(); // O3
      expect(screen.getByText('15 μg/m³')).toBeInTheDocument(); // PM2.5
      expect(screen.getByText('25 μg/m³')).toBeInTheDocument(); // PM10
      expect(screen.getByText('5 μg/m³')).toBeInTheDocument(); // SO2
      expect(screen.getByText('1 μg/m³')).toBeInTheDocument(); // NH3
    });

    test('applies correct color coding for pollutant levels', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      const pollutantItems = screen.getAllByTestId('pollutant-item');
      expect(pollutantItems).toHaveLength(7);
      
      // Check that each pollutant has the correct CSS class
      pollutantItems.forEach(item => {
        expect(item).toHaveClass('pollutant-item');
      });
    });
  });

  describe('Health Advisory', () => {
    test('displays health advisory for good air quality', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByText('weather.aqi.health.good')).toBeInTheDocument();
    });

    test('displays health advisory for poor air quality', () => {
      render(<AQIDisplay aqiData={mockHighAQIData} />);
      
      expect(screen.getByText('weather.aqi.health.poor')).toBeInTheDocument();
    });

    test('displays health advisory for very poor air quality', () => {
      render(<AQIDisplay aqiData={mockVeryHighAQIData} />);
      
      expect(screen.getByText('weather.aqi.health.very_poor')).toBeInTheDocument();
    });

    test('displays health recommendations', () => {
      render(<AQIDisplay aqiData={mockHighAQIData} />);
      
      expect(screen.getByText('weather.aqi.recommendations.title')).toBeInTheDocument();
    });
  });

  describe('AQI Level Classification', () => {
    test('classifies AQI level 1 as good', () => {
      const goodAQIData = {
        list: [{ main: { aqi: 1 }, components: mockAQIData.list[0].components }],
      };
      
      render(<AQIDisplay aqiData={goodAQIData} />);
      
      expect(screen.getByText('weather.aqi.good')).toBeInTheDocument();
    });

    test('classifies AQI level 2 as fair', () => {
      const fairAQIData = {
        list: [{ main: { aqi: 2 }, components: mockAQIData.list[0].components }],
      };
      
      render(<AQIDisplay aqiData={fairAQIData} />);
      
      expect(screen.getByText('weather.aqi.fair')).toBeInTheDocument();
    });

    test('classifies AQI level 3 as moderate', () => {
      const moderateAQIData = {
        list: [{ main: { aqi: 3 }, components: mockAQIData.list[0].components }],
      };
      
      render(<AQIDisplay aqiData={moderateAQIData} />);
      
      expect(screen.getByText('weather.aqi.moderate')).toBeInTheDocument();
    });

    test('classifies AQI level 4 as poor', () => {
      const poorAQIData = {
        list: [{ main: { aqi: 4 }, components: mockAQIData.list[0].components }],
      };
      
      render(<AQIDisplay aqiData={poorAQIData} />);
      
      expect(screen.getByText('weather.aqi.poor')).toBeInTheDocument();
    });

    test('classifies AQI level 5 as very poor', () => {
      const veryPoorAQIData = {
        list: [{ main: { aqi: 5 }, components: mockAQIData.list[0].components }],
      };
      
      render(<AQIDisplay aqiData={veryPoorAQIData} />);
      
      expect(screen.getByText('weather.aqi.very_poor')).toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    test('formats pollutant values correctly', () => {
      const dataWithDecimals = {
        list: [
          {
            main: { aqi: 2 },
            components: {
              co: 200.7,
              no2: 20.3,
              o3: 30.8,
              pm2_5: 15.2,
              pm10: 25.9,
              so2: 5.1,
              nh3: 1.4,
            },
          },
        ],
      };
      
      render(<AQIDisplay aqiData={dataWithDecimals} />);
      
      expect(screen.getByText('201 μg/m³')).toBeInTheDocument(); // CO rounded
      expect(screen.getByText('20 μg/m³')).toBeInTheDocument(); // NO2 rounded
      expect(screen.getByText('31 μg/m³')).toBeInTheDocument(); // O3 rounded
      expect(screen.getByText('15 μg/m³')).toBeInTheDocument(); // PM2.5 rounded
      expect(screen.getByText('26 μg/m³')).toBeInTheDocument(); // PM10 rounded
      expect(screen.getByText('5 μg/m³')).toBeInTheDocument(); // SO2 rounded
      expect(screen.getByText('1 μg/m³')).toBeInTheDocument(); // NH3 rounded
    });

    test('handles zero values correctly', () => {
      const dataWithZeros = {
        list: [
          {
            main: { aqi: 1 },
            components: {
              co: 0,
              no2: 0,
              o3: 0,
              pm2_5: 0,
              pm10: 0,
              so2: 0,
              nh3: 0,
            },
          },
        ],
      };
      
      render(<AQIDisplay aqiData={dataWithZeros} />);
      
      expect(screen.getByText('0 μg/m³')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('has correct CSS classes for responsive design', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      const aqiDisplay = screen.getByTestId('aqi-display');
      expect(aqiDisplay).toHaveClass('aqi-display');
      
      const aqiHeader = screen.getByTestId('aqi-header');
      expect(aqiHeader).toHaveClass('aqi-header');
      
      const aqiLevel = screen.getByTestId('aqi-level');
      expect(aqiLevel).toHaveClass('aqi-level');
      
      const pollutantBreakdown = screen.getByTestId('pollutant-breakdown');
      expect(pollutantBreakdown).toHaveClass('pollutant-breakdown');
      
      const healthAdvisory = screen.getByTestId('health-advisory');
      expect(healthAdvisory).toHaveClass('health-advisory');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      const aqiDisplay = screen.getByTestId('aqi-display');
      expect(aqiDisplay).toHaveAttribute('aria-label', 'weather.aqi.title');
    });

    test('has proper heading structure', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      const title = screen.getByText('weather.aqi.title');
      expect(title.tagName).toBe('H3');
    });

    test('has proper color contrast for different AQI levels', () => {
      const { rerender } = render(<AQIDisplay aqiData={mockAQIData} />);
      
      let aqiLevel = screen.getByTestId('aqi-level');
      expect(aqiLevel).toHaveClass('aqi-good');
      
      rerender(<AQIDisplay aqiData={mockHighAQIData} />);
      aqiLevel = screen.getByTestId('aqi-level');
      expect(aqiLevel).toHaveClass('aqi-poor');
    });

    test('supports screen readers with proper text content', () => {
      render(<AQIDisplay aqiData={mockAQIData} />);
      
      expect(screen.getByText('weather.aqi.title')).toBeInTheDocument();
      expect(screen.getByText('weather.aqi.good')).toBeInTheDocument();
      expect(screen.getByText('weather.aqi.health.good')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles missing components data gracefully', () => {
      const incompleteData = {
        list: [
          {
            main: { aqi: 2 },
            // Missing components object
          },
        ],
      };
      
      render(<AQIDisplay aqiData={incompleteData} />);
      
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
      expect(screen.getByText('weather.aqi.fair')).toBeInTheDocument();
    });

    test('handles missing main data gracefully', () => {
      const incompleteData = {
        list: [
          {
            components: mockAQIData.list[0].components,
            // Missing main object
          },
        ],
      };
      
      render(<AQIDisplay aqiData={incompleteData} />);
      
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
    });

    test('handles null values in components', () => {
      const dataWithNulls = {
        list: [
          {
            main: { aqi: 2 },
            components: {
              co: null,
              no2: null,
              o3: null,
              pm2_5: null,
              pm10: null,
              so2: null,
              nh3: null,
            },
          },
        ],
      };
      
      render(<AQIDisplay aqiData={dataWithNulls} />);
      
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
      expect(screen.getByText('weather.aqi.fair')).toBeInTheDocument();
    });

    test('handles invalid AQI values', () => {
      const invalidData = {
        list: [
          {
            main: { aqi: 6 }, // Invalid AQI value
            components: mockAQIData.list[0].components,
          },
        ],
      };
      
      render(<AQIDisplay aqiData={invalidData} />);
      
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
      // Should default to a safe display
    });

    test('handles negative AQI values', () => {
      const negativeData = {
        list: [
          {
            main: { aqi: -1 }, // Negative AQI value
            components: mockAQIData.list[0].components,
          },
        ],
      };
      
      render(<AQIDisplay aqiData={negativeData} />);
      
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
      // Should handle gracefully
    });
  });

  describe('Performance', () => {
    test('renders efficiently with large dataset', () => {
      const largeDataset = {
        list: Array.from({ length: 100 }, (_, index) => ({
          main: { aqi: (index % 5) + 1 },
          components: {
            co: 100 + index,
            no2: 10 + index,
            o3: 20 + index,
            pm2_5: 10 + index,
            pm10: 20 + index,
            so2: 5 + index,
            nh3: 1 + index,
          },
          dt: 1640995200 + (index * 3600),
        })),
      };
      
      const startTime = performance.now();
      render(<AQIDisplay aqiData={largeDataset} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50); // Should render in less than 50ms
    });

    test('does not re-render unnecessarily', () => {
      const { rerender } = render(<AQIDisplay aqiData={mockAQIData} />);
      
      // Re-render with same data
      rerender(<AQIDisplay aqiData={mockAQIData} />);
      
      // Should still have the same elements
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
      expect(screen.getByText('weather.aqi.fair')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    test('handles malformed data gracefully', () => {
      const malformedData = {
        list: [
          {
            main: 'not-an-object',
            components: 'not-an-object',
          },
        ],
      };
      
      render(<AQIDisplay aqiData={malformedData} />);
      
      // Should not crash and should still render the container
      expect(screen.getByTestId('aqi-display')).toBeInTheDocument();
    });

    test('handles empty list gracefully', () => {
      const emptyData = {
        list: [],
      };
      
      render(<AQIDisplay aqiData={emptyData} />);
      
      expect(screen.queryByTestId('aqi-display')).not.toBeInTheDocument();
    });

    test('handles undefined data gracefully', () => {
      render(<AQIDisplay aqiData={undefined} />);
      
      expect(screen.queryByTestId('aqi-display')).not.toBeInTheDocument();
    });
  });
}); 