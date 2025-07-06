import {
  getWeatherData,
  getForecastData,
  getAQIData,
  getWeatherAlerts,
  getWeatherByLocation,
} from '../weatherService';

// Mock fetch
global.fetch = jest.fn();

// Mock environment variables
const originalEnv = process.env;
process.env.VITE_OPENWEATHER_API_KEY = 'test-api-key';

describe('Weather Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockClear();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getWeatherData', () => {
    const mockWeatherResponse = {
      name: 'Mumbai',
      main: {
        temp: 30,
        feels_like: 32,
        humidity: 70,
        pressure: 1013,
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: { speed: 5 },
      visibility: 10000,
      sys: { country: 'IN' },
    };

    test('fetches weather data successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockWeatherResponse,
      });

      const result = await getWeatherData('Mumbai');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=test-api-key&units=metric'
      );
      expect(result).toEqual(mockWeatherResponse);
    });

    test('handles city not found error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getWeatherData('InvalidCity')).rejects.toThrow('City not found');
    });

    test('handles API key error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      await expect(getWeatherData('Mumbai')).rejects.toThrow('Invalid API key');
    });

    test('handles rate limit error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
      });

      await expect(getWeatherData('Mumbai')).rejects.toThrow('Rate limit exceeded');
    });

    test('handles network error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(getWeatherData('Mumbai')).rejects.toThrow('Network error');
    });

    test('handles empty city name', async () => {
      await expect(getWeatherData('')).rejects.toThrow('City name is required');
    });

    test('handles null city name', async () => {
      await expect(getWeatherData(null)).rejects.toThrow('City name is required');
    });

    test('handles undefined city name', async () => {
      await expect(getWeatherData(undefined)).rejects.toThrow('City name is required');
    });

    test('uses mock data in development mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = await getWeatherData('Mumbai');

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('main');
      expect(result).toHaveProperty('weather');

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('getForecastData', () => {
    const mockForecastResponse = {
      list: [
        {
          dt: 1640995200,
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
      ],
    };

    test('fetches forecast data successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockForecastResponse,
      });

      const result = await getForecastData('Mumbai');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/forecast?q=Mumbai&appid=test-api-key&units=metric'
      );
      expect(result).toEqual(mockForecastResponse.list);
    });

    test('handles forecast API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getForecastData('Mumbai')).rejects.toThrow('Failed to fetch forecast data');
    });

    test('handles empty forecast response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ list: [] }),
      });

      const result = await getForecastData('Mumbai');
      expect(result).toEqual([]);
    });

    test('uses mock data in development mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = await getForecastData('Mumbai');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('getAQIData', () => {
    const mockAQIResponse = {
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

    test('fetches AQI data successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAQIResponse,
      });

      const result = await getAQIData(19.076, 72.8777);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/air_pollution?lat=19.076&lon=72.8777&appid=test-api-key'
      );
      expect(result).toEqual(mockAQIResponse);
    });

    test('handles AQI API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(getAQIData(19.076, 72.8777)).rejects.toThrow('Failed to fetch AQI data');
    });

    test('handles invalid coordinates', async () => {
      await expect(getAQIData('invalid', 'invalid')).rejects.toThrow('Invalid coordinates');
    });

    test('handles out of range coordinates', async () => {
      await expect(getAQIData(91, 181)).rejects.toThrow('Coordinates out of range');
    });

    test('uses mock data in development mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = await getAQIData(19.076, 72.8777);

      expect(result).toHaveProperty('list');
      expect(Array.isArray(result.list)).toBe(true);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('getWeatherAlerts', () => {
    const mockAlertsResponse = {
      alerts: [
        {
          event: 'Heavy Rain',
          description: 'Heavy rainfall expected',
          severity: 'Moderate',
          start: 1640995200,
          end: 1641081600,
          tags: ['rain', 'flood'],
        },
      ],
    };

    test('fetches weather alerts successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockAlertsResponse,
      });

      const result = await getWeatherAlerts('Mumbai');

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/onecall?q=Mumbai&exclude=current,minutely,hourly,daily&appid=test-api-key'
      );
      expect(result).toEqual(mockAlertsResponse.alerts);
    });

    test('handles no alerts response', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await getWeatherAlerts('Mumbai');
      expect(result).toEqual([]);
    });

    test('handles alerts API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });

      await expect(getWeatherAlerts('Mumbai')).rejects.toThrow('Failed to fetch weather alerts');
    });

    test('uses mock data in development mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = await getWeatherAlerts('Mumbai');

      expect(Array.isArray(result)).toBe(true);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('getWeatherByLocation', () => {
    const mockLocationWeatherResponse = {
      name: 'Mumbai',
      main: {
        temp: 30,
        feels_like: 32,
        humidity: 70,
        pressure: 1013,
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: { speed: 5 },
      visibility: 10000,
      sys: { country: 'IN' },
    };

    test('fetches weather data by coordinates successfully', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockLocationWeatherResponse,
      });

      const result = await getWeatherByLocation(19.076, 72.8777);

      expect(fetch).toHaveBeenCalledWith(
        'https://api.openweathermap.org/data/2.5/weather?lat=19.076&lon=72.8777&appid=test-api-key&units=metric'
      );
      expect(result).toEqual(mockLocationWeatherResponse);
    });

    test('handles location weather API errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      await expect(getWeatherByLocation(19.076, 72.8777)).rejects.toThrow('Failed to fetch weather data');
    });

    test('handles invalid coordinates', async () => {
      await expect(getWeatherByLocation('invalid', 'invalid')).rejects.toThrow('Invalid coordinates');
    });

    test('uses mock data in development mode', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result = await getWeatherByLocation(19.076, 72.8777);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('main');
      expect(result).toHaveProperty('weather');

      process.env.NODE_ENV = originalNodeEnv;
    });
  });

  describe('Error Handling', () => {
    test('handles JSON parsing errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getWeatherData('Mumbai')).rejects.toThrow('Invalid JSON');
    });

    test('handles timeout errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Request timeout'));

      await expect(getWeatherData('Mumbai')).rejects.toThrow('Request timeout');
    });

    test('handles CORS errors', async () => {
      fetch.mockRejectedValueOnce(new Error('CORS error'));

      await expect(getWeatherData('Mumbai')).rejects.toThrow('CORS error');
    });
  });

  describe('API Key Handling', () => {
    test('throws error when API key is missing', async () => {
      const originalApiKey = process.env.VITE_OPENWEATHER_API_KEY;
      delete process.env.VITE_OPENWEATHER_API_KEY;

      await expect(getWeatherData('Mumbai')).rejects.toThrow('API key is required');

      process.env.VITE_OPENWEATHER_API_KEY = originalApiKey;
    });

    test('throws error when API key is empty', async () => {
      const originalApiKey = process.env.VITE_OPENWEATHER_API_KEY;
      process.env.VITE_OPENWEATHER_API_KEY = '';

      await expect(getWeatherData('Mumbai')).rejects.toThrow('API key is required');

      process.env.VITE_OPENWEATHER_API_KEY = originalApiKey;
    });
  });

  describe('Data Validation', () => {
    test('validates weather data structure', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          // Missing required fields
          name: 'Mumbai',
        }),
      });

      const result = await getWeatherData('Mumbai');
      expect(result).toHaveProperty('name');
      expect(result.name).toBe('Mumbai');
    });

    test('validates forecast data structure', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          list: [
            {
              dt: 1640995200,
              // Missing other fields
            },
          ],
        }),
      });

      const result = await getForecastData('Mumbai');
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    test('validates AQI data structure', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          list: [
            {
              main: { aqi: 2 },
              // Missing components
            },
          ],
        }),
      });

      const result = await getAQIData(19.076, 72.8777);
      expect(result).toHaveProperty('list');
      expect(Array.isArray(result.list)).toBe(true);
    });
  });

  describe('Performance', () => {
    test('handles concurrent API calls', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ name: 'Mumbai', main: { temp: 30 } }),
      });

      const promises = [
        getWeatherData('Mumbai'),
        getWeatherData('Delhi'),
        getWeatherData('Bangalore'),
      ];

      const results = await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(fetch).toHaveBeenCalledTimes(3);
    });

    test('handles rapid successive calls', async () => {
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ name: 'Mumbai', main: { temp: 30 } }),
      });

      for (let i = 0; i < 5; i++) {
        await getWeatherData('Mumbai');
      }

      expect(fetch).toHaveBeenCalledTimes(5);
    });
  });

  describe('Mock Data', () => {
    test('returns consistent mock data in development', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const result1 = await getWeatherData('Mumbai');
      const result2 = await getWeatherData('Mumbai');

      expect(result1).toEqual(result2);

      process.env.NODE_ENV = originalNodeEnv;
    });

    test('mock data has required structure', async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const weatherData = await getWeatherData('Mumbai');
      const forecastData = await getForecastData('Mumbai');
      const aqiData = await getAQIData(19.076, 72.8777);
      const alertsData = await getWeatherAlerts('Mumbai');

      expect(weatherData).toHaveProperty('name');
      expect(weatherData).toHaveProperty('main');
      expect(weatherData).toHaveProperty('weather');

      expect(Array.isArray(forecastData)).toBe(true);
      expect(forecastData.length).toBeGreaterThan(0);

      expect(aqiData).toHaveProperty('list');
      expect(Array.isArray(aqiData.list)).toBe(true);

      expect(Array.isArray(alertsData)).toBe(true);

      process.env.NODE_ENV = originalNodeEnv;
    });
  });
}); 