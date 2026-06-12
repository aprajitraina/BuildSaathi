using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

/// <summary>
/// A human user who belongs to a Contractor organization.
/// A Contractor can have multiple Users with different roles (Owner, Supervisor, Accountant).
/// </summary>
public class User : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string? Phone { get; private set; }
    public UserRole Role { get; private set; } = UserRole.Staff;
    public bool IsActive { get; private set; } = true;
    public string? RefreshToken { get; private set; }
    public DateTime? RefreshTokenExpiresAt { get; private set; }

    public Contractor Contractor { get; private set; } = null!;

    protected User() { }

    public static User Create(Guid contractorId, string name, string email,
        string passwordHash, UserRole role = UserRole.Owner)
    {
        return new User
        {
            ContractorId = contractorId,
            Name = name,
            Email = email.ToLowerInvariant(),
            PasswordHash = passwordHash,
            Role = role,
        };
    }

    public void SetRefreshToken(string token, DateTime expiresAt)
    {
        RefreshToken = token;
        RefreshTokenExpiresAt = expiresAt;
        UpdatedAt = DateTime.UtcNow;
    }

    public void RevokeRefreshToken()
    {
        RefreshToken = null;
        RefreshTokenExpiresAt = null;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool IsRefreshTokenValid(string token) =>
        RefreshToken == token && RefreshTokenExpiresAt > DateTime.UtcNow;
}
