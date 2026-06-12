using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Documents.Commands.DeleteDocument;

public class DeleteDocumentHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<DeleteDocumentCommand>
{
    public async Task Handle(DeleteDocumentCommand request, CancellationToken cancellationToken)
    {
        var doc = await db.Documents
            .FirstOrDefaultAsync(d => d.Id == request.DocumentId && d.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new NotFoundException("Document", request.DocumentId);

        doc.IsDeleted = true;
        doc.DeletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);
    }
}
