using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

/// <summary>
/// An active construction site — created when a contractor wins a tender.
/// Tracks milestones, progress percentage, and links to billing and materials.
/// </summary>
public class Project : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public Guid? TenderId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string? ClientName { get; private set; }
    public string Location { get; private set; } = string.Empty;
    public string State { get; private set; } = string.Empty;
    public ProjectStatus Status { get; private set; } = ProjectStatus.Planning;
    public decimal ContractValue { get; private set; }
    public int CompletionPercent { get; private set; } = 0;
    public DateTime? StartDate { get; private set; }
    public DateTime? ExpectedCompletionDate { get; private set; }
    public DateTime? ActualCompletionDate { get; private set; }

    public Contractor Contractor { get; private set; } = null!;
    public ICollection<Milestone> Milestones { get; private set; } = [];
    public ICollection<Invoice> Invoices { get; private set; } = [];

    protected Project() { }

    public static Project Create(Guid contractorId, string title, string location,
        string state, decimal contractValue, Guid? tenderId = null)
    {
        return new Project
        {
            ContractorId = contractorId,
            Title = title,
            Location = location,
            State = state,
            ContractValue = contractValue,
            TenderId = tenderId,
        };
    }

    public void UpdateProgress(int completionPercent)
    {
        if (completionPercent is < 0 or > 100)
            throw new ArgumentOutOfRangeException(nameof(completionPercent), "Must be 0–100.");

        CompletionPercent = completionPercent;
        if (completionPercent == 100)
        {
            Status = ProjectStatus.Completed;
            ActualCompletionDate = DateTime.UtcNow;
        }
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate(DateTime startDate)
    {
        Status = ProjectStatus.Active;
        StartDate = startDate;
        UpdatedAt = DateTime.UtcNow;
    }
}
