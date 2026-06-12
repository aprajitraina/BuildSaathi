using BuildSaathi.Application.Features.Documents.Commands.DeleteDocument;
using BuildSaathi.Application.Features.Documents.Commands.UploadDocument;
using BuildSaathi.Application.Features.Documents.Queries.GetDocuments;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildSaathi.API.Controllers;

[ApiController]
[Route("api/v1/documents")]
[Authorize]
public class DocumentsController(
    ISender mediator,
    IFileStorageService fileStorage,
    IConfiguration configuration) : ControllerBase
{
    private readonly string _bucket = configuration["MINIO_BUCKET_DOCUMENTS"] ?? "buildsaathi-documents";

    [HttpGet]
    public async Task<IActionResult> GetDocuments(
        [FromQuery] string? entityType,
        [FromQuery] Guid? entityId,
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20,
        CancellationToken ct = default)
    {
        var normalizedEntityType = string.IsNullOrWhiteSpace(entityType)
            ? null
            : entityType.Trim().ToLowerInvariant();
        var result = await mediator.Send(new GetDocumentsQuery(normalizedEntityType, entityId, pageNumber, pageSize), ct);
        return Ok(result);
    }

    [HttpPost("upload")]
    [RequestSizeLimit(50_000_000)]
    [Consumes("multipart/form-data")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Upload(
        [FromForm] UploadDocumentForm form,
        CancellationToken ct)
    {
        var file = form.File;
        var documentType = form.DocumentType;
        var entityType = form.EntityType;
        var entityId = form.EntityId;

        if (file is null || file.Length == 0)
            return BadRequest("File is required.");
        var normalizedEntityType = string.IsNullOrWhiteSpace(entityType)
            ? null
            : entityType.Trim().ToLowerInvariant();

        var storageKey = await fileStorage.UploadAsync(file.OpenReadStream(), file.FileName, file.ContentType ?? "application/octet-stream", _bucket, ct);

        var id = await mediator.Send(new UploadDocumentCommand(
            Path.GetFileNameWithoutExtension(file.FileName),
            file.FileName,
            storageKey,
            file.ContentType ?? "application/octet-stream",
            file.Length,
            documentType,
            normalizedEntityType,
            entityId
        ), ct);

        return Ok(new { id });
    }

    [HttpGet("{id:guid}/download")]
    public async Task<IActionResult> GetDownloadUrl(Guid id, CancellationToken ct)
    {
        var doc = await mediator.Send(new GetDocumentByIdQuery(id), ct);
        var url = await fileStorage.GetPresignedDownloadUrlAsync(doc.StorageKey, _bucket, TimeSpan.FromMinutes(15), ct);
        return Ok(new { url });
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var doc = await mediator.Send(new GetDocumentByIdQuery(id), ct);
        await fileStorage.DeleteAsync(doc.StorageKey, _bucket, ct);
        await mediator.Send(new DeleteDocumentCommand(id), ct);
        return NoContent();
    }
}

public sealed class UploadDocumentForm
{
    public IFormFile File { get; set; } = null!;
    public string DocumentType { get; set; } = string.Empty;
    public string? EntityType { get; set; }
    public Guid? EntityId { get; set; }
}
