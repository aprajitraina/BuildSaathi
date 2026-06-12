using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Projects.Commands.Milestones;

public class AddMilestoneHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<AddMilestoneCommand, Guid>
{
    public async Task<Guid> Handle(AddMilestoneCommand request, CancellationToken cancellationToken)
    {
        var project = await db.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Project", request.ProjectId);

        var sortOrder = await db.Milestones.CountAsync(m => m.ProjectId == request.ProjectId, cancellationToken);
        var milestone = Domain.Entities.Milestone.Create(request.ProjectId, request.Title, request.DueDate, sortOrder);

        db.Milestones.Add(milestone);
        activityLogger.Log("project_milestone_added", $"Milestone added: {request.Title}", "project", project.Id);
        await db.SaveChangesAsync(cancellationToken);
        return milestone.Id;
    }
}
