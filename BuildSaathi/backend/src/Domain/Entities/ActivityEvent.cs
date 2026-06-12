using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

public class ActivityEvent : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public Guid? ActorUserId { get; private set; }
    public string EventType { get; private set; } = string.Empty;
    public string Description { get; private set; } = string.Empty;
    public string EntityType { get; private set; } = string.Empty;
    public Guid? EntityId { get; private set; }
    public string? MetadataJson { get; private set; }

    protected ActivityEvent() { }

    public static ActivityEvent Create(
        Guid contractorId,
        string eventType,
        string description,
        string entityType,
        Guid? entityId = null,
        Guid? actorUserId = null,
        string? metadataJson = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(eventType);
        ArgumentException.ThrowIfNullOrWhiteSpace(description);
        ArgumentException.ThrowIfNullOrWhiteSpace(entityType);

        return new ActivityEvent
        {
            ContractorId = contractorId,
            ActorUserId = actorUserId,
            EventType = eventType,
            Description = description,
            EntityType = entityType,
            EntityId = entityId,
            MetadataJson = metadataJson,
        };
    }
}
