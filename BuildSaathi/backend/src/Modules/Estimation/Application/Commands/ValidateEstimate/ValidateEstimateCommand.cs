using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Commands.ValidateEstimate;

public record ValidateEstimateCommand(Guid EstimateId) : IRequest<EstimationApiEnvelope<EstimateDetailDto>>;
