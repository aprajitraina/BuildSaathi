namespace BuildSaathi.Modules.Estimation.Application.Abstractions;

public record EstimationItemPayload(string ItemName, decimal Quantity, string Unit, decimal Rate, decimal Amount);

public record NormalizedItemResult(int Index, string NormalizedName, string? Suggestion);

public record NormalizeItemsResult(IReadOnlyList<NormalizedItemResult> Items);

public record SuggestImprovementsResult(IReadOnlyList<string> Suggestions);

public interface IEstimationAIClient
{
    Task<NormalizeItemsResult> NormalizeItemsAsync(IReadOnlyList<EstimationItemPayload> items, CancellationToken cancellationToken = default);
    Task<SuggestImprovementsResult> SuggestImprovementsAsync(IReadOnlyList<EstimationItemPayload> items, CancellationToken cancellationToken = default);
}
