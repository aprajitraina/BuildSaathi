using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Infrastructure.Persistence;

/// <summary>
/// EF Core DbContext. Implements IApplicationDbContext so Application layer
/// can reference it without taking a dependency on EF Core types directly.
///
/// Global query filters:
/// - Soft delete: IsDeleted == false on all BaseEntity-derived types
/// - Tenant isolation: ContractorId == current contractor for ITenantEntity types
/// </summary>
public class ApplicationDbContext(
    DbContextOptions<ApplicationDbContext> options,
    ICurrentUserService currentUser) : DbContext(options), IApplicationDbContext
{
    public DbSet<Contractor> Contractors => Set<Contractor>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Tender> Tenders => Set<Tender>();
    public DbSet<TenderMatch> TenderMatches => Set<TenderMatch>();
    public DbSet<TenderSummary> TenderSummaries => Set<TenderSummary>();
    public DbSet<BOQ> BOQs => Set<BOQ>();
    public DbSet<BOQLineItem> BOQLineItems => Set<BOQLineItem>();
    public DbSet<DSRRate> DSRRates => Set<DSRRate>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Milestone> Milestones => Set<Milestone>();
    public DbSet<Invoice> Invoices => Set<Invoice>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<MaterialRate> MaterialRates => Set<MaterialRate>();
    public DbSet<Document> Documents => Set<Document>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<ActivityEvent> ActivityEvents => Set<ActivityEvent>();
    public DbSet<Estimate> Estimates => Set<Estimate>();
    public DbSet<EstimateItem> EstimateItems => Set<EstimateItem>();
    public DbSet<EstimateWarning> EstimateWarnings => Set<EstimateWarning>();
    public DbSet<RateMaster> RateMasters => Set<RateMaster>();
    private Guid CurrentContractorId => currentUser.ContractorId;
    private bool IsTenantFilterBypassed => !currentUser.IsAuthenticated || currentUser.ContractorId == Guid.Empty;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all IEntityTypeConfiguration<T> implementations in this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);

        // Global filters: soft-delete + tenant isolation where applicable
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType) ||
                typeof(ITenantEntity).IsAssignableFrom(entityType.ClrType))
            {
                modelBuilder.Entity(entityType.ClrType)
                    .HasQueryFilter(BuildGlobalFilter(entityType.ClrType));
            }
        }
    }

    private System.Linq.Expressions.LambdaExpression BuildGlobalFilter(Type entityType)
    {
        var param = System.Linq.Expressions.Expression.Parameter(entityType, "e");
        System.Linq.Expressions.Expression? predicate = null;

        if (typeof(BaseEntity).IsAssignableFrom(entityType))
        {
            var isDeletedProp = System.Linq.Expressions.Expression.Property(param, nameof(BaseEntity.IsDeleted));
            var notDeleted = System.Linq.Expressions.Expression.Not(isDeletedProp);
            predicate = notDeleted;
        }

        if (typeof(ITenantEntity).IsAssignableFrom(entityType))
        {
            var contractorProp = System.Linq.Expressions.Expression.Property(param, nameof(ITenantEntity.ContractorId));
            var currentContractor = System.Linq.Expressions.Expression.Property(
                System.Linq.Expressions.Expression.Constant(this),
                nameof(CurrentContractorId));
            var bypassTenantFilter = System.Linq.Expressions.Expression.Property(
                System.Linq.Expressions.Expression.Constant(this),
                nameof(IsTenantFilterBypassed));
            var contractorMatches = System.Linq.Expressions.Expression.Equal(contractorProp, currentContractor);
            var tenantPredicate = System.Linq.Expressions.Expression.OrElse(bypassTenantFilter, contractorMatches);
            predicate = predicate is null
                ? tenantPredicate
                : System.Linq.Expressions.Expression.AndAlso(predicate, tenantPredicate);
        }

        return System.Linq.Expressions.Expression.Lambda(predicate!, param);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-set audit fields on save
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    if (currentUser.IsAuthenticated)
                        entry.Entity.CreatedById = currentUser.UserId;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    if (currentUser.IsAuthenticated)
                        entry.Entity.UpdatedById = currentUser.UserId;
                    break;
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
