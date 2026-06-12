using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;

namespace BuildSaathi.Application.Features.Projects.Commands.CreateProject;

public class CreateProjectHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<CreateProjectCommand, ProjectCreateResponse>
{
    public async Task<ProjectCreateResponse> Handle(CreateProjectCommand request, CancellationToken cancellationToken)
    {
        var project = Domain.Entities.Project.Create(
            currentUser.ContractorId,
            request.Title,
            request.Location,
            request.State,
            request.ContractValue,
            request.TenderId
        );

        db.Projects.Add(project);
        await db.SaveChangesAsync(cancellationToken);

        return new ProjectCreateResponse(project.Id, project.Title, project.Status.ToString().ToLowerInvariant());
    }
}
