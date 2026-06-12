using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Models;

namespace BuildSaathi.Domain.Interfaces;

/// <summary>
/// Abstraction over the AI microservice (Python FastAPI).
/// The Application layer uses this interface — the actual HTTP call is in Infrastructure.
/// This allows swapping AI providers and makes Application handlers unit-testable.
/// </summary>
public interface IAIService
{
    Task<TenderSummary> SummarizeTenderAsync(Guid tenderId, string tenderContent, CancellationToken cancellationToken = default);
    Task<BOQEstimationResult> EstimateBOQAsync(
        Guid boqId,
        string projectScope,
        string state,
        string category,
        decimal? estimatedAreaSqm = null,
        decimal? estimatedLengthKm = null,
        CancellationToken cancellationToken = default);
}
