# Domain/

The heart of BuildSaathi. Contains all business entities, value objects, domain events, and repository interfaces.

## Rules

- Zero dependencies on any framework (no EF Core, no ASP.NET, no MediatR)
- Entities enforce their own invariants — never expose raw setters where validation is needed
- All repository interfaces live here; implementations live in Infrastructure

## Structure

```
Domain/
├── Entities/           → Core business objects (Contractor, Tender, Project, BOQ, etc.)
├── Enums/              → Domain enumerations
├── Events/             → Domain events raised by entity state changes
├── Exceptions/         → Domain-specific exceptions
├── Interfaces/         → Repository contracts + other abstractions
└── ValueObjects/       → Immutable value types (Money, Address, etc.)
```
