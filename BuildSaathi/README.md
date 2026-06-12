# BuildSaathi (NirmaanOS)

> **AI-Powered Contractor Operating System for India**  
> Positioning: BidAssist + Procore + IndiaMART — built for Bharat-scale small contractors.

---

## What is BuildSaathi?

BuildSaathi is a SaaS platform that helps small-town and mid-sized Indian contractors:

- **Discover** government and private tenders relevant to their trade and location
- **Understand** complex tender documents instantly via AI summarization
- **Estimate** project costs accurately using DSR (Delhi Schedule of Rates) data
- **Track** project progress, milestones, and team coordination
- **Manage** materials, suppliers, billing, and document compliance

---

## Monorepo Structure

```
BuildSaathi/
├── frontend/          → Next.js 14 App Router (TypeScript, Tailwind, ShadCN)
├── backend/           → ASP.NET Core (.NET 8) Clean Architecture API
├── ai-services/       → Python FastAPI microservices (AI/ML)
├── infra/             → Docker, GitHub Actions CI/CD, scripts
└── docs/              → Architecture, API reference, product specs
```

---

## Quick Start

See [SETUP.md](./SETUP.md) for full developer onboarding instructions.

```bash
# 1. Clone and enter the repo
git clone https://github.com/your-org/BuildSaathi.git
cd BuildSaathi

# 2. Copy environment config
cp .env.example .env
# Edit .env with your local values

# 3. Start all services
docker-compose up -d

# 4. Apply database migrations
cd backend && dotnet ef database update --project src/Infrastructure --startup-project src/API

# 5. Open the app
# Frontend: http://localhost:3000
# API:      http://localhost:5000/swagger
# AI:       http://localhost:8000/docs
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, ShadCN UI, React Query, Zustand |
| Backend | ASP.NET Core (.NET 8), Clean Architecture, CQRS, MediatR, EF Core, MySQL |
| AI Services | Python 3.11, FastAPI, LangChain, OpenAI SDK, ChromaDB |
| Database | MySQL 8.0 |
| DevOps | Docker, docker-compose, GitHub Actions |

---

## Phase Roadmap

| Phase | Scope | Status |
|---|---|---|
| Phase 0 | Monorepo scaffold, Docker, CI, DB schema | ✅ Done |
| Phase 1 | Auth, Dashboard, Tender Discovery, AI Summary, BOQ | 🚧 In Progress |
| Phase 2 | Project Tracker, Billing, Document Vault, Materials | Planned |
| Phase 3 | AI Integration (real), RAG pipeline, Estimation Copilot | Planned |
| Phase 4 | Marketplace foundations, Labor, Scheme Alerts | Planned |
| Phase 5 | Scale, i18n, Mobile-first polish | Planned |

---

## Team

| Role | Contact |
|---|---|
| Technical Co-founder / CTO | — |
| Product | — |

---

## License

Proprietary — All rights reserved. BuildSaathi Pvt. Ltd.
