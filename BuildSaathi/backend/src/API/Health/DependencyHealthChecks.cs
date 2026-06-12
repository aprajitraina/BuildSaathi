using Amazon.S3;
using Amazon.S3.Util;
using BuildSaathi.Infrastructure.Persistence;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Diagnostics.HealthChecks;

namespace BuildSaathi.API.Health;

public class DatabaseHealthCheck(ApplicationDbContext dbContext) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var canConnect = await dbContext.Database.CanConnectAsync(cancellationToken);
            return canConnect
                ? HealthCheckResult.Healthy("Database connection is healthy.")
                : HealthCheckResult.Unhealthy("Database connection failed.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Database health check failed.", ex);
        }
    }
}

public class RedisHealthCheck(IDistributedCache cache) : IHealthCheck
{
    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var key = $"healthcheck:redis:{Guid.NewGuid():N}";
            await cache.SetStringAsync(
                key,
                "ok",
                new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromSeconds(30),
                },
                cancellationToken);

            var value = await cache.GetStringAsync(key, cancellationToken);
            await cache.RemoveAsync(key, cancellationToken);

            return value == "ok"
                ? HealthCheckResult.Healthy("Redis cache is healthy.")
                : HealthCheckResult.Unhealthy("Redis read/write probe failed.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Redis health check failed.", ex);
        }
    }
}

public class StorageHealthCheck(IConfiguration configuration) : IHealthCheck
{
    private readonly string _endpoint = configuration["MINIO_ENDPOINT"] ?? "localhost:9000";
    private readonly string _accessKey = configuration["MINIO_ACCESS_KEY"] ?? "minioadmin";
    private readonly string _secretKey = configuration["MINIO_SECRET_KEY"] ?? "minioadmin";
    private readonly bool _useSsl = bool.TryParse(configuration["MINIO_USE_SSL"], out var ssl) && ssl;
    private readonly string _bucket = configuration["MINIO_BUCKET_DOCUMENTS"] ?? "buildsaathi-documents";

    public async Task<HealthCheckResult> CheckHealthAsync(
        HealthCheckContext context,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var s3Config = new AmazonS3Config
            {
                ServiceURL = $"{(_useSsl ? "https" : "http")}://{_endpoint}",
                ForcePathStyle = true,
            };

            using var client = new AmazonS3Client(_accessKey, _secretKey, s3Config);
            var exists = await AmazonS3Util.DoesS3BucketExistV2Async(client, _bucket);

            return exists
                ? HealthCheckResult.Healthy("Object storage is healthy.")
                : HealthCheckResult.Unhealthy($"Bucket '{_bucket}' not found.");
        }
        catch (Exception ex)
        {
            return HealthCheckResult.Unhealthy("Object storage health check failed.", ex);
        }
    }
}
