using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.DeleteBOQ;

public record DeleteBOQCommand(Guid BOQId) : IRequest;
