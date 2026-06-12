using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Application.Common.Services;

public class ActivityLogger(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IActivityLogger
{
    public void Log(
        string eventType,
        string description,
        string entityType,
        Guid? entityId = null,
        string? metadataJson = null)
    {
        if (!currentUser.IsAuthenticated || currentUser.ContractorId == Guid.Empty)
            return;

        var activity = ActivityEvent.Create(
            currentUser.ContractorId,
            eventType,
            description,
            entityType,
            entityId,
            currentUser.UserId == Guid.Empty ? null : currentUser.UserId,
            metadataJson);

        db.ActivityEvents.Add(activity);
    }
}
