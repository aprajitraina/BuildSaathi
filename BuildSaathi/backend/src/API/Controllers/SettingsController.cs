using BuildSaathi.Application.Features.Settings.Commands.UpdateSettingsProfile;
using BuildSaathi.Application.Features.Settings.Queries.GetSettingsProfile;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/settings")]
[Authorize]
public class SettingsController(ISender mediator) : ControllerBase
{
    [HttpGet("profile")]
    [ProducesResponseType(typeof(SettingsProfileDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetProfile(CancellationToken ct)
    {
        var result = await mediator.Send(new GetSettingsProfileQuery(), ct);
        return Ok(result);
    }

    [HttpPut("profile")]
    [ProducesResponseType(typeof(SettingsProfileDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateSettingsProfileCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }
}
