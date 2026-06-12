using BuildSaathi.Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BuildSaathi.Infrastructure.Persistence;

/// <summary>
/// Design-time DbContext factory used by EF tooling.
/// Avoids runtime service dependencies and MySQL auto-detect network calls.
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var connectionString =
            Environment.GetEnvironmentVariable("BUILDSAATHI_DB_CONNECTION")
            ?? "Server=localhost;Port=3306;Database=buildsaathi_dev;User=buildsaathi;Password=buildsaathi123;";

        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseMySql(
            connectionString,
            new MySqlServerVersion(new Version(8, 0, 36)));

        return new ApplicationDbContext(optionsBuilder.Options, new DesignTimeCurrentUserService());
    }

    private sealed class DesignTimeCurrentUserService : ICurrentUserService
    {
        public Guid UserId => Guid.Empty;
        public Guid ContractorId => Guid.Empty;
        public string UserName => string.Empty;
        public bool IsAuthenticated => false;
    }
}
