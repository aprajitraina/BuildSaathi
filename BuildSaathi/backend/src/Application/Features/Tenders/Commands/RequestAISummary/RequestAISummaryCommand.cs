using MediatR;

namespace BuildSaathi.Application.Features.Tenders.Commands.RequestAISummary;

public record RequestAISummaryCommand(
    Guid TenderId,
    bool ForceRegenerate = false,
    bool CachedOnly = false) : IRequest<AISummaryResponse>;

public record AISummaryResponse(
    Guid TenderId,
    string ScopeOfWork,
    IEnumerable<string> KeyRequirements,
    IEnumerable<string> EligibilityCriteria,
    IEnumerable<string> KeyRisks,
    string Recommendation,
    string RecommendationReason,
    bool IsAiGenerated,
    DateTime GeneratedAt
);
