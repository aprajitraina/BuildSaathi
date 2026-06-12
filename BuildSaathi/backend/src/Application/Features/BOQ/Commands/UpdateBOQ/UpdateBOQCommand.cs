using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using MediatR;

namespace BuildSaathi.Application.Features.BOQ.Commands.UpdateBOQ;

public record UpdateBOQCommand(
    Guid BOQId,
    string Title,
    string State,
    string WorkCategory,
    decimal OverheadPercent,
    decimal ContingencyPercent
) : IRequest<BOQResponse>;
