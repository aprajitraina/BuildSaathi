using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Notifications.Commands;

public class MarkNotificationReadHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<MarkNotificationReadCommand>
{
    public async Task Handle(MarkNotificationReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await db.Notifications
            .FirstOrDefaultAsync(n => n.Id == request.NotificationId && n.ContractorId == currentUser.ContractorId, cancellationToken);

        if (notification is not null)
        {
            notification.MarkRead();
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}

public class MarkAllNotificationsReadHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<MarkAllNotificationsReadCommand>
{
    public async Task Handle(MarkAllNotificationsReadCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var unread = await db.Notifications
            .Where(n => n.ContractorId == contractorId && !n.IsRead)
            .ToListAsync(cancellationToken);

        foreach (var n in unread) n.MarkRead();

        await db.SaveChangesAsync(cancellationToken);
    }
}
