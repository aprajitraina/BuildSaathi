using BuildSaathi.Application.Features.Projects.Commands.CreateProject;
using BuildSaathi.Application.Features.Projects.Commands.Milestones;
using BuildSaathi.Application.Features.Projects.Commands.Progress;
using BuildSaathi.Application.Features.Projects.Queries.GetProjects;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/projects")]
[Authorize]
public class ProjectsController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetProjects(CancellationToken ct)
    {
        var result = await mediator.Send(new GetProjectsQuery(), ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject([FromBody] CreateProjectCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetProject(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetProjectByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/milestones")]
    public async Task<IActionResult> AddMilestone(Guid id, [FromBody] AddMilestoneRequest request, CancellationToken ct)
    {
        var milestoneId = await mediator.Send(new AddMilestoneCommand(id, request.Title, request.Description, request.DueDate), ct);
        return Ok(new { id = milestoneId });
    }

    [HttpPatch("{id:guid}/progress")]
    public async Task<IActionResult> UpdateProgress(Guid id, [FromBody] UpdateProgressRequest request, CancellationToken ct)
    {
        await mediator.Send(new UpdateProjectProgressCommand(id, request.CompletionPercent), ct);
        return NoContent();
    }

    [HttpPatch("{id:guid}/milestones/{milestoneId:guid}")]
    public async Task<IActionResult> UpdateMilestoneStatus(Guid id, Guid milestoneId, [FromBody] UpdateMilestoneStatusRequest request, CancellationToken ct)
    {
        await mediator.Send(new UpdateMilestoneStatusCommand(id, milestoneId, request.Status), ct);
        return NoContent();
    }
}

public record AddMilestoneRequest(string Title, string? Description = null, DateTime? DueDate = null);
public record UpdateProgressRequest(int CompletionPercent);
public record UpdateMilestoneStatusRequest(string Status);
