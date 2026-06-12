using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Commands.RequestAIEstimate;

public class RequestAIEstimateHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IAIService aiService) : IRequestHandler<RequestAIEstimateCommand, BOQEstimationResponse>
{
    public async Task<BOQEstimationResponse> Handle(RequestAIEstimateCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var boq = await db.BOQs
            .Include(b => b.LineItems.Where(li => !li.IsDeleted))
            .FirstOrDefaultAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        var fallbackScope = BuildScopeFromBoq(boq);
        var result = await aiService.EstimateBOQAsync(
            boq.Id,
            string.IsNullOrWhiteSpace(request.ProjectScope) ? fallbackScope : request.ProjectScope.Trim(),
            boq.State,
            boq.WorkCategory,
            request.EstimatedAreaSqm,
            request.EstimatedLengthKm,
            cancellationToken);

        var suggestions = result.SuggestedItems
            .Select(item => new BOQEstimationSuggestionResponse(
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

        return new BOQEstimationResponse(
            result.BOQId,
            suggestions,
            result.TotalEstimatedCost,
            result.Disclaimer,
            result.IsAiGenerated);
    }

    private static string BuildScopeFromBoq(Domain.Entities.BOQ boq)
    {
        if (boq.LineItems.Count == 0)
            return $"{boq.Title} in {boq.State}, category {boq.WorkCategory}.";

        var lineSummaries = boq.LineItems
            .Take(8)
            .Select(li => $"{li.Description} ({li.Quantity} {li.Unit})");
        return $"{boq.Title} in {boq.State}, category {boq.WorkCategory}. Existing BOQ items: {string.Join("; ", lineSummaries)}.";
    }
}
