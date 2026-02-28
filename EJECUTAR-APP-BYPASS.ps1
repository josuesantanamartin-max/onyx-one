# Aliseus Startup Script
# Simple version to avoid encoding issues

Write-Host "-------------------------------------------"
Write-Host "  ALISEUS - Startup"
Write-Host "-------------------------------------------"

# Check Node.js
Write-Host "Checking Node.js..."
node -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Node.js is not installed or not in PATH."
    pause
    exit 1
}

# Check npm
Write-Host "Checking npm..."
npm -v
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: npm is not available."
    pause
    exit 1
}

# Check dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies (this may take a minute)..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error installing dependencies."
        pause
        exit 1
    }
}

Write-Host "-------------------------------------------"
Write-Host "  Starting Development Server..."
Write-Host "-------------------------------------------"
Write-Host "Local URL: http://localhost:3000"
Write-Host ""

npm run dev
