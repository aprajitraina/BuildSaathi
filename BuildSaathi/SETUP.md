# Developer Setup Guide

Get BuildSaathi running locally in under 30 minutes.

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| .NET SDK | 8.0+ | https://dotnet.microsoft.com/download |
| Node.js | 20+ | https://nodejs.org |
| Docker Desktop | Latest | https://docker.com/products/docker-desktop |
| Python | 3.11+ | https://python.org (optional — for AI services) |
| Git | Latest | https://git-scm.com |

## Quick Start (Windows PowerShell)

```powershell
# 1. Clone and enter the repo
git clone https://github.com/your-org/BuildSaathi.git
cd BuildSaathi

# 2. Run the setup script (installs deps, starts Docker services)
.\infra\scripts\setup.ps1

# 3. Apply database migrations
cd backend
dotnet ef database update --project src/Infrastructure --startup-project src/API
cd ..
```

## Manual Setup (Step by Step)

### Step 1 — Environment Configuration

```powershell
cp .env.example .env
```

Edit `.env` and set at minimum:
- `MYSQL_PASSWORD` — any password (local dev)
- `JWT_SECRET` — at least 32 characters long
- `OPENAI_API_KEY` — skip for now (MOCK_AI=true by default)

### Step 2 — Start Infrastructure Services

```powershell
# Starts MySQL, Redis, MinIO, ChromaDB
docker-compose up -d mysql redis minio chromadb

# Verify all services are healthy
docker-compose ps
```

### Step 3 — Apply Database Migrations

```powershell
cd backend

# Install EF Core tools (first time only)
dotnet tool install --global dotnet-ef

# Apply migrations
dotnet ef database update --project src/Infrastructure --startup-project src/API

cd ..
```

### Step 4 — Start the Backend API

```powershell
cd backend
dotnet run --project src/API
# API running at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

### Step 5 — Start the Frontend

```powershell
cd frontend
npm install    # if not done by setup script
npm run dev
# App running at http://localhost:3000
```

### Step 6 — Start AI Services (Optional for Phase 1)

```powershell
cd ai-services

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Start with mock mode (no OpenAI API key needed)
$env:MOCK_AI = "true"
uvicorn main:app --reload --port 8000
# AI Docs at http://localhost:8000/docs
```

## Service URLs

| Service | URL | Credentials |
|---|---|---|
| Frontend | http://localhost:3000 | — |
| Backend API | http://localhost:5000 | — |
| Swagger UI | http://localhost:5000/swagger | — |
| AI Services | http://localhost:8000 | — |
| AI Docs | http://localhost:8000/docs | — |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |

## First Login

1. Open http://localhost:3000
2. Click "Get Started Free"
3. Fill the registration form and sign up
4. You'll be redirected to the contractor dashboard

## Development Workflow

```powershell
# Run backend tests
cd backend
dotnet test BuildSaathi.sln

# Run frontend type check
cd frontend
npm run type-check

# Run frontend lint
npm run lint

# Add a new EF Core migration (after changing domain entities)
cd backend
dotnet ef migrations add MigrationName --project src/Infrastructure --startup-project src/API
```

## Docker Full Stack (Alternative)

Run all services via Docker Compose:

```powershell
docker-compose up -d
```

This starts all 7 services at once. Use this for integration testing.

## Common Issues

| Problem | Solution |
|---|---|
| `MySQL connection refused` | Wait 10–15s after `docker-compose up`, MySQL takes time to initialize |
| `JWT secret not configured` | Add `JWT_SECRET` to `.env` (min 32 chars) |
| `dotnet ef not found` | Run `dotnet tool install --global dotnet-ef` |
| Frontend can't reach API | Check `NEXT_PUBLIC_API_URL` in `.env` — should be `http://localhost:5000/api/v1` |
| AI service 500 error | Set `MOCK_AI=true` in `.env` to use mocked responses |

## Project Structure Quick Reference

```
BuildSaathi/
├── frontend/          → npm run dev         (http://localhost:3000)
├── backend/           → dotnet run           (http://localhost:5000)
├── ai-services/       → uvicorn main:app     (http://localhost:8000)
├── infra/             → docker-compose.yml
└── docs/              → Architecture docs
```
