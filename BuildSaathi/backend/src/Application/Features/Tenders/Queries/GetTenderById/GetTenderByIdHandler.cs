using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Tenders.Queries.GetTenderById;

public class GetTenderByIdHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetTenderByIdQuery, TenderDetailDto>
{
    public async Task<TenderDetailDto> Handle(GetTenderByIdQuery request, CancellationToken cancellationToken)
    {
        var tender = await db.Tenders
            .FirstOrDefaultAsync(t => t.Id == request.TenderId && t.IsActive, cancellationToken)
            ?? throw new NotFoundException(nameof(Tender), request.TenderId);

        var contractorId = currentUser.ContractorId;

        var isSaved = await db.TenderMatches
            .AnyAsync(tm => tm.TenderId == request.TenderId && tm.ContractorId == contractorId, cancellationToken);

        var hasSummary = await db.TenderSummaries
            .AnyAsync(ts => ts.TenderId == request.TenderId, cancellationToken);

        return new TenderDetailDto(
            tender.Id, tender.Title, tender.ReferenceNumber,
            tender.Department, tender.Organization, tender.State,
            tender.District, tender.Category, tender.EstimatedValue,
            tender.EmdAmount, tender.DocumentFee, tender.PublishedDate,
            tender.SubmissionDeadline, tender.OpeningDate,
            tender.SourceUrl, tender.SourcePortal,
            isSaved, hasSummary, tender.Tags
        );
    }
}
