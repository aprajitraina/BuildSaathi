using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Mapping;
using BuildSaathi.Modules.Estimation.Domain;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Modules.Estimation.Application.Commands.CreateEstimateFromForm;

public class CreateEstimateFromFormHandler(
    ICurrentUserService currentUser,
    IBuildingEstimationEngine buildingEngine,
    IEstimateRepository estimates,
    IApplicationDbContext db,
    ILogger<CreateEstimateFromFormHandler> logger) : IRequestHandler<CreateEstimateFromFormCommand, EstimationApiEnvelope<EstimateDetailDto>>
{
    public async Task<EstimationApiEnvelope<EstimateDetailDto>> Handle(CreateEstimateFromFormCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        if (contractorId == Guid.Empty)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Contractor context is required.");

        var lines = await buildingEngine.GenerateAsync(request.AreaSqFt, request.Location, cancellationToken);
        var estimate = Estimate.Create(
            contractorId,
            EstimateSourceType.Form,
            ProjectType.Building,
            request.EstimateType,
            request.AreaSqFt,
            request.Location,
            request.Floors,
            request.FinishType,
            request.TenderId);

        var order = 0;
        foreach (var line in lines)
        {
            estimate.AddItem(EstimateItem.Create(
                estimate.Id,
                line.ItemName,
                line.Quantity,
                line.Unit,
                line.Rate,
                line.Amount,
                order++));
        }

        estimates.Add(estimate);
        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("Created estimate {EstimateId} from form for contractor {ContractorId}", estimate.Id, contractorId);

        var reloaded = await estimates.GetDetailedAsync(estimate.Id, contractorId, cancellationToken);
        return EstimationApiEnvelope<EstimateDetailDto>.Ok(EstimateDtoMapper.ToDetailDto(reloaded!));
    }
}
