namespace BuildSaathi.Modules.Estimation.Application.Contracts;

public record EstimateListItemDto(
    Guid Id,
    string ProjectType,
    string EstimateType,
    string SourceType,
    decimal AreaSqFt,
    string Location,
    decimal TotalAmount,
    int ItemCount,
    DateTime CreatedAt);

public record EstimateItemDto(
    Guid Id,
    string ItemName,
    string? NormalizedName,
    decimal Quantity,
    string Unit,
    decimal Rate,
    decimal Amount,
    int SortOrder);

public record EstimateWarningDto(Guid Id, string Level, string Message, string? Code);

public record EstimateDetailDto(
    Guid Id,
    Guid? TenderId,
    string ProjectType,
    string EstimateType,
    string SourceType,
    decimal AreaSqFt,
    string Location,
    int? Floors,
    string? FinishType,
    decimal TotalAmount,
    IReadOnlyList<EstimateItemDto> Items,
    IReadOnlyList<EstimateWarningDto> Warnings,
    DateTime CreatedAt,
    DateTime UpdatedAt);
