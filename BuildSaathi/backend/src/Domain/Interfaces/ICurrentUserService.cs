namespace BuildSaathi.Domain.Interfaces;

/// <summary>
/// Provides the identity of the currently authenticated user.
/// Implemented in the API layer using HttpContext, injected throughout Application layer.
/// This keeps Application layer free from HTTP concerns.
/// </summary>
public interface ICurrentUserService
{
    Guid UserId { get; }
    Guid ContractorId { get; }
    string UserName { get; }
    bool IsAuthenticated { get; }
}
