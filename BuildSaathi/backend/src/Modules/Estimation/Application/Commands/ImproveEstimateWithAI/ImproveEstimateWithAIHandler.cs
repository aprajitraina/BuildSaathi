using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Mapping;
using BuildSaathi.Modules.Estimation.Domain;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Modules.Estimation.Application.Commands.ImproveEstimateWithAI;

public class ImproveEstimateWithAIHandler(
    ICurrentUserService currentUser,
    IEstimateRepository estimates,
    IEstimationAIClient aiClient,
    IApplicationDbContext db,
    ILogger<ImproveEstimateWithAIHandler> logger) : IRequestHandler<ImproveEstimateWithAICommand, EstimationApiEnvelope<EstimateDetailDto>>
{
    public async Task<EstimationApiEnvelope<EstimateDetailDto>> Handle(ImproveEstimateWithAICommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        if (contractorId == Guid.Empty)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Contractor context is required.");

        var estimate = await estimates.GetDetailedAsync(request.EstimateId, contractorId, cancellationToken);
        if (estimate is null)
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("Estimate not found.");

        var ordered = estimate.Items.OrderBy(i => i.SortOrder).ToList();
        var payloads = ordered
            .Select(i => new EstimationItemPayload(i.ItemName, i.Quantity, i.Unit, i.Rate, i.Amount))
            .ToList();

        NormalizeItemsResult normalized;
        SuggestImprovementsResult suggestions;
        try
        {
            normalized = await aiClient.NormalizeItemsAsync(payloads, cancellationToken);
            suggestions = await aiClient.SuggestImprovementsAsync(payloads, cancellationToken);
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "AI improvement failed for estimate {EstimateId}", estimate.Id);
            return EstimationApiEnvelope<EstimateDetailDto>.Fail("AI service unavailable. Try again later.");
        }

        foreach (var result in normalized.Items)
        {
            if (result.Index < 0 || result.Index >= ordered.Count) continue;
            ordered[result.Index].SetNormalizedName(result.NormalizedName);
        }

        var previousAi = estimate.Warnings.Where(w => w.Code == "AI_SUGGESTION").ToList();
        db.EstimateWarnings.RemoveRange(previousAi);
        foreach (var w in previousAi)
            estimate.Warnings.Remove(w);

        var suggestionTexts = suggestions.Suggestions
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s.Trim())
            .Distinct()
            .ToList();

        foreach (var text in suggestionTexts)
            estimate.Warnings.Add(EstimateWarning.Create(estimate.Id, EstimateWarningLevel.Warning, text, "AI_SUGGESTION"));

        await db.SaveChangesAsync(cancellationToken);

        logger.LogInformation("AI improvement applied to estimate {EstimateId}", estimate.Id);

        var reloaded = await estimates.GetDetailedAsync(estimate.Id, contractorId, cancellationToken);
        return EstimationApiEnvelope<EstimateDetailDto>.Ok(EstimateDtoMapper.ToDetailDto(reloaded!));
    }
}
