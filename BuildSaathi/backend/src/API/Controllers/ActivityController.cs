using BuildSaathi.Application.Features.Activity.Queries.GetActivityEvents;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/activity")]
[Authorize]
public class ActivityController(ISender mediator) : ControllerBase
{
    [HttpGet("events")]
    [ProducesResponseType(typeof(IReadOnlyCollection<ActivityEventDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetEvents([FromQuery] int limit = 25, CancellationToken ct = default)
    {
        var result = await mediator.Send(new GetActivityEventsQuery(limit), ct);
        return Ok(result);
    }
}
