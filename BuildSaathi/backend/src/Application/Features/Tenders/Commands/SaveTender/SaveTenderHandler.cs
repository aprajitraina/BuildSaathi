using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Tenders.Commands.SaveTender;

public class SaveTenderHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<SaveTenderCommand>
{
    public async Task Handle(SaveTenderCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var tenderExists = await db.Tenders
            .AnyAsync(t => t.Id == request.TenderId && t.IsActive, cancellationToken);

        if (!tenderExists)
            throw new NotFoundException("Tender", request.TenderId);

        var alreadySaved = await db.TenderMatches
            .AnyAsync(tm => tm.ContractorId == contractorId && tm.TenderId == request.TenderId, cancellationToken);

        if (!alreadySaved)
        {
            var match = TenderMatch.Create(contractorId, request.TenderId);
            db.TenderMatches.Add(match);
            activityLogger.Log("tender_saved", "Tender saved to shortlist", "tender", request.TenderId);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}

public class UnsaveTenderHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<UnsaveTenderCommand>
{
    public async Task Handle(UnsaveTenderCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var match = await db.TenderMatches
            .FirstOrDefaultAsync(tm => tm.ContractorId == contractorId && tm.TenderId == request.TenderId, cancellationToken);

        if (match is not null)
        {
            // Soft delete
            match.IsDeleted = true;
            match.DeletedAt = DateTime.UtcNow;
            activityLogger.Log("tender_unsaved", "Tender removed from shortlist", "tender", request.TenderId);
            await db.SaveChangesAsync(cancellationToken);
        }
    }
}
