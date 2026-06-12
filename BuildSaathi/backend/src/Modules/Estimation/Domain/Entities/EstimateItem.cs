using BuildSaathi.Domain.Entities;

namespace BuildSaathi.Modules.Estimation.Domain.Entities;

public class EstimateItem : BaseEntity
{
    public Guid EstimateId { get; private set; }
    public string ItemName { get; private set; } = string.Empty;
    public string? NormalizedName { get; private set; }
    public decimal Quantity { get; private set; }
    public string Unit { get; private set; } = string.Empty;
    public decimal Rate { get; private set; }
    public decimal Amount { get; private set; }
    public int SortOrder { get; private set; }

    public Estimate Estimate { get; private set; } = null!;

    protected EstimateItem() { }

    public static EstimateItem Create(
        Guid estimateId,
        string itemName,
        decimal quantity,
        string unit,
        decimal rate,
        decimal amount,
        int sortOrder,
        string? normalizedName = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(itemName);
        ArgumentException.ThrowIfNullOrWhiteSpace(unit);
        if (quantity < 0) throw new ArgumentException("Quantity cannot be negative.");
        if (rate < 0) throw new ArgumentException("Rate cannot be negative.");
        if (amount < 0) throw new ArgumentException("Amount cannot be negative.");

        return new EstimateItem
        {
            EstimateId = estimateId,
            ItemName = itemName.Trim(),
            NormalizedName = normalizedName,
            Quantity = quantity,
            Unit = unit.Trim(),
            Rate = rate,
            Amount = amount,
            SortOrder = sortOrder,
        };
    }

    public void SetNormalizedName(string? normalizedName)
    {
        NormalizedName = string.IsNullOrWhiteSpace(normalizedName) ? null : normalizedName.Trim();
        UpdatedAt = DateTime.UtcNow;
    }

    public void ApplyRateFromMaster(decimal newRate)
    {
        if (newRate < 0) throw new ArgumentException("Rate cannot be negative.");
        Rate = newRate;
        Amount = Math.Round(Quantity * Rate, 2, MidpointRounding.AwayFromZero);
        UpdatedAt = DateTime.UtcNow;
    }

    public void RecalculateAmountFromQuantityRate()
    {
        Amount = Math.Round(Quantity * Rate, 2, MidpointRounding.AwayFromZero);
        UpdatedAt = DateTime.UtcNow;
    }
}
