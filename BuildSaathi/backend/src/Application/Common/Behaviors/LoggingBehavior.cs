using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace BuildSaathi.Application.Common.Behaviors;

/// <summary>
/// Logs every MediatR request with timing. Warns on slow requests (>500ms).
/// </summary>
public class LoggingBehavior<TRequest, TResponse>(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;
        var sw = Stopwatch.StartNew();

        logger.LogInformation("Handling {RequestName}", requestName);

        var response = await next();

        sw.Stop();

        if (sw.ElapsedMilliseconds > 500)
            logger.LogWarning("Slow request detected: {RequestName} took {ElapsedMs}ms", requestName, sw.ElapsedMilliseconds);
        else
            logger.LogInformation("Handled {RequestName} in {ElapsedMs}ms", requestName, sw.ElapsedMilliseconds);

        return response;
    }
}
