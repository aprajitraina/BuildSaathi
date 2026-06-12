using BuildSaathi.Application.Common.Models;
using MediatR;

namespace BuildSaathi.Application.Features.Documents.Queries.GetDocuments;

public record GetDocumentsQuery(
    string? EntityType = null,
    Guid? EntityId = null,
    int PageNumber = 1,
    int PageSize = 20) : IRequest<PagedResult<DocumentDto>>;

public record DocumentDto(
    Guid Id,
    string FileName,
    string OriginalFileName,
    string ContentType,
    long FileSizeBytes,
    string DocumentType,
    string? EntityType,
    Guid? EntityId,
    DateTime CreatedAt
);
