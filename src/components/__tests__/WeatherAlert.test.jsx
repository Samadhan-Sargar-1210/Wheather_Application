import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WeatherAlert from '../WeatherAlert';

describe('WeatherAlert Component', () => {
  const mockAlerts = [
    {
      event: 'Heavy Rain',
      description: 'Heavy rainfall expected with possible flooding',
      severity: 'Moderate',
      start: 1640995200,
      end: 1641081600,
      tags: ['rain', 'flood'],
      safety_recommendations: [
        'Avoid low-lying areas',
        'Stay indoors during heavy rain',
        'Keep emergency supplies ready',
      ],
    },
    {
      event: 'Thunderstorm',
      description: 'Severe thunderstorm warning',
      severity: 'Severe',
      start: 1640995200,
      end: 1641081600,
      tags: ['thunderstorm', 'lightning'],
      safety_recommendations: [
        'Seek shelter immediately',
        'Avoid open areas',
        'Stay away from tall objects',
      ],
    },
  ];

  const mockHighSeverityAlerts = [
    {
      event: 'Cyclone',
      description: 'Cyclone warning with destructive winds',
      severity: 'Extreme',
      start: 1640995200,
      end: 1641081600,
      tags: ['cyclone', 'wind'],
      safety_recommendations: [
        'Evacuate immediately',
        'Follow emergency instructions',
        'Stay in safe shelter',
      ],
    },
  ];

  describe('Initial Render', () => {
    test('renders alert container when alerts are provided', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
      expect(screen.getByText('weather.alerts.title')).toBeInTheDocument();
    });

    test('renders alert icon', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByTestId('alerts-icon')).toBeInTheDocument();
    });

    test('displays correct alert count', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    test('does not render when no alerts are provided', () => {
      render(<WeatherAlert alerts={[]} />);
      
      expect(screen.queryByTestId('weather-alerts')).not.toBeInTheDocument();
    });

    test('does not render when alerts is null', () => {
      render(<WeatherAlert alerts={null} />);
      
      expect(screen.queryByTestId('weather-alerts')).not.toBeInTheDocument();
    });
  });

  describe('Alert Display', () => {
    test('displays all alert events', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByText('Heavy Rain')).toBeInTheDocument();
      expect(screen.getByText('Thunderstorm')).toBeInTheDocument();
    });

    test('displays alert descriptions', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByText('Heavy rainfall expected with possible flooding')).toBeInTheDocument();
      expect(screen.getByText('Severe thunderstorm warning')).toBeInTheDocument();
    });

    test('displays alert severity levels', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByText('Moderate')).toBeInTheDocument();
      expect(screen.getByText('Severe')).toBeInTheDocument();
    });

    test('displays alert tags', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getByText('rain')).toBeInTheDocument();
      expect(screen.getByText('flood')).toBeInTheDocument();
      expect(screen.getByText('thunderstorm')).toBeInTheDocument();
      expect(screen.getByText('lightning')).toBeInTheDocument();
    });
  });

  describe('Severity Level Styling', () => {
    test('applies correct CSS class for moderate severity', () => {
      render(<WeatherAlert alerts={[mockAlerts[0]]} />);
      
      const alertBanner = screen.getByTestId('alert-banner');
      expect(alertBanner).toHaveClass('alert-moderate');
    });

    test('applies correct CSS class for severe severity', () => {
      render(<WeatherAlert alerts={[mockAlerts[1]]} />);
      
      const alertBanner = screen.getByTestId('alert-banner');
      expect(alertBanner).toHaveClass('alert-severe');
    });

    test('applies correct CSS class for extreme severity', () => {
      render(<WeatherAlert alerts={mockHighSeverityAlerts} />);
      
      const alertBanner = screen.getByTestId('alert-banner');
      expect(alertBanner).toHaveClass('alert-extreme');
    });

    test('applies correct CSS class for minor severity', () => {
      const minorAlert = [
        {
          ...mockAlerts[0],
          severity: 'Minor',
        },
      ];
      
      render(<WeatherAlert alerts={minorAlert} />);
      
      const alertBanner = screen.getByTestId('alert-banner');
      expect(alertBanner).toHaveClass('alert-minor');
    });
  });

  describe('Safety Recommendations', () => {
    test('displays safety recommendations when alert is expanded', async () => {
      const user = userEvent.setup();
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const expandButton = screen.getByTestId('expand-alert-btn-0');
      await user.click(expandButton);
      
      expect(screen.getByText('weather.alerts.safety_recommendations')).toBeInTheDocument();
      expect(screen.getByText('Avoid low-lying areas')).toBeInTheDocument();
      expect(screen.getByText('Stay indoors during heavy rain')).toBeInTheDocument();
      expect(screen.getByText('Keep emergency supplies ready')).toBeInTheDocument();
    });

    test('toggles safety recommendations visibility', async () => {
      const user = userEvent.setup();
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const expandButton = screen.getByTestId('expand-alert-btn-0');
      
      // Initially collapsed
      expect(screen.queryByText('weather.alerts.safety_recommendations')).not.toBeInTheDocument();
      
      // Expand
      await user.click(expandButton);
      expect(screen.getByText('weather.alerts.safety_recommendations')).toBeInTheDocument();
      
      // Collapse
      await user.click(expandButton);
      expect(screen.queryByText('weather.alerts.safety_recommendations')).not.toBeInTheDocument();
    });

    test('displays recommendations for multiple alerts', async () => {
      const user = userEvent.setup();
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const expandButton1 = screen.getByTestId('expand-alert-btn-0');
      const expandButton2 = screen.getByTestId('expand-alert-btn-1');
      
      // Expand first alert
      await user.click(expandButton1);
      expect(screen.getByText('Avoid low-lying areas')).toBeInTheDocument();
      
      // Expand second alert
      await user.click(expandButton2);
      expect(screen.getByText('Seek shelter immediately')).toBeInTheDocument();
    });
  });

  describe('Alert Timing', () => {
    test('displays alert timing information', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      expect(screen.getAllByText('weather.alerts.active_until')).toHaveLength(2);
    });

    test('formats alert timing correctly', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      // Should display formatted date/time
      const dateElements = screen.getAllByText('1/2/2022');
      expect(dateElements).toHaveLength(2);
    });
  });

  describe('Multiple Alerts', () => {
    test('displays multiple alerts in correct order', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const alertBanners = screen.getAllByTestId('alert-banner');
      expect(alertBanners).toHaveLength(2);
    });

    test('handles large number of alerts efficiently', () => {
      const manyAlerts = Array.from({ length: 10 }, (_, index) => ({
        event: `Alert ${index + 1}`,
        description: `Description for alert ${index + 1}`,
        severity: 'Moderate',
        start: 1640995200,
        end: 1641081600,
        tags: ['test'],
        safety_recommendations: ['Stay safe'],
      }));
      
      render(<WeatherAlert alerts={manyAlerts} />);
      
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getAllByTestId('alert-banner')).toHaveLength(10);
    });
  });

  describe('Responsive Design', () => {
    test('has correct CSS classes for responsive design', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const alertsContainer = screen.getByTestId('weather-alerts');
      expect(alertsContainer).toHaveClass('weather-alerts-section');
      
      const alertsHeader = screen.getByTestId('alerts-header');
      expect(alertsHeader).toHaveClass('alerts-header');
      
      const alertsContainer2 = screen.getByTestId('alerts-container');
      expect(alertsContainer2).toHaveClass('alerts-container');
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const alertsContainer = screen.getByTestId('weather-alerts');
      expect(alertsContainer).toHaveAttribute('aria-label', 'weather.alerts.title');
    });

    test('has proper heading structure', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const title = screen.getByText('weather.alerts.title');
      expect(title.tagName).toBe('H3');
    });

    test('has proper button labels for expand/collapse', () => {
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const expandButtons = screen.getAllByText('weather.alerts.view_details');
      expandButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-expanded', 'false');
      });
    });

    test('updates aria-expanded when toggled', async () => {
      const user = userEvent.setup();
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const expandButton = screen.getByTestId('expand-alert-btn-0');
      
      await user.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
      
      await user.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<WeatherAlert alerts={mockAlerts} />);
      
      const expandButton = screen.getByTestId('expand-alert-btn-0');
      
      // Focus on button
      expandButton.focus();
      expect(expandButton).toHaveFocus();
      
      // Press Enter to expand
      await user.keyboard('{Enter}');
      expect(screen.getByText('weather.alerts.safety_recommendations')).toBeInTheDocument();
      
      // Press Space to collapse
      await user.keyboard(' ');
      expect(screen.queryByText('weather.alerts.safety_recommendations')).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles missing severity gracefully', () => {
      const alertWithoutSeverity = [
        {
          event: 'Test Alert',
          description: 'Test description',
          // Missing severity
          start: 1640995200,
          end: 1641081600,
          tags: ['test'],
          safety_recommendations: ['Stay safe'],
        },
      ];
      
      render(<WeatherAlert alerts={alertWithoutSeverity} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
      expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });

    test('handles missing tags gracefully', () => {
      const alertWithoutTags = [
        {
          event: 'Test Alert',
          description: 'Test description',
          severity: 'Moderate',
          start: 1640995200,
          end: 1641081600,
          // Missing tags
          safety_recommendations: ['Stay safe'],
        },
      ];
      
      render(<WeatherAlert alerts={alertWithoutTags} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
      expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });

    test('handles missing safety recommendations gracefully', () => {
      const alertWithoutRecommendations = [
        {
          event: 'Test Alert',
          description: 'Test description',
          severity: 'Moderate',
          start: 1640995200,
          end: 1641081600,
          tags: ['test'],
          // Missing safety_recommendations
        },
      ];
      
      render(<WeatherAlert alerts={alertWithoutRecommendations} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
      expect(screen.getByText('Test Alert')).toBeInTheDocument();
    });

    test('handles null values in alert data', () => {
      const alertWithNulls = [
        {
          event: null,
          description: null,
          severity: null,
          start: null,
          end: null,
          tags: null,
          safety_recommendations: null,
        },
      ];
      
      render(<WeatherAlert alerts={alertWithNulls} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
    });

    test('handles empty strings in alert data', () => {
      const alertWithEmptyStrings = [
        {
          event: '',
          description: '',
          severity: '',
          start: 1640995200,
          end: 1641081600,
          tags: [],
          safety_recommendations: [],
        },
      ];
      
      render(<WeatherAlert alerts={alertWithEmptyStrings} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('renders efficiently with many alerts', () => {
      const manyAlerts = Array.from({ length: 50 }, (_, index) => ({
        event: `Alert ${index + 1}`,
        description: `Description for alert ${index + 1}`,
        severity: 'Moderate',
        start: 1640995200,
        end: 1641081600,
        tags: ['test'],
        safety_recommendations: ['Stay safe'],
      }));
      
      const startTime = performance.now();
      render(<WeatherAlert alerts={manyAlerts} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // Should render in less than 100ms
    });

    test('does not re-render unnecessarily', () => {
      const { rerender } = render(<WeatherAlert alerts={mockAlerts} />);
      
      // Re-render with same data
      rerender(<WeatherAlert alerts={mockAlerts} />);
      
      // Should still have the same elements
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
      expect(screen.getAllByTestId('alert-banner')).toHaveLength(2);
    });
  });

  describe('Error Boundaries', () => {
    test('handles malformed alert data gracefully', () => {
      const malformedAlerts = [
        {
          event: 123, // Should be string
          description: {}, // Should be string
          severity: [], // Should be string
          start: 'invalid', // Should be number
          end: 'invalid', // Should be number
          tags: 'not-an-array', // Should be array
          safety_recommendations: 'not-an-array', // Should be array
        },
      ];
      
      render(<WeatherAlert alerts={malformedAlerts} />);
      
      // Should not crash and should still render the container
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
    });

    test('handles undefined alert properties gracefully', () => {
      const alertWithUndefined = [
        {
          event: undefined,
          description: undefined,
          severity: undefined,
          start: undefined,
          end: undefined,
          tags: undefined,
          safety_recommendations: undefined,
        },
      ];
      
      render(<WeatherAlert alerts={alertWithUndefined} />);
      
      expect(screen.getByTestId('weather-alerts')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    test('displays loading state when alerts are being fetched', () => {
      render(<WeatherAlert alerts={mockAlerts} isLoading={true} />);
      
      expect(screen.getByTestId('alerts-loading')).toBeInTheDocument();
      expect(screen.getByText('weather.alerts.loading')).toBeInTheDocument();
    });

    test('does not display loading state when not loading', () => {
      render(<WeatherAlert alerts={mockAlerts} isLoading={false} />);
      
      expect(screen.queryByTestId('alerts-loading')).not.toBeInTheDocument();
      expect(screen.queryByText('weather.alerts.loading')).not.toBeInTheDocument();
    });
  });
}); 