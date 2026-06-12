using BuildSaathi.Application.Common.Exceptions;
using BuildSaathi.Application.Common.Interfaces;
using BuildSaathi.Application.Common.Models;
using BuildSaathi.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildSaathi.Application.Features.Billing.Queries.ExportInvoicePdf;

public class ExportInvoicePdfHandler(
    IApplicationDbContext db,
    ICurrentUserService currentUser,
    IReportPdfService pdfService) : IRequestHandler<ExportInvoicePdfQuery, PdfFileResult>
{
    public async Task<PdfFileResult> Handle(ExportInvoicePdfQuery request, CancellationToken cancellationToken)
    {
        var contractorId = currentUser.ContractorId;
        var invoice = await db.Invoices
            .Include(i => i.Payments)
            .FirstOrDefaultAsync(i => i.Id == request.InvoiceId && i.ContractorId == contractorId, cancellationToken)
            ?? throw new NotFoundException("Invoice", request.InvoiceId);

        var content = pdfService.GenerateInvoicePdf(invoice, invoice.Payments.ToList());
        var safeInvoiceNumber = SanitizeFileName(invoice.InvoiceNumber);
        var fileName = $"invoice-{safeInvoiceNumber}.pdf";
        return new PdfFileResult(content, fileName);
    }

    private static string SanitizeFileName(string value)
    {
        var name = value.Trim().ToLowerInvariant().Replace(' ', '-');
        foreach (var ch in Path.GetInvalidFileNameChars())
            name = name.Replace(ch, '-');
        return string.IsNullOrWhiteSpace(name) ? "invoice" : name;
    }
}
