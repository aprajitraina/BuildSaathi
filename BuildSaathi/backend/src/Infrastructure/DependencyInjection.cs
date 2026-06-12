using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using BuildSaathi.Infrastructure.Persistence;
using BuildSaathi.Infrastructure.Services;
using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Infrastructure.AI;
using BuildSaathi.Modules.Estimation.Infrastructure.Parsers;
using BuildSaathi.Modules.Estimation.Infrastructure.Repositories;
using BuildSaathi.Modules.Estimation.Engines;
using BuildSaathi.Modules.Estimation.Validators;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace BuildSaathi.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, IConfiguration configuration)
    {
        // EF Core with MySQL (Pomelo provider)
        var connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Database connection string not configured.");
        var serverVersionString = configuration["DatabaseSettings:ServerVersion"] ?? "8.0.36";
        if (!Version.TryParse(serverVersionString, out var parsedVersion))
            throw new InvalidOperationException("Invalid DatabaseSettings:ServerVersion value.");
        var mySqlServerVersion = new MySqlServerVersion(parsedVersion);

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseMySql(connectionString, mySqlServerVersion,
                mysql =>
                {
                    mysql.CommandTimeout(30);
                    mysql.EnableRetryOnFailure(3);
                }));

        services.AddScoped<IApplicationDbContext>(sp => sp.GetRequiredService<ApplicationDbContext>());

        // Services
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IPasswordHasher, BcryptPasswordHasher>();
        services.AddScoped<ICacheService, DistributedCacheService>();
        services.AddScoped<IFileStorageService, S3FileStorageService>();
        services.AddScoped<IReportPdfService, ReportPdfService>();

        // AI Service HTTP Client
        services.AddHttpClient<IAIService, AIServiceClient>(client =>
        {
            var aiBaseUrl = configuration["AIServiceSettings:BaseUrl"] ?? "http://localhost:8000";
            var timeoutSeconds = int.TryParse(configuration["AIServiceSettings:TimeoutSeconds"], out var timeout)
                ? Math.Max(5, timeout)
                : 30;
            client.BaseAddress = new Uri(aiBaseUrl);
            client.Timeout = TimeSpan.FromSeconds(timeoutSeconds);
        });

        services.AddHttpClient<IEstimationAIClient, EstimationAIClient>(client =>
        {
            var aiBaseUrl = configuration["AIServiceSettings:BaseUrl"] ?? "http://localhost:8000";
            var timeoutSeconds = int.TryParse(configuration["AIServiceSettings:TimeoutSeconds"], out var timeout)
                ? Math.Max(5, timeout)
                : 120;
            client.BaseAddress = new Uri(aiBaseUrl);
            client.Timeout = TimeSpan.FromSeconds(timeoutSeconds);
        });

        services.AddScoped<IEstimateRepository, EstimateRepository>();
        services.AddScoped<IWordDocumentParser, WordParserService>();
        services.AddScoped<IBuildingEstimationEngine, BuildingEstimationEngine>();
        services.AddScoped<IEstimateValidationService, EstimateValidator>();

        // Redis distributed cache
        var redisConnection = configuration["RedisSettings:ConnectionString"] ?? "localhost:6379";
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redisConnection;
            options.InstanceName = "BuildSaathi:";
        });

        return services;
    }
}
