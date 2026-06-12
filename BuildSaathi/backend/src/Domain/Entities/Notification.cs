using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

public class Notification : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public string Title { get; private set; } = string.Empty;
    public string Message { get; private set; } = string.Empty;
    public string Type { get; private set; } = string.Empty; // tender_deadline | payment_due | system
    public bool IsRead { get; private set; } = false;
    public string? ActionUrl { get; private set; }
    public string? EntityType { get; private set; }
    public Guid? EntityId { get; private set; }

    public Contractor Contractor { get; private set; } = null!;

    protected Notification() { }

    public static Notification Create(Guid contractorId, string title, string message,
        string type, string? actionUrl = null, string? entityType = null, Guid? entityId = null) =>
        new()
        {
            ContractorId = contractorId,
            Title = title,
            Message = message,
            Type = type,
            ActionUrl = actionUrl,
            EntityType = entityType,
            EntityId = entityId,
        };

    public void MarkRead()
    {
        IsRead = true;
        UpdatedAt = DateTime.UtcNow;
    }
}
