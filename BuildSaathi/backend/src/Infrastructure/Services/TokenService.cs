using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BuildSaathi.Infrastructure.Services;

/// <summary>
/// JWT access token generation and refresh token creation.
/// ContractorId and UserId are embedded as claims — read by ICurrentUserService in API layer.
/// </summary>
public class TokenService(IConfiguration config) : ITokenService
{
    private readonly string _secret = config["JwtSettings:Secret"] ?? throw new InvalidOperationException("JWT secret not configured.");
    private readonly string _issuer = config["JwtSettings:Issuer"] ?? "BuildSaathi";
    private readonly string _audience = config["JwtSettings:Audience"] ?? "BuildSaathi-Client";
    private readonly int _expiryMinutes = int.TryParse(config["JwtSettings:ExpiryMinutes"], out var m) ? m : 15;

    public string GenerateAccessToken(User user, Contractor contractor)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim("contractorId", contractor.Id.ToString()),
            new Claim("userId", user.Id.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim("contractorName", contractor.Name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        var token = new JwtSecurityToken(
            issuer: _issuer,
            audience: _audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_expiryMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var bytes = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(bytes);
        return Convert.ToBase64String(bytes);
    }

    public Guid? GetUserIdFromToken(string token)
    {
        try
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(token);
            var sub = jwt.Claims.FirstOrDefault(c => c.Type == "userId")?.Value;
            return Guid.TryParse(sub, out var id) ? id : null;
        }
        catch
        {
            return null;
        }
    }
}
