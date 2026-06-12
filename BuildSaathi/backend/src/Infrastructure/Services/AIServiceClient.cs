using System.Net.Http.Json;
using System.Diagnostics;
using System.Text.Json.Serialization;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Domain.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Infrastructure.Services;

/// <summary>
/// HTTP client that calls the Python FastAPI AI microservice.
/// Implements graceful degradation — if the AI service is unavailable or returns an error,
/// a mock/cached response is returned so the app remains functional.
/// </summary>
public class AIServiceClient(
    HttpClient httpClient,
    IConfiguration config,
    ILogger<AIServiceClient> logger) : IAIService
{
    private readonly bool _mockEnabled = ResolveMockMode(config);
    private readonly int _retryCount = int.TryParse(config["AIServiceSettings:RetryCount"], out var retries) ? Math.Max(0, retries) : 2;
    private readonly int _retryDelayMs = int.TryParse(config["AIServiceSettings:RetryDelayMs"], out var delay) ? Math.Max(0, delay) : 500;
    private readonly int _timeoutSeconds = int.TryParse(config["AIServiceSettings:TimeoutSeconds"], out var timeout) ? Math.Max(5, timeout) : 30;

    public async Task<TenderSummary> SummarizeTenderAsync(
        Guid tenderId, string tenderContent, CancellationToken cancellationToken = default)
    {
        var traceId = Activity.Current?.TraceId.ToString() ?? Guid.NewGuid().ToString("N");

        if (_mockEnabled)
        {
            logger.LogInformation("AI mock enabled for trace {TraceId}", traceId);
            return TenderSummary.CreateMock(tenderId);
        }

        var request = new SummaryRequest(tenderId, tenderContent);
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        cts.CancelAfter(TimeSpan.FromSeconds(_timeoutSeconds));
        Exception? lastError = null;

        for (var attempt = 1; attempt <= _retryCount + 1; attempt++)
        {
            try
            {
                using var message = new HttpRequestMessage(HttpMethod.Post, "/summarize")
                {
                    Content = JsonContent.Create(request),
                };
                message.Headers.Add("X-Trace-Id", traceId);

                var response = await httpClient.SendAsync(message, cts.Token);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<AISummaryResponse>(cancellationToken: cts.Token);
                if (result is null)
                    throw new InvalidOperationException("AI service returned empty summary payload.");

                return TenderSummary.FromAiResponse(
                    tenderId,
                    result.ScopeOfWork,
                    result.KeyRequirements,
                    result.EligibilityCriteria,
                    result.KeyRisks,
                    result.Recommendation,
                    result.RecommendationReason);
            }
            catch (Exception ex) when (!cancellationToken.IsCancellationRequested)
            {
                lastError = ex;
                if (attempt > _retryCount)
                    break;

                logger.LogWarning(
                    "AI summarize retry {Attempt} for trace {TraceId}",
                    attempt,
                    traceId);
                await Task.Delay(_retryDelayMs, cancellationToken);
            }
        }

        logger.LogWarning(lastError, "AI summarize failed for trace {TraceId}", traceId);
        if (_mockEnabled)
            return TenderSummary.CreateMock(tenderId);

        throw new InvalidOperationException($"AI summarization unavailable. traceId={traceId}");
    }

    public async Task<BOQEstimationResult> EstimateBOQAsync(
        Guid boqId,
        string projectScope,
        string state,
        string category,
        decimal? estimatedAreaSqm = null,
        decimal? estimatedLengthKm = null,
        CancellationToken cancellationToken = default)
    {
        var traceId = Activity.Current?.TraceId.ToString() ?? Guid.NewGuid().ToString("N");
        if (_mockEnabled)
        {
            logger.LogInformation("AI mock estimation enabled for trace {TraceId}", traceId);
            var mockSuggestions = new[]
            {
                new BOQEstimationSuggestion(
                    "Site setup and mobilization",
                    "lump-sum",
                    1m,
                    150000m,
                    150000m,
                    "DSR-MOCK-SETUP",
                    "General",
                    "Baseline setup package for a standard site.",
                    0.62m),
                new BOQEstimationSuggestion(
                    "Earthwork excavation",
                    "m3",
                    Math.Max(estimatedLengthKm ?? 1m, 0.1m) * 1200m,
                    310m,
                    Math.Max(estimatedLengthKm ?? 1m, 0.1m) * 1200m * 310m,
                    "DSR-MOCK-EARTH",
                    "Earthwork",
                    "Quantity scales with the provided/assumed linear scope.",
                    0.58m),
            };

            return new BOQEstimationResult(
                boqId,
                mockSuggestions,
                mockSuggestions.Sum(s => s.Amount),
                "Mock estimation generated. Validate rates and quantities before use.",
                false);
        }

        var request = new EstimationRequest(boqId, projectScope, state, category, estimatedAreaSqm, estimatedLengthKm);
        using var cts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
        cts.CancelAfter(TimeSpan.FromSeconds(_timeoutSeconds));
        Exception? lastError = null;

        for (var attempt = 1; attempt <= _retryCount + 1; attempt++)
        {
            try
            {
                using var message = new HttpRequestMessage(HttpMethod.Post, "/estimate")
                {
                    Content = JsonContent.Create(request),
                };
                message.Headers.Add("X-Trace-Id", traceId);

                var response = await httpClient.SendAsync(message, cts.Token);
                response.EnsureSuccessStatusCode();

                var result = await response.Content.ReadFromJsonAsync<AIEstimationResponse>(cancellationToken: cts.Token);
                if (result is null)
                    throw new InvalidOperationException("AI service returned empty estimation payload.");

                var mappedItems = result.SuggestedItems
                    .Select(item => new BOQEstimationSuggestion(
                        item.Description,
                        item.Unit,
                        item.Quantity,
                        item.UnitRate,
                        item.Amount,
                        item.DsrCode,
                        item.Category,
                        item.QuantityHint,
                        item.Confidence))
                    .ToArray();

                return new BOQEstimationResult(
                    result.BoqId,
                    mappedItems,
                    result.TotalEstimatedCost,
                    result.Disclaimer,
                    result.IsAiGenerated);
            }
            catch (Exception ex) when (!cancellationToken.IsCancellationRequested)
            {
                lastError = ex;
                if (attempt > _retryCount)
                    break;

                logger.LogWarning("AI estimate retry {Attempt} for trace {TraceId}", attempt, traceId);
                await Task.Delay(_retryDelayMs, cancellationToken);
            }
        }

        logger.LogWarning(lastError, "AI estimate failed for trace {TraceId}", traceId);
        throw new InvalidOperationException($"AI estimation unavailable. traceId={traceId}");
    }

    private static bool ResolveMockMode(IConfiguration config)
    {
        var raw = config["AI_MOCK_MODE"] ?? config["AIServiceSettings:MockEnabled"];
        return bool.TryParse(raw, out var enabled) && enabled;
    }

    private sealed record SummaryRequest(
        [property: JsonPropertyName("tender_id")] Guid TenderId,
        [property: JsonPropertyName("content")] string Content,
        [property: JsonPropertyName("language")] string Language = "en");

    private sealed record EstimationRequest(
        [property: JsonPropertyName("boq_id")] Guid BoqId,
        [property: JsonPropertyName("project_scope")] string ProjectScope,
        [property: JsonPropertyName("state")] string State,
        [property: JsonPropertyName("work_category")] string WorkCategory,
        [property: JsonPropertyName("estimated_area_sqm")] decimal? EstimatedAreaSqm,
        [property: JsonPropertyName("estimated_length_km")] decimal? EstimatedLengthKm);

    private record AISummaryResponse(
        [property: JsonPropertyName("scope_of_work")]
        string ScopeOfWork,
        [property: JsonPropertyName("key_requirements")]
        string[] KeyRequirements,
        [property: JsonPropertyName("eligibility_criteria")]
        string[] EligibilityCriteria,
        [property: JsonPropertyName("key_risks")]
        string[] KeyRisks,
        [property: JsonPropertyName("recommendation")]
        string Recommendation,
        [property: JsonPropertyName("recommendation_reason")]
        string RecommendationReason
    );

    private record AIEstimationResponse(
        [property: JsonPropertyName("boq_id")] Guid BoqId,
        [property: JsonPropertyName("suggested_items")] AIEstimationItem[] SuggestedItems,
        [property: JsonPropertyName("total_estimated_cost")] decimal TotalEstimatedCost,
        [property: JsonPropertyName("disclaimer")] string Disclaimer,
        [property: JsonPropertyName("is_ai_generated")] bool IsAiGenerated);

    private record AIEstimationItem(
        [property: JsonPropertyName("description")] string Description,
        [property: JsonPropertyName("unit")] string Unit,
        [property: JsonPropertyName("quantity")] decimal Quantity,
        [property: JsonPropertyName("unit_rate")] decimal UnitRate,
        [property: JsonPropertyName("amount")] decimal Amount,
        [property: JsonPropertyName("dsr_code")] string? DsrCode,
        [property: JsonPropertyName("category")] string Category,
        [property: JsonPropertyName("quantity_hint")] string? QuantityHint,
        [property: JsonPropertyName("confidence")] decimal Confidence);
}
