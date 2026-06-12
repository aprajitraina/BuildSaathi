using BuildSaathi.Application.Features.Materials.Queries.GetMaterials;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/materials")]
[Authorize]
public class MaterialsController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> GetMaterials([FromQuery] string? state, CancellationToken ct)
    {
        var result = await mediator.Send(new GetMaterialsQuery(state), ct);
        return Ok(result);
    }

    [HttpGet("{materialName}/rates")]
    public async Task<IActionResult> GetRates(string materialName, [FromQuery] string? state, CancellationToken ct)
    {
        var result = await mediator.Send(new GetMaterialRatesByNameQuery(materialName, state), ct);
        return Ok(result);
    }
}
