# BuildSaathi — Windows Developer Setup Script
# Run from the BuildSaathi/ root directory
# PowerShell: .\infra\scripts\setup.ps1

Write-Host "=== BuildSaathi Developer Setup ===" -ForegroundColor Cyan

# 1. Check prerequisites
Write-Host "`n[1/5] Checking prerequisites..." -ForegroundColor Yellow

$dotnetVersion = dotnet --version 2>$null
if (-not $dotnetVersion) { Write-Error "dotnet SDK not found. Install .NET 8 from https://dotnet.microsoft.com"; exit 1 }
Write-Host "  .NET SDK: $dotnetVersion" -ForegroundColor Green

$nodeVersion = node --version 2>$null
if (-not $nodeVersion) { Write-Error "Node.js not found. Install Node 20 from https://nodejs.org"; exit 1 }
Write-Host "  Node.js: $nodeVersion" -ForegroundColor Green

$dockerVersion = docker --version 2>$null
if (-not $dockerVersion) { Write-Error "Docker not found. Install Docker Desktop from https://docker.com"; exit 1 }
Write-Host "  Docker: $dockerVersion" -ForegroundColor Green

# 2. Copy env file
Write-Host "`n[2/5] Setting up environment..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "  Created .env from .env.example" -ForegroundColor Green
    Write-Host "  IMPORTANT: Edit .env with your actual values before continuing" -ForegroundColor Yellow
} else {
    Write-Host "  .env already exists — skipping" -ForegroundColor Gray
}

# 3. Install frontend dependencies
Write-Host "`n[3/5] Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm ci
Set-Location ..
Write-Host "  Frontend dependencies installed" -ForegroundColor Green

# 4. Restore backend dependencies
Write-Host "`n[4/5] Restoring backend dependencies..." -ForegroundColor Yellow
dotnet restore backend/BuildSaathi.sln
Write-Host "  Backend dependencies restored" -ForegroundColor Green

# 5. Start Docker services
Write-Host "`n[5/5] Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d mysql redis minio chromadb
Write-Host "  Waiting for MySQL to be ready..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host "`n=== Setup Complete ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Run database migrations:  cd backend && dotnet ef database update --project src/Infrastructure --startup-project src/API"
Write-Host "  2. Start API:                cd backend && dotnet run --project src/API"
Write-Host "  3. Start Frontend:           cd frontend && npm run dev"
Write-Host "  4. Start AI Services:        cd ai-services && uvicorn main:app --reload --port 8000"
Write-Host ""
Write-Host "URLs:"
Write-Host "  Frontend:  http://localhost:3000"
Write-Host "  API:       http://localhost:5000"
Write-Host "  Swagger:   http://localhost:5000/swagger"
Write-Host "  AI Docs:   http://localhost:8000/docs"
Write-Host "  MinIO:     http://localhost:9001 (admin/minioadmin)"
