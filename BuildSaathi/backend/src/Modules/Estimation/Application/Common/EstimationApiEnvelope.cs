namespace BuildSaathi.Modules.Estimation.Application.Common;

public record EstimationApiEnvelope<T>(bool Success, T? Data, IReadOnlyList<string> Errors)
{
    public static EstimationApiEnvelope<T> Ok(T data) => new(true, data, Array.Empty<string>());
    public static EstimationApiEnvelope<T> Fail(params string[] errors) => new(false, default, errors);
}
