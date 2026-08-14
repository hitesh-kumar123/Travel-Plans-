# PowerShell Script to Update Weather API Key
# Usage: Run this script and paste your API key when prompted

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Weather API Key Update Tool" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This script will update your WEATHER_API_KEY in server/.env" -ForegroundColor Yellow
Write-Host ""

# Prompt for API key
$apiKey = Read-Host "Paste your OpenWeatherMap API key here"

if ([string]::IsNullOrWhiteSpace($apiKey)) {
    Write-Host ""
    Write-Host "❌ No API key provided. Exiting." -ForegroundColor Red
    pause
    exit
}

# Trim whitespace
$apiKey = $apiKey.Trim()

Write-Host ""
Write-Host "⏳ Updating server/.env file..." -ForegroundColor Yellow

# Path to .env file
$envPath = ".\server\.env"

if (Test-Path $envPath) {
    # Read the file
    $content = Get-Content $envPath -Raw
    
    # Replace the API key
    $newContent = $content -replace "WEATHER_API_KEY=.*", "WEATHER_API_KEY=$apiKey"
    
    # Write back to file
    Set-Content $envPath -Value $newContent -NoNewline
    
    Write-Host "✅ API key updated successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your server/.env now contains:" -ForegroundColor Cyan
    Write-Host "WEATHER_API_KEY=$apiKey" -ForegroundColor White
    Write-Host ""
    Write-Host "🔄 Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your backend server (Ctrl+C and run 'npm run dev' again)" -ForegroundColor White
    Write-Host "2. Wait 10-15 minutes if this is a brand new API key" -ForegroundColor White
    Write-Host "3. Test the Weather page in your browser" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "❌ Could not find server/.env file!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the project root directory." -ForegroundColor Yellow
    Write-Host ""
}

pause