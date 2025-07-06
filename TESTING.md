# Weather App Testing Guide

This document provides comprehensive information about the testing setup for the Weather App, including how to run tests, what each test covers, and how to interpret test results.

## 🧪 Test Overview

The Weather App includes a comprehensive test suite covering:

- **Component Tests**: React components and UI elements
- **Hook Tests**: Custom React hooks
- **Service Tests**: API services and data handling
- **Integration Tests**: App integration and snapshots
- **Accessibility Tests**: Screen reader and keyboard navigation
- **Performance Tests**: Rendering efficiency and memory management
- **Error Handling Tests**: Graceful error recovery

## 📋 Test Categories

### 1. Component Tests

#### WeatherApp.test.jsx
Tests the main WeatherApp component including:
- ✅ City weather search functionality
- ✅ Geolocation-based weather retrieval
- ✅ Weather data display and formatting
- ✅ 5-day forecast integration
- ✅ Air Quality Index display
- ✅ Personalized precautions system
- ✅ Multi-language switching
- ✅ Severe weather alerts
- ✅ Voice assistant functionality
- ✅ Theme switching (light/dark/high-contrast)
- ✅ Error handling for API failures
- ✅ Loading states and user feedback
- ✅ Accessibility features
- ✅ Responsive design behavior

#### WeatherForecast.test.jsx
Tests the forecast display component including:
- ✅ 5-day forecast data rendering
- ✅ Temperature and weather condition display
- ✅ Rain probability visualization
- ✅ Responsive card layout
- ✅ Date formatting and localization
- ✅ Weather icon display
- ✅ Chart integration
- ✅ Data validation and error handling

#### AQIDisplay.test.jsx
Tests the Air Quality Index component including:
- ✅ AQI level classification (Good, Fair, Moderate, Poor, Very Poor)
- ✅ Color-coded AQI display
- ✅ Pollutant breakdown (CO, NO₂, O₃, PM2.5, PM10, SO₂, NH₃)
- ✅ Health advisory display
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Data formatting and validation

#### WeatherAlert.test.jsx
Tests the weather alerts component including:
- ✅ Alert banner display
- ✅ Severity level styling
- ✅ Safety recommendations
- ✅ Alert timing information
- ✅ Multiple alerts handling
- ✅ Tooltip functionality
- ✅ Responsive design
- ✅ Accessibility features

#### ThemeToggle.test.jsx
Tests the theme switching component including:
- ✅ Light/Dark/High-Contrast theme switching
- ✅ Active theme indication
- ✅ Hover effects and animations
- ✅ Keyboard navigation
- ✅ Accessibility features
- ✅ Theme persistence
- ✅ Responsive design

#### FiveDayForecastChart.test.jsx
Tests the chart component including:
- ✅ Temperature line chart
- ✅ Rain chance bar chart
- ✅ Chart responsiveness
- ✅ Data processing and formatting
- ✅ Tooltip functionality
- ✅ Accessibility features
- ✅ Performance optimization

#### FarmerCalendar.test.jsx
Tests the farmer advisory calendar including:
- ✅ Calendar display and navigation
- ✅ Advisory data visualization
- ✅ Legend and tooltips
- ✅ Priority level handling
- ✅ Responsive design
- ✅ Accessibility features

### 2. Hook Tests

#### useTheme.test.js
Tests the theme management hook including:
- ✅ Theme state management
- ✅ Theme switching functionality
- ✅ localStorage persistence
- ✅ Theme validation
- ✅ Error handling
- ✅ Performance optimization
- ✅ Browser compatibility

#### useSpeech.test.js
Tests the speech synthesis hook including:
- ✅ Speech synthesis support detection
- ✅ Text-to-speech functionality
- ✅ Language support
- ✅ Speech rate control
- ✅ Speaking state management
- ✅ Error handling
- ✅ Browser compatibility

### 3. Service Tests

