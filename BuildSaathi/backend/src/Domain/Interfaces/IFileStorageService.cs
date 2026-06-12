namespace BuildSaathi.Domain.Interfaces;

/// <summary>
/// Abstraction over file storage (MinIO locally, S3 in production).
/// Application layer uses this — Infrastructure implements it.
/// </summary>
public interface IFileStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string bucket, CancellationToken cancellationToken = default);
    Task<string> GetPresignedDownloadUrlAsync(string storageKey, string bucket, TimeSpan expiry, CancellationToken cancellationToken = default);
    Task DeleteAsync(string storageKey, string bucket, CancellationToken cancellationToken = default);
}
