using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Activity.Queries.GetActivityEvents;

public class GetActivityEventsHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetActivityEventsQuery, IReadOnlyCollection<ActivityEventDto>>
{
    public async Task<IReadOnlyCollection<ActivityEventDto>> Handle(GetActivityEventsQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var limit = Math.Clamp(request.Limit, 1, 100);

        var events = await db.ActivityEvents
            .Where(e => e.ContractorId == contractorId)
            .OrderByDescending(e => e.CreatedAt)
            .Take(limit)
            .Select(e => new ActivityEventDto(
                e.Id,
                e.EventType,
                e.Description,
                e.EntityType,
                e.EntityId,
                e.CreatedAt))
            .ToListAsync(cancellationToken);

        return events;
    }
}
