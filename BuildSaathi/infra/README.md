# infra/

Infrastructure as code — Docker, CI/CD, and utility scripts.

## Structure

| Folder | Purpose |
|---|---|
| `docker/` | Dockerfiles for each service |
| `ci/` | GitHub Actions workflow files |
| `scripts/` | Developer utility scripts (setup, seed, reset-db) |

## Quick Start

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Reset database (WARNING: destroys data)
./infra/scripts/reset-db.sh

# Seed development data
./infra/scripts/seed.sh
```

## Environments

| Environment | Config file | Notes |
|---|---|---|
| Development | `.env` (copy from `.env.example`) | Docker Compose |
| Staging | GitHub Actions secrets | Container registry deploy |
| Production | Environment variables | Managed cloud |
