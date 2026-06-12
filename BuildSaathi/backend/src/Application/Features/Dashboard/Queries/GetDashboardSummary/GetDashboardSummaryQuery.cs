using MediatR;

namespace BuildSaathi.Application.Features.Dashboard.Queries.GetDashboardSummary;

public record GetDashboardSummaryQuery : IRequest<DashboardSummaryResponse>;

public record DashboardSummaryResponse(
    int ActiveTendersCount,
    int SavedTendersCount,
    int ActiveProjectsCount,
    decimal PaymentDueAmount,
    int UnreadNotificationsCount,
    IEnumerable<TenderDeadlineDto> UpcomingDeadlines,
    IEnumerable<ActivityItemDto> RecentActivity
);

public record TenderDeadlineDto(
    Guid TenderId,
    string TenderTitle,
    DateTime Deadline,
    int DaysRemaining
);

public record ActivityItemDto(
    Guid Id,
    string Type,
    string Description,
    string Timestamp,
    Guid EntityId
);
