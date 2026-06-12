using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Mapping;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Queries.GetEstimatesList;

public class GetEstimatesListHandler(
    ICurrentUserService currentUser,
    IEstimateRepository estimates) : IRequestHandler<GetEstimatesListQuery, EstimationApiEnvelope<IReadOnlyList<EstimateListItemDto>>>
{
    public async Task<EstimationApiEnvelope<IReadOnlyList<EstimateListItemDto>>> Handle(GetEstimatesListQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        if (contractorId == Guid.Empty)
            return EstimationApiEnvelope<IReadOnlyList<EstimateListItemDto>>.Fail("Contractor context is required.");

        var list = await estimates.ListForContractorAsync(contractorId, cancellationToken);
        var dto = list.Select(EstimateDtoMapper.ToListItemDto).ToList();
        return EstimationApiEnvelope<IReadOnlyList<EstimateListItemDto>>.Ok(dto);
    }
}
