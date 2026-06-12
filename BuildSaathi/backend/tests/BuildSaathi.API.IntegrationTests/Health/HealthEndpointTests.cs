using System.Net;
using BuildSaathi.API.IntegrationTests.Infrastructure;
using FluentAssertions;
using Xunit;

namespace BuildSaathi.API.IntegrationTests.Health;

public class HealthEndpointTests : IClassFixture<ApiWebApplicationFactory>
{
    private readonly HttpClient _client;

    public HealthEndpointTests(ApiWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HealthEndpoint_ShouldBeReachable()
    {
        var response = await _client.GetAsync("/health");

        response.StatusCode.Should().BeOneOf(HttpStatusCode.OK, HttpStatusCode.ServiceUnavailable);
    }
}
