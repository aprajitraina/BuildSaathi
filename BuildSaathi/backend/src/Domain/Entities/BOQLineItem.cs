namespace BuildSaathi.Domain.Entities;

/// <summary>
/// A single cost item within a BOQ. Amount = Quantity × UnitRate.
/// Can reference a DSR code for official rate validation.
/// </summary>
public class BOQLineItem : BaseEntity
{
    public Guid BOQId { get; private set; }
    public string Description { get; private set; } = string.Empty;
    public string Unit { get; private set; } = string.Empty;
    public decimal Quantity { get; private set; }
    public decimal UnitRate { get; private set; }
    public decimal Amount => Quantity * UnitRate;
    public string? DsrCode { get; private set; }
    public string Category { get; private set; } = string.Empty;
    public string? Remarks { get; private set; }
    public int SortOrder { get; private set; }

    public BOQ BOQ { get; private set; } = null!;

    protected BOQLineItem() { }

    public static BOQLineItem Create(Guid boqId, string description, string unit,
        decimal quantity, decimal unitRate, string category,
        string? dsrCode = null, string? remarks = null, int sortOrder = 0)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        if (quantity <= 0) throw new ArgumentException("Quantity must be positive.");
        if (unitRate < 0) throw new ArgumentException("Unit rate cannot be negative.");

        return new BOQLineItem
        {
            BOQId = boqId,
            Description = description,
            Unit = unit,
            Quantity = quantity,
            UnitRate = unitRate,
            Category = category,
            DsrCode = dsrCode,
            Remarks = remarks,
            SortOrder = sortOrder,
        };
    }

    public void Update(string description, string unit, decimal quantity,
        decimal unitRate, string category, string? dsrCode, string? remarks)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        ArgumentException.ThrowIfNullOrWhiteSpace(unit);
        ArgumentException.ThrowIfNullOrWhiteSpace(category);
        if (quantity <= 0) throw new ArgumentException("Quantity must be positive.");
        if (unitRate < 0) throw new ArgumentException("Unit rate cannot be negative.");

        Description = description;
        Unit = unit;
        Quantity = quantity;
        UnitRate = unitRate;
        Category = category;
        DsrCode = dsrCode;
        Remarks = remarks;
        UpdatedAt = DateTime.UtcNow;
    }
}
