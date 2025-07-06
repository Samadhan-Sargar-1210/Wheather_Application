# 🚀 Quick Setup for Real Weather Data

## The Issue
Your app is currently showing **demo/sample data** because the OpenWeatherMap API key is not configured.

## Quick Fix (3 Steps)

### Step 1: Get Free API Key
1. Go to: https://openweathermap.org/api
2. Click "Sign Up" (free, no credit card)
3. Go to "My API Keys" in your profile
4. Copy your API key (looks like: `1234567890abcdef1234567890abcdef`)

### Step 2: Add API Key to Your Project
Create a file called `.env` in your project root (same folder as `package.json`) and add:

```bash
VITE_OPENWEATHERMAP_API_KEY=your_actual_api_key_here
```

**Replace `your_actual_api_key_here` with your actual API key**

### Step 3: Restart Your App
```bash
npm run dev
```

## What You'll Get
✅ **Real temperature data** from weather stations  
✅ **Accurate weather conditions** (sunny, rainy, etc.)  
✅ **Live humidity, pressure, wind speed**  
✅ **Correct sunrise/sunset times**  
✅ **5-day forecast** with real predictions  
✅ **Location-based weather** using GPS  

## Current Status
- 🔴 **Demo Mode**: Showing sample data
- 🟢 **Real Data**: Available after API key setup

## Need Help?
- API Key not working? Wait 2-3 hours after registration
- City not found? Try official city names (e.g., "Mumbai" not "Bombay")
- Still seeing demo data? Check your `.env` file is in the right location

**That's it! Your app will show real weather data once you add the API key.** 