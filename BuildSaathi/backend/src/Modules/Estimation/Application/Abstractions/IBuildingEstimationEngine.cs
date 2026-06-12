namespace BuildSaathi.Modules.Estimation.Application.Abstractions;

public record BuildingEstimateLine(string ItemName, decimal Quantity, string Unit, decimal Rate, decimal Amount);

public interface IBuildingEstimationEngine
{
    Task<IReadOnlyList<BuildingEstimateLine>> GenerateAsync(decimal areaSqFt, string rateState, CancellationToken cancellationToken = default);
}
