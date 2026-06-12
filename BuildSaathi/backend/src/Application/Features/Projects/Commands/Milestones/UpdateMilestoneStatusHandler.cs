using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Enums;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Projects.Commands.Milestones;

public class UpdateMilestoneStatusHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<UpdateMilestoneStatusCommand>
{
    public async Task Handle(UpdateMilestoneStatusCommand request, CancellationToken cancellationToken)
    {
        var project = await db.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Project", request.ProjectId);

        var milestone = await db.Milestones
            .FirstOrDefaultAsync(m => m.Id == request.MilestoneId && m.ProjectId == request.ProjectId, cancellationToken)
            ?? throw new NotFoundException("Milestone", request.MilestoneId);

        var status = request.Status.Trim().ToLowerInvariant() switch
        {
            "notstarted" or "not_started" => MilestoneStatus.NotStarted,
            "inprogress" or "in_progress" => MilestoneStatus.InProgress,
            "completed" => MilestoneStatus.Completed,
            "delayed" => MilestoneStatus.Delayed,
            "cancelled" or "canceled" => MilestoneStatus.Cancelled,
            _ => throw new InvalidOperationException("Invalid milestone status."),
        };

        milestone.SetStatus(status);
        activityLogger.Log(
            "project_milestone_status_updated",
            $"Milestone status updated to {status}",
            "project",
            project.Id);
        await db.SaveChangesAsync(cancellationToken);
    }
}
