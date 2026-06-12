using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.Tenders.Queries.SearchTenders;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Tenders.Queries.GetSavedTenders;

public class GetSavedTendersHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetSavedTendersQuery, IEnumerable<TenderDto>>
{
    public async Task<IEnumerable<TenderDto>> Handle(GetSavedTendersQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var summaryIds = (await db.TenderSummaries
            .Select(ts => ts.TenderId)
            .ToListAsync(cancellationToken)).ToHashSet();

        var saved = await db.TenderMatches
            .Include(tm => tm.Tender)
            .Where(tm => tm.ContractorId == contractorId && tm.Tender.IsActive)
            .OrderByDescending(tm => tm.CreatedAt)
            .ToListAsync(cancellationToken);

        return saved.Select(tm => new TenderDto(
            tm.Tender.Id, tm.Tender.Title, tm.Tender.ReferenceNumber,
            tm.Tender.Department, tm.Tender.Organization, tm.Tender.State,
            tm.Tender.District, tm.Tender.Category, tm.Tender.EstimatedValue,
            tm.Tender.EmdAmount, tm.Tender.PublishedDate, tm.Tender.SubmissionDeadline,
            tm.Tender.SourcePortal,
            IsSaved: true,
            HasSummary: summaryIds.Contains(tm.TenderId)
        ));
    }
}
