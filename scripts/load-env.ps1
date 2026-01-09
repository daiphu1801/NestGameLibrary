# Load environment variables from .env file
# Usage: . .\scripts\load-env.ps1

Write-Host "Loading environment variables from .env..." -ForegroundColor Cyan

if (-not (Test-Path ".env")) {
    Write-Host "Error: .env file not found!" -ForegroundColor Red
    exit 1
}

Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$' -and -not $_.StartsWith('#')) {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        
        # Remove quotes if present
        $value = $value -replace '^["'']|["'']$', ''
        
        # Set environment variable
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
        Set-Item -Path "env:$name" -Value $value
        
        # Show loaded (hide token value)
        if ($name -eq 'CLOUDFLARE_API_TOKEN') {
            Write-Host "  Loaded: $name = ****" -ForegroundColor Green
        } else {
            Write-Host "  Loaded: $name = $value" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "Environment variables loaded successfully!" -ForegroundColor Green
Write-Host "You can now run: .\scripts\upload-roms-to-r2.ps1" -ForegroundColor Yellow
Write-Host ""
