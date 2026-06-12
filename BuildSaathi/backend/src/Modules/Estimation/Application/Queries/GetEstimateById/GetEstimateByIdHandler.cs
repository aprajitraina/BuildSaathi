using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Mapping;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Queries.GetEstimateById;

public class GetEstimateByIdHandler(
    ICurrentUserService currentUser,
    IEstimateRepository estimates) : IRequestHandler<GetEstimateByIdQuery, EstimationApiEnvelope<EstimateDetailDto>>
{
    public async Task<EstimationApiEnvelope<EstimateDetailDto>> Handle(GetEstimateByIdQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        if (contractorId == Guid.Empty)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Contractor context is required.");

        var estimate = await estimates.GetDetailedAsync(request.Id, contractorId, cancellationToken);
        if (estimate is null)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Estimate not found.");

        return EstimationApiEnvelope<EstimateDetailDto>.Ok(EstimateDtoMapper.ToDetailDto(estimate));
    }
}
