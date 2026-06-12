using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.RequestAIEstimate;

public record RequestAIEstimateCommand(
    Guid BOQId,
    string? ProjectScope = null,
    decimal? EstimatedAreaSqm = null,
    decimal? EstimatedLengthKm = null) : IRequest<BOQEstimationResponse>;

public record BOQEstimationResponse(
    Guid BOQId,
    IReadOnlyList<BOQEstimationSuggestionResponse> SuggestedItems,
    decimal TotalEstimatedCost,
    string Disclaimer,
    bool IsAiGenerated);

public record BOQEstimationSuggestionResponse(
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    decimal Amount,
    string? DsrCode,
    string Category,
    string? QuantityHint,
    decimal Confidence);
