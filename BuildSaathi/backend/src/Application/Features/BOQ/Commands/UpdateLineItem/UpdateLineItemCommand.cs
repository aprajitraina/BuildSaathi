using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.UpdateLineItem;

public record UpdateLineItemCommand(
    Guid BOQId,
    Guid LineItemId,
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    string Category,
    string? DsrCode = null,
    string? Remarks = null
) : IRequest<LineItemResponse>;
