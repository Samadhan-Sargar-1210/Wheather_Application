#!/bin/bash

# Weather App Deployment Script
# This script helps you prepare and deploy your weather app

echo "🌤️  Weather App Deployment Script"
echo "=================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    echo "   git remote add origin YOUR_GITHUB_REPO_URL"
    echo "   git push -u origin main"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env file from env.example"
        echo "📝 Please edit .env file and add your OpenWeatherMap API key"
    else
        echo "❌ env.example not found. Please create .env file manually"
    fi
fi

# Check if API key is set
if ! grep -q "VITE_OPENWEATHER_API_KEY" .env || grep -q "your_openweathermap_api_key_here" .env; then
    echo "⚠️  Please add your OpenWeatherMap API key to .env file"
    echo "   Get your free API key from: https://openweathermap.org/api"
fi

# Build the project
echo "🔨 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Check if dist folder exists
if [ -d "dist" ]; then
    echo "✅ Build output found in dist/ folder"
    echo "📁 Files in dist/:"
    ls -la dist/
else
    echo "❌ dist/ folder not found. Build may have failed."
    exit 1
fi

echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "1. Push your code to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for deployment'"
echo "   git push origin main"
echo ""
echo "2. Deploy to Netlify:"
echo "   - Go to https://netlify.com"
echo "   - Click 'New site from Git'"
echo "   - Connect your GitHub repository"
echo "   - Set build command: npm run build"
echo "   - Set publish directory: dist"
echo "   - Add environment variable: VITE_OPENWEATHER_API_KEY"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Click 'New Project'"
echo "   - Import your GitHub repository"
echo "   - Add environment variable: VITE_OPENWEATHER_API_KEY"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "🎉 Happy deploying!" 