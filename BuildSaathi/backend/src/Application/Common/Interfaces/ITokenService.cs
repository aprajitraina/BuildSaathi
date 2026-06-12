using BuildSaathi.Domain.Entities;

namespace BuildSaathi.Application.Common.Interfaces;

/// <summary>
/// Generates and validates JWT access tokens and refresh tokens.
/// Implemented in Infrastructure using Microsoft.IdentityModel.Tokens.
/// </summary>
public interface ITokenService
{
    string GenerateAccessToken(User user, Contractor contractor);
    string GenerateRefreshToken();
    Guid? GetUserIdFromToken(string token);
}
