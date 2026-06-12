using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Queries.GetEstimatesList;

public record GetEstimatesListQuery : IRequest<EstimationApiEnvelope<IReadOnlyList<EstimateListItemDto>>>;
