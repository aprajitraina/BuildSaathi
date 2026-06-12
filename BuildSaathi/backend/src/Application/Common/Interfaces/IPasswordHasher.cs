namespace BuildSaathi.Application.Common.Interfaces;

/// <summary>
/// Abstraction for password hashing and verification.
/// Implemented in Infrastructure to keep cryptographic dependencies out of Application.
/// </summary>
public interface IPasswordHasher
{
    string HashPassword(string password);
    bool VerifyPassword(string password, string passwordHash);
}
