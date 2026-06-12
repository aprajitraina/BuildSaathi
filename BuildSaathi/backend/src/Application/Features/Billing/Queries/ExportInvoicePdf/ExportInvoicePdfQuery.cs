using BuildSaathi.Application.Common.Models;
using MediatR;

namespace BuildSaathi.Application.Features.Billing.Queries.ExportInvoicePdf;

public record ExportInvoicePdfQuery(Guid InvoiceId) : IRequest<PdfFileResult>;
