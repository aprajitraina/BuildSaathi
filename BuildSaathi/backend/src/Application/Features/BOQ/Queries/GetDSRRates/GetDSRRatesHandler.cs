using BuildSaathi.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Queries.GetDSRRates;

public class GetDSRRatesHandler(
    IApplicationDbContext db,
    ICacheService cache)
    : IRequestHandler<GetDSRRatesQuery, IEnumerable<DSRRateDto>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(30);

    public async Task<IEnumerable<DSRRateDto>> Handle(GetDSRRatesQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"dsr-rates:{request.State.Trim().ToLowerInvariant()}:{request.Category?.Trim().ToLowerInvariant() ?? "all"}:{request.Query?.Trim().ToLowerInvariant() ?? "all"}";
        var cached = await cache.GetAsync<List<DSRRateDto>>(cacheKey, cancellationToken);
        if (cached is not null)
            return cached;

        var query = db.DSRRates
            .Where(d => d.IsActive && d.State == request.State);

        if (!string.IsNullOrWhiteSpace(request.Category))
            query = query.Where(d => d.Category == request.Category);

        if (!string.IsNullOrWhiteSpace(request.Query))
            query = query.Where(d => d.Description.Contains(request.Query) || d.Code.Contains(request.Query));

        var rates = await query
            .OrderBy(d => d.Category).ThenBy(d => d.Code)
            .Take(100)
            .ToListAsync(cancellationToken);

        var result = rates.Select(d => new DSRRateDto(
            d.Id, d.Code, d.Description, d.Unit, d.Rate,
            d.State, d.Category, d.EffectiveFrom, d.Source)).ToList();

        await cache.SetAsync(cacheKey, result, CacheTtl, cancellationToken);
        return result;
    }
}
