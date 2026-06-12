using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Projects.Commands.Progress;

public class UpdateProjectProgressHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IActivityLogger activityLogger) : IRequestHandler<UpdateProjectProgressCommand>
{
    public async Task Handle(UpdateProjectProgressCommand request, CancellationToken cancellationToken)
    {
        var project = await db.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId && p.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Project", request.ProjectId);

        project.UpdateProgress(request.CompletionPercent);
        activityLogger.Log(
            "project_progress_updated",
            $"Project progress updated to {request.CompletionPercent}%",
            "project",
            project.Id);
        await db.SaveChangesAsync(cancellationToken);
    }
}
