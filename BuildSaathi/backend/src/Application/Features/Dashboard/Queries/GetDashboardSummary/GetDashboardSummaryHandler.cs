using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Dashboard.Queries.GetDashboardSummary;

public class GetDashboardSummaryHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryResponse>
{
    public async Task<DashboardSummaryResponse> Handle(GetDashboardSummaryQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var now = DateTime.UtcNow;

        var savedTendersCount = await db.TenderMatches
            .CountAsync(tm => tm.ContractorId == contractorId, cancellationToken);

        var activeTendersCount = await db.TenderMatches
            .Include(tm => tm.Tender)
            .CountAsync(tm => tm.ContractorId == contractorId &&
                tm.Tender.SubmissionDeadline >= now &&
                tm.Status != TenderMatchStatus.Won &&
                tm.Status != TenderMatchStatus.Lost &&
                tm.Status != TenderMatchStatus.Withdrawn, cancellationToken);

        var activeProjectsCount = await db.Projects
            .CountAsync(p => p.ContractorId == contractorId &&
                p.Status == ProjectStatus.Active && !p.IsDeleted, cancellationToken);

        var paymentDueAmount = await db.Invoices
            .Where(i => i.ContractorId == contractorId &&
                i.Status != InvoiceStatus.Paid &&
                i.Status != InvoiceStatus.Cancelled)
            .SumAsync(i => i.Amount - i.PaidAmount, cancellationToken);

        var unreadCount = await db.Notifications
            .CountAsync(n => n.ContractorId == contractorId && !n.IsRead, cancellationToken);

        // Upcoming deadlines — saved tenders due in next 14 days
        var upcomingDeadlines = await db.TenderMatches
            .Include(tm => tm.Tender)
            .Where(tm => tm.ContractorId == contractorId &&
                tm.Tender.SubmissionDeadline >= now &&
                tm.Tender.SubmissionDeadline <= now.AddDays(14))
            .OrderBy(tm => tm.Tender.SubmissionDeadline)
            .Take(5)
            .Select(tm => new TenderDeadlineDto(
                tm.TenderId,
                tm.Tender.Title,
                tm.Tender.SubmissionDeadline,
                (int)(tm.Tender.SubmissionDeadline - now).TotalDays
            ))
            .ToListAsync(cancellationToken);

        var recentActivity = await db.ActivityEvents
            .Where(e => e.ContractorId == contractorId)
            .OrderByDescending(e => e.CreatedAt)
            .Take(10)
            .Select(e => new ActivityItemDto(
                e.Id,
                NormalizeDashboardActivityType(e.EventType),
                e.Description,
                e.CreatedAt.ToString("yyyy-MM-dd HH:mm"),
                e.EntityId ?? Guid.Empty))
            .ToListAsync(cancellationToken);

        return new DashboardSummaryResponse(
            ActiveTendersCount: activeTendersCount,
            SavedTendersCount: savedTendersCount,
            ActiveProjectsCount: activeProjectsCount,
            PaymentDueAmount: paymentDueAmount,
            UnreadNotificationsCount: unreadCount,
            UpcomingDeadlines: upcomingDeadlines,
            RecentActivity: recentActivity
        );
    }

    private static string NormalizeDashboardActivityType(string eventType)
    {
        return eventType switch
        {
            "tender_saved" => "tender_saved",
            "boq_created" or "boq_updated" => "boq_created",
            "invoice_sent" or "invoice_payment_recorded" => "invoice_sent",
            _ => "project_updated"
        };
    }
}
