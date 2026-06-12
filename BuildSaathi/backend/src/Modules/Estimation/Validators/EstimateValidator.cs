using BuildSaathi.Modules.Estimation.Application.Abstractions;
using BuildSaathi.Modules.Estimation.Domain;
using BuildSaathi.Modules.Estimation.Domain.Entities;
using BuildSaathi.Modules.Estimation.Engines;
using BuildSaathi.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Modules.Estimation.Validators;

public class EstimateValidator(ApplicationDbContext db) : IEstimateValidationService
{
    private static readonly string[] MaterialTokens = ["cement", "steel", "brick", "sand", "aggregate", "rcc"];
    private static readonly string[] LabourTokens = ["labour", "labor", "manpower", "workmanship"];

    public async Task<IReadOnlyList<EstimateValidationIssue>> ValidateAsync(Estimate estimate, CancellationToken cancellationToken = default)
    {
        var list = new List<EstimateValidationIssue>();
        const decimal tol = 0.05m;

        foreach (var item in estimate.Items)
        {
            var expected = Math.Round(item.Quantity * item.Rate, 2, MidpointRounding.AwayFromZero);
            if (Math.Abs(item.Amount - expected) > tol)
            {
                list.Add(new EstimateValidationIssue(
                    EstimateWarningLevel.Error,
                    $"Amount mismatch for '{item.ItemName}': expected {expected} (Qty × Rate) but found {item.Amount}.",
                    "AMOUNT_MISMATCH"));
            }

            if (item.Rate <= 0)
            {
                var filled = await TryFillRateFromMasterAsync(item, estimate.Location, cancellationToken);
                if (!filled)
                    list.Add(new EstimateValidationIssue(
                        EstimateWarningLevel.Warning,
                        $"Missing or zero rate for '{item.ItemName}'.",
                        "MISSING_RATE"));
            }
        }

        var textBlob = string.Join(" ", estimate.Items.Select(i => i.ItemName)).ToLowerInvariant();
        if (!MaterialTokens.Any(textBlob.Contains))
            list.Add(new EstimateValidationIssue(EstimateWarningLevel.Warning, "No typical material line items detected (cement, steel, bricks, etc.).", "MISSING_MATERIAL"));

        if (!LabourTokens.Any(textBlob.Contains))
            list.Add(new EstimateValidationIssue(EstimateWarningLevel.Warning, "No labour-related line items detected.", "MISSING_LABOUR"));

        return list;
    }

    private async Task<bool> TryFillRateFromMasterAsync(EstimateItem item, string location, CancellationToken cancellationToken)
    {
        string? code = null;
        var n = item.ItemName.ToLowerInvariant();
        if (n.Contains("cement")) code = BuildingEstimationEngine.CodeCement;
        else if (n.Contains("steel") || n.Contains("reinforcement")) code = BuildingEstimationEngine.CodeSteel;
        else if (n.Contains("brick")) code = BuildingEstimationEngine.CodeBricks;

        if (code is null) return false;

        var rate = await db.RateMasters.AsNoTracking()
            .Where(r => r.ItemCode == code && (r.State == location || r.State == null))
            .OrderByDescending(r => r.State != null)
            .Select(r => r.Rate)
            .FirstOrDefaultAsync(cancellationToken);

        if (rate <= 0) return false;

        item.ApplyRateFromMaster(rate);
        return true;
    }
}
