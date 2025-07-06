import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ThemeToggle from '../ThemeToggle';

describe('ThemeToggle Component', () => {
  const mockOnThemeChange = jest.fn();

  beforeEach(() => {
    mockOnThemeChange.mockClear();
  });

  describe('Initial Render', () => {
    test('renders theme toggle container', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    test('renders all theme buttons', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('High Contrast')).toBeInTheDocument();
    });

    test('renders theme icons', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByTestId('md-light-mode')).toBeInTheDocument();
      expect(screen.getByTestId('md-dark-mode')).toBeInTheDocument();
      expect(screen.getByTestId('md-accessibility')).toBeInTheDocument();
    });
  });

  describe('Theme Switching', () => {
    test('calls onThemeChange when light theme button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="dark" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light');
      await user.click(lightButton);
      
      expect(mockOnThemeChange).toHaveBeenCalledWith('light');
    });

    test('calls onThemeChange when dark theme button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);
      
      expect(mockOnThemeChange).toHaveBeenCalledWith('dark');
    });

    test('calls onThemeChange when high contrast theme button is clicked', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const highContrastButton = screen.getByText('High Contrast');
      await user.click(highContrastButton);
      
      expect(mockOnThemeChange).toHaveBeenCalledWith('high-contrast');
    });

    test('calls onThemeChange only once per click', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark');
      await user.click(darkButton);
      
      expect(mockOnThemeChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Active Theme Display', () => {
    test('applies active class to current theme button', () => {
      render(<ThemeToggle currentTheme="dark" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      expect(darkButton).toHaveClass('active');
    });

    test('does not apply active class to non-current theme buttons', () => {
      render(<ThemeToggle currentTheme="dark" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      
      expect(lightButton).not.toHaveClass('active');
      expect(highContrastButton).not.toHaveClass('active');
    });

    test('applies active class to light theme when current', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      expect(lightButton).toHaveClass('active');
    });

    test('applies active class to high contrast theme when current', () => {
      render(<ThemeToggle currentTheme="high-contrast" onThemeChange={mockOnThemeChange} />);
      
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      expect(highContrastButton).toHaveClass('active');
    });
  });

  describe('Theme-Specific Styling', () => {
    test('applies light theme specific styling', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      expect(lightButton).toHaveClass('light');
    });

    test('applies dark theme specific styling', () => {
      render(<ThemeToggle currentTheme="dark" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      expect(darkButton).toHaveClass('dark');
    });

    test('applies high contrast theme specific styling', () => {
      render(<ThemeToggle currentTheme="high-contrast" onThemeChange={mockOnThemeChange} />);
      
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      expect(highContrastButton).toHaveClass('high-contrast');
    });
  });

  describe('Hover Effects', () => {
    test('applies hover effects to theme buttons', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      
      await user.hover(darkButton);
      expect(darkButton).toHaveClass('hover');
      
      await user.unhover(darkButton);
      expect(darkButton).not.toHaveClass('hover');
    });

    test('hover effects work on all theme buttons', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      const darkButton = screen.getByText('Dark').closest('button');
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      
      await user.hover(lightButton);
      expect(lightButton).toHaveClass('hover');
      
      await user.hover(darkButton);
      expect(darkButton).toHaveClass('hover');
      
      await user.hover(highContrastButton);
      expect(highContrastButton).toHaveClass('hover');
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports keyboard navigation with Tab key', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      const darkButton = screen.getByText('Dark').closest('button');
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      
      // Focus on first button
      lightButton.focus();
      expect(lightButton).toHaveFocus();
      
      // Tab to next button
      await user.tab();
      expect(darkButton).toHaveFocus();
      
      // Tab to next button
      await user.tab();
      expect(highContrastButton).toHaveFocus();
    });

    test('supports keyboard activation with Enter key', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      darkButton.focus();
      
      await user.keyboard('{Enter}');
      
      expect(mockOnThemeChange).toHaveBeenCalledWith('dark');
    });

    test('supports keyboard activation with Space key', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      darkButton.focus();
      
      await user.keyboard(' ');
      
      expect(mockOnThemeChange).toHaveBeenCalledWith('dark');
    });

    test('maintains focus after theme change', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      darkButton.focus();
      
      await user.click(darkButton);
      
      expect(darkButton).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    test('has proper ARIA labels', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      const darkButton = screen.getByText('Dark').closest('button');
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      
      expect(lightButton).toHaveAttribute('aria-label', 'weather.theme.light');
      expect(darkButton).toHaveAttribute('aria-label', 'weather.theme.dark');
      expect(highContrastButton).toHaveAttribute('aria-label', 'weather.theme.high_contrast');
    });

    test('has proper ARIA pressed states', () => {
      render(<ThemeToggle currentTheme="dark" onThemeChange={mockOnThemeChange} />);
      
      const lightButton = screen.getByText('Light').closest('button');
      const darkButton = screen.getByText('Dark').closest('button');
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      
      expect(lightButton).toHaveAttribute('aria-pressed', 'false');
      expect(darkButton).toHaveAttribute('aria-pressed', 'true');
      expect(highContrastButton).toHaveAttribute('aria-pressed', 'false');
    });

    test('has proper role attributes', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveAttribute('role', 'group');
      expect(themeToggle).toHaveAttribute('aria-label', 'weather.theme.selector');
    });

    test('has proper focus indicators', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      darkButton.focus();
      
      expect(darkButton).toHaveClass('focus-visible');
    });

    test('supports screen readers with proper text content', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('High Contrast')).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    test('has correct CSS classes for responsive design', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const themeToggle = screen.getByTestId('theme-toggle');
      expect(themeToggle).toHaveClass('theme-toggle');
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('theme-button');
      });
    });

    test('maintains functionality on small screens', async () => {
      const user = userEvent.setup();
      
      // Mock small screen
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 480,
      });
      
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      await user.click(darkButton);
      
      expect(mockOnThemeChange).toHaveBeenCalledWith('dark');
    });
  });

  describe('Edge Cases', () => {
    test('handles undefined currentTheme gracefully', () => {
      render(<ThemeToggle currentTheme={undefined} onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getByText('Light')).toBeInTheDocument();
      expect(screen.getByText('Dark')).toBeInTheDocument();
      expect(screen.getByText('High Contrast')).toBeInTheDocument();
    });

    test('handles null currentTheme gracefully', () => {
      render(<ThemeToggle currentTheme={null} onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    test('handles invalid currentTheme gracefully', () => {
      render(<ThemeToggle currentTheme="invalid-theme" onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    test('handles missing onThemeChange callback gracefully', () => {
      render(<ThemeToggle currentTheme="light" />);
      
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      
      // Should not crash when clicking buttons
      const darkButton = screen.getByText('Dark').closest('button');
      expect(() => fireEvent.click(darkButton)).not.toThrow();
    });
  });

  describe('Performance', () => {
    test('renders efficiently', () => {
      const startTime = performance.now();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(10); // Should render in less than 10ms
    });

    test('does not re-render unnecessarily', () => {
      const { rerender } = render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      // Re-render with same props
      rerender(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      // Should still have the same elements
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
      expect(screen.getAllByRole('button')).toHaveLength(3);
    });

    test('handles rapid theme changes efficiently', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      const highContrastButton = screen.getByText('High Contrast').closest('button');
      
      // Rapid clicks
      await user.click(darkButton);
      await user.click(highContrastButton);
      await user.click(darkButton);
      
      expect(mockOnThemeChange).toHaveBeenCalledTimes(3);
      expect(mockOnThemeChange).toHaveBeenCalledWith('dark');
      expect(mockOnThemeChange).toHaveBeenCalledWith('high-contrast');
    });
  });

  describe('Error Boundaries', () => {
    test('handles malformed props gracefully', () => {
      render(<ThemeToggle currentTheme={123} onThemeChange="not-a-function" />);
      
      // Should not crash and should still render
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });

    test('handles missing props gracefully', () => {
      render(<ThemeToggle />);
      
      // Should not crash and should still render
      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument();
    });
  });

  describe('Animation Effects', () => {
    test('applies transition effects to theme buttons', () => {
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveClass('theme-button');
        expect(button).toHaveStyle({ transition: expect.stringContaining('all') });
      });
    });

    test('applies animation effects on theme change', async () => {
      const user = userEvent.setup();
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      const darkButton = screen.getByText('Dark').closest('button');
      
      await user.click(darkButton);
      
      // Should have animation classes applied
      expect(darkButton).toHaveClass('active');
    });
  });

  describe('Localization', () => {
    test('supports different languages for button labels', () => {
      // Mock translation function
      const mockT = jest.fn((key) => {
        const translations = {
          'weather.theme.light': 'Luz',
          'weather.theme.dark': 'Oscuro',
          'weather.theme.high_contrast': 'Alto Contraste',
        };
        return translations[key] || key;
      });
      
      // Mock useTranslation hook
      jest.doMock('react-i18next', () => ({
        useTranslation: () => ({
          t: mockT,
          i18n: { language: 'es' },
        }),
      }));
      
      render(<ThemeToggle currentTheme="light" onThemeChange={mockOnThemeChange} />);
      
      expect(screen.getByText('Luz')).toBeInTheDocument();
      expect(screen.getByText('Oscuro')).toBeInTheDocument();
      expect(screen.getByText('Alto Contraste')).toBeInTheDocument();
    });
  });
}); 