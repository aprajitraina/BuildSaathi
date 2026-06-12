using MediatR;

namespace BuildSaathi.Application.Features.Materials.Queries.GetMaterials;

public record GetMaterialsQuery(string? State = null) : IRequest<IEnumerable<MaterialRateDto>>;
public record GetMaterialRatesByNameQuery(string MaterialName, string? State = null) : IRequest<IEnumerable<MaterialRateDto>>;

public record MaterialRateDto(
    Guid Id,
    string MaterialName,
    string Unit,
    decimal Rate,
    string State,
    string Category,
    DateTime EffectiveDate,
    string? Source
);
