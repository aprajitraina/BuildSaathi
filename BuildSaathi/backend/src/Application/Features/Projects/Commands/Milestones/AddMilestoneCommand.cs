using MediatR;

namespace BuildSaathi.Application.Features.Projects.Commands.Milestones;

public record AddMilestoneCommand(
    Guid ProjectId,
    string Title,
    string? Description = null,
    DateTime? DueDate = null
) : IRequest<Guid>;
