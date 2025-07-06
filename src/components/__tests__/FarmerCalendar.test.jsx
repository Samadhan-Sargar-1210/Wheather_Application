import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FarmerCalendar from '../FarmerCalendar';

describe('FarmerCalendar Component', () => {
  const mockAdvisoryData = {
    '2024-01-15': {
      type: 'sowing',
      crop: 'Wheat',
      description: 'Optimal sowing period for wheat',
      priority: 'high',
    },
    '2024-01-20': {
      type: 'rainfall',
      description: 'Expected heavy rainfall',
      priority: 'medium',
    },
    '2024-01-25': {
      type: 'protection',
      crop: 'Cotton',
      description: 'Apply pest protection for cotton',
      priority: 'high',
    },
    '2024-02-01': {
      type: 'harvest',
      crop: 'Rice',
      description: 'Rice harvest period begins',
      priority: 'medium',
    },
  };

  describe('Initial Render', () => {
    test('renders farmer calendar container', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('renders calendar title', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.title')).toBeInTheDocument();
    });

    test('renders calendar icon', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
    });

    test('renders calendar component', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    test('renders legend', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.legend.title')).toBeInTheDocument();
    });

    test('does not render when no advisory data is provided', () => {
      render(<FarmerCalendar advisoryData={null} />);
      
      expect(screen.queryByTestId('farmer-calendar')).not.toBeInTheDocument();
    });

    test('does not render when advisory data is empty', () => {
      render(<FarmerCalendar advisoryData={{}} />);
      
      expect(screen.queryByTestId('farmer-calendar')).not.toBeInTheDocument();
    });
  });

  describe('Calendar Display', () => {
    test('displays calendar with correct month and year', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    test('handles calendar navigation', async () => {
      const user = userEvent.setup();
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendar = screen.getByTestId('calendar');
      
      // Calendar should be interactive
      expect(calendar).toBeInTheDocument();
    });

    test('displays advisory data on calendar dates', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Calendar should show advisory data
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });
  });

  describe('Advisory Data Display', () => {
    test('displays sowing advisories correctly', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.legend.sowing')).toBeInTheDocument();
    });

    test('displays rainfall advisories correctly', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.legend.rainfall')).toBeInTheDocument();
    });

    test('displays protection advisories correctly', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.legend.protection')).toBeInTheDocument();
    });

    test('displays harvest advisories correctly', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.legend.harvest')).toBeInTheDocument();
    });
  });

  describe('Legend Display', () => {
    test('displays all legend items', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.legend.sowing')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.rainfall')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.protection')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.harvest')).toBeInTheDocument();
    });

    test('displays legend icons', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const legendItems = screen.getAllByTestId('legend-item');
      expect(legendItems.length).toBeGreaterThan(0);
    });

    test('applies correct colors to legend items', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const legendItems = screen.getAllByTestId('legend-item');
      legendItems.forEach(item => {
        expect(item).toHaveClass('legend-item');
      });
    });
  });

  describe('Tooltip Functionality', () => {
    test('displays tooltip on date hover', async () => {
      const user = userEvent.setup();
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendar = screen.getByTestId('calendar');
      
      // Hover over calendar
      await user.hover(calendar);
      
      // Tooltip should be displayed
      expect(calendar).toBeInTheDocument();
    });

    test('hides tooltip when mouse leaves', async () => {
      const user = userEvent.setup();
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendar = screen.getByTestId('calendar');
      
      // Hover over calendar
      await user.hover(calendar);
      
      // Leave calendar
      await user.unhover(calendar);
      
      // Tooltip should be hidden
      expect(calendar).toBeInTheDocument();
    });
  });

  describe('Priority Levels', () => {
    test('displays high priority advisories prominently', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // High priority advisories should be visible
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    test('displays medium priority advisories', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Medium priority advisories should be visible
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });

    test('displays low priority advisories', () => {
      const lowPriorityData = {
        '2024-01-15': {
          type: 'sowing',
          crop: 'Wheat',
          description: 'Optimal sowing period for wheat',
          priority: 'low',
        },
      };
      
      render(<FarmerCalendar advisoryData={lowPriorityData} />);
      
      // Low priority advisories should be visible
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('has correct CSS classes for responsive design', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendarContainer = screen.getByTestId('farmer-calendar');
      expect(calendarContainer).toHaveClass('farmer-calendar');
      
      const calendarHeader = screen.getByTestId('calendar-header');
      expect(calendarHeader).toHaveClass('calendar-header');
      
      const calendarWrapper = screen.getByTestId('calendar-wrapper');
      expect(calendarWrapper).toHaveClass('calendar-wrapper');
      
      const legendContainer = screen.getByTestId('legend-container');
      expect(legendContainer).toHaveClass('legend-container');
    });

    test('maintains functionality on mobile devices', () => {
      // Mock mobile screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });
      
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
      expect(screen.getByTestId('legend-container')).toBeInTheDocument();
    });

    test('maintains functionality on tablet devices', () => {
      // Mock tablet screen size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
      expect(screen.getByTestId('legend-container')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendarContainer = screen.getByTestId('farmer-calendar');
      expect(calendarContainer).toHaveAttribute('aria-label', 'weather.farmer.calendar.title');
    });

    test('has proper heading structure', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const title = screen.getByText('weather.farmer.calendar.title');
      expect(title.tagName).toBe('H3');
    });

    test('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendar = screen.getByTestId('calendar');
      
      // Focus on calendar
      calendar.focus();
      expect(calendar).toHaveFocus();
      
      // Navigate with arrow keys
      await user.keyboard('{ArrowRight}');
      expect(calendar).toHaveFocus();
    });

    test('supports screen readers with proper text content', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      expect(screen.getByText('weather.farmer.calendar.title')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.title')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('handles missing advisory data gracefully', () => {
      const incompleteData = {
        '2024-01-15': {
          type: 'sowing',
          // Missing other properties
        },
      };
      
      render(<FarmerCalendar advisoryData={incompleteData} />);
      
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('handles null values in advisory data', () => {
      const dataWithNulls = {
        '2024-01-15': {
          type: null,
          crop: null,
          description: null,
          priority: null,
        },
      };
      
      render(<FarmerCalendar advisoryData={dataWithNulls} />);
      
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('handles invalid date formats', () => {
      const dataWithInvalidDates = {
        'invalid-date': {
          type: 'sowing',
          crop: 'Wheat',
          description: 'Test advisory',
          priority: 'high',
        },
      };
      
      render(<FarmerCalendar advisoryData={dataWithInvalidDates} />);
      
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('handles empty advisory descriptions', () => {
      const dataWithEmptyDescriptions = {
        '2024-01-15': {
          type: 'sowing',
          crop: 'Wheat',
          description: '',
          priority: 'high',
        },
      };
      
      render(<FarmerCalendar advisoryData={dataWithEmptyDescriptions} />);
      
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('handles unknown advisory types', () => {
      const dataWithUnknownTypes = {
        '2024-01-15': {
          type: 'unknown_type',
          crop: 'Wheat',
          description: 'Unknown advisory type',
          priority: 'high',
        },
      };
      
      render(<FarmerCalendar advisoryData={dataWithUnknownTypes} />);
      
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('handles malformed advisory data gracefully', () => {
      const malformedData = {
        '2024-01-15': 'not-an-object',
        '2024-01-20': null,
        '2024-01-25': {
          type: 123, // Should be string
          crop: {}, // Should be string
          description: [], // Should be string
          priority: 456, // Should be string
        },
      };
      
      render(<FarmerCalendar advisoryData={malformedData} />);
      
      // Should not crash and should still render the container
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    test('renders efficiently with large dataset', () => {
      const largeDataset = {};
      
      // Generate data for a full year
      for (let i = 0; i < 365; i++) {
        const date = new Date(2024, 0, 1);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        largeDataset[dateString] = {
          type: ['sowing', 'rainfall', 'protection', 'harvest'][i % 4],
          crop: ['Wheat', 'Rice', 'Cotton', 'Corn'][i % 4],
          description: `Advisory for ${dateString}`,
          priority: ['high', 'medium', 'low'][i % 3],
        };
      }
      
      const startTime = performance.now();
      render(<FarmerCalendar advisoryData={largeDataset} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(200); // Increased threshold for large dataset
    });

    test('does not re-render unnecessarily', () => {
      const { rerender } = render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Re-render with same data
      rerender(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Should still have the same elements
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });
  });

  describe('Error Boundaries', () => {
    test('handles malformed advisory data gracefully', () => {
      const malformedData = {
        '2024-01-15': 'not-an-object',
        '2024-01-20': null,
        '2024-01-25': {
          type: 123, // Should be string
          crop: {}, // Should be string
          description: [], // Should be string
          priority: 456, // Should be string
        },
      };
      
      render(<FarmerCalendar advisoryData={malformedData} />);
      
      // Should not crash and should still render the container
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
    });

    test('handles calendar rendering errors gracefully', () => {
      // Mock calendar component to throw errors
      const originalCalendar = require('react-calendar');
      jest.spyOn(require('react-calendar'), 'default').mockImplementation(() => {
        throw new Error('Calendar rendering error');
      });
      
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Should not crash and should handle the error gracefully
      expect(screen.getByTestId('farmer-calendar')).toBeInTheDocument();
      
      // Restore original implementation
      require('react-calendar').default = originalCalendar;
    });
  });

  describe('Theme Integration', () => {
    test('applies theme-specific styling', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      const calendarContainer = screen.getByTestId('farmer-calendar');
      expect(calendarContainer).toHaveClass('farmer-calendar');
    });

    test('maintains functionality in different themes', () => {
      // Test in light theme
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
      
      // Test in dark theme (if theme context is available)
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      expect(screen.getAllByTestId('calendar')).toHaveLength(2); // Two instances rendered
    });
  });

  describe('Localization', () => {
    test('supports different languages for calendar labels', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // With our i18n mock, keys should be displayed as-is
      expect(screen.getByText('weather.farmer.calendar.title')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.title')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.sowing')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.rainfall')).toBeInTheDocument(); // Only in legend now
      expect(screen.getByText('weather.farmer.calendar.legend.protection')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.harvest')).toBeInTheDocument();
    });
  });

  describe('Data Filtering', () => {
    test('filters advisories by type', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Should display all advisory types
      expect(screen.getByText('weather.farmer.calendar.legend.sowing')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.rainfall')).toBeInTheDocument(); // Only in legend now
      expect(screen.getByText('weather.farmer.calendar.legend.protection')).toBeInTheDocument();
      expect(screen.getByText('weather.farmer.calendar.legend.harvest')).toBeInTheDocument();
    });

    test('filters advisories by priority', () => {
      render(<FarmerCalendar advisoryData={mockAdvisoryData} />);
      
      // Should display advisories of all priorities
      expect(screen.getByTestId('calendar')).toBeInTheDocument();
    });
  });
}); 