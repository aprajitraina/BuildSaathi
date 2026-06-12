# Architecture

## System Overview

BuildSaathi uses a three-tier architecture:

```
[Next.js Frontend] ──HTTP──▶ [ASP.NET Core API] ──EF Core──▶ [MySQL 8]
                                      │
                              HTTP ──▶ [Python AI Services] ──▶ [ChromaDB]
                                      │
                              [Redis Cache + Hangfire Jobs]
                              [MinIO File Storage]
```

## Layer Responsibilities

### Frontend (Next.js 14 App Router)
- Server-side rendering for SEO and initial load performance
- Domain-module-based structure: each product module owns its UI, hooks, and service calls
- React Query for server state; Zustand for UI/client-only state
- ShadCN UI components built on Radix + Tailwind

### Backend (ASP.NET Core Clean Architecture)
- **Domain**: Entities, Value Objects, Domain Events, Repository Interfaces — zero framework deps
- **Application**: CQRS Handlers (MediatR), Use Cases, DTOs, FluentValidation validators
- **Infrastructure**: EF Core DbContext, MySQL provider, Repository implementations, external HTTP clients
- **API**: Controllers, JWT middleware, Swagger, global error handling, DI composition

### AI Services (Python FastAPI)
- Independent microservice, independently deployable and scalable
- REST endpoints consumed by the .NET API (never directly from frontend)
- LangChain orchestration for prompt pipelines
- ChromaDB vector store for RAG (Retrieval-Augmented Generation)
- Graceful degradation: if AI is unavailable, mock/cached response is returned

## Multi-Tenancy Model

Row-level tenancy via `ContractorId` foreign key on all tenant-scoped entities.
EF Core global query filters enforce isolation at the ORM level.
JWT claims carry `ContractorId` and `UserId` — injected via `ICurrentUserService`.

## Key Architecture Decisions

| Decision | Choice | Reason |
|---|---|---|
| State management | React Query + Zustand | Server vs UI state separation |
| Backend pattern | CQRS + MediatR | Testability, future event sourcing |
| Database | MySQL 8 | Indian hosting availability |
| AI integration | Python microservice | Better ML ecosystem, independent scaling |
| Tenancy | Row-level (ContractorId) | Simpler ops at startup scale |
| File storage | S3-compatible (MinIO) | Portability across environments |
| Background jobs | Hangfire (.NET) | Visibility dashboard, .NET-native |

## ADR Index

ADR-001: Use Clean Architecture for backend layer separation  
ADR-002: Row-level multi-tenancy over schema-per-tenant  
ADR-003: Python AI microservice over in-process .NET LLM SDK  
ADR-004: MySQL over PostgreSQL for Indian hosting compatibility  
