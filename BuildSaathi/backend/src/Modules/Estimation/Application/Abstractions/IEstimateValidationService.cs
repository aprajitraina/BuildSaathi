using BuildSaathi.Modules.Estimation.Domain;
using BuildSaathi.Modules.Estimation.Domain.Entities;

namespace BuildSaathi.Modules.Estimation.Application.Abstractions;

public record EstimateValidationIssue(EstimateWarningLevel Level, string Message, string? Code = null);

public interface IEstimateValidationService
{
    Task<IReadOnlyList<EstimateValidationIssue>> ValidateAsync(Estimate estimate, CancellationToken cancellationToken = default);
}
