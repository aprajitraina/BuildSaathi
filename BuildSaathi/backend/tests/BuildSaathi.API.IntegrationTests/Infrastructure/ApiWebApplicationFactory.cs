using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;

namespace BuildSaathi.API.IntegrationTests.Infrastructure;

public class ApiWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        builder.UseSetting("ConnectionStrings:DefaultConnection", "Server=localhost;Port=3306;Database=buildsaathi_test;User=test;Password=test;");
        builder.UseSetting("JwtSettings:Secret", "integration_test_secret_with_minimum_length_32_chars");
        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ConnectionStrings:DefaultConnection"] = "Server=localhost;Port=3306;Database=buildsaathi_test;User=test;Password=test;",
                ["JwtSettings:Secret"] = "integration_test_secret_with_minimum_length_32_chars",
            });
        });
    }
}
