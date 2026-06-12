using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Commands.DeleteBOQ;

public class DeleteBOQHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<DeleteBOQCommand>
{
    public async Task Handle(DeleteBOQCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boq = await db.BOQs
            .FirstOrDefaultAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        boq.IsDeleted = true;
        boq.DeletedAt = DateTime.UtcNow;
        activityLogger.Log("boq_deleted", $"BOQ deleted: {boq.Title}", "boq", boq.Id);
        await db.SaveChangesAsync(cancellationToken);
    }
}
