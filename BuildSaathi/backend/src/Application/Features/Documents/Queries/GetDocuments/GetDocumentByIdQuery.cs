using MediatR;

namespace BuildSaathi.Application.Features.Documents.Queries.GetDocuments;

public record GetDocumentByIdQuery(Guid DocumentId) : IRequest<DocumentDetailDto>;

public record DocumentDetailDto(
    Guid Id,
    string FileName,
    string OriginalFileName,
    string StorageKey,
    string ContentType,
    long FileSizeBytes,
    string DocumentType,
    string? EntityType,
    Guid? EntityId,
    DateTime CreatedAt
);
