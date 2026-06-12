# Application.Tests/

Unit tests for Application layer handlers. Uses xUnit + Moq + FluentAssertions.

## What to Test

- Command handlers: business logic correctness
- Query handlers: correct filtering and projection
- Validators: invalid input rejection
- Domain entity invariants

## What NOT to Test Here

- EF Core database behavior (use integration tests in API.Tests)
- HTTP endpoints (use API.Tests with WebApplicationFactory)
- Infrastructure implementations

## Test Conventions

- One test class per handler: `RegisterHandlerTests.cs`
- Use in-memory DbContext or mocked `IApplicationDbContext`
- Arrange-Act-Assert structure, no nested test classes
