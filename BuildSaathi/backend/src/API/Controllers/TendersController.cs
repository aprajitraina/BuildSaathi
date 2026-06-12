using BuildSaathi.Application.Features.Tenders.Commands.RequestAISummary;
using BuildSaathi.Application.Features.Tenders.Commands.SaveTender;
using BuildSaathi.Application.Features.Tenders.Queries.GetSavedTenders;
using BuildSaathi.Application.Features.Tenders.Queries.GetTenderById;
using BuildSaathi.Application.Features.Tenders.Queries.SearchTenders;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/tenders")]
[Authorize]
public class TendersController(ISender mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(SearchTendersResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search(
        [FromQuery] string? query,
        [FromQuery] string? state,
        [FromQuery] string? category,
        [FromQuery] decimal? minValue,
        [FromQuery] decimal? maxValue,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new SearchTendersQuery(
            query, state, category, minValue, maxValue, null, pageNumber, pageSize), ct);
        return Ok(result);
    }

    [HttpGet("saved")]
    public async Task<IActionResult> GetSaved(CancellationToken ct)
    {
        var result = await mediator.Send(new GetSavedTendersQuery(), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetTenderByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/save")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Save(Guid id, CancellationToken ct)
    {
        await mediator.Send(new SaveTenderCommand(id), ct);
        return NoContent();
    }

    [HttpDelete("{id:guid}/save")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Unsave(Guid id, CancellationToken ct)
    {
        await mediator.Send(new UnsaveTenderCommand(id), ct);
        return NoContent();
    }

    [HttpPost("{id:guid}/summarize")]
    public async Task<IActionResult> RequestSummary(
        Guid id,
        [FromQuery] bool forceRegenerate = false,
        CancellationToken ct = default)
    {
        var result = await mediator.Send(new RequestAISummaryCommand(id, ForceRegenerate: forceRegenerate), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/summary")]
    public async Task<IActionResult> GetSummary(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new RequestAISummaryCommand(id, CachedOnly: true), ct);
        return Ok(result);
    }
}
