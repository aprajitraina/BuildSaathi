using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

/// <summary>
/// Join entity representing a contractor's interest in a specific tender.
/// Created when a contractor saves a tender. Status tracks bid progression.
/// </summary>
public class TenderMatch : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public Guid TenderId { get; private set; }
    public TenderMatchStatus Status { get; private set; } = TenderMatchStatus.Saved;
    public string? Notes { get; private set; }

    public Contractor Contractor { get; private set; } = null!;
    public Tender Tender { get; private set; } = null!;

    protected TenderMatch() { }

    public static TenderMatch Create(Guid contractorId, Guid tenderId) =>
        new() { ContractorId = contractorId, TenderId = tenderId };

    public void UpdateStatus(TenderMatchStatus status, string? notes = null)
    {
        Status = status;
        Notes = notes;
        UpdatedAt = DateTime.UtcNow;
    }
}
