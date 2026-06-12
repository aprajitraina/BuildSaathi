namespace BuildSaathi.Domain.Interfaces;

/// <summary>
/// Marker interface for entities scoped to a contractor tenant.
/// Used by EF Core global query filters for automatic tenant isolation.
/// </summary>
public interface ITenantEntity
{
    Guid ContractorId { get; }
}
