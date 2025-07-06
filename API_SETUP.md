# 🌤️ Weather App API Setup Guide

## Getting Real Weather Data

This weather app now uses the **OpenWeatherMap API** to provide real, live weather data instead of mock data. Follow these steps to set up your API key:

### 🔑 Step 1: Get Your Free API Key

1. **Visit OpenWeatherMap**: Go to [https://openweathermap.org/api](https://openweathermap.org/api)
2. **Sign Up**: Create a free account (no credit card required)
3. **Get API Key**: 
   - Go to your profile → "My API Keys"
   - Copy your API key (it looks like: `1234567890abcdef1234567890abcdef`)

### ⚙️ Step 2: Configure Your API Key

#### Option A: Environment Variable (Recommended for Production)

1. **Create `.env` file** in your project root:
```bash
# .env
VITE_OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

2. **Replace `your_actual_api_key_here`** with your actual API key from OpenWeatherMap

#### Option B: Direct Configuration (Quick Setup)

1. **Edit the config file**: Open `src/config/weatherApi.js`
2. **Replace the API key**:
```javascript
export const WEATHER_API_CONFIG = {
  API_KEY: 'your_actual_api_key_here', // Replace this
  // ... rest of config
}
```

### 🚀 Step 3: Test Your Setup

1. **Start the development server**:
```bash
npm run dev
```

2. **Search for a city** (e.g., "London", "New York", "Mumbai")
3. **Verify real data**: You should see actual temperature, humidity, wind speed, etc.

### 🔧 API Features

With the real API, you'll get:

- ✅ **Live Temperature Data** - Real-time temperatures from weather stations
- ✅ **Accurate Weather Conditions** - Current weather status (sunny, rainy, etc.)
- ✅ **Humidity & Pressure** - Actual atmospheric data
- ✅ **Wind Speed** - Real wind measurements
- ✅ **Sunrise/Sunset Times** - Accurate daily sun times
- ✅ **5-Day Forecast** - Extended weather predictions
- ✅ **Location-Based Weather** - GPS coordinates support

### 📊 API Limits (Free Tier)

- **1,000 calls per day** (more than enough for personal use)
- **Current weather data** for any city
- **5-day forecast** data
- **Geolocation support**

### 🛠️ Troubleshooting

#### "Weather data not found" Error
- Check if the city name is spelled correctly
- Try using the city's official name (e.g., "Mumbai" instead of "Bombay")

#### "API key invalid" Error
- Verify your API key is correct
- Make sure you've activated your API key (may take a few hours after registration)
- Check if you've exceeded the daily limit

#### "Failed to fetch" Error
- Check your internet connection
- Verify the API key is properly configured
- Try refreshing the page

### 🔒 Security Notes

- **Never commit your API key** to version control
- **Use environment variables** for production deployments
- **The free tier is sufficient** for personal projects

### 🌍 Supported Locations

The API supports weather data for:
- **All major cities** worldwide
- **Small towns** and villages
- **GPS coordinates** for precise location weather
- **International locations** with proper city names

### 📱 Deployment

When deploying to Netlify/Vercel:

1. **Add environment variable** in your deployment platform:
   - Variable name: `VITE_OPENWEATHERMAP_API_KEY`
   - Variable value: Your actual API key

2. **Redeploy** your application

### 🎯 Next Steps

Once you have real weather data:
- Test with different cities
- Try the location-based weather feature
- Check the 5-day forecast accuracy
- Verify sunrise/sunset times

---

**Need Help?** 
- OpenWeatherMap Documentation: [https://openweathermap.org/api](https://openweathermap.org/api)
- API Status: [https://openweathermap.org/weathermap](https://openweathermap.org/weathermap)

**Happy Weather Tracking! 🌤️** 