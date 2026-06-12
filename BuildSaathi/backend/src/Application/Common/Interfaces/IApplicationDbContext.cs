using BuildSaathi.Domain.Entities;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Common.Interfaces;

/// <summary>
/// Application-layer DbContext interface — keeps Application handlers independent from EF Core types.
/// Infrastructure implements this with the real ApplicationDbContext.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<Contractor> Contractors { get; }
    DbSet<User> Users { get; }
    DbSet<Tender> Tenders { get; }
    DbSet<TenderMatch> TenderMatches { get; }
    DbSet<TenderSummary> TenderSummaries { get; }
    DbSet<BOQ> BOQs { get; }
    DbSet<BOQLineItem> BOQLineItems { get; }
    DbSet<DSRRate> DSRRates { get; }
    DbSet<Project> Projects { get; }
    DbSet<Milestone> Milestones { get; }
    DbSet<Invoice> Invoices { get; }
    DbSet<Payment> Payments { get; }
    DbSet<MaterialRate> MaterialRates { get; }
    DbSet<Document> Documents { get; }
    DbSet<Notification> Notifications { get; }
    DbSet<ActivityEvent> ActivityEvents { get; }
    DbSet<Estimate> Estimates { get; }
    DbSet<EstimateItem> EstimateItems { get; }
    DbSet<EstimateWarning> EstimateWarnings { get; }
    DbSet<RateMaster> RateMasters { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
