using BuildSaathi.Application.Features.BOQ.Commands.AddLineItem;
using BuildSaathi.Application.Features.BOQ.Commands.CreateBOQ;
using BuildSaathi.Application.Features.BOQ.Commands.DeleteBOQ;
using BuildSaathi.Application.Features.BOQ.Commands.DeleteLineItem;
using BuildSaathi.Application.Features.BOQ.Commands.RequestAIEstimate;
using BuildSaathi.Application.Features.BOQ.Commands.UpdateBOQ;
using BuildSaathi.Application.Features.BOQ.Commands.UpdateLineItem;
using BuildSaathi.Application.Features.BOQ.Queries.ExportBOQPdf;
using BuildSaathi.Application.Features.BOQ.Queries.GetBOQ;
using BuildSaathi.Application.Features.BOQ.Queries.GetDSRRates;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/boq")]
[Authorize]
public class BOQController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List(CancellationToken ct)
    {
        var result = await mediator.Send(new GetBOQListQuery(), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetBOQByIdQuery(id), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}/export-pdf")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> ExportPdf(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new ExportBOQPdfQuery(id), ct);
        return File(result.Content, "application/pdf", result.FileName);
    }

    [HttpPost]
    [ProducesResponseType(typeof(BOQResponse), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateBOQCommand command, CancellationToken ct)
    {
        var result = await mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await mediator.Send(new DeleteBOQCommand(id), ct);
        return NoContent();
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(BOQResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateBOQRequest body, CancellationToken ct)
    {
        var command = new UpdateBOQCommand(
            id,
            body.Title,
            body.State,
            body.WorkCategory,
            body.OverheadPercent,
            body.ContingencyPercent);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/line-items")]
    public async Task<IActionResult> AddLineItem(Guid id, [FromBody] AddLineItemRequest body, CancellationToken ct)
    {
        var command = new AddLineItemCommand(
            id, body.Description, body.Unit, body.Quantity,
            body.UnitRate, body.Category, body.DsrCode, body.Remarks);
        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpDelete("{id:guid}/line-items/{lineItemId:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteLineItem(Guid id, Guid lineItemId, CancellationToken ct)
    {
        await mediator.Send(new DeleteLineItemCommand(id, lineItemId), ct);
        return NoContent();
    }

    [HttpPut("{id:guid}/line-items/{lineItemId:guid}")]
    [ProducesResponseType(typeof(LineItemResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> UpdateLineItem(Guid id, Guid lineItemId, [FromBody] UpdateLineItemRequest body, CancellationToken ct)
    {
        var command = new UpdateLineItemCommand(
            id,
            lineItemId,
            body.Description,
            body.Unit,
            body.Quantity,
            body.UnitRate,
            body.Category,
            body.DsrCode,
            body.Remarks);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }

    [HttpPost("{id:guid}/estimate")]
    [ProducesResponseType(typeof(BOQEstimationResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> RequestAIEstimate(Guid id, [FromBody] RequestAIEstimateRequest? body, CancellationToken ct)
    {
        var command = new RequestAIEstimateCommand(
            id,
            body?.ProjectScope,
            body?.EstimatedAreaSqm,
            body?.EstimatedLengthKm);

        var result = await mediator.Send(command, ct);
        return Ok(result);
    }
}

[ApiController]
[Route("api/v1/dsr-rates")]
[Authorize]
public class DSRRatesController(ISender mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(
        [FromQuery] string state,
        [FromQuery] string? category,
        [FromQuery] string? query,
        CancellationToken ct)
    {
        var result = await mediator.Send(new GetDSRRatesQuery(state, category, query), ct);
        return Ok(result);
    }
}

// Request body DTO — avoids binding the full AddLineItemCommand directly
public record AddLineItemRequest(
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    string Category,
    string? DsrCode = null,
    string? Remarks = null
);

public record UpdateBOQRequest(
    string Title,
    string State,
    string WorkCategory,
    decimal OverheadPercent,
    decimal ContingencyPercent
);

public record UpdateLineItemRequest(
    string Description,
    string Unit,
    decimal Quantity,
    decimal UnitRate,
    string Category,
    string? DsrCode = null,
    string? Remarks = null
);

public record RequestAIEstimateRequest(
    string? ProjectScope = null,
    decimal? EstimatedAreaSqm = null,
    decimal? EstimatedLengthKm = null
);
