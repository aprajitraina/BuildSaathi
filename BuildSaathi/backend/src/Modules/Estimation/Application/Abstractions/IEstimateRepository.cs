using BuildSaathi.Modules.Estimation.Domain.Entities;

namespace BuildSaathi.Modules.Estimation.Application.Abstractions;

public interface IEstimateRepository
{
    Task<Estimate?> GetDetailedAsync(Guid id, Guid contractorId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Estimate>> ListForContractorAsync(Guid contractorId, CancellationToken cancellationToken = default);
    void Add(Estimate estimate);
}
