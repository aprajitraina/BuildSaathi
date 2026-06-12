using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using BuildSaathi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Modules.Estimation.Infrastructure.Repositories;

public class EstimateRepository(ApplicationDbContext db) : IEstimateRepository
{
    public void Add(Estimate estimate) => db.Estimates.Add(estimate);

    public async Task<Estimate?> GetDetailedAsync(Guid id, Guid contractorId, CancellationToken cancellationToken = default) =>
        await db.Estimates
            .AsSplitQuery()
            .Include(e => e.Items)
            .Include(e => e.Warnings)
            .FirstOrDefaultAsync(e => e.Id == id && e.ContractorId == contractorId, cancellationToken);

    public async Task<IReadOnlyList<Estimate>> ListForContractorAsync(Guid contractorId, CancellationToken cancellationToken = default) =>
        await db.Estimates
            .AsNoTracking()
            .Include(e => e.Items)
            .Where(e => e.ContractorId == contractorId)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync(cancellationToken);
}
