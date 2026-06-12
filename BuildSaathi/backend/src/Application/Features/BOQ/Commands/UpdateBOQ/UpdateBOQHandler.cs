using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Commands.UpdateBOQ;

public class UpdateBOQHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<UpdateBOQCommand, BOQResponse>
{
    public async Task<BOQResponse> Handle(UpdateBOQCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boq = await db.BOQs
            .Include(b => b.LineItems.Where(li => !li.IsDeleted))
            .FirstOrDefaultAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        boq.UpdateDetails(
            request.Title,
            request.State,
            request.WorkCategory,
            request.OverheadPercent,
            request.ContingencyPercent);

        activityLogger.Log("boq_updated", $"BOQ updated: {boq.Title}", "boq", boq.Id);
        await db.SaveChangesAsync(cancellationToken);
        return CreateBOQHandler.MapToResponse(boq);
    }
}
