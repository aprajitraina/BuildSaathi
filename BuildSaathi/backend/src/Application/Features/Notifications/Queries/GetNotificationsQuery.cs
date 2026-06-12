using MediatR;

namespace BuildSaathi.Application.Features.Notifications.Queries;

public record GetNotificationsQuery : IRequest<IEnumerable<NotificationDto>>;

public record NotificationDto(
    Guid Id,
    string Title,
    string Message,
    string Type,
    bool IsRead,
    string? ActionUrl,
    DateTime CreatedAt
);
