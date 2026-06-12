namespace BuildSaathi.Domain.Entities;

/// <summary>
/// Delhi Schedule of Rates (or state-specific equivalent).
/// The official government rate table used for BOQ estimation.
/// This is reference data — seeded per state, not user-generated.
/// </summary>
public class DSRRate : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Unit { get; set; } = string.Empty;
    public decimal Rate { get; set; }
    public string State { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public DateTime EffectiveFrom { get; set; }
    public string Source { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;

    protected DSRRate() { }

    public static DSRRate Create(
        string code,
        string description,
        string unit,
        decimal rate,
        string state,
        string category,
        string source,
        DateTime? effectiveFrom = null)
    {
        var from = effectiveFrom ?? new DateTime(2023, 4, 1, 0, 0, 0, DateTimeKind.Utc);
        return new DSRRate
        {
            Code = code,
            Description = description,
            Unit = unit,
            Rate = rate,
            State = state,
            Category = category,
            EffectiveFrom = from,
            Source = source,
            IsActive = true,
        };
    }
}
