using MediatR;

namespace BuildSaathi.Application.Features.Projects.Queries.GetProjects;

public record GetProjectsQuery : IRequest<IEnumerable<ProjectDto>>;

public record ProjectDto(
    Guid Id,
    string Title,
    string Location,
    string State,
    string Status,
    int CompletionPercent,
    decimal ContractValue,
    DateTime? StartDate,
    DateTime? ExpectedCompletionDate
);
