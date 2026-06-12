namespace BuildSaathi.Domain.Entities;

/// <summary>
/// Cached AI-generated summary for a tender.
/// Summaries are shared (not tenant-scoped) — generated once, served to all.
/// Keyed on TenderId + content hash to avoid regenerating for identical content.
/// </summary>
public class TenderSummary : BaseEntity
{
    public Guid TenderId { get; set; }
    public string ScopeOfWork { get; set; } = string.Empty;
    public List<string> KeyRequirements { get; set; } = [];
    public List<string> EligibilityCriteria { get; set; } = [];
    public List<string> KeyRisks { get; set; } = [];
    public string Recommendation { get; set; } = "medium"; // high | medium | low
    public string RecommendationReason { get; set; } = string.Empty;
    public bool IsAiGenerated { get; set; } = false;
    public string? ContentHash { get; set; }

    public Tender Tender { get; private set; } = null!;

    // EF Core + seeder-compatible: allow internal init
    internal TenderSummary() { }

    public static TenderSummary CreateMock(Guid tenderId) => new()
    {
        TenderId = tenderId,
        ScopeOfWork = "Construction and renovation work as per tender specifications.",
        KeyRequirements = ["Valid contractor registration", "Experience certificate", "EMD deposit"],
        EligibilityCriteria = ["Class A contractor license", "Minimum 3 years experience", "Financial turnover as specified"],
        KeyRisks = ["Tight submission deadline", "High EMD requirement"],
        Recommendation = "medium",
        RecommendationReason = "Standard government tender with moderate complexity. Evaluate based on your capacity.",
        IsAiGenerated = false,
    };

    /// <summary>Maps a successful AI service JSON payload into a domain entity (called from Infrastructure).</summary>
    public static TenderSummary FromAiResponse(
        Guid tenderId,
        string scopeOfWork,
        string[]? keyRequirements,
        string[]? eligibilityCriteria,
        string[]? keyRisks,
        string recommendation,
        string recommendationReason) => new()
    {
        TenderId = tenderId,
        ScopeOfWork = scopeOfWork,
        KeyRequirements = keyRequirements?.ToList() ?? [],
        EligibilityCriteria = eligibilityCriteria?.ToList() ?? [],
        KeyRisks = keyRisks?.ToList() ?? [],
        Recommendation = recommendation,
        RecommendationReason = recommendationReason,
        IsAiGenerated = true,
    };
}
