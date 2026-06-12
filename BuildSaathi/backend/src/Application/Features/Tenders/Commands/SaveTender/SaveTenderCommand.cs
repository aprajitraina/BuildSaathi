using MediatR;

namespace BuildSaathi.Application.Features.Tenders.Commands.SaveTender;

public record SaveTenderCommand(Guid TenderId) : IRequest;
public record UnsaveTenderCommand(Guid TenderId) : IRequest;
