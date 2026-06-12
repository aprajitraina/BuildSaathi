using BuildSaathi.Domain.Entities;

namespace BuildSaathi.Modules.Estimation.Domain.Entities;

public class EstimateWarning : BaseEntity
{
    public Guid EstimateId { get; private set; }
    public EstimateWarningLevel Level { get; private set; }
    public string Message { get; private set; } = string.Empty;
    public string? Code { get; private set; }

    public Estimate Estimate { get; private set; } = null!;

    protected EstimateWarning() { }

    public static EstimateWarning Create(Guid estimateId, EstimateWarningLevel level, string message, string? code = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(message);
        return new EstimateWarning
        {
            EstimateId = estimateId,
            Level = level,
            Message = message.Trim(),
            Code = code,
        };
    }
}
