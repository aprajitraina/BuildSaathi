using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Commands.DeleteLineItem;

public class DeleteLineItemHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<DeleteLineItemCommand>
{
    public async Task Handle(DeleteLineItemCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boqExists = await db.BOQs
            .AnyAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken);

        if (!boqExists) throw new NotFoundException("BOQ", request.BOQId);

        var item = await db.BOQLineItems
            .FirstOrDefaultAsync(li => li.Id == request.LineItemId && li.BOQId == request.BOQId, cancellationToken)
            ?? throw new NotFoundException("LineItem", request.LineItemId);

        item.IsDeleted = true;
        item.DeletedAt = DateTime.UtcNow;
        activityLogger.Log("boq_line_item_deleted", $"BOQ line item deleted: {item.Description}", "boq", request.BOQId);
        await db.SaveChangesAsync(cancellationToken);
    }
}
