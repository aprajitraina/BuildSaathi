# backend/

ASP.NET Core (.NET 8) backend for BuildSaathi using Clean Architecture.

## Architecture

```
BuildSaathi.sln
└── src/
    ├── BuildSaathi.Domain/         → Entities, Value Objects, Domain Events, Interfaces
    ├── BuildSaathi.Application/    → CQRS Handlers, Use Cases, DTOs, Validators
    ├── BuildSaathi.Infrastructure/ → EF Core, MySQL, Repos, External Services
    └── BuildSaathi.API/            → Controllers, Middleware, JWT, Swagger
└── tests/
    ├── BuildSaathi.Domain.Tests/
    ├── BuildSaathi.Application.Tests/
    └── BuildSaathi.API.Tests/
```

## Dependency Rule

Domain ← Application ← Infrastructure ← API  
Only the outer layer depends on the inner. Domain has zero framework dependencies.

## Running Locally

```bash
cd backend

# Restore dependencies
dotnet restore

# Run migrations
dotnet ef database update --project src/Infrastructure --startup-project src/API

# Run the API
dotnet run --project src/API

# API is available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

## Key Packages

| Package | Purpose |
|---|---|
| MediatR | CQRS dispatcher — decouples commands/queries from handlers |
| FluentValidation | Pipeline-based validation for all commands |
| EF Core (MySQL) | ORM with code-first migrations |
| JWT Bearer | Authentication middleware |
| Serilog | Structured logging (console + file sinks) |
| Hangfire | Background job processing |
| Mapster | Object-to-object mapping (Commands → Entities, Entities → DTOs) |
| Swashbuckle | Swagger/OpenAPI documentation |

## Adding a New Feature

1. Add entity to `Domain/Entities/`
2. Add repository interface to `Domain/Interfaces/`
3. Create command/query + handler in `Application/Features/{Module}/`
4. Add FluentValidation validator in same folder
5. Implement repository in `Infrastructure/Persistence/Repositories/`
6. Add controller endpoint in `API/Controllers/`
7. Write unit test for handler in `tests/BuildSaathi.Application.Tests/`
