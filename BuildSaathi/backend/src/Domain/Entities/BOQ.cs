using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

/// <summary>
/// Bill of Quantities — a cost estimate for a tender or project.
/// Contains line items, each with quantity × unit rate = amount.
/// Supports overhead and contingency percentage additions.
/// </summary>
public class BOQ : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public Guid? TenderId { get; private set; }
    public Guid? ProjectId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string State { get; private set; } = string.Empty;
    public string WorkCategory { get; private set; } = string.Empty;
    public BOQStatus Status { get; private set; } = BOQStatus.Draft;
    public decimal OverheadPercent { get; private set; } = 15m;
    public decimal ContingencyPercent { get; private set; } = 5m;

    public Contractor Contractor { get; private set; } = null!;
    public Tender? Tender { get; private set; }
    public ICollection<BOQLineItem> LineItems { get; private set; } = [];

    public decimal BaseTotal => LineItems.Sum(i => i.Amount);
    public decimal OverheadAmount => BaseTotal * OverheadPercent / 100;
    public decimal ContingencyAmount => BaseTotal * ContingencyPercent / 100;
    public decimal TotalEstimatedCost => BaseTotal + OverheadAmount + ContingencyAmount;

    protected BOQ() { }

    public static BOQ Create(Guid contractorId, string title, string state,
        string workCategory, Guid? tenderId = null,
        decimal overheadPercent = 15m, decimal contingencyPercent = 5m)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);

        return new BOQ
        {
            ContractorId = contractorId,
            Title = title,
            State = state,
            WorkCategory = workCategory,
            TenderId = tenderId,
            OverheadPercent = overheadPercent,
            ContingencyPercent = contingencyPercent,
        };
    }

    public void MarkFinalized()
    {
        Status = BOQStatus.Finalized;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateDetails(
        string title,
        string state,
        string workCategory,
        decimal overheadPercent,
        decimal contingencyPercent)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title);
        ArgumentException.ThrowIfNullOrWhiteSpace(state);
        ArgumentException.ThrowIfNullOrWhiteSpace(workCategory);

        Title = title;
        State = state;
        WorkCategory = workCategory;
        OverheadPercent = overheadPercent;
        ContingencyPercent = contingencyPercent;
        UpdatedAt = DateTime.UtcNow;
    }
}
