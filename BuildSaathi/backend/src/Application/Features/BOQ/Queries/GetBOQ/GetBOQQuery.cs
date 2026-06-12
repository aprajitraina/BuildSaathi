using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Queries.GetBOQ;

public record GetBOQListQuery : IRequest<IEnumerable<BOQResponse>>;
public record GetBOQByIdQuery(Guid BOQId) : IRequest<BOQResponse>;
