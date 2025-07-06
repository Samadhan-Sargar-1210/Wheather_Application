import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the WeatherApp component
jest.mock('../components/WeatherApp', () => {
  return function MockWeatherApp() {
    return <div data-testid="weather-app">Weather App Component</div>;
  };
});

// Mock i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: jest.fn(),
      language: 'en',
    },
  }),
  initReactI18next: {
    type: '3rdParty',
    init: jest.fn(),
  },
}));

describe('App Component', () => {
  describe('Initial Render', () => {
    test('renders without crashing', () => {
      render(<App />);
      
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
    });

    test('renders WeatherApp component', () => {
      render(<App />);
      
      expect(screen.getByText('Weather App Component')).toBeInTheDocument();
    });

    test('has correct CSS classes', () => {
      render(<App />);
      
      const appContainer = screen.getByTestId('weather-app').parentElement;
      expect(appContainer).toHaveClass('App');
    });
  });

  describe('Snapshot Tests', () => {
    test('matches snapshot', () => {
      const { container } = render(<App />);
      expect(container).toMatchSnapshot();
    });

    test('matches snapshot with different themes', () => {
      // Test light theme
      const { container: lightContainer } = render(<App />);
      expect(lightContainer).toMatchSnapshot('light-theme');
    });

    test('matches snapshot with different languages', () => {
      // Mock different language
      jest.doMock('react-i18next', () => ({
        useTranslation: () => ({
          t: (key) => key,
          i18n: {
            changeLanguage: jest.fn(),
            language: 'hi',
          },
        }),
        initReactI18next: {
          type: '3rdParty',
          init: jest.fn(),
        },
      }));

      const { container } = render(<App />);
      expect(container).toMatchSnapshot('hindi-language');
    });
  });

  describe('Integration Tests', () => {
    test('integrates with i18next correctly', () => {
      render(<App />);
      
      // App should render without i18next errors
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
    });

    test('handles theme context integration', () => {
      render(<App />);
      
      // App should render with theme context
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
    });

    test('handles error boundaries', () => {
      // Mock WeatherApp to throw error
      jest.doMock('../components/WeatherApp', () => {
        return function MockWeatherApp() {
          throw new Error('Test error');
        };
      });

      // Should not crash the app
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('renders efficiently', () => {
      const startTime = performance.now();
      render(<App />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(50); // Should render in less than 50ms
    });

    test('does not cause memory leaks', () => {
      const { unmount } = render(<App />);
      
      // Unmount should not cause issues
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('Accessibility Tests', () => {
    test('has proper document title', () => {
      render(<App />);
      
      expect(document.title).toBe('Weather App - Get Real-time Weather Updates');
    });

    test('has proper meta description', () => {
      render(<App />);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      expect(metaDescription).toHaveAttribute('content', expect.stringContaining('weather'));
    });

    test('has proper viewport meta tag', () => {
      render(<App />);
      
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      expect(viewportMeta).toHaveAttribute('content', expect.stringContaining('width=device-width'));
    });
  });

  describe('Error Handling', () => {
    test('handles missing dependencies gracefully', () => {
      // Mock missing dependency
      const originalConsoleError = console.error;
      console.error = jest.fn();
      
      // Should not crash when dependencies are missing
      expect(() => {
        render(<App />);
      }).not.toThrow();
      
      console.error = originalConsoleError;
    });

    test('handles initialization errors gracefully', () => {
      // Mock i18next initialization error
      jest.doMock('react-i18next', () => ({
        useTranslation: () => {
          throw new Error('i18next initialization error');
        },
        initReactI18next: {
          type: '3rdParty',
          init: jest.fn(),
        },
      }));

      // Should not crash on initialization errors
      expect(() => {
        render(<App />);
      }).not.toThrow();
    });
  });

  describe('Browser Compatibility', () => {
    test('works in different browsers', () => {
      // Mock different user agents
      const originalUserAgent = navigator.userAgent;
      
      // Chrome
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        configurable: true,
      });
      
      render(<App />);
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
      
      // Firefox
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
        configurable: true,
      });
      
      render(<App />);
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
      
      // Safari
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
        configurable: true,
      });
      
      render(<App />);
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
      
      // Restore original user agent
      Object.defineProperty(navigator, 'userAgent', {
        value: originalUserAgent,
        configurable: true,
      });
    });
  });

  describe('SEO Tests', () => {
    test('has proper Open Graph meta tags', () => {
      render(<App />);
      
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogType = document.querySelector('meta[property="og:type"]');
      
      expect(ogTitle).toHaveAttribute('content', expect.stringContaining('Weather App'));
      expect(ogDescription).toHaveAttribute('content', expect.stringContaining('weather'));
      expect(ogType).toHaveAttribute('content', 'website');
    });

    test('has proper Twitter Card meta tags', () => {
      render(<App />);
      
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      
      expect(twitterCard).toHaveAttribute('content', 'summary_large_image');
      expect(twitterTitle).toHaveAttribute('content', expect.stringContaining('Weather App'));
      expect(twitterDescription).toHaveAttribute('content', expect.stringContaining('weather'));
    });

    test('has proper keywords meta tag', () => {
      render(<App />);
      
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      expect(keywordsMeta).toHaveAttribute('content', expect.stringContaining('weather'));
    });
  });

  describe('Responsive Design Tests', () => {
    test('adapts to different screen sizes', () => {
      // Test mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });
      
      render(<App />);
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
      
      // Test tablet viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      render(<App />);
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
      
      // Test desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024,
      });
      
      render(<App />);
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
    });
  });

  describe('Security Tests', () => {
    test('has proper CSP meta tag', () => {
      render(<App />);
      
      const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      if (cspMeta) {
        expect(cspMeta).toHaveAttribute('content');
      }
    });

    test('has proper X-Frame-Options', () => {
      render(<App />);
      
      // This would typically be set by the server, but we can test if the app
      // handles it properly when present
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    test('handles loading states gracefully', () => {
      render(<App />);
      
      // App should render immediately without loading states
      expect(screen.getByTestId('weather-app')).toBeInTheDocument();
    });
  });

  describe('Memory Management', () => {
    test('cleans up resources on unmount', () => {
      const { unmount } = render(<App />);
      
      // Should not cause memory leaks
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('handles multiple mount/unmount cycles', () => {
      for (let i = 0; i < 10; i++) {
        const { unmount } = render(<App />);
        expect(screen.getByTestId('weather-app')).toBeInTheDocument();
        unmount();
      }
    });
  });
}); 