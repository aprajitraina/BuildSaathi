using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Commands.UpdateLineItem;

public class UpdateLineItemHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<UpdateLineItemCommand, LineItemResponse>
{
    public async Task<LineItemResponse> Handle(UpdateLineItemCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boq = await db.BOQs
            .FirstOrDefaultAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        var lineItem = await db.BOQLineItems
            .FirstOrDefaultAsync(li => li.Id == request.LineItemId && li.BOQId == boq.Id, cancellationToken)
            ?? throw new NotFoundException("BOQLineItem", request.LineItemId);

        lineItem.Update(
            request.Description,
            request.Unit,
            request.Quantity,
            request.UnitRate,
            request.Category,
            request.DsrCode,
            request.Remarks);

        activityLogger.Log("boq_line_item_updated", $"BOQ line item updated: {lineItem.Description}", "boq", boq.Id);
        await db.SaveChangesAsync(cancellationToken);

        return new LineItemResponse(
            lineItem.Id,
            lineItem.Description,
            lineItem.Unit,
            lineItem.Quantity,
            lineItem.UnitRate,
            lineItem.Amount,
            lineItem.DsrCode,
            lineItem.Category,
            lineItem.Remarks,
            lineItem.SortOrder);
    }
}
