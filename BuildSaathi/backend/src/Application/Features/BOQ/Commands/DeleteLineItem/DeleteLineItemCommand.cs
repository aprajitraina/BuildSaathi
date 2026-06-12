using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.DeleteLineItem;

public record DeleteLineItemCommand(Guid BOQId, Guid LineItemId) : IRequest;
