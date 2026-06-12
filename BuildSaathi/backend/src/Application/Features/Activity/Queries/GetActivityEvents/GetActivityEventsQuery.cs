using MediatR;

namespace BuildSaathi.Application.Features.Activity.Queries.GetActivityEvents;

public record GetActivityEventsQuery(int Limit = 25) : IRequest<IReadOnlyCollection<ActivityEventDto>>;

public record ActivityEventDto(
    Guid Id,
    string EventType,
    string Description,
    string EntityType,
    Guid? EntityId,
    DateTime CreatedAt
);
