# Weather App Deployment Script for Windows
# This script helps you prepare and deploy your weather app

Write-Host "🌤️  Weather App Deployment Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "❌ Git repository not found. Please initialize git first:" -ForegroundColor Red
    Write-Host "   git init" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Yellow
    Write-Host "   git remote add origin YOUR_GITHUB_REPO_URL" -ForegroundColor Yellow
    Write-Host "   git push -u origin main" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from example..." -ForegroundColor Yellow
    if (Test-Path "env.example") {
        Copy-Item "env.example" ".env"
        Write-Host "✅ Created .env file from env.example" -ForegroundColor Green
        Write-Host "📝 Please edit .env file and add your OpenWeatherMap API key" -ForegroundColor Yellow
    } else {
        Write-Host "❌ env.example not found. Please create .env file manually" -ForegroundColor Red
    }
}

# Check if API key is set
$envContent = Get-Content ".env" -ErrorAction SilentlyContinue
if (-not $envContent -or $envContent -match "your_openweathermap_api_key_here") {
    Write-Host "⚠️  Please add your OpenWeatherMap API key to .env file" -ForegroundColor Yellow
    Write-Host "   Get your free API key from: https://openweathermap.org/api" -ForegroundColor Cyan
}

# Build the project
Write-Host "🔨 Building the project..." -ForegroundColor Blue
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed. Please fix the errors and try again." -ForegroundColor Red
    exit 1
}

# Check if dist folder exists
if (Test-Path "dist") {
    Write-Host "✅ Build output found in dist/ folder" -ForegroundColor Green
    Write-Host "📁 Files in dist/:" -ForegroundColor Blue
    Get-ChildItem "dist" | Format-Table Name, Length, LastWriteTime
} else {
    Write-Host "❌ dist/ folder not found. Build may have failed." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Ready for deployment!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Push your code to GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Prepare for deployment'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy to Netlify:" -ForegroundColor White
Write-Host "   - Go to https://netlify.com" -ForegroundColor Gray
Write-Host "   - Click 'New site from Git'" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repository" -ForegroundColor Gray
Write-Host "   - Set build command: npm run build" -ForegroundColor Gray
Write-Host "   - Set publish directory: dist" -ForegroundColor Gray
Write-Host "   - Add environment variable: VITE_OPENWEATHER_API_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Go to https://vercel.com" -ForegroundColor Gray
Write-Host "   - Click 'New Project'" -ForegroundColor Gray
Write-Host "   - Import your GitHub repository" -ForegroundColor Gray
Write-Host "   - Add environment variable: VITE_OPENWEATHER_API_KEY" -ForegroundColor Gray
Write-Host ""
Write-Host "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Happy deploying!" -ForegroundColor Green 