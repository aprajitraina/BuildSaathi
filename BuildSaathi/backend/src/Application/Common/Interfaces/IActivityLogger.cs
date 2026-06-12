namespace BuildSaathi.Application.Common.Interfaces;

public interface IActivityLogger
{
    void Log(
        string eventType,
        string description,
        string entityType,
        Guid? entityId = null,
        string? metadataJson = null);
}
