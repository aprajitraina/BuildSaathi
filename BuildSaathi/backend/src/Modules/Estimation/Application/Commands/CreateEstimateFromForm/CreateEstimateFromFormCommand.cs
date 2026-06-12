using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Domain;
using MediatR;

namespace BuildSaathi.Modules.Estimation.Application.Commands.CreateEstimateFromForm;

public record CreateEstimateFromFormCommand(
    decimal AreaSqFt,
    string Location,
    int? Floors,
    string? FinishType,
    EstimateType EstimateType = EstimateType.Residential,
    Guid? TenderId = null) : IRequest<EstimationApiEnvelope<EstimateDetailDto>>;
