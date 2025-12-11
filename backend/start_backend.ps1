# Backend Startup Script
# Jalankan dengan: .\start_backend.ps1

Write-Host "🚀 Starting Pyramid Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Aktivasi virtual environment
Write-Host "📦 Activating virtual environment..." -ForegroundColor Yellow
& .venv\Scripts\Activate.ps1

# Set environment variable
Write-Host "🔑 Setting environment variables..." -ForegroundColor Yellow
$env:MYAPP_SECRET_KEY = "development-secret-key-change-in-production"

# Jalankan server
Write-Host "🌐 Starting server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ Backend will be available at: http://localhost:6543" -ForegroundColor Green
Write-Host "⚠️  Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

pserve development.ini --reload
