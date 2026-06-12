using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.AddLineItem;

public record AddLineItemCommand(
    Guid BOQId,
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    string Category,
    string? DsrCode = null,
    string? Remarks = null
) : IRequest<LineItemResponse>;
