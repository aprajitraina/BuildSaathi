using BuildSaathi.Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Materials.Queries.GetMaterials;

public class GetMaterialsHandler(
    IApplicationDbContext db,
    ICacheService cache)
    : IRequestHandler<GetMaterialsQuery, IEnumerable<MaterialRateDto>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(20);

    public async Task<IEnumerable<MaterialRateDto>> Handle(GetMaterialsQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"materials:latest:{request.State?.Trim().ToLowerInvariant() ?? "all"}";
        var cached = await cache.GetAsync<List<MaterialRateDto>>(cacheKey, cancellationToken);
        if (cached is not null)
            return cached;

        var query = db.MaterialRates.AsQueryable();
        if (!string.IsNullOrWhiteSpace(request.State))
            query = query.Where(m => m.State == request.State);

        var latestRates = await query
            .OrderByDescending(m => m.EffectiveDate)
            .Take(200)
            .ToListAsync(cancellationToken);

        var result = latestRates.Select(MapRate).ToList();
        await cache.SetAsync(cacheKey, result, CacheTtl, cancellationToken);
        return result;
    }

    internal static MaterialRateDto MapRate(Domain.Entities.MaterialRate m) => new(
        m.Id, m.MaterialName, m.Unit, m.Rate, m.State, m.Category, m.EffectiveDate, m.Source
    );
}

public class GetMaterialRatesByNameHandler(
    IApplicationDbContext db,
    ICacheService cache)
    : IRequestHandler<GetMaterialRatesByNameQuery, IEnumerable<MaterialRateDto>>
{
    private static readonly TimeSpan CacheTtl = TimeSpan.FromMinutes(20);

    public async Task<IEnumerable<MaterialRateDto>> Handle(GetMaterialRatesByNameQuery request, CancellationToken cancellationToken)
    {
        var cacheKey = $"materials:by-name:{request.MaterialName.Trim().ToLowerInvariant()}:{request.State?.Trim().ToLowerInvariant() ?? "all"}";
        var cached = await cache.GetAsync<List<MaterialRateDto>>(cacheKey, cancellationToken);
        if (cached is not null)
            return cached;

        var query = db.MaterialRates.Where(m => m.MaterialName == request.MaterialName);
        if (!string.IsNullOrWhiteSpace(request.State))
            query = query.Where(m => m.State == request.State);

        var rates = await query
            .OrderByDescending(m => m.EffectiveDate)
            .Take(90)
            .ToListAsync(cancellationToken);

        var result = rates.Select(GetMaterialsHandler.MapRate).ToList();
        await cache.SetAsync(cacheKey, result, CacheTtl, cancellationToken);
        return result;
    }
}
