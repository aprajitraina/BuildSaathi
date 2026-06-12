using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Tenders.Queries.SearchTenders;

public class SearchTendersHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<SearchTendersQuery, SearchTendersResponse>
{
    public async Task<SearchTendersResponse> Handle(SearchTendersQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var query = db.Tenders
            .Where(t => t.IsActive && !t.IsDeleted && t.SubmissionDeadline >= DateTime.UtcNow);

        if (!string.IsNullOrWhiteSpace(request.Query))
            query = query.Where(t => t.Title.Contains(request.Query) || t.Department.Contains(request.Query));

        if (!string.IsNullOrWhiteSpace(request.State))
            query = query.Where(t => t.State == request.State);

        if (!string.IsNullOrWhiteSpace(request.Category))
            query = query.Where(t => t.Category == request.Category);

        if (request.MinValue.HasValue)
            query = query.Where(t => t.EstimatedValue >= request.MinValue.Value);

        if (request.MaxValue.HasValue)
            query = query.Where(t => t.EstimatedValue <= request.MaxValue.Value);

        if (request.DeadlineBefore.HasValue)
            query = query.Where(t => t.SubmissionDeadline <= request.DeadlineBefore.Value);

        var totalCount = await query.CountAsync(cancellationToken);
        var totalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize);

        // Get contractor's saved tender IDs for IsSaved flag
        var savedIds = (await db.TenderMatches
            .Where(tm => tm.ContractorId == contractorId)
            .Select(tm => tm.TenderId)
            .ToListAsync(cancellationToken)).ToHashSet();

        // Get tender IDs that have AI summaries
        var summaryIds = (await db.TenderSummaries
            .Select(ts => ts.TenderId)
            .ToListAsync(cancellationToken)).ToHashSet();

        var tenders = await query
            .OrderByDescending(t => t.PublishedDate)
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var dtos = tenders.Select(t => new TenderDto(
            t.Id, t.Title, t.ReferenceNumber, t.Department, t.Organization,
            t.State, t.District, t.Category, t.EstimatedValue, t.EmdAmount,
            t.PublishedDate, t.SubmissionDeadline, t.SourcePortal,
            IsSaved: savedIds.Contains(t.Id),
            HasSummary: summaryIds.Contains(t.Id)
        ));

        return new SearchTendersResponse(
            Items: dtos,
            TotalCount: totalCount,
            PageNumber: request.PageNumber,
            PageSize: request.PageSize,
            TotalPages: totalPages,
            HasPreviousPage: request.PageNumber > 1,
            HasNextPage: request.PageNumber < totalPages
        );
    }
}
