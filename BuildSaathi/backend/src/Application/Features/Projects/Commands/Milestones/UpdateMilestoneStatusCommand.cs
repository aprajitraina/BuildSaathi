using MediatR;

namespace BuildSaathi.Application.Features.Projects.Commands.Milestones;

public record UpdateMilestoneStatusCommand(Guid ProjectId, Guid MilestoneId, string Status) : IRequest;
