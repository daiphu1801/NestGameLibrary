# Upload all ROMs to Cloudflare R2
# Usage: .\scripts\upload-roms-to-r2.ps1

Write-Host "Uploading ROMs to Cloudflare R2..." -ForegroundColor Cyan
Write-Host ""

# Check if wrangler is installed
$wranglerInstalled = Get-Command wrangler -ErrorAction SilentlyContinue

if (-not $wranglerInstalled) {
    Write-Host "Wrangler not found. Installing..." -ForegroundColor Yellow
    npm install -g wrangler
    Write-Host "Wrangler installed!" -ForegroundColor Green
    Write-Host ""
}

# Login to Cloudflare (if not already logged in)
Write-Host "Checking Cloudflare authentication..." -ForegroundColor Cyan
wrangler whoami
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Cloudflare:" -ForegroundColor Yellow
    wrangler login
}
Write-Host ""

# Bucket name
$BUCKET_NAME = "nesgame"

# ROM directories
$romDirs = @(
    "Nes ROMs Complete 1 Of 4",
    "Nes ROMs Complete 2 Of 4",
    "Nes ROMs Complete 3 Of 4",
    "Nes ROMs Complete 4 Of 4"
)

$totalFiles = 0
$uploadedFiles = 0
$failedFiles = 0

# Count total files
Write-Host "Counting files..." -ForegroundColor Cyan
foreach ($dir in $romDirs) {
    if (Test-Path $dir) {
        $files = Get-ChildItem -Path $dir -Filter "*.zip" -ErrorAction SilentlyContinue
        $totalFiles += $files.Count
    }
}
Write-Host "Found $totalFiles ROM files" -ForegroundColor Green
Write-Host ""

# Upload files
Write-Host "Starting upload..." -ForegroundColor Cyan
Write-Host ""

foreach ($dir in $romDirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "Directory not found: $dir" -ForegroundColor Yellow
        continue
    }

    Write-Host "Processing: $dir" -ForegroundColor Magenta
    
    $files = Get-ChildItem -Path $dir -Filter "*.zip"
    
    foreach ($file in $files) {
        $uploadedFiles++
        $fileName = $file.Name
        $filePath = $file.FullName
        
        # Progress
        $percent = [math]::Round(($uploadedFiles / $totalFiles) * 100, 1)
        Write-Host "[$uploadedFiles/$totalFiles - $percent%] Uploading: $fileName" -ForegroundColor White
        
        # Upload to R2
        try {
            wrangler r2 object put "$BUCKET_NAME/$fileName" --file="$filePath" --remote 2>&1 | Out-Null
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  Success" -ForegroundColor Green
            } else {
                Write-Host "  Failed" -ForegroundColor Red
                $failedFiles++
            }
        } catch {
            Write-Host "  Error: $_" -ForegroundColor Red
            $failedFiles++
        }
    }
    
    Write-Host ""
}

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UPLOAD SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total files:    $totalFiles" -ForegroundColor White
Write-Host "Uploaded:       $($uploadedFiles - $failedFiles)" -ForegroundColor Green
Write-Host "Failed:         $failedFiles" -ForegroundColor Red
Write-Host ""

if ($failedFiles -eq 0) {
    Write-Host "All ROMs uploaded successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Go to Cloudflare R2 dashboard" -ForegroundColor White
    Write-Host "2. Enable Public Access in Settings tab" -ForegroundColor White
    Write-Host "3. Copy the Public URL (https://pub-xxxxx.r2.dev)" -ForegroundColor White
    Write-Host "4. Run: node scripts/update-game-paths-to-r2.js" -ForegroundColor White
} else {
    Write-Host "Some files failed to upload. Check errors above." -ForegroundColor Yellow
}

Write-Host ""
