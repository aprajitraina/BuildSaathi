using System.Security.Claims;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.API.Services;

/// <summary>
/// Extracts the current user identity from the HTTP request's JWT claims.
/// Injected into Application handlers via ICurrentUserService to keep them HTTP-agnostic.
/// </summary>
public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private readonly ClaimsPrincipal? _user = httpContextAccessor.HttpContext?.User;

    public Guid UserId =>
        Guid.TryParse(_user?.FindFirstValue("userId"), out var id) ? id : Guid.Empty;

    public Guid ContractorId =>
        Guid.TryParse(_user?.FindFirstValue("contractorId"), out var id) ? id : Guid.Empty;

    public string UserName =>
        _user?.FindFirstValue(ClaimTypes.Name) ?? string.Empty;

    public bool IsAuthenticated =>
        _user?.Identity?.IsAuthenticated ?? false;
}
