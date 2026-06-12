namespace BuildSaathi.Domain.Models;

public record BOQEstimationSuggestion(
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    decimal Amount,
    string? DsrCode,
    string Category,
    string? QuantityHint,
    decimal Confidence);

public record BOQEstimationResult(
    Guid BOQId,
    IReadOnlyList<BOQEstimationSuggestion> SuggestedItems,
    decimal TotalEstimatedCost,
    string Disclaimer,
    bool IsAiGenerated);
