using System.Net.Http.Json;
using System.Text.Json.Serialization;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using Microsoft.Extensions.Configuration;
namespace BuildSaathi.Modules.Estimation.Infrastructure.AI;

public class EstimationAIClient(
    HttpClient httpClient,
    IConfiguration configuration) : IEstimationAIClient
{
    private readonly bool _mock = bool.TryParse(configuration["AI_MOCK_MODE"] ?? configuration["AIServiceSettings:MockEnabled"], out var m) && m;

    public async Task<NormalizeItemsResult> NormalizeItemsAsync(
        IReadOnlyList<EstimationItemPayload> items, CancellationToken cancellationToken = default)
    {
        if (_mock)
        {
            var mocked = items.Select((item, i) =>
            {
                var name = item.ItemName.Trim();
                var normalized = name.Length == 0 ? "Item" : char.ToUpperInvariant(name[0]) + name[1..];
                return new NormalizedItemResult(i, normalized, "Mock normalization — verify against specifications.");
            }).ToList();
            return new NormalizeItemsResult(mocked);
        }

        var body = new ItemsRequest(items.Select(i => new ItemDto(i.ItemName, (double)i.Quantity, i.Unit, (double)i.Rate, (double)i.Amount)).ToList());
        using var response = await httpClient.PostAsJsonAsync("/normalize-items", body, cancellationToken);
        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<NormalizeResponseDto>(cancellationToken: cancellationToken);
        if (payload?.Items is null) throw new InvalidOperationException("Invalid normalize-items response.");

        var results = payload.Items
            .Select(i => new NormalizedItemResult(i.Index, i.NormalizedName, i.Suggestion))
            .ToList();
        return new NormalizeItemsResult(results);
    }

    public async Task<SuggestImprovementsResult> SuggestImprovementsAsync(
        IReadOnlyList<EstimationItemPayload> items, CancellationToken cancellationToken = default)
    {
        if (_mock)
        {
            return new SuggestImprovementsResult(new[]
            {
                "Mock: Cross-check steel quantity with structural drawings.",
                "Mock: Confirm cement factor for your finish type and number of floors.",
            });
        }

        var body = new ItemsRequest(items.Select(i => new ItemDto(i.ItemName, (double)i.Quantity, i.Unit, (double)i.Rate, (double)i.Amount)).ToList());
        using var response = await httpClient.PostAsJsonAsync("/suggest-improvements", body, cancellationToken);
        response.EnsureSuccessStatusCode();
        var payload = await response.Content.ReadFromJsonAsync<SuggestResponseDto>(cancellationToken: cancellationToken);
        if (payload?.Suggestions is null) throw new InvalidOperationException("Invalid suggest-improvements response.");

        return new SuggestImprovementsResult(payload.Suggestions);
    }

    private sealed record ItemsRequest([property: JsonPropertyName("items")] IReadOnlyList<ItemDto> Items);

    private sealed record ItemDto(
        [property: JsonPropertyName("item_name")] string ItemName,
        [property: JsonPropertyName("quantity")] double Quantity,
        [property: JsonPropertyName("unit")] string Unit,
        [property: JsonPropertyName("rate")] double Rate,
        [property: JsonPropertyName("amount")] double Amount);

    private sealed record NormalizeResponseDto([property: JsonPropertyName("items")] IReadOnlyList<NormalizeItemDto> Items);

    private sealed record NormalizeItemDto(
        [property: JsonPropertyName("index")] int Index,
        [property: JsonPropertyName("normalized_name")] string NormalizedName,
        [property: JsonPropertyName("suggestion")] string? Suggestion);

    private sealed record SuggestResponseDto([property: JsonPropertyName("suggestions")] IReadOnlyList<string> Suggestions);
}