#### weatherService.test.js
Tests the weather API services including:
- ✅ Weather data fetching
- ✅ Forecast data retrieval
- ✅ AQI data fetching
- ✅ Weather alerts retrieval
- ✅ Geolocation weather fetching
- ✅ Error handling for API failures
- ✅ Data validation
- ✅ Mock data in development
- ✅ Performance optimization

### 4. Integration Tests

#### App.test.jsx
Tests the main App component including:
- ✅ Component integration
- ✅ i18next integration
- ✅ Theme context integration
- ✅ Error boundaries
- ✅ Performance testing
- ✅ Accessibility testing
- ✅ SEO meta tags
- ✅ Browser compatibility
- ✅ Snapshot testing

## 🚀 Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Advanced Test Commands

```bash
# Run specific test file
npx jest src/components/__tests__/WeatherApp.test.jsx

# Run tests matching a pattern
npx jest --testNamePattern="city search"

# Run tests with verbose output
npx jest --verbose

# Run tests with coverage and generate report
npx jest --coverage --coverageReporters=html
```

### Using the Test Runner Script

```bash
# Run all tests with detailed reporting
node run-tests.js

# Run tests for specific category
node run-tests.js --category "Component Tests"

# Run only coverage tests
node run-tests.js --coverage-only

# Run tests with verbose output
node run-tests.js --verbose
```

## 📊 Test Coverage

The test suite aims for comprehensive coverage:

- **Statements**: 80% minimum
- **Branches**: 80% minimum
- **Functions**: 80% minimum
- **Lines**: 80% minimum

### Coverage Reports

After running tests with coverage, you can find:

- **HTML Report**: `coverage/lcov-report/index.html`
- **Text Report**: Console output
- **LCOV Report**: `coverage/lcov.info`

## 🧩 Test Structure

### File Organization

```
src/
├── components/
│   └── __tests__/
│       ├── WeatherApp.test.jsx
│       ├── WeatherForecast.test.jsx
│       ├── AQIDisplay.test.jsx
│       ├── WeatherAlert.test.jsx
│       ├── ThemeToggle.test.jsx
│       ├── FiveDayForecastChart.test.jsx
│       └── FarmerCalendar.test.jsx
├── hooks/
│   └── __tests__/
│       ├── useTheme.test.js
│       └── useSpeech.test.js
├── services/
│   └── __tests__/
│       └── weatherService.test.js
└── __tests__/
    └── App.test.jsx
```

### Test File Naming Convention

- Component tests: `ComponentName.test.jsx`
- Hook tests: `useHookName.test.js`
- Service tests: `serviceName.test.js`
- Integration tests: `App.test.jsx`

## 🔧 Test Configuration

### Jest Configuration

The Jest configuration is defined in `package.json`:

```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"],
    "moduleNameMapping": {
      "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/src/__mocks__/fileMock.js"
    },
    "transform": {
      "^.+\\.(js|jsx)$": "babel-jest"
    },
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx}",
      "<rootDir>/src/**/*.{test,spec}.{js,jsx}"
    ],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/main.jsx",
      "!src/index.js",
      "!src/**/*.config.js",
      "!src/**/__mocks__/**"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

### Setup Files

- `src/setupTests.js`: Global test setup and mocks
- `src/__mocks__/fileMock.js`: Mock for static assets

## 🎯 Testing Best Practices

### Writing Tests

1. **Arrange-Act-Assert Pattern**
   ```javascript
   test('should display weather data', () => {
     // Arrange
     const mockData = { name: 'Mumbai', temp: 30 };
     
     // Act
     render(<WeatherApp data={mockData} />);
     
     // Assert
     expect(screen.getByText('Mumbai')).toBeInTheDocument();
   });
   ```

2. **Descriptive Test Names**
   ```javascript
   test('displays error message when city is not found', () => {
     // Test implementation
   });
   ```

3. **Test Isolation**
   - Each test should be independent
   - Clean up after each test
   - Mock external dependencies

4. **Accessibility Testing**
   ```javascript
   test('supports keyboard navigation', () => {
     // Test keyboard interactions
   });
   ```

### Mocking

1. **API Calls**
   ```javascript
   jest.mock('../services/weatherService', () => ({
     getWeatherData: jest.fn(),
   }));
   ```

2. **Browser APIs**
   ```javascript
   global.speechSynthesis = {
     speak: jest.fn(),
     cancel: jest.fn(),
   };
   ```

3. **React Components**
   ```javascript
   jest.mock('../components/WeatherIcon', () => {
     return function MockWeatherIcon(props) {
       return <div data-testid="weather-icon" {...props} />;
     };
   });
   ```

## 🐛 Debugging Tests

### Common Issues

1. **Test Environment Issues**
   ```bash
   # Clear Jest cache
   npx jest --clearCache
   ```

2. **Mock Issues**
   ```javascript
   // Reset mocks between tests
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

