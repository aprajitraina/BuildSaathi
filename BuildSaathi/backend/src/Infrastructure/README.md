# Infrastructure/

Implements all interfaces defined in Domain and Application. Handles persistence, external services, and I/O.

## What Lives Here

- **Persistence/**: EF Core ApplicationDbContext, entity configurations, migrations, repositories
- **Services/**: ITokenService (JWT), IAIService (HTTP client to Python AI), IFileStorageService (S3/MinIO)
- **DependencyInjection.cs**: Registers all infrastructure services with the DI container

## EF Core Conventions

- All entities use `BaseEntity` — EF Core picks up Id, CreatedAt, UpdatedAt, IsDeleted
- Global query filters applied for soft-delete (`!e.IsDeleted`) and tenant isolation (`e.ContractorId == currentTenantId`)
- Migrations live in `Persistence/Migrations/`

## Adding a Migration

```bash
cd backend
dotnet ef migrations add MigrationName --project src/Infrastructure --startup-project src/API
dotnet ef database update --project src/Infrastructure --startup-project src/API
```
