using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BuildSaathi.Modules.Estimation.Engines;

public class BuildingEstimationEngine(ApplicationDbContext db, ILogger<BuildingEstimationEngine> logger) : IBuildingEstimationEngine
{
    public const string CodeCement = "CEMENT";
    public const string CodeSteel = "STEEL";
    public const string CodeBricks = "BRICKS";

    public async Task<IReadOnlyList<BuildingEstimateLine>> GenerateAsync(
        decimal areaSqFt, string rateState, CancellationToken cancellationToken = default)
    {
        if (areaSqFt <= 0) throw new ArgumentOutOfRangeException(nameof(areaSqFt));

        var cementRate = await ResolveRateAsync(CodeCement, rateState, cancellationToken);
        var steelRate = await ResolveRateAsync(CodeSteel, rateState, cancellationToken);
        var brickRate = await ResolveRateAsync(CodeBricks, rateState, cancellationToken);

        var cementQty = Math.Round(areaSqFt * 0.4m, 3, MidpointRounding.AwayFromZero);
        var steelQty = Math.Round(areaSqFt * 3.5m, 3, MidpointRounding.AwayFromZero);
        var brickQty = Math.Round(areaSqFt * 8m, 3, MidpointRounding.AwayFromZero);

        var lines = new List<BuildingEstimateLine>
        {
            Line("Cement (building norm)", cementQty, "Bag", cementRate),
            Line("Steel reinforcement (building norm)", steelQty, "Kg", steelRate),
            Line("Bricks (building norm)", brickQty, "Nos", brickRate),
        };

        if (cementRate == 0 || steelRate == 0 || brickRate == 0)
            logger.LogWarning("Some RateMaster entries missing for state {State}; zero rates used.", rateState);

        return lines;
    }

    private async Task<decimal> ResolveRateAsync(string itemCode, string state, CancellationToken cancellationToken)
    {
        var match = await db.RateMasters
            .AsNoTracking()
            .Where(r => r.ItemCode == itemCode && (r.State == state || r.State == null))
            .OrderByDescending(r => r.State != null)
            .Select(r => r.Rate)
            .FirstOrDefaultAsync(cancellationToken);

        return match;
    }

    private static BuildingEstimateLine Line(string name, decimal qty, string unit, decimal rate) =>
        new(name, qty, unit, rate, Math.Round(qty * rate, 2, MidpointRounding.AwayFromZero));
}
