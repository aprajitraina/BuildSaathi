using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Auth.Commands.Register;

public class RegisterHandler(
    IApplicationDbContext db,
    IPasswordHasher passwordHasher,
    ITokenService tokenService) : IRequestHandler<RegisterCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var emailExists = await db.Users
            .AnyAsync(u => u.Email == request.Email.ToLowerInvariant(), cancellationToken);

        if (emailExists)
            throw new InvalidOperationException("An account with this email already exists.");

        var contractor = Contractor.Create(
            request.Name, request.Email, request.Phone,
            request.CompanyName, request.City, request.State);

        db.Contractors.Add(contractor);

        var passwordHash = passwordHasher.HashPassword(request.Password);
        var user = User.Create(contractor.Id, request.Name, request.Email, passwordHash);

        var refreshToken = tokenService.GenerateRefreshToken();
        user.SetRefreshToken(refreshToken, DateTime.UtcNow.AddDays(7));

        db.Users.Add(user);
        await db.SaveChangesAsync(cancellationToken);

        var accessToken = tokenService.GenerateAccessToken(user, contractor);

        return new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: refreshToken,
            ExpiresIn: 900, // 15 minutes in seconds
            Contractor: new ContractorDto(
                contractor.Id, contractor.Name, contractor.Email,
                contractor.Phone, contractor.CompanyName,
                contractor.City, contractor.State)
        );
    }
}
