using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Commands.ImproveEstimateWithAI;

public record ImproveEstimateWithAICommand(Guid EstimateId) : IRequest<EstimationApiEnvelope<EstimateDetailDto>>;
