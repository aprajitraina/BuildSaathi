using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Projects.Queries.GetProjects;

public class GetProjectsHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetProjectsQuery, IEnumerable<ProjectDto>>
{
    public async Task<IEnumerable<ProjectDto>> Handle(GetProjectsQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;

        var projects = await db.Projects
            .Where(p => p.ContractorId == contractorId)
            .OrderByDescending(p => p.CreatedAt)
            .ToListAsync(cancellationToken);

        return projects.Select(p => new ProjectDto(
            p.Id,
            p.Title,
            p.Location,
            p.State,
            p.Status.ToString().ToLowerInvariant(),
            p.CompletionPercent,
            p.ContractValue,
            p.StartDate,
            p.ExpectedCompletionDate
        ));
    }
}

public class GetProjectByIdHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetProjectByIdQuery, ProjectDetailDto>
{
    public async Task<ProjectDetailDto> Handle(GetProjectByIdQuery request, CancellationToken cancellationToken)
    {
        var project = await db.Projects
            .Include(p => p.Milestones)
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Project", request.ProjectId);

        return new ProjectDetailDto(
            project.Id,
            project.Title,
            project.Location,
            project.State,
            project.Status.ToString().ToLowerInvariant(),
            project.CompletionPercent,
            project.ContractValue,
            project.StartDate,
            project.ExpectedCompletionDate,
            project.Milestones
                .OrderBy(m => m.SortOrder)
                .Select(m => new ProjectMilestoneDto(
                    m.Id,
                    m.Title,
                    m.Description,
                    m.Status.ToString().ToLowerInvariant(),
                    m.DueDate,
                    m.CompletedAt,
                    m.SortOrder
                ))
        );
    }
}
