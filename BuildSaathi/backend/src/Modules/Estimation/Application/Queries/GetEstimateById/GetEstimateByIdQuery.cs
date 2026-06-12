using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Queries.GetEstimateById;

public record GetEstimateByIdQuery(Guid Id) : IRequest<EstimationApiEnvelope<EstimateDetailDto>>;
