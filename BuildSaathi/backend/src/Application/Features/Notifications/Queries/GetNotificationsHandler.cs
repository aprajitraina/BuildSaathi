using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Notifications.Queries;

public class GetNotificationsHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetNotificationsQuery, IEnumerable<NotificationDto>>
{
    public async Task<IEnumerable<NotificationDto>> Handle(GetNotificationsQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var notifications = await db.Notifications
            .Where(n => n.ContractorId == contractorId)
            .OrderByDescending(n => n.CreatedAt)
            .Take(50)
            .ToListAsync(cancellationToken);

        return notifications.Select(n => new NotificationDto(
            n.Id, n.Title, n.Message, n.Type, n.IsRead, n.ActionUrl, n.CreatedAt));
    }
}
