using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using BuildSaathi.Domain.Entities;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Commands.AddLineItem;

public class AddLineItemHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<AddLineItemCommand, LineItemResponse>
{
    public async Task<LineItemResponse> Handle(AddLineItemCommand request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var boq = await db.BOQs
            .FirstOrDefaultAsync(b => b.Id == request.BOQId && b.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        var sortOrder = await db.BOQLineItems.CountAsync(li => li.BOQId == request.BOQId, cancellationToken);

        var item = BOQLineItem.Create(
            request.BOQId, request.Description, request.Unit,
            request.Quantity, request.UnitRate, request.Category,
            request.DsrCode, request.Remarks, sortOrder);

        db.BOQLineItems.Add(item);
        activityLogger.Log("boq_line_item_added", $"BOQ line item added: {item.Description}", "boq", boq.Id);
        await db.SaveChangesAsync(cancellationToken);

        return new LineItemResponse(
            item.Id, item.Description, item.Unit, item.Quantity,
            item.UnitRate, item.Amount, item.DsrCode,
            item.Category, item.Remarks, item.SortOrder);
    }
}
