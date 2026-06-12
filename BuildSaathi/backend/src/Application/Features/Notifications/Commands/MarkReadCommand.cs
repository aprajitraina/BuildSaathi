using MediatR;

namespace BuildSaathi.Application.Features.Notifications.Commands;

public record MarkNotificationReadCommand(Guid NotificationId) : IRequest;
public record MarkAllNotificationsReadCommand : IRequest;
