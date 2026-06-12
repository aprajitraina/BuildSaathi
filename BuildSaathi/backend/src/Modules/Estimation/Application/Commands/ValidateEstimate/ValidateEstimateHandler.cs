using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Mapping;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Modules.Estimation.Application.Commands.ValidateEstimate;

public class ValidateEstimateHandler(
    ICurrentUserService currentUser,
    IEstimateRepository estimates,
    IEstimateValidationService validation,
    IApplicationDbContext db,
    ILogger<ValidateEstimateHandler> logger) : IRequestHandler<ValidateEstimateCommand, EstimationApiEnvelope<EstimateDetailDto>>
{
    public async Task<EstimationApiEnvelope<EstimateDetailDto>> Handle(ValidateEstimateCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        if (contractorId == Guid.Empty)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Contractor context is required.");

        var estimate = await estimates.GetDetailedAsync(request.EstimateId, contractorId, cancellationToken);
        if (estimate is null)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Estimate not found.");

        var issues = await validation.ValidateAsync(estimate, cancellationToken);

        var existing = estimate.Warnings.ToList();
        db.EstimateWarnings.RemoveRange(existing);
        estimate.Warnings.Clear();

        foreach (var issue in issues)
            estimate.Warnings.Add(EstimateWarning.Create(estimate.Id, issue.Level, issue.Message, issue.Code));

        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Validated estimate {EstimateId}: {WarningCount} issues", estimate.Id, issues.Count);

        var reloaded = await estimates.GetDetailedAsync(estimate.Id, contractorId, cancellationToken);
        return EstimationApiEnvelope<EstimateDetailDto>.Ok(EstimateDtoMapper.ToDetailDto(reloaded!));
    }
}
