using BuildSaathi.Modules.Estimation.Application.Commands.CreateEstimateFromForm;
using BuildSaathi.Modules.Estimation.Application.Commands.ImproveEstimateWithAI;
using BuildSaathi.Modules.Estimation.Application.Commands.UploadEstimateFile;
using BuildSaathi.Modules.Estimation.Application.Commands.ValidateEstimate;
using BuildSaathi.Modules.Estimation.Application.Common;
using BuildSaathi.Modules.Estimation.Application.Contracts;
using BuildSaathi.Modules.Estimation.Application.Queries.GetEstimateById;
using BuildSaathi.Modules.Estimation.Application.Queries.GetEstimatesList;
using BuildSaathi.Modules.Estimation.Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/estimation")]
[Authorize]
public class EstimationController(ISender mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(EstimationApiEnvelope<IReadOnlyList<EstimateListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(CancellationToken ct)
    {
        var result = await mediator.Send(new GetEstimatesListQuery(), ct);
        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(EstimationApiEnvelope<EstimateDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await mediator.Send(new GetEstimateByIdQuery(id), ct);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpPost("form")]
    [ProducesResponseType(typeof(EstimationApiEnvelope<EstimateDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> CreateFromForm([FromBody] CreateEstimateFormRequest body, CancellationToken ct)
    {
        var estimateType = ParseEstimateType(body.EstimateType);
        var command = new CreateEstimateFromFormCommand(
            body.AreaSqFt,
            body.Location,
            body.Floors,
            body.FinishType,
            estimateType,
            body.TenderId);

        var result = await mediator.Send(command, ct);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(typeof(EstimationApiEnvelope<EstimateDetailDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [RequestSizeLimit(32_000_000)]
    public async Task<IActionResult> Upload(
        [FromForm] UploadEstimateForm form,
        CancellationToken ct = default)
    {
        var file = form.File;
        var location = form.Location;
        var estimateType = form.EstimateType;
        var tenderId = form.TenderId;

        if (file.Length == 0)
            return BadRequest(EstimationApiEnvelope<EstimateDetailDto>.Fail("File is required."));

        await using var stream = file.OpenReadStream();
        var command = new UploadEstimateFileCommand(
            stream,
            file.FileName,
            location,
            ParseEstimateType(estimateType),
            tenderId);

        var result = await mediator.Send(command, ct);
        if (!result.Success)
            return BadRequest(result);
        return Ok(result);
    }

    [HttpPost("validate")]
    [ProducesResponseType(typeof(EstimationApiEnvelope<EstimateDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Validate([FromBody] EstimateIdRequest body, CancellationToken ct)
    {
        var result = await mediator.Send(new ValidateEstimateCommand(body.EstimateId), ct);
        if (!result.Success)
            return NotFound(result);
        return Ok(result);
    }

    [HttpPost("improve-ai")]
    [ProducesResponseType(typeof(EstimationApiEnvelope<EstimateDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ImproveAi([FromBody] EstimateIdRequest body, CancellationToken ct)
    {
        var result = await mediator.Send(new ImproveEstimateWithAICommand(body.EstimateId), ct);
        if (!result.Success)
            return result.Errors.Any(e => e.Contains("unavailable", StringComparison.OrdinalIgnoreCase))
                ? StatusCode(503, result)
                : NotFound(result);
        return Ok(result);
    }

    private static EstimateType ParseEstimateType(string? raw) =>
        Enum.TryParse<EstimateType>(raw, true, out var et) ? et : EstimateType.Residential;
}

public record CreateEstimateFormRequest(
    decimal AreaSqFt,
    string Location,
    int? Floors,
    string? FinishType,
    string? EstimateType,
    Guid? TenderId);

public record EstimateIdRequest(Guid EstimateId);

public sealed class UploadEstimateForm
{
    public IFormFile File { get; set; } = null!;
    public string Location { get; set; } = string.Empty;
    public string? EstimateType { get; set; }
    public Guid? TenderId { get; set; }
}
