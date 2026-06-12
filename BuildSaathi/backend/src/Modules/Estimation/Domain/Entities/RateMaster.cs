using BuildSaathi.Domain.Entities;

namespace BuildSaathi.Modules.Estimation.Domain.Entities;

/// <summary>
/// Reference rates for estimation engines (cement, steel, bricks, sand, etc.).
/// </summary>
public class RateMaster : BaseEntity
{
    public string ItemCode { get; private set; } = string.Empty;
    public string DisplayName { get; private set; } = string.Empty;
    public string Unit { get; private set; } = string.Empty;
    public decimal Rate { get; private set; }
    /// <summary>When set, rate applies to that state; null means default / any.</summary>
    public string? State { get; private set; }

    protected RateMaster() { }

    public static RateMaster Create(string itemCode, string displayName, string unit, decimal rate, string? state = null) =>
        new()
        {
            ItemCode = itemCode,
            DisplayName = displayName,
            Unit = unit,
            Rate = rate,
            State = state,
        };
}
