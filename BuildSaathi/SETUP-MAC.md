# BuildSaathi — macOS Setup Guide

Complete guide to run the BuildSaathi monorepo on macOS.
Everything listed here is **free** for personal/development use.

---

## Prerequisites — Software Required

### 1. Homebrew (Mac Package Manager)

```bash
/bin/bash -c "$(curl -fsSL https://brew.sh)"
```

---

### 2. Core Runtimes

| Tool | Install Command | Purpose |
|---|---|---|
| **.NET 8 SDK** | `brew install --cask dotnet-sdk` | Backend ASP.NET Core API |
| **Node.js 18+** | `brew install node` | Next.js Frontend |
| **Python 3.12** | `brew install python@3.12` | FastAPI AI Services |
| **Git** | `brew install git` | Version control |

Verify installs:

```bash
dotnet --version        # should show 8.x.x
node --version          # should show v18.x or higher
python3 --version       # should show 3.12.x
```

---

### 3. Docker Desktop (Runs all infrastructure)

Download and install from: https://www.docker.com/products/docker-desktop/

Docker replaces the need to install MySQL, Redis, MinIO, and ChromaDB individually.
One command starts everything.

After installing, open Docker Desktop and wait for it to say **"Engine running"**.

---

### 4. IDE / Code Editor

**Option A — Cursor (Recommended)**
Download from: https://cursor.com

**Option B — VS Code (Free)**
Download from: https://code.visualstudio.com

> ⚠️ Visual Studio for Mac was discontinued by Microsoft. Use Cursor or VS Code instead.

Install the **C# Dev Kit** extension in Cursor/VS Code for backend development:

```
Name: C# Dev Kit
Publisher: Microsoft
ID: ms-dotnettools.csdevkit
```

---

### 5. Optional Tools (Free)

| Tool | Purpose | Download |
|---|---|---|
| **TablePlus** | MySQL GUI to view/manage database | https://tableplus.com (free tier) |
| **Bruno** | API testing (Postman alternative) | https://usebruno.com (free) |
| **Postman** | API testing | https://postman.com (free) |

---

## Project Setup — Step by Step

### Step 1 — Get the Code

```bash
# Clone or copy the project to your Mac
git clone <your-repo-url> BuildSaathi
cd BuildSaathi/BuildSaathi
```

---

### Step 2 — Environment Variables

```bash
# Copy the template env file
cp .env.example .env
```

Open `.env` and set a JWT secret (must be 32+ characters):

```
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
```

Leave everything else at defaults for local development.

---

### Step 3 — Start Infrastructure via Docker

```bash
# From the project root (where docker-compose.yml is)
docker compose up -d mysql redis minio chromadb
```

This starts:
- **MySQL 8** on port `3306`
- **Redis** on port `6379`
- **MinIO** (file storage) on port `9000`
- **ChromaDB** (vector database for AI) on port `8001`

Verify containers are running:

```bash
docker compose ps
```

All four should show `running`.

---

### Step 4 — Backend (ASP.NET Core API)

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Run the API (Development mode)
dotnet run --project src/API/BuildSaathi.API.csproj
```

The API starts on:
- HTTPS: `https://localhost:55761`
- HTTP: `http://localhost:55762`

On first run, the API automatically:
1. Connects to MySQL
2. Runs all EF Core migrations (creates all tables)
3. Seeds demo data (DSR rates, sample contractor account)

> **Demo login credentials:**
> - Email: `demo@buildsaathi.in`
> - Password: `demo1234`

Swagger UI (API docs): http://localhost:55762/swagger

---

### Step 5 — Frontend (Next.js)

Open a new terminal tab:

```bash
cd frontend

# Install npm packages
npm install

# Create local env file
echo "NEXT_PUBLIC_API_URL=http://localhost:55762/api/v1" > .env.local

# Start the dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

### Step 6 — AI Services (FastAPI — Optional)

Open another terminal tab:

```bash
cd ai-services

# Create Python virtual environment
python3 -m venv .venv

# Activate it
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start in mock mode (no OpenAI key required)
AI_MOCK_MODE=true uvicorn main:app --reload --port 8000
```

AI service runs at: http://localhost:8000
API docs: http://localhost:8000/docs

---

## Running Everything at Once

After initial setup, use these three commands (each in a separate terminal tab):

```bash
# Terminal 1 — Infrastructure
docker compose up -d mysql redis minio chromadb

# Terminal 2 — Backend API
cd backend && dotnet run --project src/API/BuildSaathi.API.csproj

# Terminal 3 — Frontend
cd frontend && npm run dev

# Terminal 4 — AI Services (optional)
cd ai-services && source .venv/bin/activate && AI_MOCK_MODE=true uvicorn main:app --reload --port 8000
```

---

## Using Real OpenAI (Optional)

By default, `AI_MOCK_MODE=true` — all AI features return smart mock responses.
No API key required and no charges during development.

To enable real AI:

1. Get an OpenAI API key from: https://platform.openai.com
2. Edit `.env`:

```
AI_MOCK_MODE=false
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o
```

3. Restart the AI service

---

## Troubleshooting

### MySQL connection error on API startup

```
MySqlException: Unable to connect to any of the specified MySQL hosts
```

**Fix:** MySQL container is not running.

```bash
docker compose up -d mysql
docker compose ps   # verify it shows "running"
```

---

### Frontend can't reach the API (Network Error / 404)

**Fix:** The frontend `.env.local` file is missing or has the wrong port.

```bash
# In the frontend/ folder:
echo "NEXT_PUBLIC_API_URL=http://localhost:55762/api/v1" > .env.local
# Then restart: npm run dev
```

---

### dotnet: command not found

```bash
brew install --cask dotnet-sdk
# Then reload your shell:
source ~/.zshrc
```

---

### Certificate warning on HTTPS in browser

Use **HTTP** for local development (`http://localhost:55762`) to avoid self-signed certificate issues on Mac.

---

### Port already in use

```bash
# Find what's using a port (example: 5000)
lsof -i :5000

# Kill it
kill -9 <PID>
```

---

## Cost Summary

| Component | Cost |
|---|---|
| All software (Homebrew, .NET, Node, Python, Docker) | **Free** |
| Cursor IDE | Free plan available |
| Docker Desktop | Free for personal/individual use |
| BuildSaathi itself | Free (your own code) |
| OpenAI API (real AI features) | Pay-per-use — skipped with `AI_MOCK_MODE=true` |

**Total cost to run locally: ₹0**

---

## Project Structure (Quick Reference)

```
BuildSaathi/
├── backend/                  ← ASP.NET Core 8 API
│   └── src/API/              ← Start here for backend
├── frontend/                 ← Next.js 14 App
├── ai-services/              ← Python FastAPI AI
├── docker-compose.yml        ← Starts all infrastructure
├── .env.example              ← Copy to .env
└── SETUP-MAC.md              ← This file
```

---

## Quick Links

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| API (HTTP) | http://localhost:55762 |
| API (HTTPS) | https://localhost:55761 |
| Swagger UI | http://localhost:55762/swagger |
| AI Services | http://localhost:8000 |
| AI Docs | http://localhost:8000/docs |
| MinIO Console | http://localhost:9001 |
