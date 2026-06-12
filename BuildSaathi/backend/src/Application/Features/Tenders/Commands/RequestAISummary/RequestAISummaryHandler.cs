using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace BuildSaathi.Application.Features.Tenders.Commands.RequestAISummary;

public class RequestAISummaryHandler(
    IApplicationDbContext db,
    IAIService aiService) : IRequestHandler<RequestAISummaryCommand, AISummaryResponse>
{
    public async Task<AISummaryResponse> Handle(RequestAISummaryCommand request, CancellationToken cancellationToken)
    {
        var tender = await db.Tenders
            .FirstOrDefaultAsync(t => t.Id == request.TenderId, cancellationToken)
            ?? throw new NotFoundException("Tender", request.TenderId);

        var tenderContent = $"{tender.Title}\n{tender.Department}\n{tender.Organization}\n" +
                            $"Value: {tender.EstimatedValue}\nDeadline: {tender.SubmissionDeadline:d}";
        var contentHash = ComputeSha256(tenderContent);

        var existing = await db.TenderSummaries
            .FirstOrDefaultAsync(ts => ts.TenderId == request.TenderId, cancellationToken);

        if (existing is not null)
        {
            if (request.CachedOnly)
            {
                return Map(existing);
            }

            var hasSameContent = string.Equals(existing.ContentHash, contentHash, StringComparison.OrdinalIgnoreCase);
            if (!request.ForceRegenerate && hasSameContent)
            {
                return Map(existing);
            }
        }
        else if (request.CachedOnly)
        {
            throw new NotFoundException("TenderSummary", request.TenderId);
        }

        var summary = await aiService.SummarizeTenderAsync(tender.Id, tenderContent, cancellationToken);
        summary.ContentHash = contentHash;

        if (existing is null)
        {
            db.TenderSummaries.Add(summary);
        }
        else
        {
            existing.ScopeOfWork = summary.ScopeOfWork;
            existing.KeyRequirements = summary.KeyRequirements;
            existing.EligibilityCriteria = summary.EligibilityCriteria;
            existing.KeyRisks = summary.KeyRisks;
            existing.Recommendation = summary.Recommendation;
            existing.RecommendationReason = summary.RecommendationReason;
            existing.IsAiGenerated = summary.IsAiGenerated;
            existing.ContentHash = contentHash;
            existing.UpdatedAt = DateTime.UtcNow;
            summary = existing;
        }

        await db.SaveChangesAsync(cancellationToken);

        return Map(summary);
    }

    private static AISummaryResponse Map(Domain.Entities.TenderSummary summary) =>
        new(
            summary.TenderId,
            summary.ScopeOfWork,
            summary.KeyRequirements,
            summary.EligibilityCriteria,
            summary.KeyRisks,
            summary.Recommendation,
            summary.RecommendationReason,
            summary.IsAiGenerated,
            summary.CreatedAt);

    private static string ComputeSha256(string value)
    {
        var bytes = Encoding.UTF8.GetBytes(value);
        var hash = SHA256.HashData(bytes);
        return Convert.ToHexString(hash);
    }
}
