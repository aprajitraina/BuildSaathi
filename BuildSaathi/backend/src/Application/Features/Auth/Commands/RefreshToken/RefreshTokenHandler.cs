using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.Auth.Commands.Register;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Auth.Commands.RefreshToken;

public class RefreshTokenHandler(
    IApplicationDbContext db,
    ITokenService tokenService) : IRequestHandler<RefreshTokenCommand, AuthResponse>
{
    public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var incomingToken = request.RefreshToken.Trim();

        var user = await db.Users
            .Include(u => u.Contractor)
            .FirstOrDefaultAsync(
                u => u.RefreshToken == incomingToken && u.IsActive,
                cancellationToken);

        if (user is null || !user.IsRefreshTokenValid(incomingToken))
            throw new UnauthorizedAccessException("Invalid or expired refresh token.");

        // Rotate refresh token on every successful refresh to prevent replay.
        var newRefreshToken = tokenService.GenerateRefreshToken();
        user.SetRefreshToken(newRefreshToken, DateTime.UtcNow.AddDays(7));
        await db.SaveChangesAsync(cancellationToken);

        var accessToken = tokenService.GenerateAccessToken(user, user.Contractor);

        return new AuthResponse(
            AccessToken: accessToken,
            RefreshToken: newRefreshToken,
            ExpiresIn: 900,
            Contractor: new ContractorDto(
                user.Contractor.Id,
                user.Contractor.Name,
                user.Email,
                user.Phone ?? string.Empty,
                user.Contractor.CompanyName,
                user.Contractor.City,
                user.Contractor.State)
        );
    }
}
