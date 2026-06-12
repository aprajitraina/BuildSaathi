using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;

namespace BuildSaathi.Application.Features.Documents.Commands.UploadDocument;

public class UploadDocumentHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<UploadDocumentCommand, Guid>
{
    public async Task<Guid> Handle(UploadDocumentCommand request, CancellationToken cancellationToken)
    {
        var doc = Domain.Entities.Document.Create(
            currentUser.ContractorId,
            request.FileName,
            request.OriginalFileName,
            request.ContentType,
            request.FileSizeBytes,
            request.StorageKey,
            request.DocumentType,
            request.EntityType,
            request.EntityId
        );

        db.Documents.Add(doc);
        await db.SaveChangesAsync(cancellationToken);
        return doc.Id;
    }
}
