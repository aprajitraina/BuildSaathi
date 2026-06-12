namespace BuildSaathi.Domain.Entities;

/// <summary>
/// Base class for all domain entities. Provides identity, audit fields, and soft-delete support.
/// All tenant-scoped entities inherit from this — but add ContractorId themselves to be explicit.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public Guid? CreatedById { get; set; }
    public Guid? UpdatedById { get; set; }

    // Soft delete — never hard-delete business records
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
}
