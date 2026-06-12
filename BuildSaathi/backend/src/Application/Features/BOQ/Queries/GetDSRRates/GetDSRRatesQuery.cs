using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Queries.GetDSRRates;

public record GetDSRRatesQuery(
    string State,
    string? Category = null,
    string? Query = null
) : IRequest<IEnumerable<DSRRateDto>>;

public record DSRRateDto(
    Guid Id,
    string Code,
    string Description,
    string Unit,
    decimal Rate,
    string State,
    string Category,
    DateTime EffectiveFrom,
    string Source
);
