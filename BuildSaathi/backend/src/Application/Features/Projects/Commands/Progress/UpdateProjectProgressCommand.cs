using MediatR;

namespace BuildSaathi.Application.Features.Projects.Commands.Progress;

public record UpdateProjectProgressCommand(Guid ProjectId, int CompletionPercent) : IRequest;
