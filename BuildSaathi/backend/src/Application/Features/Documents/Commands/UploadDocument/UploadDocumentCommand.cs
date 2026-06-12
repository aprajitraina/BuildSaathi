using MediatR;

namespace BuildSaathi.Application.Features.Documents.Commands.UploadDocument;

public record UploadDocumentCommand(
    string FileName,
    string OriginalFileName,
    string StorageKey,
    string ContentType,
    long FileSizeBytes,
    string DocumentType,
    string? EntityType = null,
    Guid? EntityId = null
) : IRequest<Guid>;
