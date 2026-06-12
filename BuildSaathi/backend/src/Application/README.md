# Application/

Use-case layer. Contains all business operations as Commands and Queries using CQRS via MediatR.

## Rules

- Depends only on Domain — never on Infrastructure or API
- Each feature lives in `Features/{ModuleName}/Commands/` or `Features/{ModuleName}/Queries/`
- Each command/query has its own handler in the same folder
- FluentValidation validators run via MediatR pipeline behavior (ValidationBehavior)
- DTOs (response shapes) defined per feature — no entity leakage to callers

## Structure

```
Application/
├── DependencyInjection.cs          → IServiceCollection extension for DI registration
├── Common/
│   ├── Behaviors/                  → MediatR pipeline behaviors (Validation, Logging)
│   ├── Exceptions/                 → Application-level exceptions (NotFoundException, etc.)
│   └── Interfaces/                 → Application-specific abstractions (ITokenService, etc.)
└── Features/
    ├── Auth/
    │   ├── Commands/Register/
    │   ├── Commands/Login/
    │   └── Commands/RefreshToken/
    ├── Tenders/
    │   ├── Queries/SearchTenders/
    │   ├── Queries/GetTenderById/
    │   ├── Commands/SaveTender/
    │   └── Commands/RequestAISummary/
    ├── BOQ/
    │   ├── Commands/CreateBOQ/
    │   ├── Commands/AddLineItem/
    │   └── Queries/GetBOQ/
    ├── Dashboard/
    │   └── Queries/GetDashboardSummary/
    └── Notifications/
        └── Queries/GetNotifications/
```

## Adding a Feature

```
Features/Tenders/Commands/SaveTender/
├── SaveTenderCommand.cs        → IRequest<SaveTenderResponse>
├── SaveTenderHandler.cs        → IRequestHandler<SaveTenderCommand, SaveTenderResponse>
├── SaveTenderValidator.cs      → AbstractValidator<SaveTenderCommand>
└── SaveTenderResponse.cs       → DTO returned to caller
```
