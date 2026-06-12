namespace BuildSaathi.Domain.Entities;

public class MaterialRate : BaseEntity
{
    public string MaterialName { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Rate { get; set; }
    public string State { get; set; } = string.Empty;
    public string? District { get; set; }
    public DateTime EffectiveDate { get; set; }
    public string? Source { get; set; }
    public Guid? SupplierId { get; set; }
    public string Category { get; set; } = string.Empty; // Cement, Steel, Sand, etc.

    protected MaterialRate() { }

    public static MaterialRate Create(string materialName, string unit, decimal rate,
        string state, DateTime effectiveDate, string category, string? source = null)
    {
        return new MaterialRate
        {
            MaterialName = materialName,
            Unit = unit,
            Rate = rate,
            State = state,
            EffectiveDate = effectiveDate,
            Category = category,
            Source = source,
        };
    }
}
