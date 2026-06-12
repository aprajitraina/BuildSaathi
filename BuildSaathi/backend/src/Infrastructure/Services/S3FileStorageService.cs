using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using BuildSaathi.Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace BuildSaathi.Infrastructure.Services;

public class S3FileStorageService(IConfiguration configuration) : IFileStorageService
{
    private readonly string _endpoint = configuration["MINIO_ENDPOINT"] ?? "localhost:9000";
    private readonly string _accessKey = configuration["MINIO_ACCESS_KEY"] ?? "minioadmin";
    private readonly string _secretKey = configuration["MINIO_SECRET_KEY"] ?? "minioadmin";
    private readonly bool _useSsl = bool.TryParse(configuration["MINIO_USE_SSL"], out var ssl) && ssl;

    private AmazonS3Client CreateClient()
    {
        var cfg = new AmazonS3Config
        {
            ServiceURL = $"{(_useSsl ? "https" : "http")}://{_endpoint}",
            ForcePathStyle = true,
        };
        return new AmazonS3Client(_accessKey, _secretKey, cfg);
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, string bucket, CancellationToken cancellationToken = default)
    {
        using var client = CreateClient();
        await EnsureBucketExists(client, bucket, cancellationToken);

        var key = $"docs/{DateTime.UtcNow:yyyy/MM/dd}/{Guid.NewGuid()}-{SanitizeFileName(fileName)}";
        var request = new PutObjectRequest
        {
            BucketName = bucket,
            Key = key,
            InputStream = fileStream,
            ContentType = contentType,
            AutoCloseStream = false,
        };
        await client.PutObjectAsync(request, cancellationToken);
        return key;
    }

    public async Task<string> GetPresignedDownloadUrlAsync(string storageKey, string bucket, TimeSpan expiry, CancellationToken cancellationToken = default)
    {
        using var client = CreateClient();
        await EnsureBucketExists(client, bucket, cancellationToken);
        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucket,
            Key = storageKey,
            Expires = DateTime.UtcNow.Add(expiry),
            Verb = HttpVerb.GET,
        };
        return client.GetPreSignedURL(request);
    }

    public async Task DeleteAsync(string storageKey, string bucket, CancellationToken cancellationToken = default)
    {
        using var client = CreateClient();
        var request = new DeleteObjectRequest { BucketName = bucket, Key = storageKey };
        await client.DeleteObjectAsync(request, cancellationToken);
    }

    private static async Task EnsureBucketExists(IAmazonS3 client, string bucket, CancellationToken ct)
    {
        var exists = await AmazonS3Util.DoesS3BucketExistV2Async(client, bucket);
        if (!exists)
            await client.PutBucketAsync(new PutBucketRequest { BucketName = bucket }, ct);
    }

    private static string SanitizeFileName(string fileName)
    {
        foreach (var c in Path.GetInvalidFileNameChars())
            fileName = fileName.Replace(c, '-');
        return fileName;
    }
}
