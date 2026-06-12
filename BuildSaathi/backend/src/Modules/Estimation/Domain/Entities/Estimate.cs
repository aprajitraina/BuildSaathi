using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Modules.Estimation.Domain.Entities;

public class Estimate : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public Guid? TenderId { get; private set; }
    public ProjectType ProjectType { get; private set; }
    public EstimateType EstimateType { get; private set; }
    public EstimateSourceType SourceType { get; private set; }
    public decimal AreaSqFt { get; private set; }
    public string Location { get; private set; } = string.Empty;
    public int? Floors { get; private set; }
    public string? FinishType { get; private set; }

    public ICollection<EstimateItem> Items { get; private set; } = new List<EstimateItem>();
    public ICollection<EstimateWarning> Warnings { get; private set; } = new List<EstimateWarning>();

    protected Estimate() { }

    public static Estimate Create(
        Guid contractorId,
        EstimateSourceType sourceType,
        ProjectType projectType,
        EstimateType estimateType,
        decimal areaSqFt,
        string location,
        int? floors,
        string? finishType,
        Guid? tenderId = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(location);

        return new Estimate
        {
            ContractorId = contractorId,
            TenderId = tenderId,
            SourceType = sourceType,
            ProjectType = projectType,
            EstimateType = estimateType,
            AreaSqFt = areaSqFt,
            Location = location.Trim(),
            Floors = floors,
            FinishType = finishType,
        };
    }

    public void AddItem(EstimateItem item)
    {
        ArgumentNullException.ThrowIfNull(item);
        Items.Add(item);
    }

    public decimal TotalAmount => Items.Sum(i => i.Amount);
}
