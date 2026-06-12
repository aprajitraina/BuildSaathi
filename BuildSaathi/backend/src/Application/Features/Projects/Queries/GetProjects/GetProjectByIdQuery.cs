using MediatR;

namespace BuildSaathi.Application.Features.Projects.Queries.GetProjects;

public record GetProjectByIdQuery(Guid ProjectId) : IRequest<ProjectDetailDto>;

public record ProjectDetailDto(
    Guid Id,
    string Title,
    string Location,
    string State,
    string Status,
    int CompletionPercent,
    decimal ContractValue,
    DateTime? StartDate,
    DateTime? ExpectedCompletionDate,
    IEnumerable<ProjectMilestoneDto> Milestones
);

public record ProjectMilestoneDto(
    Guid Id,
    string Title,
    string? Description,
    string Status,
    DateTime? DueDate,
    DateTime? CompletedAt,
    int SortOrder
);
