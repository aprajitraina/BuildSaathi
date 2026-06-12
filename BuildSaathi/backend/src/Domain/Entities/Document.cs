using BuildSaathi.Domain.Interfaces;

namespace BuildSaathi.Domain.Entities;

/// <summary>
/// Represents a file uploaded to the Document Vault.
/// Uses a polymorphic entity reference (EntityType + EntityId) to link to Tender, Project, or Contractor.
/// The actual file lives in S3/MinIO — this is just the metadata record.
/// </summary>
public class Document : BaseEntity, ITenantEntity
{
    public Guid ContractorId { get; private set; }
    public string FileName { get; private set; } = string.Empty;
    public string OriginalFileName { get; private set; } = string.Empty;
    public string ContentType { get; private set; } = string.Empty;
    public long FileSizeBytes { get; private set; }
    public string StorageKey { get; private set; } = string.Empty; // S3/MinIO object key
    public string DocumentType { get; private set; } = string.Empty; // Contract, Drawing, Compliance, etc.
    public string? EntityType { get; private set; } // "Tender" | "Project" | null
    public Guid? EntityId { get; private set; }
    public string? Tags { get; private set; } // Comma-separated tags

    public Contractor Contractor { get; private set; } = null!;

    protected Document() { }

    public static Document Create(Guid contractorId, string fileName, string originalFileName,
        string contentType, long fileSizeBytes, string storageKey,
        string documentType, string? entityType = null, Guid? entityId = null)
    {
        return new Document
        {
            ContractorId = contractorId,
            FileName = fileName,
            OriginalFileName = originalFileName,
            ContentType = contentType,
            FileSizeBytes = fileSizeBytes,
            StorageKey = storageKey,
            DocumentType = documentType,
            EntityType = entityType,
            EntityId = entityId,
        };
    }
}
