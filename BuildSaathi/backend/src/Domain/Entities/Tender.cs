namespace BuildSaathi.Domain.Entities;

/// <summary>
/// A government or private contract opportunity.
/// Tenders are shared data (not tenant-scoped) — all contractors can see them.
/// Contractor interest is tracked via TenderMatch.
/// </summary>
public class Tender : BaseEntity
{
    public string Title { get; private set; } = string.Empty;
    public string ReferenceNumber { get; private set; } = string.Empty;
    public string Department { get; private set; } = string.Empty;
    public string Organization { get; private set; } = string.Empty;
    public string State { get; private set; } = string.Empty;
    public string? District { get; private set; }
    public string Category { get; private set; } = string.Empty;
    public decimal EstimatedValue { get; private set; }
    public decimal? EmdAmount { get; private set; }
    public decimal? DocumentFee { get; private set; }
    public DateTime PublishedDate { get; private set; }
    public DateTime SubmissionDeadline { get; private set; }
    public DateTime? OpeningDate { get; private set; }
    public string? SourceUrl { get; private set; }
    public string SourcePortal { get; private set; } = string.Empty;
    public bool IsActive { get; private set; } = true;
    public List<string> Tags { get; private set; } = [];

    // Navigation
    public ICollection<TenderMatch> TenderMatches { get; private set; } = [];
    public ICollection<TenderSummary> Summaries { get; private set; } = [];
    public ICollection<Document> Documents { get; private set; } = [];

    protected Tender() { }

    public static Tender Create(
        string title, string referenceNumber, string department,
        string organization, string state, string category,
        decimal estimatedValue, DateTime submissionDeadline,
        string sourcePortal, DateTime publishedDate)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(referenceNumber);

        return new Tender
        {
            Title = title,
            ReferenceNumber = referenceNumber,
            Department = department,
            Organization = organization,
            State = state,
            Category = category,
            EstimatedValue = estimatedValue,
            SubmissionDeadline = submissionDeadline,
            SourcePortal = sourcePortal,
            PublishedDate = publishedDate,
        };
    }
}