3. **Async Test Issues**
   ```javascript
   test('async operation', async () => {
     await waitFor(() => {
       expect(screen.getByText('Result')).toBeInTheDocument();
     });
   });
   ```

### Debug Mode

```bash
# Run tests in debug mode
npx jest --debug

# Run specific test in debug mode
npx jest --debug WeatherApp.test.jsx
```

## 📈 Performance Testing

### Rendering Performance

```javascript
test('renders efficiently', () => {
  const startTime = performance.now();
  render(<WeatherApp />);
  const endTime = performance.now();
  
  expect(endTime - startTime).toBeLessThan(100);
});
```

### Memory Leak Testing

```javascript
test('does not cause memory leaks', () => {
  const { unmount } = render(<WeatherApp />);
  
  expect(() => {
    unmount();
  }).not.toThrow();
});
```

## 🔍 Accessibility Testing

### Screen Reader Support

```javascript
test('has proper ARIA labels', () => {
  render(<WeatherApp />);
  
  expect(screen.getByLabelText('Search city')).toBeInTheDocument();
});
```

### Keyboard Navigation

```javascript
test('supports keyboard navigation', async () => {
  const user = userEvent.setup();
  
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();
});
```

## 🌐 Browser Compatibility Testing

### Different User Agents

```javascript
test('works in different browsers', () => {
  // Mock different user agents
  Object.defineProperty(navigator, 'userAgent', {
    value: 'Chrome/91.0.4472.124',
    configurable: true,
  });
  
  render(<WeatherApp />);
  expect(screen.getByTestId('weather-app')).toBeInTheDocument();
});
```

## 📱 Responsive Testing

### Different Screen Sizes

```javascript
test('adapts to different screen sizes', () => {
  // Test mobile viewport
  Object.defineProperty(window, 'innerWidth', {
    value: 375,
    configurable: true,
  });
  
  render(<WeatherApp />);
  expect(screen.getByTestId('weather-app')).toBeInTheDocument();
});
```

## 🚨 Error Handling Testing

### API Failures

```javascript
test('handles API failures gracefully', async () => {
  // Mock API failure
  jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));
  
  render(<WeatherApp />);
  
  await waitFor(() => {
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
});
```

### Component Errors

```javascript
test('handles component errors gracefully', () => {
  // Mock component error
  jest.spyOn(console, 'error').mockImplementation(() => {});
  
  expect(() => {
    render(<BrokenComponent />);
  }).not.toThrow();
});
```

## 📋 Test Checklist

Before committing code, ensure:

- [ ] All tests pass
- [ ] Coverage meets minimum thresholds
- [ ] New features have corresponding tests
- [ ] Error scenarios are tested
- [ ] Accessibility features are tested
- [ ] Performance is acceptable
- [ ] Tests are well-documented
- [ ] No console errors in tests

## 🤝 Contributing to Tests

When adding new features:

1. **Write tests first** (TDD approach)
2. **Test happy path and edge cases**
3. **Include accessibility tests**
4. **Add performance tests if needed**
5. **Update this documentation**

## 📞 Support

If you encounter issues with tests:

1. Check the Jest documentation
2. Review the test setup files
3. Check for common issues in this guide
4. Create an issue with detailed error information

---

**Happy Testing! 🧪✨** 