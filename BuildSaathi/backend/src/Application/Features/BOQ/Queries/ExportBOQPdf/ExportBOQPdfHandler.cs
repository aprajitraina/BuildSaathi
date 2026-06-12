using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Common.Models;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.BOQ.Queries.ExportBOQPdf;

public class ExportBOQPdfHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IReportPdfService pdfService) : IRequestHandler<ExportBOQPdfQuery, PdfFileResult>
{
    public async Task<PdfFileResult> Handle(ExportBOQPdfQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var boq = await db.BOQs
            .Include(b => b.LineItems)
            .FirstOrDefaultAsync(
                b => b.Id == request.BOQId && b.ContractorId == contractorId,
                cancellationToken)
            ?? throw new NotFoundException("BOQ", request.BOQId);

        var content = pdfService.GenerateBoqPdf(boq);
        var safeTitle = SanitizeFileName(boq.Title);
        var fileName = $"boq-{safeTitle}-{boq.Id:N}.pdf";
        return new PdfFileResult(content, fileName);
    }

    private static string SanitizeFileName(string value)
    {
        var name = value.Trim().ToLowerInvariant().Replace(' ', '-');
        foreach (var ch in Path.GetInvalidFileNameChars())
            name = name.Replace(ch, '-');
        return string.IsNullOrWhiteSpace(name) ? "estimate" : name;
    }
}
