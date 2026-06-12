using MediatR;

namespace BuildSaathi.Application.Features.Projects.Commands.CreateProject;

public record CreateProjectCommand(
    string Title,
    string Location,
    string State,
    decimal ContractValue,
    Guid? TenderId = null
) : IRequest<ProjectCreateResponse>;

public record ProjectCreateResponse(Guid Id, string Title, string Status);
