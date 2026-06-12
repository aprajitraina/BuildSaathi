using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Auth.Commands.Logout;

public class LogoutHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<LogoutCommand, Unit>
{
    public async Task<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        if (!currentUser.IsAuthenticated || currentUser.UserId == Guid.Empty)
            throw new UnauthorizedAccessException("Unauthorized.");

        var user = await db.Users
            .FirstOrDefaultAsync(u => u.Id == currentUser.UserId, cancellationToken);

        if (user is null)
            throw new UnauthorizedAccessException("Unauthorized.");

        user.RevokeRefreshToken();
        await db.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
