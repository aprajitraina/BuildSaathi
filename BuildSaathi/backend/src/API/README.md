# API/

ASP.NET Core Web API — the composition root and HTTP entry point for BuildSaathi.

## Responsibility

- Configure and compose all services (DI registration)
- JWT authentication middleware
- Global exception handler (maps to RFC 7807 ProblemDetails)
- Controllers — thin wrappers that call MediatR with IRequest objects
- Swagger UI for interactive API documentation

## Controllers

| Controller | Route | Purpose |
|---|---|---|
| AuthController | `/api/v1/auth` | Register, login, token refresh |
| TendersController | `/api/v1/tenders` | Tender search, details, save |
| BOQController | `/api/v1/boq` | BOQ CRUD, line items |
| DashboardController | `/api/v1/dashboard` | Dashboard summary |
| ProjectsController | `/api/v1/projects` | Project CRUD (Phase 2) |
| BillingController | `/api/v1/billing` | Invoices, payments (Phase 2) |
| DocumentsController | `/api/v1/documents` | File upload/download (Phase 2) |

## Controller Convention

Controllers are intentionally thin — they only:
1. Deserialize the HTTP request into a Command/Query record
2. Send it via `ISender.Send()`
3. Return the result with appropriate HTTP status code

**No business logic in controllers.** All logic lives in Application layer handlers.
