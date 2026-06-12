using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Common.Models;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Documents.Queries.GetDocuments;

public class GetDocumentsHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetDocumentsQuery, PagedResult<DocumentDto>>
{
    public async Task<PagedResult<DocumentDto>> Handle(GetDocumentsQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = Math.Max(1, request.PageNumber);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);
        var normalizedEntityType = request.EntityType?.Trim().ToLowerInvariant();

        if (request.EntityId.HasValue && normalizedEntityType is null)
            throw new InvalidOperationException("EntityType is required when EntityId is provided.");

        var query = db.Documents.Where(d => d.ContractorId == currentUser.ContractorId);

        if (!string.IsNullOrWhiteSpace(normalizedEntityType))
            query = query.Where(d => d.EntityType == normalizedEntityType);
        if (request.EntityId.HasValue)
            query = query.Where(d => d.EntityId == request.EntityId);

        var totalCount = await query.CountAsync(cancellationToken);

        var docs = await query
            .OrderByDescending(d => d.CreatedAt)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var items = docs.Select(d => new DocumentDto(
            d.Id, d.FileName, d.OriginalFileName, d.ContentType,
            d.FileSizeBytes, d.DocumentType, d.EntityType, d.EntityId, d.CreatedAt
        )).ToList();

        return new PagedResult<DocumentDto>(items, totalCount, pageNumber, pageSize);
    }
}

public class GetDocumentByIdHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser) : IRequestHandler<GetDocumentByIdQuery, DocumentDetailDto>
{
    public async Task<DocumentDetailDto> Handle(GetDocumentByIdQuery request, CancellationToken cancellationToken)
    {
        var doc = await db.Documents
            .FirstOrDefaultAsync(d => d.Id == request.DocumentId && d.ContractorId == currentUser.ContractorId, cancellationToken)
            ?? throw new InvalidOperationException("Document not found.");

        return new DocumentDetailDto(
            doc.Id,
            doc.FileName,
            doc.OriginalFileName,
            doc.StorageKey,
            doc.ContentType,
            doc.FileSizeBytes,
            doc.DocumentType,
            doc.EntityType,
            doc.EntityId,
            doc.CreatedAt
        );
    }
}
