using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Domain.Entities;

namespace BuildSaathi.Modules.Estimation.Application.Mapping;

public static class EstimateDtoMapper
{
    public static EstimateDetailDto ToDetailDto(Estimate e) =>
        new(
            e.Id,
            e.TenderId,
            e.ProjectType.ToString(),
            e.EstimateType.ToString(),
            e.SourceType.ToString(),
            e.AreaSqFt,
            e.Location,
            e.Floors,
            e.FinishType,
            e.TotalAmount,
            e.Items.OrderBy(i => i.SortOrder).Select(i => new EstimateItemDto(
                i.Id, i.ItemName, i.NormalizedName, i.Quantity, i.Unit, i.Rate, i.Amount, i.SortOrder)).ToList(),
            e.Warnings.Select(w => new EstimateWarningDto(w.Id, w.Level.ToString(), w.Message, w.Code)).ToList(),
            e.CreatedAt,
            e.UpdatedAt);

    public static EstimateListItemDto ToListItemDto(Estimate e) =>
        new(
            e.Id,
            e.ProjectType.ToString(),
            e.EstimateType.ToString(),
            e.SourceType.ToString(),
            e.AreaSqFt,
            e.Location,
            e.TotalAmount,
            e.Items.Count,
            e.CreatedAt);
}
